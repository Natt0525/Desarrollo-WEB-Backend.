import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

// Real-browser smoke test; requires the project's existing local Chromium and Vite.
const url = process.argv[2] || 'http://127.0.0.1:5173/#inventario'
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'zion-smoke-'))
const chrome = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe')
const browser = spawn(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket, next = 0
const pending = new Map(), errors = [], checks = []
try {
  let port
  for (let i = 0; i < 80; i++) {
    try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break } catch { await pause(100) }
  }
  assert.ok(port, 'Chromium did not start')
  const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args)
    const task = pending.get(message.id)
    if (!task) return
    pending.delete(message.id)
    if (message.error) task.reject(message.error)
    else task.resolve(message.result)
  })
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++next
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)) }, 15000)
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value) }, reject: error => { clearTimeout(timer); reject(error) } })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const click = async (text, selector = 'button') => {
    await evaluate('(() => { const el = [...document.querySelectorAll(' + JSON.stringify(selector) + ')].filter(el => el.getClientRects().length).find(el => el.textContent.trim() === ' + JSON.stringify(text) + '); if (!el) throw Error("Missing button: " + ' + JSON.stringify(text) + '); if(el.disabled) throw Error("Disabled: " + el.textContent); el.click(); })()')
    await pause(90)
  }
  const clickSelector = async selector => { await evaluate('document.querySelector(' + JSON.stringify(selector) + ').click()'); await pause(90) }
  const set = async (selector, value) => {
    await evaluate('(() => { const el = [...document.querySelectorAll(' + JSON.stringify(selector) + ')].find(el => el.getClientRects().length); if(!el) throw Error("Missing field: " + ' + JSON.stringify(selector) + '); const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, "value").set.call(el,' + JSON.stringify(String(value)) + '); el.dispatchEvent(new Event("input",{bubbles:true})); el.dispatchEvent(new Event("change",{bubbles:true})); })()')
    await pause(60)
  }
  const form = async (values, selector = '.workshop-form') => {
    for (const [name, value] of Object.entries(values)) await set(selector + ' [name="' + name + '"]', value)
    const valid = await evaluate('document.querySelector(' + JSON.stringify(selector) + ').reportValidity()')
    assert.equal(valid, true, 'Invalid form ' + JSON.stringify(values))
    await evaluate('document.querySelector(' + JSON.stringify(selector) + ').requestSubmit()')
    await pause(120)
  }
  const has = async text => assert.ok((await evaluate('document.body.innerText')).includes(text), 'Missing text: ' + text)
  const nav = async index => { await clickSelector('.sales-rail nav button:nth-child(' + index + ')'); await pause(100) }
  const verify = label => { checks.push(label); console.log('PASS ' + label) }
  const selectOrder = async () => {
    await evaluate('[...document.querySelectorAll(".order-row")].find(el => el.textContent.includes("QA Modelo")).click()')
    await pause(100)
  }
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url })
  await pause(1600)
  await nav(4)
  await click('+ Registrar técnico')
  await form({ name: 'QA Técnico', specialty: 'Diagnóstico', turn: '09:00–17:00', rate: 40, paymentTiming: 'Fin de semana' })
  await has('QA Técnico')
  verify('alta de técnico')

  await nav(7)
  await click('+ Registrar cliente')
  await form({ name: 'QA Cliente', phone: '70000123', email: 'qa@example.test' }, '.client-form')
  await has('QA Cliente')
  await click('+ Nueva orden')
  assert.equal(await evaluate('document.querySelector("[name=client]").value'), 'QA Cliente')
  await form({ brand: 'QA', model: 'Modelo', failure: 'No enciende', accessories: 'Sin accesorios', verification: 'No enciende · pendiente' })
  await has('QA Modelo')
  await has('Equipo sin encender')
  verify('cliente → orden con datos precargados')

  await click('Añadir trabajo')
  await form({ title: 'Prueba de placa', technician: 'QA Técnico', price: 1000, partCost: 200 })
  await has('V1')
  await set('.op-status-control select', 'Entregado')
  await has('Registra la aprobación')
  await click('Registrar aprobación')
  await click('Nueva versión')
  await form({ amount: 1100 })
  await has('V1')
  await has('V2')
  await click('Registrar aprobación')
  await click('Registrar cobro')
  await form({ amount: 400, method: 'QR' })
  await has('Cobro registrado en caja')
  verify('presupuestos versionados, aprobación y anticipo')

  await evaluate('(() => { const input = document.querySelector(".order-file input[type=file]"); const dt = new DataTransfer(); dt.items.add(new File([Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII="), c => c.charCodeAt(0))], "qa.png", { type: "image/png" })); input.files = dt.files; input.dispatchEvent(new Event("change", { bubbles: true })); })()')
  await pause(150)
  assert.equal(await evaluate('document.querySelectorAll(".order-file .op-photos img").length'), 1)
  verify('fotografía de recepción')

  await nav(7)
  await evaluate('[...document.querySelectorAll(".client-row")].find(el => el.textContent.includes("QA Cliente")).click()')
  await has('QA Modelo')
  await has('700')
  await nav(4)
  await evaluate('[...document.querySelectorAll(".technician-roster button")].find(el => el.textContent.includes("QA Técnico")).click()')
  await pause(80)
  await has('Prueba de placa')
  await has('80,00')
  await click('Registrar pago pendiente')
  await set('.commission-control input', 50)
  await has('40%')
  verify('orden → cliente y técnico; comisión pagada; porcentaje histórico')

  await nav(6)
  await selectOrder()
  await click('Registrar cobro')
  await form({ amount: 700, method: 'Efectivo' })
  await set('.op-status-control select', 'Entregado')
  await has('Termina todos los trabajos')
  await set('.order-file .op-job select', 'Terminado')
  await set('.op-status-control select', 'Listo')
  await set('.op-status-control select', 'Entregado')
  assert.equal(await evaluate('document.querySelector(".order-file .op-status-control select").value'), 'Entregado')
  await click('Archivar')
  await has('Orden archivada')
  await click('Restaurar')
  await has('Orden restaurada')
  verify('saldo, control de entrega y archivo reversible')

  await nav(4)
  await evaluate('[...document.querySelectorAll(".technician-roster button")].find(el => el.textContent.includes("QA Técnico")).click()')
  await pause(80)
  await has('360,00')
  await has('280,00')
  await click('Registrar pago pendiente')
  await has('Todo pagado')
  verify('segundo cobro actualiza comisión sin duplicar el pago')

  await nav(2)
  await click('+ Registrar celular')
  await form({ model: 'QA Celular', storage: '128 GB', ram: '8 GB', color: 'Negro', grade: '9/10', battery: 90, price: 1500, cost: 900, imei: '123456789012345', network: '4G', warranty: '30 días' })
  await has('QA Celular')
  await click('Vender equipo')
  await clickSelector('.sale-form input[type=checkbox]')
  await form({ customer: 'QA Comprador', phone: '70000987', salePrice: 1500, payment: 'QR' }, '.sale-form')
  await has('Venta registrada')
  await nav(5)
  await has('QA Celular')
  await nav(2)
  await has('Vendido')
  verify('celular: alta, venta, caja e inventario compartidos')

  await nav(3)
  await click('+ Registrar pantalla')
  await form({ brand: 'QA', model: 'Pantalla prueba', compatibility: 'QA-100', technology: 'Incell', quality: 'Compatible', stock: 3, price: 400, cost: 200, supplier: 'Proveedor QA', warranty: '30 días', location: 'A-01' })
  await has('Pantalla prueba')
  await evaluate('[...document.querySelectorAll(".screen-inspector button")].find(el => el.textContent.toLowerCase().includes("vender")).click()')
  await pause(90)
  await clickSelector('.screen-sale-form input[type=checkbox]')
  await form({ customer: 'QA Comprador', quantity: 2, salePrice: 400, payment: 'Efectivo' }, '.screen-sale-form')
  await has('Venta registrada')
  await nav(5)
  await has('Pantalla prueba · 2 u.')
  await nav(3)
  const stock = await evaluate('[...document.querySelectorAll(".screen-row")].find(el => el.textContent.includes("Pantalla prueba"))?.textContent')
  assert.ok(stock?.includes('1 u.'), 'Stock after sale: ' + stock)
  verify('pantalla: alta, venta de dos unidades y stock persistente')

  await nav(5)
  await evaluate('window.print = () => { window.__printed = true }')
  await click('Imprimir / guardar PDF')
  assert.equal(await evaluate('window.__printed'), true)
  const pdf = await call('Page.printToPDF', { printBackground: true, preferCSSPageSize: true })
  await fs.mkdir('design-previews', { recursive: true })
  await fs.writeFile('design-previews/reporte-ventas-demo.pdf', Buffer.from(pdf.data, 'base64'))
  verify('reporte de caja imprimible en PDF')

  for (const width of [1440, 1024, 768, 390, 320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
    for (const module of [1, 2, 3, 4, 5, 6, 7]) {
      await nav(module)
      const metrics = await evaluate('({ width: innerWidth, scroll: document.documentElement.scrollWidth })')
      assert.ok(metrics.scroll <= width + 1, 'Overflow ' + width + ' module ' + module + ': ' + JSON.stringify(metrics))
      if ([1440, 390].includes(width) && [1, 4, 5, 6, 7].includes(module)) {
        const shot = await call('Page.captureScreenshot', { format: 'png' })
        await fs.writeFile('design-previews/module-' + module + '-' + width + '.png', Buffer.from(shot.data, 'base64'))
      }
    }
  }
  verify('7 módulos sin desbordamiento horizontal en 5 anchos (320–1440 px)')
  assert.equal(errors.length, 0, 'Browser errors: ' + JSON.stringify(errors))
  verify('sin errores de ejecución ni errores en consola')
  console.log(JSON.stringify({ passed: checks.length, checks }, null, 2))
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close()
  if (browser.exitCode === null) browser.kill()
}

