import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

const [width = '390', height = '844', output = 'design-previews/review.png', url = 'http://127.0.0.1:5173/', clickSelector = ''] = process.argv.slice(2)
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'nucleo-review-'))
const chrome = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe')
const browser = spawn(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
let next = 0
const pending = new Map()
try {
  let port
  for (let i = 0; i < 80; i++) {
    try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break } catch { await wait(100) }
  }
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    const task = pending.get(message.id)
    if (!task) return
    pending.delete(message.id)
    if (message.error) task.reject(message.error)
    else task.resolve(message.result)
  })
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++next
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  await call('Page.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: Number(width), height: Number(height), deviceScaleFactor: 1, mobile: Number(width) < 600 })
  await call('Page.navigate', { url })
  await wait(2500)
  if (clickSelector) {
    for (const selector of clickSelector.split('||').map(value => value.trim()).filter(Boolean)) {
      await call('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(selector)})?.click()` })
      await wait(500)
    }
  }
  const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await fs.writeFile(output, Buffer.from(shot.data, 'base64'))
  const metrics = await call('Runtime.evaluate', { expression: `JSON.stringify({ innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth })`, returnByValue: true })
  console.log(metrics.result.value)
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close()
  if (browser.exitCode === null) browser.kill()
}
