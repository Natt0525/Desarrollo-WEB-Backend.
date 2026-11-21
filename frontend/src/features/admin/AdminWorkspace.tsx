import { useEffect, useMemo, useState, useCallback } from 'react'
import galaxyS22Image from '../../assets/phones/samsung-galaxy-s22-phantom-black.jpg'
import iphone12Image from '../../assets/phones/iphone-12-blue.jpg'
import xiaomi12LiteImage from '../../assets/phones/xiaomi-12-lite-black.png'
import galaxyA54Image from '../../assets/phones/samsung-galaxy-a54-awesome-lime.jpg'
import ScreenDashboard from './screens/ScreenDashboard'
import TechnicianDashboard from './technicians/TechnicianDashboard'
import ClientDashboard from './clients/ClientDashboard'
import OperationsDashboard from './operations/OperationsDashboard'
import './shared/AdminDashboard.css'
import WorkshopForm, { type Field } from './shared/WorkshopForm'
import { useDemoState, recordSale, ensureClient, uploadedImage, normalizePhone } from './shared/demoStore'
import noPhoto from '../../assets/no-photo.svg'

type DeviceStatus = 'Disponible' | 'Reservado' | 'Vendido'
type DetailView = 'specs' | 'sale' | null
type Device = { id: string; model: string; storage: string; ram: string; color: string; grade: string; battery: number; price: number; cost: number; status: DeviceStatus; image: string; repairs: string[]; network: string; warranty: string; accessories: string; imei: string; notes: string; specs: Array<{ label: string; value: string }> }

const initialDevices: Device[] = [
  { id: 'ZT-0284', model: 'Samsung Galaxy S22', storage: '128 GB', ram: '8 GB', color: 'Phantom Black', grade: '9/10', battery: 88, price: 2350, cost: 1740, status: 'Disponible', image: galaxyS22Image, repairs: ['Batería original', 'Pantalla original', 'Glass original'], network: '5G · Nano-SIM + eSIM', warranty: '90 días', accessories: 'Cable USB-C', imei: '358321•••••4821', notes: 'Marco con una marca leve en la esquina inferior. Cámaras y carga inalámbrica verificadas.', specs: [
    { label: 'Pantalla', value: '6.1″ Dynamic AMOLED 2X · 120 Hz' }, { label: 'Procesador', value: 'Snapdragon 8 Gen 1 / Exynos 2200' }, { label: 'Memoria', value: '8 GB RAM · 128 GB' }, { label: 'Cámaras', value: '50 MP + 12 MP + 10 MP · frontal 10 MP' }, { label: 'Batería', value: '3.700 mAh · carga 25 W · inalámbrica 15 W' }, { label: 'Protección', value: 'IP68 · Gorilla Glass Victus+' }, { label: 'Sistema', value: 'Android · One UI' }, { label: 'Conectividad', value: '5G · Wi-Fi 6 · Bluetooth 5.2 · NFC' },
  ] },
  { id: 'ZT-0281', model: 'iPhone 12', storage: '64 GB', ram: '4 GB', color: 'Azul', grade: '8.5/10', battery: 84, price: 3100, cost: 2450, status: 'Reservado', image: iphone12Image, repairs: ['Batería original', 'Glass cambiado', 'Pantalla original'], network: '5G · Nano-SIM + eSIM', warranty: '60 días', accessories: 'Cable Lightning', imei: '353910•••••1278', notes: 'Face ID y True Tone activos. Reserva vigente hasta el viernes a las 18:00.', specs: [
    { label: 'Pantalla', value: '6.1″ Super Retina XDR OLED' }, { label: 'Procesador', value: 'Apple A14 Bionic' }, { label: 'Memoria', value: '4 GB RAM · 64 GB' }, { label: 'Cámaras', value: 'Dual 12 MP · frontal TrueDepth 12 MP' }, { label: 'Batería', value: 'Hasta 17 h de video · MagSafe 15 W' }, { label: 'Protección', value: 'IP68 · Ceramic Shield' }, { label: 'Sistema', value: 'iOS' }, { label: 'Conectividad', value: '5G · Wi-Fi 6 · Bluetooth 5.0 · NFC' },
  ] },
  { id: 'ZT-0279', model: 'Xiaomi 12 Lite', storage: '256 GB', ram: '8 GB', color: 'Negro', grade: '9/10', battery: 91, price: 1750, cost: 1350, status: 'Disponible', image: xiaomi12LiteImage, repairs: ['Batería original', 'Pantalla cambiada AMOLED', 'Tapa original'], network: '5G · Dual SIM', warranty: '90 días', accessories: 'Caja y cargador 67 W', imei: '867541•••••9054', notes: 'Pantalla AMOLED compatible instalada y calibrada. Se entrega con cargador original.', specs: [
    { label: 'Pantalla', value: '6.55″ AMOLED · 120 Hz · Dolby Vision' }, { label: 'Procesador', value: 'Snapdragon 778G 5G' }, { label: 'Memoria', value: '8 GB RAM · 256 GB' }, { label: 'Cámaras', value: '108 MP + 8 MP + 2 MP · frontal 32 MP' }, { label: 'Batería', value: '4.300 mAh · carga rápida 67 W' }, { label: 'Protección', value: 'Gorilla Glass 5' }, { label: 'Sistema', value: 'Android · MIUI' }, { label: 'Conectividad', value: '5G · Wi-Fi 6 · Bluetooth 5.2 · NFC' },
  ] },
  { id: 'ZT-0274', model: 'Samsung Galaxy A54 5G', storage: '128 GB', ram: '8 GB', color: 'Awesome Lime', grade: '8/10', battery: 86, price: 1850, cost: 1420, status: 'Vendido', image: galaxyA54Image, repairs: ['Batería cambiada', 'Pantalla original', 'Glass original'], network: '5G · Dual SIM', warranty: '90 días', accessories: 'Solo equipo', imei: '352099•••••6603', notes: 'Vendido. Conservar fotografías internas y diagnóstico para atención de garantía.', specs: [
    { label: 'Pantalla', value: '6.4″ Super AMOLED · 120 Hz' }, { label: 'Procesador', value: 'Exynos 1380' }, { label: 'Memoria', value: '8 GB RAM · 128 GB · microSD' }, { label: 'Cámaras', value: '50 MP + 12 MP + 5 MP · frontal 32 MP' }, { label: 'Batería', value: '5.000 mAh · carga 25 W' }, { label: 'Protección', value: 'IP67 · Gorilla Glass 5' }, { label: 'Sistema', value: 'Android · One UI' }, { label: 'Conectividad', value: '5G · Wi-Fi 6 · Bluetooth 5.3 · NFC' },
  ] },
]

