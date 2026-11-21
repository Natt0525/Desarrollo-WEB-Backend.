import { useEffect, useState } from 'react'
import RepairAnatomy from './RepairAnatomy'
import { sectionLinks, serviceCards } from './homeContent'

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

type HomePageProps = {
  onOpenAdmin: () => void
}

type SectionId = (typeof sectionLinks)[number]['id']

function HomePage({ onOpenAdmin }: HomePageProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const readingLine = window.innerHeight * 0.42
        let currentSection: SectionId = sectionLinks[0].id

        sectionLinks.forEach(({ id }) => {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= readingLine) currentSection = id
        })

        setActiveSection(currentSection)
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])
  return (
    <div className="site">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Zion Tech, inicio"><span>ZION</span><i /><span>TECH</span></a>
        <nav aria-label="Navegación principal"><a href="#anatomia">Anatomía</a><a href="#proceso">Proceso</a><a href="#servicios">Servicios</a></nav>
        <div className="header-tools">
          <button className="admin-entry" type="button" onClick={onOpenAdmin}><i /><span>Administración</span></button>
          <a className="header-action" href="#contacto">Hablar con el taller <ArrowIcon /></a>
        </div>
      </header>

      <nav className="section-rail" aria-label="Navegación por secciones">
        <ul>
          {sectionLinks.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>
                <span className="section-rail-label">{label}</span>
                <span className="section-rail-marker" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="contenido-principal" tabIndex={-1}>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <h1>Tu teléfono,<br /><em>entendido</em><br />por dentro.</h1>
            <p className="hero-lede">Diagnóstico claro, reparación documentada y cada pieza en su lugar. Mira cómo trabajamos antes de dejar tu equipo.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contacto">Consultar reparación <ArrowIcon /></a>
              <a className="text-link" href="#anatomia">Ver el desmontaje <span>↓</span></a>
            </div>
            <dl className="hero-facts">
              <div><dt>01</dt><dd>Orden por equipo</dd></div><div><dt>02</dt><dd>Diagnóstico visible</dd></div><div><dt>03</dt><dd>Seguimiento real</dd></div>
            </dl>
          </div>
          <div className="hero-anatomy" id="anatomia"><RepairAnatomy /></div>
        </section>

        <section className="promise-strip" aria-label="Compromisos del taller">
          <span>Fotografías al recibir</span><span>Presupuesto antes de reparar</span><span>Historial por dispositivo</span><span>Precios en bolivianos</span>
        </section>

        <section className="process" id="proceso">
          <div className="section-heading">
            <p>02 / EL PROCESO</p><h2>Así trabajamos<br />tu reparación.</h2>
            <span>Te explicamos qué revisamos, cuánto costará y qué trabajo realizamos en tu equipo.</span>
          </div>
          <div className="process-steps">
            <article><span>01 · RECIBIMOS</span><h3>Registramos cómo llega.</h3><p>Anotamos el modelo, la falla, los accesorios y tomamos fotografías del estado del equipo.</p></article>
            <article><span>02 · REVISAMOS</span><h3>Te damos un diagnóstico claro.</h3><p>Confirmamos la falla, el repuesto necesario y el precio antes de comenzar la reparación.</p></article>
            <article><span>03 · ENTREGAMOS</span><h3>Compruebas el trabajo realizado.</h3><p>Registramos la reparación, el pago y el estado final para que toda la información quede disponible.</p></article>
          </div>
        </section>

        <section className="services" id="servicios">
          <div className="services-heading"><p>03 / SERVICIOS</p><h2>Servicios del taller.</h2></div>
          <div className="service-grid">
            {serviceCards.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-image"><img src={service.image} alt={service.alt} loading="lazy" /></div>
                <div className="service-copy"><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p><a href="#contacto" aria-label={`Consultar sobre ${service.title}`}>Consultar <ArrowIcon /></a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="control-room" id="taller">
          <div className="control-copy"><p>04 / CONTROL DEL TALLER</p><h2>El trabajo real también necesita orden.</h2><p className="control-lede">Órdenes, técnicos, anticipos, repuestos y comisiones conectados con el equipo correcto.</p></div>
          <div className="order-card" aria-label="Ejemplo de seguimiento de una orden">
            <div className="order-top"><span>ORDEN #0248</span><strong>EN DIAGNÓSTICO</strong></div>
            <div className="order-device"><span>Samsung Galaxy S10</span><strong>No enciende / revisión de placa</strong></div>
            <div className="order-flow">
              <div className="done"><i /><span>Recepción</span><small>09:42</small></div><div className="done"><i /><span>Inspección</span><small>10:18</small></div>
              <div className="active"><i /><span>Diagnóstico</span><small>Ahora</small></div><div><i /><span>Aprobación</span><small>Pendiente</small></div>
            </div>
            <div className="order-bottom"><span>TÉCNICO · ML</span><span>UBICACIÓN · MESA 02</span></div>
          </div>
        </section>

        <section className="contact" id="contacto">
          <div className="contact-meta"><span>05 / CONTACTO</span><span>LA PAZ · BOLIVIA</span></div>
          <div className="contact-copy"><p>¿Tu celular necesita una revisión?</p><h2>Hablemos<br />del equipo.</h2></div>
          <a className="contact-button" href="https://wa.me/" aria-label="Consultar una reparación por WhatsApp"><span>Consultar por WhatsApp</span><ArrowIcon /></a>
        </section>
      </main>

      <footer><div className="wordmark"><span>ZION</span><i /><span>TECH</span></div><p>Reparaciones · Usados · Pantallas</p><p>Precios en bolivianos / Bs</p></footer>
    </div>
  )
}

export default HomePage
