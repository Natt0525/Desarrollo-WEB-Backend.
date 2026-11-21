import { useCallback, useMemo, useState } from 'react'
import '../shared/AdminDashboard.css'
import './TechnicianDashboard.css'

import { type Technician, initialTechnicians } from '../shared/workshopData'
import WorkshopForm, { type Field } from '../shared/WorkshopForm'
import { useDemoState } from '../shared/demoStore'

type TechnicianDashboardProps = { onExit: () => void; onOpenPhones: () => void; onOpenScreens: () => void; onOpenClients: () => void; onOpenOperations: (section: 'summary' | 'sales' | 'orders') => void }

function TechnicianDashboard({ onExit, onOpenPhones, onOpenScreens, onOpenClients, onOpenOperations }: TechnicianDashboardProps) {
  const [technicians, setTechnicians] = useDemoState('technicians', initialTechnicians)
  const [query, setQuery] = useState('')
  const [registering, setRegistering] = useState(false)
  const [notice, setNotice] = useState('')
  const closeRegistration = useCallback(() => setRegistering(false), [])
  const fields: Field[] = [
    { name: 'name', label: 'Nombre completo', required: true },
    { name: 'specialty', label: 'Especialidad', required: true },
    { name: 'turn', label: 'Horario', required: true },
  ]
  const staff = useMemo(() => technicians
    .filter(technician => !technician.owner)
    .filter(technician => `${technician.name} ${technician.specialty} ${technician.turn}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [query, technicians])

  const registerTechnician = (data: FormData) => {
    const value = (key: string) => String(data.get(key) || '').trim()
    const name = value('name')
    if (technicians.some(technician => technician.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error('Ya existe un técnico con ese nombre.')
    const technician: Technician = {
      id: `tec-${crypto.randomUUID().slice(0, 8)}`,
      name,
      initials: name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase(),
      specialty: value('specialty'),
      turn: value('turn'),
      rate: 50,
      owner: false,
      paymentTiming: 'Posteriormente',
    }
    setTechnicians(current => [...current, technician])
    closeRegistration()
    setNotice('Técnico registrado.')
  }

  return <main className="sales-shell tech-shell">
    <aside className="sales-rail">
      <button className="sales-mark" type="button" onClick={onExit} aria-label="Volver a la portada"><b>Z</b><span>ZION<br />TECH</span></button>
      <nav aria-label="Módulos administrativos"><button type="button" onClick={() => onOpenOperations('summary')}><i>⌁</i><span>Resumen</span></button><button type="button" onClick={onOpenPhones}><i>▣</i><span>Celulares</span></button><button type="button" onClick={onOpenScreens}><i>▤</i><span>Pantallas</span></button><button className="active" type="button"><i>⌾</i><span>Técnicos</span></button><button type="button" onClick={() => onOpenOperations('sales')}><i>↗</i><span>Ventas</span></button><button type="button" onClick={() => onOpenOperations('orders')}><i>⌕</i><span>Órdenes</span></button><button type="button" onClick={onOpenClients}><i>◎</i><span>Clientes</span></button></nav>
      <div className="rail-user"><span>ZT</span><div><b>Propietario</b><small>Administrador</small></div></div>
    </aside>

    <section className="sales-workspace tech-workspace">
      <header className="sales-topbar tech-topbar"><div><p>Técnicos</p></div><div className="sales-top-actions"><button className="tech-add" type="button" onClick={() => setRegistering(true)} aria-label="Registrar técnico" title="Registrar técnico">＋</button><button className="exit-dashboard" type="button" onClick={onExit}>Salir</button></div></header>
      {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Cerrar</button></div>}

      <section className="tech-directory">
        <header><label className="tech-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar técnico" aria-label="Buscar técnico" /></label><b>{staff.length}</b></header>
        <div className="tech-list">
          {staff.map(technician => <article key={technician.id} className="tech-card"><span className="tech-initials">{technician.initials}</span><div><h2>{technician.name}</h2><p>{technician.specialty}</p></div><time>{technician.turn}</time></article>)}
          {!staff.length && <div className="tech-empty"><span>⌕</span><b>Sin resultados</b></div>}
        </div>
      </section>
    </section>
    {registering && <WorkshopForm title="Registrar técnico" fields={fields} onClose={closeRegistration} onSave={registerTechnician} />}
  </main>
}

export default TechnicianDashboard
