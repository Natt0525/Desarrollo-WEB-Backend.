import { useEffect, useMemo, useState, useCallback } from 'react'
import galaxyA54Screen from '../../../assets/screens/samsung-galaxy-a54-frame.jpg'
import iphone12Screen from '../../../assets/screens/iphone-12-oled.jpg'
import iphone11Screen from '../../../assets/screens/iphone-11-incell.jpg'
import redmiNote11Screen from '../../../assets/screens/redmi-note-11-amoled.jpg'
import motoG54Screen from '../../../assets/screens/motorola-moto-g54-frame.png'
import redmiNote10ProScreen from '../../../assets/screens/redmi-note-10-pro-amoled.png'
import '../shared/AdminDashboard.css'
import './ScreenDashboard.css'
import WorkshopForm, { type Field } from '../shared/WorkshopForm'
import { useDemoState, ensureClient, recordSale, uploadedImage } from '../shared/demoStore'
import noPhoto from '../../../assets/no-photo.svg'

type Technology = 'LCD' | 'Incell' | 'AMOLED'
type ScreenPart = {
  id: string; brand: string; model: string; compatibility: string; technology: Technology
  frame: boolean; originalPanel: boolean; quality: string; stock: number; price: number
  image?: string; cost: number; supplier: string; warranty: string; location: string; notes: string
}

const initialScreens: ScreenPart[] = [
  { id: 'PT-0418', brand: 'Samsung', model: 'Galaxy A54 5G', compatibility: 'SM-A546E / A546B', technology: 'AMOLED', frame: true, originalPanel: false, quality: 'Service Pack compatible', stock: 4, price: 980, cost: 690, supplier: 'Importadora Andes', warranty: '90 días', location: 'Gaveta A-04', notes: 'Marco negro. Incluye adhesivo; verificar huella antes de instalar.' },
  { id: 'PT-0412', brand: 'Apple', model: 'iPhone 12 / 12 Pro', compatibility: 'A2172 / A2402 / A2403', technology: 'AMOLED', frame: false, originalPanel: true, quality: 'Panel original · glass cambiado', stock: 2, price: 1250, cost: 920, supplier: 'Mobile Parts LP', warranty: '60 días', location: 'Gaveta B-02', notes: 'Conserva True Tone después de transferir IC. Probar brillo y táctil completo.' },
  { id: 'PT-0409', brand: 'Apple', model: 'iPhone 11', compatibility: 'A2111 / A2221 / A2223', technology: 'Incell', frame: false, originalPanel: false, quality: 'Premium COF', stock: 7, price: 490, cost: 305, supplier: 'Tecno Repuestos BO', warranty: '45 días', location: 'Gaveta B-06', notes: 'Tono frío calibrado. Requiere adhesivo perimetral nuevo.' },
  { id: 'PT-0401', brand: 'Xiaomi', model: 'Redmi Note 11', compatibility: '2201117TG / 2201117TY', technology: 'AMOLED', frame: true, originalPanel: false, quality: 'Compatible AAA', stock: 1, price: 620, cost: 405, supplier: 'Importadora Andes', warranty: '45 días', location: 'Gaveta C-03', notes: 'Probar sensor de proximidad y brillo automático antes del sellado.' },
  { id: 'PT-0397', brand: 'Motorola', model: 'Moto G54 5G', compatibility: 'XT2343-1 / XT2343-2', technology: 'LCD', frame: true, originalPanel: false, quality: 'Compatible premium', stock: 3, price: 430, cost: 270, supplier: 'Tecno Repuestos BO', warranty: '30 días', location: 'Gaveta C-08', notes: 'Marco azul oscuro. Revisar versión exacta antes de retirar el protector.' },
  { id: 'PT-0400', brand: 'Xiaomi', model: 'Redmi Note 10 Pro', compatibility: 'M2101K6G / M2101K6I', technology: 'AMOLED', frame: false, originalPanel: true, quality: 'Panel original · glass cambiado', stock: 0, price: 760, cost: 550, supplier: 'Mobile Parts LP', warranty: '60 días', location: 'Sin ubicación', notes: 'Agotada. Mantener visible para consultas y reposición.' },
]

const screenImages: Record<string, string> = {
  'PT-0418': galaxyA54Screen,
  'PT-0412': iphone12Screen,
  'PT-0409': iphone11Screen,
  'PT-0401': redmiNote11Screen,
  'PT-0397': motoG54Screen,
  'PT-0400': redmiNote10ProScreen,
}

