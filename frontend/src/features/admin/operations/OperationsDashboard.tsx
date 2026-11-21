import { useMemo, useState, useCallback, useEffect } from 'react'
import { type RepairOrder, type Job, type OrderStatus, type OperationsDashboardProps, type Sale, type SaleType, initialOrders, initialSales, initialClients, initialTechnicians, statusFlow } from '../shared/workshopData'
import { useDemoState, commitOrder, recordSale, timestamp, readDemo, writeDemo } from '../shared/demoStore'
import WorkshopForm, { WorkshopDialog, type Field } from '../shared/WorkshopForm'
import '../shared/AdminDashboard.css'
import './OperationsDashboard.css'

const money = new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const bs = (value: number) => 'Bs ' + money.format(value)
const balanceOf = (order: RepairOrder) => Math.max(0, order.approved - order.advance)
const chargedForJob = (order: RepairOrder, job: Job) => {
  const total = order.jobs.reduce((sum, item) => sum + item.price, 0)
  return total > 0 ? Math.min(job.price, order.advance * job.price / total) : 0
}
const latestApproved = (order: RepairOrder) => order.budgets.at(-1)?.response.startsWith('Aprobado')
const statuses: OrderStatus[] = [...statusFlow, 'Sin reparar']
const formString = (data: FormData, key: string) => String(data.get(key) || '').trim()
const formNumber = (data: FormData, key: string) => Number(data.get(key))
const methods = ['Efectivo', 'QR', 'Transferencia']

