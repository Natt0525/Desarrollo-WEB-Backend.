import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = 'https://es.ifixit.com/Gu%C3%ADa/Cambio+de+placa+madre+de+un+Samsung+Galaxy+S10/121821';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
}
async function writeNew(file, data) {
  await fs.writeFile(file, data, { flag: 'wx' });
}
const guide = await (await get('https://www.ifixit.com/api/2.0/guides/121821?langid=es')).json();
if (guide.steps.length !== 21 || guide.locale !== 'es') throw new Error('Unexpected guide');
const photos = path.join(root, 'fotos-originales');
const screenshots = path.join(root, 'capturas');
await fs.mkdir(photos, { recursive: true });
await fs.mkdir(screenshots, { recursive: true });
const captureOnly = process.argv.includes('--solo-capturas');
const index = captureOnly ? JSON.parse(await fs.readFile(path.join(root, 'indice.json'), 'utf8')) : { title: guide.title, source, author: guide.author.username, steps: [] };
if (!captureOnly) {
for (let i = 0; i < guide.steps.length; i++) {
  const step = guide.steps[i];
  const number = String(i + 1).padStart(2, '0');
  const entry = { number: i + 1, id: step.stepid, title: step.title, images: [] };
  for (let j = 0; j < step.media.data.length; j++) {
    const photo = step.media.data[j];
    const url = photo.original || photo.large;
    const response = await get(url);
    const ext = response.headers.get('content-type')?.includes('png') ? 'png' : 'jpg';
    const filename = `paso-${number}-foto-${String(j + 1).padStart(2, '0')}.${ext}`;
    const data = Buffer.from(await response.arrayBuffer());
    if (data.length < 1000) throw new Error(`Empty image: ${url}`);
    await writeNew(path.join(photos, filename), data);
    entry.images.push({ file: `fotos-originales/${filename}`, source: url, bytes: data.length });
  }
  index.steps.push(entry);
  console.log(`Fotos del paso ${number}: ${entry.images.length}`);
}
await writeNew(path.join(root, 'indice.json'), JSON.stringify(index, null, 2));
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'ifixit-capturas-'));
const chrome = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const browser = spawn(chrome, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
let sequence = 0;
const pending = new Map();
async function command(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 60000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
try {
  let port;
  for (let n = 0; n < 100; n++) {
    try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await pause(200); }
  }
  if (!port) throw new Error('Chrome did not start');
  const targets = await (await get(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    const task = pending.get(data.id);
    if (task) { clearTimeout(task.timer); pending.delete(data.id); data.error ? task.reject(new Error(JSON.stringify(data.error))) : task.resolve(data.result); }
  });
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1.5, mobile: false });
  await command('Page.navigate', { url: source });
  let count = 0;
  for (let n = 0; n < 90; n++) {
    count = await evaluate('document.querySelectorAll("li.step-wrapper").length');
    if (count === 21) break;
    await pause(500);
  }
  if (count !== 21) throw new Error(`Expected 21 visible step blocks, found ${count}`);
  await evaluate('document.fonts.ready.then(() => true)');
  for (let i = 0; i < 21; i++) {
    const box = await evaluate(`(async () => {
      const step = document.querySelectorAll('li.step-wrapper')[${i}];
      step.scrollIntoView({ block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 650));
      const images = [...step.querySelectorAll('img.stepImage')];
      await Promise.all(images.map(img => img.decode().catch(() => {})));
      const loaded = images.filter(img => img.naturalWidth > 100);
      if (!loaded.length) throw new Error('Step image not loaded');
      const rect = step.getBoundingClientRect();
      return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height, scale: 1 };
    })()`);
    const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: box });
    const filename = `paso-${String(i + 1).padStart(2, '0')}.png`;
    await writeNew(path.join(screenshots, filename), Buffer.from(shot.data, 'base64'));
    console.log(`Captura ${filename}`);
  }
  console.log(`Completado: 21 capturas y ${index.steps.reduce((sum, step) => sum + step.images.length, 0)} fotos originales.`);
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await command('Browser.close'); } catch {}
    socket.close();
  }
  if (browser.exitCode === null) browser.kill();
}