const imageFor = (screen: ScreenPart) => screen.image || screenImages[screen.id] || noPhoto
const money = new Intl.NumberFormat('es-BO')
type ScreenDashboardProps = { onExit: () => void; onOpenPhones: () => void; onOpenTechnicians: () => void; onOpenClients: () => void; onOpenOperations: (section: 'summary' | 'sales' | 'orders') => void }
type DrawerView = 'detail' | 'sale' | null

function stockLabel(stock: number) {
  if (stock === 0) return 'Agotada'
  if (stock <= 2) return 'Stock bajo'
  return 'Disponible'
}

function ScreenDashboard({ onExit, onOpenPhones, onOpenTechnicians, onOpenClients, onOpenOperations }: ScreenDashboardProps) {
  const [inventory, setInventory] = useDemoState('screens', initialScreens)
  const [selectedId, setSelectedId] = useState(initialScreens[0].id)
  const [query, setQuery] = useState('')
  const [technology, setTechnology] = useState<'Todas' | Technology>('Todas')
  const [drawer, setDrawer] = useState<DrawerView>(null)
  const [notice, setNotice] = useState('')

  const [registering, setRegistering] = useState(false)
  const closeRegistration = useCallback(() => setRegistering(false), [])
  const registrationFields: Field[] = [
    { name: 'brand', label: 'Marca', required: true }, { name: 'model', label: 'Modelo exacto', required: true },
    { name: 'compatibility', label: 'Códigos de modelos compatibles', required: true }, { name: 'technology', label: 'Tecnología', options: ['LCD', 'Incell', 'AMOLED'] },
    { name: 'frame', label: 'Marco', options: ['Con marco', 'Sin marco'] }, { name: 'originalPanel', label: 'Panel original con glass cambiado', options: ['No', 'Sí'] },
    { name: 'quality', label: 'Calidad / procedencia del módulo', required: true },
    { name: 'stock', label: 'Unidades disponibles', type: 'number', min: 0, required: true },
    { name: 'price', label: 'Precio unitario (Bs)', type: 'number', min: .01, required: true },
    { name: 'cost', label: 'Costo unitario (Bs)', type: 'number', min: 0, required: true },
    { name: 'supplier', label: 'Proveedor · privado', required: true }, { name: 'warranty', label: 'Cobertura de garantía', required: true },
    { name: 'location', label: 'Ubicación en almacén', required: true }, { name: 'notes', label: 'Notas de prueba y compatibilidad', type: 'textarea' },
    { name: 'image', label: 'Foto exacta · JPG, PNG o WebP, hasta 3 MB', type: 'file' },
  ]
  const registerScreen = (data: FormData) => {
    const value = (key: string) => String(data.get(key) || '').trim()
    const stock = Number(value('stock'))
    if (!Number.isInteger(stock)) throw new Error('El stock debe ser un número entero.')
    const screen: ScreenPart = { id: 'PT-' + crypto.randomUUID().slice(0,8), brand: value('brand'), model: value('model'), compatibility: value('compatibility'), technology: value('technology') as Technology, frame: value('frame') === 'Con marco', originalPanel: value('originalPanel') === 'Sí', quality: value('quality'), stock, price: Number(value('price')), cost: Number(value('cost')), supplier: value('supplier'), warranty: value('warranty'), location: value('location'), notes: value('notes'), image: uploadedImage(data, noPhoto) }
    setInventory(current => [screen, ...current]); setSelectedId(screen.id); setQuery(''); setTechnology('Todas'); closeRegistration(); setNotice('Pantalla registrada en esta sesión.')
  }

  const filtered = useMemo(() => inventory.filter((screen) => {
    const searchable = `${screen.brand} ${screen.model} ${screen.compatibility} ${screen.id}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (technology === 'Todas' || screen.technology === technology)
  }), [inventory, query, technology])
  const selected = inventory.find((screen) => screen.id === selectedId) ?? inventory[0]
  const availableUnits = inventory.reduce((total, screen) => total + screen.stock, 0)
  const lowStock = inventory.filter((screen) => screen.stock > 0 && screen.stock <= 2).length
  const inventoryValue = inventory.reduce((total, screen) => total + screen.stock * screen.cost, 0)

  const selectScreen = (id: string) => {
    setSelectedId(id)
    if (window.matchMedia('(max-width: 1050px)').matches) setDrawer('detail')
  }

  useEffect(() => {
    if (!drawer) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setDrawer(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [drawer])

  const completeSale = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const quantity = Number(form.get('quantity'))
    const customer = String(form.get('customer') || '').trim()
    const finalPrice = Number(form.get('salePrice'))
    if (!customer || !Number.isInteger(quantity) || quantity < 1 || quantity > selected.stock || !Number.isFinite(finalPrice) || finalPrice <= 0) { setNotice('Revisa la cantidad, el precio y el cliente.'); setDrawer(null); return }
    ensureClient(customer)
    recordSale({ type: 'Pantalla', description: selected.model + ' · ' + quantity + ' u.', client: customer, method: String(form.get('payment')), amount: Math.round(finalPrice * quantity * 100) / 100, cost: selected.cost * quantity, reference: selected.id, notes: String(form.get('notes') || '').trim() })
    setInventory((current) => current.map((screen) => screen.id === selected.id ? { ...screen, stock: screen.stock - quantity } : screen))
    setNotice(`Venta registrada: ${quantity} pantalla${quantity > 1 ? 's' : ''} para ${customer}, Bs ${money.format(finalPrice * quantity)}.`)
    setDrawer(null)
  }

  const detailContent = <>
    <div className="screen-detail-hero">
      <div className="screen-photo"><img src={imageFor(selected)} alt={`Pantalla de repuesto compatible con ${selected.model}`} /><span>{selected.technology}</span></div>
      <div><small>{selected.id} · {selected.brand}</small><h2>{selected.model}</h2><p>{selected.quality}</p><b>Bs {money.format(selected.price)}</b></div>
    </div>
    <div className="screen-facts">
      <div><span>Compatibilidad</span><b>{selected.compatibility}</b></div><div><span>Presentación</span><b>{selected.frame ? 'Con marco' : 'Sin marco'}</b></div>
      <div><span>Procedencia del panel</span><b>{selected.originalPanel ? 'Panel original con glass cambiado' : selected.quality}</b></div><div><span>Disponibilidad</span><b>{selected.stock} unidades · {stockLabel(selected.stock)}</b></div>
    </div>
    <section className="screen-private"><div><span>Proveedor privado</span><b>{selected.supplier}</b></div><div><span>Cobertura</span><b>{selected.warranty}</b></div><div><span>Ubicación</span><b>{selected.location}</b></div></section>
    <div className="screen-note"><span>Control antes de instalar</span><p>{selected.notes}</p></div>
    <button className="drawer-primary" type="button" disabled={selected.stock === 0} onClick={() => setDrawer('sale')}>{selected.stock === 0 ? 'Sin stock para vender' : 'Vender esta pantalla'}</button>
  </>

  return (
    <main className="sales-shell screen-shell">
      <aside className="sales-rail">
        <button className="sales-mark" type="button" onClick={onExit} aria-label="Volver a la portada"><b>Z</b><span>ZION<br />TECH</span></button>
        <nav aria-label="Módulos administrativos"><button type="button" onClick={() => onOpenOperations('summary')}><i>⌁</i><span>Resumen</span></button><button type="button" onClick={onOpenPhones}><i>▣</i><span>Celulares</span></button><button className="active" type="button"><i>▤</i><span>Pantallas</span></button><button type="button" onClick={onOpenTechnicians}><i>⌾</i><span>Técnicos</span></button><button type="button" onClick={() => onOpenOperations('sales')}><i>↗</i><span>Ventas</span></button><button type="button" onClick={() => onOpenOperations('orders')}><i>⌕</i><span>Órdenes</span></button><button type="button" onClick={onOpenClients}><i>◎</i><span>Clientes</span></button></nav>
        <div className="rail-user"><span>ZT</span><div><b>Propietario</b><small>Administrador</small></div></div>
      </aside>

      <section className="sales-workspace screen-workspace">
        <header className="sales-topbar"><div><p>Venta de pantallas</p><span>Compatibilidad y stock listos para mostrador</span></div><div className="sales-top-actions"><button type="button" onClick={() => setRegistering(true)}>+ Registrar pantalla</button><button className="exit-dashboard" type="button" onClick={onExit}>Salir</button></div></header>
        <section className="screen-totals" aria-label="Resumen del inventario"><div><span>Unidades disponibles</span><b>{availableUnits}</b></div><div><span>Referencias con stock bajo</span><b>{lowStock}</b></div><div><span>Valor invertido</span><b>Bs {money.format(inventoryValue)}</b></div></section>
        <div className="inventory-toolbar screen-toolbar"><label className="inventory-search"><span>Buscar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Marca, modelo o código compatible" /></label><div className="status-filters" aria-label="Filtrar por tecnología">{(['Todas', 'LCD', 'Incell', 'AMOLED'] as const).map((item) => <button className={technology === item ? 'active' : ''} type="button" key={item} onClick={() => setTechnology(item)}>{item}</button>)}</div></div>
        {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Cerrar</button></div>}

        <div className="screen-layout">
          <section className="screen-catalog" aria-label="Pantallas registradas">
            <div className="catalog-heading"><span>{filtered.length} referencias</span><span>Selecciona una pieza para revisar o vender</span></div>
            {filtered.length ? filtered.map((screen) => <button className={`screen-row technology-${screen.technology.toLowerCase()} ${selected.id === screen.id ? 'selected' : ''}`} type="button" key={screen.id} onClick={() => selectScreen(screen.id)}>
              <span className="screen-thumb"><img src={imageFor(screen)} alt={`Módulo de pantalla para ${screen.model}`} /><i>{screen.technology}</i></span>
              <span className="screen-identity"><small>{screen.id} · {screen.brand}</small><b>{screen.model}</b><em>{screen.compatibility}</em><u>{screen.frame ? 'Con marco' : 'Sin marco'}{screen.originalPanel ? ' · panel original' : ''}</u></span>
              <span className={`screen-stock ${screen.stock === 0 ? 'out' : screen.stock <= 2 ? 'low' : ''}`}><i />{screen.stock} u.<small>{stockLabel(screen.stock)}</small></span>
              <span className="screen-price"><b>Bs {money.format(screen.price)}</b><small>Ver ficha →</small></span>
            </button>) : <div className="inventory-empty"><b>No encontramos pantallas.</b><span>Prueba otro modelo o tecnología.</span></div>}
          </section>
          <aside className="screen-inspector" aria-label={`Ficha de ${selected.model}`}>{detailContent}</aside>
        </div>
      </section>

      {drawer && <div className="device-overlay" role="dialog" aria-modal="true" aria-labelledby="screen-drawer-title"><button className="overlay-backdrop" type="button" onClick={() => setDrawer(null)} aria-label="Cerrar ventana" /><section className="detail-drawer screen-drawer"><header><div><span>{selected.id}</span><h2 id="screen-drawer-title">{drawer === 'sale' ? 'Registrar venta' : selected.model}</h2><p>{drawer === 'sale' ? `${selected.brand} · ${selected.technology}` : 'Compatibilidad, calidad y datos privados de esta pieza'}</p></div><button type="button" onClick={() => setDrawer(null)} aria-label="Cerrar">×</button></header>
        {drawer === 'detail' ? detailContent : <form className="sale-form screen-sale-form" onSubmit={completeSale}>
          <div className="sale-summary"><img src={imageFor(selected)} alt={`Pantalla para ${selected.model}`} /><div><b>{selected.model}</b><span>{selected.technology} · {selected.frame ? 'con marco' : 'sin marco'}</span><strong>Bs {money.format(selected.price)}</strong></div></div>
          <label><span>Cliente</span><input name="customer" placeholder="Nombre completo" required /></label>
          <div className="sale-form-pair"><label><span>Cantidad</span><input name="quantity" type="number" min="1" max={selected.stock} defaultValue="1" required /></label><label><span>Precio unitario en Bs</span><input name="salePrice" type="number" min="0.01" step="0.01" defaultValue={selected.price} required /></label></div>
          <label><span>Destino</span><select name="destination" defaultValue="Venta de repuesto"><option>Venta de repuesto</option></select></label>
          <label><span>Método de pago</span><select name="payment" defaultValue="Efectivo"><option>Efectivo</option><option>QR</option><option>Transferencia</option><option>Mixto</option></select></label>
          <label><span>Observaciones</span><textarea name="notes" placeholder="Prueba realizada, garantía o técnico responsable" /></label>
          <label className="sale-check"><input type="checkbox" required /><span>Confirmo que modelo, tecnología y flex fueron verificados antes de entregar.</span></label>
          <button className="drawer-primary" type="submit">Confirmar venta y descontar stock</button><small>La venta quedará registrada con su movimiento, garantía y proveedor.</small>
        </form>}
      </section></div>}
      {registering && <WorkshopForm title="Registrar pantalla" fields={registrationFields} onClose={closeRegistration} onSave={registerScreen} />}
    </main>
  )
}

export default ScreenDashboard