function OperationsDashboard({ section, onNavigate, onExit, onOpenPhones, onOpenScreens, onOpenTechnicians, onOpenClients }: OperationsDashboardProps) {
  const [orders] = useDemoState('orders', initialOrders)
  const [sales] = useDemoState('sales', initialSales)
  const [clients] = useDemoState('clients', initialClients)
  const [technicians] = useDemoState('technicians', initialTechnicians)
  const [draft] = useState(() => {
    const value = readDemo<{ client: string; phone: string } | null>('orderDraft', null)
    return value
  })
  useEffect(() => { writeDemo('orderDraft', null, null) }, [])
  const [demoDate] = useState(() => new Date().toLocaleDateString('es-BO'))
  const [selectedId, setSelectedId] = useState(initialOrders[0].id)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todas')
  const [saleFilter, setSaleFilter] = useState('Todas')
  const [showArchived, setShowArchived] = useState(false)
  const [dialog, setDialog] = useState<'detail' | 'new' | 'edit' | 'job' | 'cost' | 'budget' | 'payment' | null>(draft ? 'new' : null)
  const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)
  const close = useCallback(() => setDialog(null), [])
  const selected = orders.find(order => order.id === selectedId) ?? orders[0]
  const activeOrders = orders.filter(order => !order.archived)
  const filtered = useMemo(() => orders.filter(order => Boolean(order.archived) === showArchived && (filter === 'Todas' || order.status === filter) && `${order.id} ${order.client} ${order.phone} ${order.device}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [orders, query, filter, showArchived])
  const rows = sales.filter(sale => saleFilter === 'Todas' || sale.type === saleFilter)
  const navigate = (target: 'summary' | 'sales' | 'orders') => { setDialog(null); onNavigate(target) }
  const save = (order: RepairOrder, message = 'Orden actualizada.') => { commitOrder(order); setNotice(message); close() }
  const openOrder = (id: string) => { setSelectedId(id); if (window.innerWidth <= 1200) setDialog('detail') }
  const openCost = (orderId: string, jobIndex: number) => { setSelectedId(orderId); setEditingJobIndex(jobIndex); setDialog('cost') }
  const goOrder = (id: string) => { setSelectedId(id); onNavigate('orders'); setDialog('detail') }
  const technicianNames = technicians.filter(tech => !tech.owner).map(tech => tech.name)
  const snapshotJob = (job: Job) => ({ ...job, rate: technicians.find(tech => tech.name === job.technician)?.owner ? 0 : 50 })
  const changeStatus = (status: OrderStatus) => {
    if (['En reparación', 'Listo', 'Entregado'].includes(status) && !latestApproved(selected)) return setNotice('Registra la aprobación del último presupuesto antes de reparar.')
    if (['Listo', 'Entregado'].includes(status) && (!selected.jobs.length || selected.jobs.some(job => job.state !== 'Terminado'))) return setNotice('Termina todos los trabajos antes de marcar la orden como lista.')
    if (status === 'Entregado' && balanceOf(selected) > 0) return setNotice('Registra el saldo pendiente antes de entregar.')
    commitOrder({ ...selected, status })
    setNotice('Estado actualizado a ' + status + '.')
  }
  const uploadPhotos = async (files: FileList | null) => {
    if (!files?.length) return
    const existing = selected.photoUrls ?? []
    if (existing.length + files.length > 5) return setNotice('Puedes adjuntar hasta cinco fotografías.')
    if ([...files].some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024)) return setNotice('Usa JPG, PNG o WebP de hasta 3 MB por foto.')
    setUploading(true)
    try {
      const urls = await Promise.all([...files].map(file => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No se pudo leer la fotografía.')); reader.readAsDataURL(file) })))
      commitOrder({ ...selected, photoUrls: [...existing, ...urls], photos: existing.length + urls.length })
      setNotice('Fotografías adjuntas a esta sesión.')
    } catch { setNotice('No se pudieron cargar las fotos. Inténtalo de nuevo.') }
    finally { setUploading(false) }
  }

  const detail = <div className="op-detail">
    <div className="op-identity"><small>{selected.id} · {selected.received}</small><h2>{selected.device}</h2><p>{selected.client} · {selected.phone}</p><span className="op-badge">{selected.status}</span></div>
    <div className="op-actions"><button onClick={() => setDialog('edit')}>Editar seguimiento</button><button onClick={() => { commitOrder({ ...selected, archived: !selected.archived }); setShowArchived(!selected.archived); setNotice(selected.archived ? 'Orden restaurada.' : 'Orden archivada. Puedes restaurarla desde Archivadas.'); close() }}>{selected.archived ? 'Restaurar' : 'Archivar'}</button></div>
    <label className="op-status-control">Estado de la orden<select value={selected.status} onChange={event => changeStatus(event.target.value as OrderStatus)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
    <dl className="op-facts"><div><dt>Falla reportada</dt><dd>{selected.failure}</dd></div><div><dt>Accesorios</dt><dd>{selected.accessories}</dd></div><div><dt>Ubicación</dt><dd>{selected.location}</dd></div><div><dt>Siguiente paso</dt><dd>{selected.nextStep}</dd></div></dl>
    {selected.pendingVerification && <p className="op-warning">Equipo sin encender: funciones pendientes de verificar.</p>}
    <section className="op-section"><h3>Diagnóstico</h3><p>{selected.diagnosis}</p></section>
    <section className="op-section"><header><h3>Trabajos</h3><button onClick={() => setDialog('job')}>＋</button></header>{selected.jobs.length ? selected.jobs.map((job, index) => <article className="op-job" key={index}><div><b>{job.title}</b><span>{job.technician}</span><small>{bs(job.price)} · {job.costRecorded || job.partCost > 0 ? `Gasto ${bs(job.partCost)}` : 'Gasto pendiente'}</small></div><button className="op-cost-icon" type="button" onClick={() => openCost(selected.id, index)} aria-label={'Registrar gasto de ' + job.title} title="Registrar gasto">{job.costRecorded || job.partCost > 0 ? '✎' : '＋'}</button><label>Estado<select aria-label={'Estado de ' + job.title} value={job.state} onChange={event => commitOrder({ ...selected, jobs: selected.jobs.map((item, i) => i === index ? { ...item, state: event.target.value } : item) })}>{['Pendiente', 'Sin aprobar', 'En proceso', 'Terminado'].map(state => <option key={state}>{state}</option>)}</select></label></article>) : <p>Añade el primer trabajo.</p>}</section>
    <section className="op-section"><header><h3>Presupuestos</h3><button onClick={() => setDialog('budget')}>Nueva versión</button></header>{selected.budgets.map((budget, index) => <article className="op-budget" key={budget.version}><b>{budget.version} · {bs(budget.amount)}</b><span>{budget.response}</span><small>{budget.date}</small>{index === selected.budgets.length - 1 && !budget.response.startsWith('Aprobado') && !budget.response.startsWith('Rechazado') && <div className="op-actions">{['Aprobado', 'Rechazado'].map(response => <button key={response} onClick={() => {
      if (response === 'Aprobado' && Math.abs(selected.jobs.reduce((sum, job) => sum + job.price, 0) - budget.amount) > .01) return setNotice('El presupuesto debe coincidir con los importes de los trabajos.')
      commitOrder({ ...selected, approved: response === 'Aprobado' ? budget.amount : selected.approved, jobs: response === 'Aprobado' ? selected.jobs.map(snapshotJob) : selected.jobs, budgets: selected.budgets.map((item, i) => i === index ? { ...item, response, date: timestamp() } : item) }); setNotice('Respuesta del cliente registrada.')
    }}>{response === 'Aprobado' ? 'Registrar aprobación' : 'Registrar rechazo'}</button>)}</div>}</article>)}{!selected.budgets.length && <p>Aún no hay presupuestos.</p>}</section>
    <div className="op-finance"><div><span>Aprobado</span><b>{bs(selected.approved)}</b></div><div><span>Cobrado</span><b>{bs(selected.advance)}</b></div><div><span>Saldo</span><b>{bs(balanceOf(selected))}</b></div></div>
    <section className="op-section"><button className="op-primary" disabled={!latestApproved(selected) || balanceOf(selected) <= 0} onClick={() => setDialog('payment')}>Registrar cobro</button>{selected.advance > selected.approved && <p className="op-warning">Hay {bs(selected.advance - selected.approved)} a favor del cliente. Revisa el presupuesto.</p>}</section>
    <section className="op-section"><h3>Fotografías de recepción</h3><p>{selected.photoUrls?.length ?? 0}/5 fotos adjuntas · hasta 3 MB cada una</p><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} aria-label="Adjuntar fotografías" onChange={event => { void uploadPhotos(event.target.files); event.target.value = '' }} /><div className="op-photos">{selected.photoUrls?.map((url, index) => <figure key={index}><img src={url} alt={'Recepción, foto ' + (index + 1)} /><button onClick={() => commitOrder({ ...selected, photoUrls: selected.photoUrls?.filter((_, i) => i !== index), photos: (selected.photoUrls?.length ?? 1) - 1 })}>Quitar foto {index + 1}</button></figure>)}</div></section>
  </div>

  let fields: Field[] = []
  if (dialog === 'new') fields = [
    { name: 'client', label: 'Nombre del cliente', required: true, value: draft?.client }, { name: 'phone', label: 'Teléfono', type: 'tel', required: true, value: draft?.phone },
    { name: 'brand', label: 'Marca', required: true }, { name: 'model', label: 'Modelo', required: true },
    { name: 'failure', label: 'Falla reportada', type: 'textarea', required: true }, { name: 'accessories', label: 'Accesorios entregados' },
    { name: 'verification', label: 'Verificación inicial', options: ['Verificado', 'No enciende · pendiente'] },
  ]
  if (dialog === 'edit') fields = [
    { name: 'diagnosis', label: 'Diagnóstico', type: 'textarea', required: true, value: selected.diagnosis },
    { name: 'location', label: 'Ubicación', required: true, value: selected.location },
    { name: 'nextStep', label: 'Siguiente paso', required: true, value: selected.nextStep },
    { name: 'accessories', label: 'Accesorios', value: selected.accessories },
    { name: 'verification', label: 'Verificación', options: ['Verificado', 'No enciende · pendiente'], value: selected.pendingVerification ? 'No enciende · pendiente' : 'Verificado' },
  ]
  if (dialog === 'job') fields = [
    { name: 'title', label: 'Trabajo', required: true }, { name: 'technician', label: 'Técnico responsable', options: technicianNames, required: true },
    { name: 'price', label: 'Precio del trabajo (Bs)', type: 'number', min: 0, required: true },
  ]
  if (dialog === 'cost') fields = [{ name: 'partCost', label: 'Gasto o repuesto (Bs)', type: 'number', min: 0, value: editingJobIndex === null ? 0 : selected.jobs[editingJobIndex]?.partCost ?? 0, required: true }]
  if (dialog === 'budget') fields = [{ name: 'amount', label: 'Nuevo presupuesto (Bs)', type: 'number', min: selected.advance, value: selected.jobs.reduce((sum, job) => sum + job.price, 0), required: true }]
  if (dialog === 'payment') fields = [{ name: 'amount', label: 'Importe recibido (Bs)', type: 'number', min: .01, max: balanceOf(selected), value: balanceOf(selected), required: true }, { name: 'method', label: 'Método de pago', options: methods }]
  const submit = (data: FormData) => {
    if (dialog === 'new') {
      const phone = formString(data, 'phone')
      if (phone.replace(/\D/g, '').length < 7) throw new Error('Ingresa un teléfono válido.')
      const id = '#' + String(Math.max(0, ...orders.map(order => Number(order.id.slice(1)))) + 1).padStart(4, '0')
      const order: RepairOrder = { id, client: formString(data, 'client'), phone, device: formString(data, 'brand') + ' ' + formString(data, 'model'), failure: formString(data, 'failure'), accessories: formString(data, 'accessories') || 'Sin accesorios', status: 'Recepción', received: timestamp(), technician: 'Sin asignar', diagnosis: 'Pendiente de diagnóstico', approved: 0, advance: 0, location: 'Recepción', nextStep: 'Fotografiar el equipo y asignar trabajos', photos: 0, photoUrls: [], pendingVerification: formString(data, 'verification') !== 'Verificado', jobs: [], budgets: [] }
      save(order, 'Orden creada y cliente vinculado.'); setSelectedId(id); setQuery(''); setFilter('Todas'); setShowArchived(false); onNavigate('orders')
    }
    if (dialog === 'edit') save({ ...selected, diagnosis: formString(data, 'diagnosis'), location: formString(data, 'location'), nextStep: formString(data, 'nextStep'), accessories: formString(data, 'accessories'), pendingVerification: formString(data, 'verification') !== 'Verificado' })
    if (dialog === 'job') {
      const payments = readDemo<Record<string, { amount?: number; entries?: { amount: number }[] }>>('commissions', {})
      if (Object.entries(payments).some(([key, payment]) => key.startsWith(selected.id + ':') && ((payment.amount ?? 0) + (payment.entries?.reduce((sum, entry) => sum + entry.amount, 0) ?? 0)) > 0)) throw new Error('Esta orden ya tiene pagos registrados. Registra trabajos adicionales en otra orden.')
      if (['Listo', 'Entregado', 'Sin reparar'].includes(selected.status)) throw new Error('Reabre la orden antes de añadir trabajos.')
      const job = snapshotJob({ title: formString(data, 'title'), technician: formString(data, 'technician'), price: formNumber(data, 'price'), partCost: 0, costRecorded: false, state: 'Pendiente' })
      save({ ...selected, jobs: [...selected.jobs, job], budgets: [...selected.budgets, { version: 'V' + (selected.budgets.length + 1), amount: [...selected.jobs, job].reduce((sum, item) => sum + item.price, 0), response: 'Esperando respuesta', date: timestamp() }] }, 'Trabajo asignado. Se creó una nueva versión para aprobación.')
    }
    if (dialog === 'cost' && editingJobIndex !== null) {
      const partCost = formNumber(data, 'partCost')
      if (!Number.isFinite(partCost) || partCost < 0) throw new Error('Revisa el gasto.')
      save({ ...selected, jobs: selected.jobs.map((job, index) => index === editingJobIndex ? { ...job, partCost, costRecorded: true } : job) }, 'Gasto guardado.')
      setEditingJobIndex(null)
    }
    if (dialog === 'budget') {
      const payments = readDemo<Record<string, { amount?: number; entries?: { amount: number }[] }>>('commissions', {})
      if (Object.entries(payments).some(([key, payment]) => key.startsWith(selected.id + ':') && ((payment.amount ?? 0) + (payment.entries?.reduce((sum, entry) => sum + entry.amount, 0) ?? 0)) > 0)) throw new Error('No se puede cambiar el presupuesto de una orden con pagos al técnico registrados.')
      const amount = formNumber(data, 'amount')
      if (amount < selected.advance) throw new Error('El presupuesto no puede ser menor a lo cobrado.')
      if (!selected.jobs.length) throw new Error('Añade un trabajo primero.')
      const total = selected.jobs.reduce((sum, job) => sum + job.price, 0)
      // Distribute a negotiated adjustment to the last job, retaining its technician and cost.
      const lastPrice = selected.jobs.at(-1)!.price + amount - total
      if (lastPrice < 0) throw new Error('El ajuste supera el último trabajo. Revisa sus importes.')
      save({ ...selected, jobs: selected.jobs.map((job, i) => i === selected.jobs.length - 1 ? { ...job, price: Math.round(lastPrice * 100) / 100 } : job), budgets: [...selected.budgets, { version: 'V' + (selected.budgets.length + 1), amount, response: 'Esperando respuesta', date: timestamp() }] }, 'Nueva versión guardada; la anterior se conserva.')
    }
    if (dialog === 'payment') {
      const amount = formNumber(data, 'amount')
      if (!latestApproved(selected) || !Number.isFinite(amount) || amount <= 0 || amount > balanceOf(selected)) throw new Error('Revisa el importe y la aprobación.')
      const now = timestamp()
      recordSale({ type: 'Servicio', client: selected.client, description: selected.device, reference: selected.id, amount, cost: 0, method: formString(data, 'method'), isAdvance: true })
      save({ ...selected, advance: Math.round((selected.advance + amount) * 100) / 100, advanceDate: selected.advanceDate || now }, 'Cobro registrado en caja.')
    }
  }

  const nav = [
    ['Resumen', '⌁', () => navigate('summary'), section === 'summary'], ['Celulares', '▣', onOpenPhones, false], ['Pantallas', '▤', onOpenScreens, false],
    ['Técnicos', '⌾', onOpenTechnicians, false], ['Ventas', '↗', () => navigate('sales'), section === 'sales'], ['Órdenes', '⌕', () => navigate('orders'), section === 'orders'], ['Clientes', '◎', onOpenClients, false],
  ] as const
  return <main className="sales-shell operations-shell"><aside className="sales-rail"><button className="sales-mark" onClick={onExit} aria-label="Volver a la portada"><b>Z</b><span>ZION<br />TECH</span></button><nav aria-label="Módulos administrativos">{nav.map(([label, icon, action, active]) => <button key={label} className={active ? 'active' : ''} onClick={action} aria-current={active ? 'page' : undefined}><i>{icon}</i><span>{label}</span></button>)}</nav><div className="rail-user"><span>ZT</span><div><b>Propietario</b><small>Administrador</small></div></div></aside>
    <section className="sales-workspace operations-workspace">
      <header className="sales-topbar"><div><p>{section === 'orders' ? 'Órdenes de reparación' : section === 'sales' ? 'Ventas y caja' : 'Resumen del taller'}</p><span>Registro del taller · {demoDate}</span></div><div className="op-top-actions">{section === 'sales' ? <button onClick={() => window.print()}>Imprimir / guardar PDF</button> : <button onClick={() => setDialog('new')}>+ Nueva orden</button>}<button onClick={onExit}>Salir</button></div></header>
      {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')}>Cerrar</button></div>}
      {section === 'orders' && <>
        <div className="op-toolbar"><label>Buscar<input aria-label="Buscar órdenes" value={query} onChange={event => setQuery(event.target.value)} placeholder="Orden, cliente o equipo" /></label><label>Estado<select value={filter} onChange={event => setFilter(event.target.value)}>{['Todas', ...statuses].map(status => <option key={status}>{status}</option>)}</select></label><label className="op-check"><input type="checkbox" checked={showArchived} onChange={event => setShowArchived(event.target.checked)} />Archivadas</label></div>
        <div className="orders-layout"><section className="orders-index"><header><h2>Equipos en seguimiento</h2><span>{filtered.length} órdenes</span></header>{filtered.map(order => <button className={'order-row ' + (order.id === selected.id ? 'selected' : '')} key={order.id} onClick={() => openOrder(order.id)}><span><small>{order.id} · {order.client}</small><b>{order.device}</b><em>{order.location}</em></span><span><strong>{order.status}</strong><b>{bs(balanceOf(order))}</b><small>saldo</small></span></button>)}{!filtered.length && <p className="op-empty">No hay órdenes con estos filtros.</p>}</section><aside className="order-file">{detail}</aside></div>
        <section className="service-sheet"><header><h2>Planilla</h2><span>{filtered.reduce((sum, order) => sum + order.jobs.length, 0)}</span></header><div className="service-head"><span>Orden</span><span>Técnico</span><span>Trabajo / modelo</span><span>Cobrado</span><span>Gasto</span></div>{filtered.flatMap(order => order.jobs.map((job, index) => <article className="service-row" key={`${order.id}:${index}`}><button type="button" onClick={() => openOrder(order.id)}>{order.id}</button><b>{job.technician}</b><span><strong>{job.title}</strong><small>{order.device}</small></span><b>{chargedForJob(order, job) > 0 ? bs(chargedForJob(order, job)) : '—'}</b><span className="service-cost">{job.costRecorded || job.partCost > 0 ? <><b>{bs(job.partCost)}</b><button type="button" onClick={() => openCost(order.id, index)} aria-label="Editar gasto" title="Editar gasto">✎</button></> : <button type="button" onClick={() => openCost(order.id, index)} aria-label="Añadir gasto" title="Añadir gasto">＋</button>}</span></article>))}{!filtered.some(order => order.jobs.length) && <div className="service-empty">Sin trabajos</div>}</section>
      </>}
      {section === 'summary' && <SummaryView orders={activeOrders} sales={sales} clients={clients.length} onOpenOrder={goOrder} />}
      {section === 'sales' && <SalesView rows={rows} filter={saleFilter} onFilter={setSaleFilter} />}
    </section>
    {dialog === 'detail' && <WorkshopDialog title={'Orden ' + selected.id} onClose={close}>{notice && <p className="op-warning" role="status">{notice}</p>}{detail}</WorkshopDialog>}
    {dialog && dialog !== 'detail' && <WorkshopForm key={dialog + selectedId} title={{ new: 'Nueva orden', edit: 'Editar seguimiento', job: 'Asignar trabajo', cost: 'Registrar gasto', budget: 'Revisar presupuesto', payment: 'Registrar cobro' }[dialog]} fields={fields} onClose={close} onSave={submit} />}
  </main>
}

function SummaryView({ orders, sales, clients, onOpenOrder }: { orders: RepairOrder[]; sales: Sale[]; clients: number; onOpenOrder: (id: string) => void }) {
  const active = orders.filter(order => !['Entregado', 'Sin reparar'].includes(order.status))
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0)
  return <>
    <section className="day-line"><div><span>Equipos activos</span><b>{active.length}</b></div><div><span>Listos para entrega</span><b>{orders.filter(order => order.status === 'Listo').length}</b></div><div><span>Clientes registrados</span><b>{clients}</b></div><div><span>Saldos por cobrar</span><b>{bs(orders.reduce((sum, order) => sum + balanceOf(order), 0))}</b></div></section>
    <section className="workflow-board"><header><h2>El recorrido de cada equipo</h2><span>Órdenes por etapa</span></header><div>{statusFlow.map(status => <div key={status}><b>{orders.filter(order => order.status === status).length}</b><span>{status}</span></div>)}</div></section>
    <div className="summary-layout"><section className="today-queue"><header><h2>Próximas acciones</h2><span>{active.length} equipos</span></header>{active.map(order => <button key={order.id} onClick={() => onOpenOrder(order.id)}><span><small>{order.id} · {order.client}</small><b>{order.device}</b><em>{order.nextStep}</em></span><strong>{order.status}</strong></button>)}{!active.length && <p className="op-empty">No quedan equipos pendientes.</p>}</section>
    <aside className="daily-cash"><header><span>Cobros registrados</span><b>{bs(total)}</b><small>{sales.length} movimientos</small></header><div className="origin-bars" aria-label="Distribución de cobros por origen">{(['Servicio', 'Celular', 'Pantalla'] as SaleType[]).map(type => { const amount = sales.filter(sale => sale.type === type).reduce((sum, sale) => sum + sale.amount, 0); return <div key={type}><span>{type}</span><b>{bs(amount)}</b><i><u style={{ width: (total ? amount / total * 100 : 0) + '%' }} /></i></div> })}</div><p className="op-empty">Los anticipos son cobros. El margen de reparación se calcula sobre el trabajo completo y su costo.</p></aside></div>
  </>
}
function SalesView({ rows, filter, onFilter }: { rows: Sale[]; filter: string; onFilter: (filter: string) => void }) {
  const completed = rows.filter(sale => !sale.isAdvance && !sale.reference.includes('anticipo') && sale.type !== 'Servicio')
  return <><div className="cash-totals"><div><span>Cobros registrados</span><b>{bs(rows.reduce((sum, sale) => sum + sale.amount, 0))}</b></div><div><span>Costos de productos vendidos</span><b>{bs(completed.reduce((sum, sale) => sum + sale.cost, 0))}</b></div><div><span>Margen de productos</span><b>{bs(completed.reduce((sum, sale) => sum + sale.amount - sale.cost, 0))}</b></div></div>
    <div className="sales-book-toolbar"><div className="status-filters">{['Todas', 'Servicio', 'Celular', 'Pantalla'].map(type => <button key={type} onClick={() => onFilter(type)} className={filter === type ? 'active' : ''}>{type}</button>)}</div><span>{rows.length} movimientos registrados</span></div>
    <section className="sales-book"><header><span>Fecha / referencia</span><span>Concepto y cliente</span><span>Pago</span><span>Cobrado</span></header>{rows.map(sale => <article key={sale.id}><span><b>{sale.time}</b><small>{sale.id}</small></span><span><em>{sale.type}</em><b>{sale.description}</b><small>{sale.client} · {sale.reference}</small>{sale.notes && <small>Nota: {sale.notes}</small>}</span><span>{sale.method}</span><strong>{bs(sale.amount)}</strong></article>)}{!rows.length && <p className="op-empty">Sin movimientos para este filtro.</p>}</section><p className="op-empty">Para registrar una venta, selecciona el producto en Celulares o Pantallas. Los cobros de reparación se registran desde Órdenes.</p>
  </>
}
export default OperationsDashboard