const money = new Intl.NumberFormat('es-BO')
type AdminWorkspaceProps = { onExit: () => void }

function AdminWorkspace({ onExit }: AdminWorkspaceProps) {
  const [activeModule, setActiveModule] = useState<'summary' | 'phones' | 'screens' | 'technicians' | 'sales' | 'orders' | 'clients'>('phones')
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.sales-rail nav')
    const active = nav?.querySelector<HTMLElement>('button.active')
    if (nav && active && window.innerWidth <= 860) nav.scrollLeft = active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.clientWidth) / 2
  }, [activeModule])
  const [inventory, setInventory] = useDemoState('phones', initialDevices)
  const [selectedId, setSelectedId] = useState(initialDevices[0].id)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'Todos' | DeviceStatus>('Todos')
  const [notice, setNotice] = useState('')
  const [detailView, setDetailView] = useState<DetailView>(null)
  const [noteDrafts, setNoteDrafts] = useDemoState<Record<string, string>>('phoneNotes', Object.fromEntries(initialDevices.map((device) => [device.id, device.notes])))

  const [registering, setRegistering] = useState(false)
  const closeRegistration = useCallback(() => setRegistering(false), [])
  const registrationFields: Field[] = [
    { name: 'model', label: 'Marca y modelo exactos', required: true }, { name: 'storage', label: 'Almacenamiento', required: true },
    { name: 'ram', label: 'Memoria RAM', required: true }, { name: 'color', label: 'Color', required: true },
    { name: 'grade', label: 'Estado estético', required: true }, { name: 'battery', label: 'Salud de batería (%)', type: 'number', min: 0, max: 100, required: true },
    { name: 'price', label: 'Precio de venta (Bs)', type: 'number', min: .01, required: true }, { name: 'cost', label: 'Costo de compra (Bs)', type: 'number', min: 0, required: true },
    { name: 'imei', label: 'IMEI privado · 15 dígitos', required: true }, { name: 'network', label: 'Red / conectividad', required: true },
    { name: 'warranty', label: 'Garantía ofrecida', required: true }, { name: 'accessories', label: 'Accesorios incluidos' },
    ...['Glass', 'Pantalla', 'Batería'].map(label => ({ name: label, label, options: ['Original', 'Cambiado', 'Pendiente de verificar'] })),
    { name: 'notes', label: 'Observaciones y características adicionales', type: 'textarea' },
    { name: 'image', label: 'Fotografía de la unidad · JPG, PNG o WebP, hasta 3 MB', type: 'file' },
  ]
  const registerPhone = (data: FormData) => {
    const value = (key: string) => String(data.get(key) || '').trim()
    if (!/^\d{15}$/.test(value('imei'))) throw new Error('El IMEI debe contener 15 dígitos.')
    if (inventory.some(device => device.imei === value('imei'))) throw new Error('Ese IMEI ya está registrado.')
    const device: Device = { id: 'ZT-' + crypto.randomUUID().slice(0,8), model: value('model'), storage: value('storage'), ram: value('ram'), color: value('color'), grade: value('grade'), battery: Number(value('battery')), price: Number(value('price')), cost: Number(value('cost')), status: 'Disponible', image: uploadedImage(data, noPhoto), repairs: ['Glass', 'Pantalla', 'Batería'].map(label => label + ': ' + value(label)), network: value('network'), warranty: value('warranty'), accessories: value('accessories') || 'Sin accesorios', imei: value('imei'), notes: value('notes'), specs: [{ label: 'Memoria', value: value('ram') + ' RAM · ' + value('storage') }, { label: 'Red', value: value('network') }, { label: 'Características adicionales', value: value('notes') || 'Pendientes de verificar' }] }
    setInventory(current => [device, ...current]); setSelectedId(device.id); setQuery(''); setFilter('Todos'); closeRegistration()
    setNoteDrafts(current => ({ ...current, [device.id]: device.notes }))
    setNotice('Celular registrado en esta sesión.')
  }

  const filteredDevices = useMemo(() => inventory.filter((device) => {
    const matchesQuery = `${device.model} ${device.storage} ${device.id}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'Todos' || device.status === filter)
  }), [filter, inventory, query])
  const selected = inventory.find((device) => device.id === selectedId) ?? inventory[0]
  const closeDetail = () => setDetailView(null)
  const selectDevice = (deviceId: string) => {
    setSelectedId(deviceId)
    if (window.matchMedia('(max-width: 1050px)').matches) setDetailView('specs')
  }

  useEffect(() => {
    if (!detailView) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetailView(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [detailView])
  const completeSale = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customer = String(form.get('customer') || '').trim()
    const salePrice = Number(form.get('salePrice'))
    const phone = String(form.get('phone') || '').trim()
    if (!customer || normalizePhone(phone).length < 7 || !Number.isFinite(salePrice) || salePrice <= 0 || selected.status === 'Vendido') { setNotice('Revisa el cliente, teléfono y precio.'); closeDetail(); return }
    ensureClient(customer, phone)
    recordSale({ type: 'Celular', description: selected.model + ' · ' + selected.storage, client: customer, method: String(form.get('payment')), amount: salePrice, cost: selected.cost, reference: selected.id, notes: String(form.get('saleNotes') || '').trim() })
    setInventory((current) => current.map((device) => device.id === selected.id ? { ...device, status: 'Vendido', price: salePrice } : device))
    setNotice(`Venta registrada: ${selected.model} para ${customer}, Bs ${money.format(salePrice)}. Se guardará definitivamente al conectar el backend.`)
    closeDetail()
  }

  const openOperations = (section: 'summary' | 'sales' | 'orders') => setActiveModule(section)
  if (activeModule === 'screens') return <ScreenDashboard onExit={onExit} onOpenPhones={() => setActiveModule('phones')} onOpenTechnicians={() => setActiveModule('technicians')} onOpenClients={() => setActiveModule('clients')} onOpenOperations={openOperations} />
  if (activeModule === 'technicians') return <TechnicianDashboard onExit={onExit} onOpenPhones={() => setActiveModule('phones')} onOpenScreens={() => setActiveModule('screens')} onOpenClients={() => setActiveModule('clients')} onOpenOperations={openOperations} />
  if (activeModule === 'clients') return <ClientDashboard onExit={onExit} onOpenPhones={() => setActiveModule('phones')} onOpenScreens={() => setActiveModule('screens')} onOpenTechnicians={() => setActiveModule('technicians')} onOpenOperations={openOperations} />
  if (activeModule === 'summary' || activeModule === 'sales' || activeModule === 'orders') return <OperationsDashboard section={activeModule} onNavigate={openOperations} onExit={onExit} onOpenPhones={() => setActiveModule('phones')} onOpenScreens={() => setActiveModule('screens')} onOpenTechnicians={() => setActiveModule('technicians')} onOpenClients={() => setActiveModule('clients')} />

  return (
    <main className="sales-shell">
      <aside className="sales-rail">
        <button className="sales-mark" type="button" onClick={onExit} aria-label="Volver a la portada"><b>Z</b><span>ZION<br />TECH</span></button>
        <nav aria-label="Módulos administrativos"><button type="button" onClick={() => setActiveModule('summary')}><i>⌁</i><span>Resumen</span></button><button className="active" type="button"><i>▣</i><span>Celulares</span></button><button type="button" onClick={() => setActiveModule('screens')}><i>▤</i><span>Pantallas</span></button><button type="button" onClick={() => setActiveModule('technicians')}><i>⌾</i><span>Técnicos</span></button><button type="button" onClick={() => setActiveModule('sales')}><i>↗</i><span>Ventas</span></button><button type="button" onClick={() => setActiveModule('orders')}><i>⌕</i><span>Órdenes</span></button><button type="button" onClick={() => setActiveModule('clients')}><i>◎</i><span>Clientes</span></button></nav>
        <div className="rail-user"><span>ZT</span><div><b>Propietario</b><small>Administrador</small></div></div>
      </aside>

      <section className="sales-workspace">
        <header className="sales-topbar"><div><p>Inventario de celulares</p><span>{inventory.filter((device) => device.status === 'Disponible').length} equipos disponibles hoy</span></div><div className="sales-top-actions"><button type="button" onClick={() => setRegistering(true)}>+ Registrar celular</button><button className="exit-dashboard" type="button" onClick={onExit}>Salir</button></div></header>
        <div className="inventory-toolbar"><label className="inventory-search"><span>Buscar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Marca, modelo o código" /></label><div className="status-filters" aria-label="Filtrar inventario">{(['Todos', 'Disponible', 'Reservado', 'Vendido'] as const).map((status) => <button className={filter === status ? 'active' : ''} type="button" key={status} onClick={() => setFilter(status)}>{status}</button>)}</div></div>
        {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Cerrar</button></div>}

        <div className="sales-grid">
          <section className="inventory-ledger" aria-label="Equipos registrados">
            <div className="ledger-head"><span>Equipo</span><span>Estado</span><span>Batería</span><span>Precio</span></div>
            {filteredDevices.length > 0 ? filteredDevices.map((device) => <button className={`ledger-row ${selected.id === device.id ? 'selected' : ''}`} type="button" key={device.id} onClick={() => selectDevice(device.id)}><span className="device-name"><small>{device.id}</small><b>{device.model}</b><em>{device.storage} · {device.color}</em></span><span><i className={`status-dot ${device.status.toLowerCase()}`} />{device.status}</span><span className="battery-value"><b>{device.battery}%</b><i><u style={{ width: `${device.battery}%` }} /></i></span><span className="row-price"><b>Bs {money.format(device.price)}</b><small>Ver ficha →</small></span></button>) : <div className="inventory-empty"><b>No encontramos equipos.</b><span>Prueba otra marca, modelo o estado.</span></div>}
          </section>

          <aside className="device-passport" aria-label={`Ficha de ${selected.model}`}>
            <div className="passport-photo"><img src={selected.image} alt={`${selected.model} ${selected.color}, imagen de referencia del modelo`} /><span>{selected.status}</span><small>FOTO DE REFERENCIA · VERIFICAR UNIDAD</small></div>
            <div className="passport-title"><div><span>{selected.id}</span><h1>{selected.model}</h1><p>{selected.ram} RAM · {selected.storage} · {selected.color} · Estado {selected.grade}</p></div></div>
            <div className="passport-price"><span>Precio publicado</span><b>Bs {money.format(selected.price)}</b></div>
            <div className="passport-actions"><button type="button" onClick={() => setDetailView('specs')}>Ficha completa</button><button className="sell-device" type="button" disabled={selected.status === 'Vendido'} onClick={() => setDetailView('sale')}>{selected.status === 'Vendido' ? 'Equipo vendido' : 'Vender equipo'}</button></div>
            <dl className="inspection-grid"><div><dt>Batería</dt><dd>{selected.battery}%</dd></div><div><dt>Red</dt><dd>{selected.network}</dd></div><div><dt>Garantía</dt><dd>{selected.warranty}</dd></div><div><dt>Incluye</dt><dd>{selected.accessories}</dd></div></dl>
            <div className="repair-record"><h2>Historial de componentes</h2>{selected.repairs.map((repair) => <p key={repair}><i />{repair}</p>)}</div>
            <div className="notes-record"><label htmlFor={`notes-${selected.id}`}>Notas internas</label><textarea id={`notes-${selected.id}`} value={noteDrafts[selected.id] ?? ''} onChange={(event) => setNoteDrafts((current) => ({ ...current, [selected.id]: event.target.value }))} /><button type="button" onClick={() => setNotice(`Notas de ${selected.model} guardadas temporalmente.`)}>Guardar notas</button></div>
            <div className="private-record"><span>Dato privado</span><b>IMEI {selected.imei}</b><small>Visible solo para personal autorizado</small></div>
          </aside>
        </div>
      </section>

      {detailView && <div className="device-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="overlay-backdrop" type="button" onClick={closeDetail} aria-label="Cerrar ventana" /><section className={`detail-drawer ${detailView === 'sale' ? 'sale-drawer' : ''}`}>
        <header><div><span>{selected.id}</span><h2 id="detail-title">{detailView === 'sale' ? 'Registrar venta' : selected.model}</h2><p>{detailView === 'sale' ? `${selected.model} · ${selected.storage}` : 'Características del modelo y estado de esta unidad'}</p></div><button type="button" onClick={closeDetail} aria-label="Cerrar">×</button></header>
        {detailView === 'specs' ? <><div className="detail-hero"><img src={selected.image} alt={`${selected.model} ${selected.color}`} /><div><span>{selected.status}</span><b>Bs {money.format(selected.price)}</b><small>{selected.color} · {selected.grade}</small></div></div><div className="spec-sheet">{selected.specs.map((spec) => <div key={spec.label}><span>{spec.label}</span><b>{spec.value}</b></div>)}</div><div className="unit-inspection"><h3>Estado de esta unidad</h3><p><span>Salud de batería</span><b>{selected.battery}%</b></p><p><span>Red</span><b>{selected.network}</b></p><p><span>Garantía ZION TECH</span><b>{selected.warranty}</b></p><p><span>Accesorios</span><b>{selected.accessories}</b></p></div><div className="detail-note"><span>Nota interna</span><p>{noteDrafts[selected.id]}</p></div><button className="drawer-primary" type="button" disabled={selected.status === 'Vendido'} onClick={() => setDetailView('sale')}>{selected.status === 'Vendido' ? 'Este equipo ya fue vendido' : 'Vender este equipo'}</button></> : <form className="sale-form" onSubmit={completeSale}>
          <div className="sale-summary"><img src={selected.image} alt="" /><div><b>{selected.model}</b><span>{selected.storage} · {selected.color}</span><strong>Bs {money.format(selected.price)}</strong></div></div>
          <label><span>Cliente</span><input name="customer" placeholder="Nombre completo" required /></label><label><span>Teléfono</span><input name="phone" type="tel" placeholder="Número de contacto" required /></label><label><span>Precio final en Bs</span><input name="salePrice" type="number" min="0.01" step="0.01" defaultValue={selected.price} required /></label><label><span>Método de pago</span><select name="payment" defaultValue="Efectivo"><option>Efectivo</option><option>Transferencia</option><option>QR</option><option>Mixto</option></select></label><label><span>Notas de la venta</span><textarea name="saleNotes" placeholder="Accesorios entregados, garantía u observaciones" /></label><label className="sale-check"><input type="checkbox" required /><span>Confirmo que el IMEI y el estado del equipo fueron verificados.</span></label><button className="drawer-primary" type="submit">Confirmar venta</button><small>En esta etapa la venta se conserva hasta recargar la página. El backend añadirá el registro definitivo y el comprobante.</small>
        </form>}
      </section></div>}
      {registering && <WorkshopForm title="Registrar celular" fields={registrationFields} onClose={closeRegistration} onSave={registerPhone} />}
    </main>
  )
}

export default AdminWorkspace
