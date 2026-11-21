import { useEffect, useState } from 'react'
import '../shared/AdminDashboard.css'
import './ClientDashboard.css'

import { type Client, type ClientFilter, type ClientDashboardProps, initialClients, initialOrders } from '../shared/workshopData'

import { useDemoState, writeDemo, normalizePhone } from '../shared/demoStore'

const money = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 })
const initials = (name: string) => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
const clientBalance = (client: Client) => client.devices.reduce((sum, device) => sum + device.balance, 0)
const activeDevices = (client: Client) => client.devices.filter((device) => !['Entregado', 'Sin reparar'].includes(device.state)).length

function ClientDashboard({ onExit, onOpenPhones, onOpenScreens, onOpenTechnicians, onOpenOperations }: ClientDashboardProps) {
  const [records, setClients] = useDemoState('clients', initialClients)
  const [orders] = useDemoState('orders', initialOrders)
  const clients: Client[] = records.map(client => ({ ...client, devices: [
    ...client.devices.filter(device => !orders.some(order => order.id === device.order)),
    ...orders.filter(order => normalizePhone(order.phone) === normalizePhone(client.phone) && !order.archived).map(order => ({ order: order.id, model: order.device, state: order.diagnosis.toLocaleLowerCase().includes('garantía') && !['Entregado', 'Sin reparar'].includes(order.status) ? 'Garantía' as const : order.status, received: order.received, fault: order.failure, technician: [...new Set(order.jobs.map(job => job.technician))].join(', ') || 'Sin asignar', total: order.approved, balance: Math.max(0, order.approved - order.advance), nextStep: order.nextStep })),
  ] }))
  const [selectedId, setSelectedId] = useState(initialClients[0].id)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ClientFilter>('Todos')
  const [drawer, setDrawer] = useState<'detail' | 'new' | null>(null)
  const [notice, setNotice] = useState('')
  const selected = clients.find((client) => client.id === selectedId) ?? clients[0]
  const filtered = clients.filter((client) => {
    const searchable = `${client.name} ${client.phone} ${client.id} ${client.devices.map((device) => device.model).join(' ')}`.toLowerCase()
    const matchesFilter = filter === 'Todos'
      || (filter === 'Con equipo' && activeDevices(client) > 0)
      || (filter === 'Saldo pendiente' && clientBalance(client) > 0)
      || (filter === 'Garantía' && client.devices.some((device) => device.state === 'Garantía'))
    return searchable.includes(query.toLowerCase()) && matchesFilter
  })

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

  const selectClient = (id: string) => {
    setSelectedId(id)
    if (window.matchMedia('(max-width: 1050px)').matches) setDrawer('detail')
  }
  const updateNotes = (notes: string) => setClients((current) => current.map((client) => client.id === selected.id ? { ...client, notes } : client))
  const registerClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const phone = String(form.get('phone') || '').trim()
    if (!name || normalizePhone(phone).length < 7) { setNotice('Ingresa nombre y teléfono válidos.'); return }
    if (clients.some(client => normalizePhone(client.phone) === normalizePhone(phone))) { setNotice('Este teléfono ya tiene un expediente. Busca el cliente existente.'); return }
    const client: Client = {
      id: 'CL-' + crypto.randomUUID().slice(0,8), name, phone: String(form.get('phone')).trim(),
      email: String(form.get('email')).trim(), neighborhood: String(form.get('neighborhood')).trim(),
      joined: 'Cliente registrado hoy', lastContact: 'Ahora', notes: String(form.get('notes')).trim(), devices: [],
    }
    setClients((current) => [client, ...current])
    setSelectedId(client.id)
    setNotice(`${client.name} fue registrado. Ya puedes crear su primera orden.`)
    setDrawer(null)
  }

  const whatsappNumber = '591' + normalizePhone(selected.phone)
  const detailContent = <>
    <section className="client-profile">
      <span className="client-avatar">{initials(selected.name)}</span>
      <div><small>{selected.id}</small><h1>{selected.name}</h1><p>{selected.joined}</p></div>
      <strong>{activeDevices(selected)} {activeDevices(selected) === 1 ? 'equipo activo' : 'equipos activos'}</strong>
    </section>
    <section className="client-contact-grid">
      <div><span>Teléfono</span><b>{selected.phone}</b></div><div><span>Correo</span><b>{selected.email || 'No registrado'}</b></div><div><span>Zona</span><b>{selected.neighborhood || 'No registrada'}</b></div><div><span>Último contacto</span><b>{selected.lastContact}</b></div>
    </section>
    <div className="client-actions"><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Escribir por WhatsApp</a><button type="button" onClick={() => { writeDemo('orderDraft', { client: selected.name, phone: selected.phone }, null); onOpenOperations('orders') }}>+ Nueva orden</button></div>
    <section className="client-account"><span>Saldo total pendiente</span><b>Bs {money.format(clientBalance(selected))}</b><small>{selected.devices.length} equipos registrados en su historial</small></section>
    <section className="device-timeline"><header><h2>Historial de equipos</h2><span>{selected.devices.length} registros</span></header>{selected.devices.length ? selected.devices.map((device) => <article key={device.order}>
      <i className={`device-state state-${device.state.toLowerCase().replaceAll(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} />
      <div className="device-event-head"><span>{device.order} · {device.received}</span><em>{device.state}</em></div><h3>{device.model}</h3><p>{device.fault}</p>
      <dl><div><dt>Técnico</dt><dd>{device.technician}</dd></div><div><dt>Total</dt><dd>Bs {money.format(device.total)}</dd></div><div><dt>Saldo</dt><dd>Bs {money.format(device.balance)}</dd></div></dl>
      <footer><span>Siguiente paso</span><b>{device.nextStep}</b></footer>
    </article>) : <div className="client-empty-history"><b>Aún no tiene equipos.</b><span>Crea una orden para iniciar su historial.</span></div>}</section>
    <section className="client-notes"><label>Notas internas</label><textarea value={selected.notes} onChange={(event) => updateNotes(event.target.value)} /><button type="button" onClick={() => setNotice(`Notas de ${selected.name} guardadas temporalmente.`)}>Guardar notas</button></section>
  </>

  return (
    <main className="sales-shell client-shell">
      <aside className="sales-rail">
        <button className="sales-mark" type="button" onClick={onExit} aria-label="Volver a la portada"><b>Z</b><span>ZION<br />TECH</span></button>
        <nav aria-label="Módulos administrativos"><button type="button" onClick={() => onOpenOperations('summary')}><i>⌁</i><span>Resumen</span></button><button type="button" onClick={onOpenPhones}><i>▣</i><span>Celulares</span></button><button type="button" onClick={onOpenScreens}><i>▤</i><span>Pantallas</span></button><button type="button" onClick={onOpenTechnicians}><i>⌾</i><span>Técnicos</span></button><button type="button" onClick={() => onOpenOperations('sales')}><i>↗</i><span>Ventas</span></button><button type="button" onClick={() => onOpenOperations('orders')}><i>⌕</i><span>Órdenes</span></button><button className="active" type="button"><i>◎</i><span>Clientes</span></button></nav>
        <div className="rail-user"><span>ZT</span><div><b>Propietario</b><small>Administrador</small></div></div>
      </aside>

      <section className="sales-workspace client-workspace">
        <header className="sales-topbar"><div><p>Clientes y equipos</p><span>Contacto, órdenes y memoria de cada reparación</span></div><div className="sales-top-actions"><button type="button" onClick={() => setDrawer('new')}>+ Registrar cliente</button><button className="exit-dashboard" type="button" onClick={onExit}>Salir</button></div></header>
        <div className="inventory-toolbar client-toolbar"><label className="inventory-search"><span>Buscar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, teléfono, equipo o código" /></label><div className="status-filters" aria-label="Filtrar clientes">{(['Todos', 'Con equipo', 'Saldo pendiente', 'Garantía'] as const).map((item) => <button className={filter === item ? 'active' : ''} type="button" key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Cerrar</button></div>}
        <div className="client-layout">
          <section className="client-index" aria-label="Clientes registrados"><header><span>{filtered.length} clientes</span><span>Selecciona un expediente para ver sus equipos</span></header>{filtered.length ? filtered.map((client) => <button className={`client-row ${selected.id === client.id ? 'selected' : ''}`} type="button" key={client.id} onClick={() => selectClient(client.id)}><span className="client-row-avatar">{initials(client.name)}</span><span className="client-row-name"><small>{client.id}</small><b>{client.name}</b><em>{client.phone}</em></span><span className="client-row-devices"><b>{activeDevices(client)}</b><small>activos</small></span><span className={`client-row-balance ${clientBalance(client) > 0 ? 'has-balance' : ''}`}><b>Bs {money.format(clientBalance(client))}</b><small>{clientBalance(client) > 0 ? 'pendiente' : 'sin saldo'}</small></span></button>) : <div className="inventory-empty"><b>No encontramos clientes.</b><span>Prueba otro nombre, teléfono o filtro.</span></div>}</section>
          <aside className="client-file" aria-label={`Expediente de ${selected.name}`}>{detailContent}</aside>
        </div>
      </section>

      {drawer && <div className="device-overlay" role="dialog" aria-modal="true" aria-labelledby="client-drawer-title"><button className="overlay-backdrop" type="button" onClick={() => setDrawer(null)} aria-label="Cerrar ventana" /><section className="detail-drawer client-drawer"><header><div><span>{drawer === 'new' ? 'Nuevo expediente' : selected.id}</span><h2 id="client-drawer-title">{drawer === 'new' ? 'Registrar cliente' : selected.name}</h2><p>{drawer === 'new' ? 'Datos mínimos para iniciar una orden' : 'Contacto e historial de equipos'}</p></div><button type="button" onClick={() => setDrawer(null)} aria-label="Cerrar">×</button></header>{drawer === 'detail' ? detailContent : <form className="client-form" onSubmit={registerClient}>{notice && <p className="form-error" role="alert">{notice}</p>}
        <div className="client-form-intro"><b>Primero identifica al cliente.</b><p>Los equipos y fotografías se añadirán al crear una orden.</p></div>
        <label><span>Nombre completo</span><input name="name" autoComplete="name" required placeholder="Ej. Andrea Flores" /></label><label><span>Teléfono</span><input name="phone" type="tel" autoComplete="tel" required placeholder="+591 700 00000" /></label><label><span>Correo electrónico</span><input name="email" type="email" autoComplete="email" placeholder="Opcional" /></label><label><span>Zona o referencia</span><input name="neighborhood" placeholder="Opcional" /></label><label><span>Notas iniciales</span><textarea name="notes" placeholder="Preferencia de contacto u observaciones" /></label><button className="drawer-primary" type="submit">Guardar cliente</button><small>En esta etapa el registro se conserva hasta recargar la página. No se permiten teléfonos duplicados. El backend conservará el historial definitivamente.</small>
      </form>}</section></div>}
    </main>
  )
}

export default ClientDashboard
