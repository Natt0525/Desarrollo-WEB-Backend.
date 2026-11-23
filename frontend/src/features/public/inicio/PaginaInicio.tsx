import { useEffect, useState } from 'react'
import AnatomiaReparacion from './AnatomiaReparacion'
import { secciones, servicios } from './contenidoInicio'

function IconoFlecha() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

type Propiedades = {
  alAbrirAdmin: () => void
}

type IdSeccion = (typeof secciones)[number]['id']

function PaginaInicio({ alAbrirAdmin }: Propiedades) {
  const [seccionActiva, setSeccionActiva] = useState<IdSeccion>('inicio')

  useEffect(() => {
    let fotograma = 0
    const actualizarSeccion = () => {
      window.cancelAnimationFrame(fotograma)
      fotograma = window.requestAnimationFrame(() => {
        const lineaLectura = window.innerHeight * 0.42
        let actual: IdSeccion = secciones[0].id

        secciones.forEach(({ id }) => {
          const seccion = document.getElementById(id)
          if (seccion && seccion.getBoundingClientRect().top <= lineaLectura) actual = id
        })

        setSeccionActiva(actual)
      })
    }

    actualizarSeccion()
    window.addEventListener('scroll', actualizarSeccion, { passive: true })
    window.addEventListener('resize', actualizarSeccion)

    return () => {
      window.cancelAnimationFrame(fotograma)
      window.removeEventListener('scroll', actualizarSeccion)
      window.removeEventListener('resize', actualizarSeccion)
    }
  }, [])
  return (
    <div className="site">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Zion Tech, inicio"><span>ZION</span><i /><span>TECH</span></a>
        <nav aria-label="Navegación principal">
          <a href="#proceso" aria-current={seccionActiva === 'proceso' ? 'page' : undefined}>Cómo trabajamos</a>
          <a href="#servicios" aria-current={seccionActiva === 'servicios' ? 'page' : undefined}>Qué hacemos</a>
          <a href="#taller" aria-current={seccionActiva === 'taller' ? 'page' : undefined}>Seguimiento</a>
        </nav>
        <div className="header-tools">
          <button className="admin-entry" type="button" onClick={alAbrirAdmin}><i /><span>Acceso</span></button>
          <a className="header-action" href="#contacto">Escríbenos <IconoFlecha /></a>
        </div>
      </header>

      <nav className="section-rail" aria-label="Navegación por secciones">
        <ul>
          {secciones.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={seccionActiva === id ? 'location' : undefined}>
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
            <h1>Encontramos<br />la falla.<span>Te mostramos la solución.</span></h1>
            <p className="hero-lede">Revisamos tu celular, te explicamos qué necesita y acordamos el precio antes de repararlo.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contacto">Revisar mi celular <IconoFlecha /></a>
              <a className="text-link" href="#proceso">Ver cómo trabajamos <span>↓</span></a>
            </div>
            <dl className="hero-facts">
              <div><dt>Al recibir</dt><dd>Registramos el estado</dd></div><div><dt>Antes de reparar</dt><dd>Acordamos el precio</dd></div><div><dt>Al entregar</dt><dd>Documentamos el trabajo</dd></div>
            </dl>
          </div>
          <div className="hero-anatomy" id="anatomia"><AnatomiaReparacion /></div>
        </section>

        <section className="promise-strip" aria-label="Compromisos del taller">
          <span>Fotos al recibir</span><span>Precio acordado antes de reparar</span><span>Historial del trabajo</span><span>Repuestos identificados</span>
        </section>

        <section className="process" id="proceso">
          <div className="section-heading">
            <p>CÓMO TRABAJAMOS</p><h2>Sabes qué pasa<br />en cada momento.</h2>
            <span>Te explicamos qué revisamos, cuánto costará y qué trabajo realizamos en tu equipo.</span>
          </div>
          <div className="process-steps">
            <article><span>01 · RECIBIMOS</span><h3>Registramos cómo llega.</h3><p>Anotamos el modelo, la falla, los accesorios y tomamos fotografías del estado del equipo.</p></article>
            <article><span>02 · REVISAMOS</span><h3>Te damos un diagnóstico claro.</h3><p>Confirmamos la falla, el repuesto necesario y el precio antes de comenzar la reparación.</p></article>
            <article><span>03 · ENTREGAMOS</span><h3>Compruebas el trabajo realizado.</h3><p>Registramos la reparación, el pago y el estado final para que toda la información quede disponible.</p></article>
          </div>
        </section>

        <section className="services" id="servicios">
          <div className="services-heading"><p>EN EL TALLER</p><h2>Lo que podemos hacer por tu celular.</h2></div>
          <div className="service-grid">
            {servicios.map((servicio) => (
              <article className="service-card" key={servicio.number}>
                <div className="service-image"><img src={servicio.image} alt={servicio.alt} loading="lazy" /></div>
                <div className="service-copy"><span>{servicio.number}</span><h3>{servicio.title}</h3><p>{servicio.copy}</p><a href={servicio.href} aria-label={`${servicio.accion}: ${servicio.title}`}>{servicio.accion} <IconoFlecha /></a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="control-room" id="taller">
          <div className="control-copy"><p>SEGUIMIENTO DE TU REPARACIÓN</p><h2>Tu reparación, sin misterios.</h2><p className="control-lede">Registramos cada avance para que sepas qué encontramos, cuánto costará y qué falta antes de entregarte el equipo.</p></div>
          <div className="order-card" aria-label="Ejemplo del seguimiento de una reparación">
            <div className="order-top"><span>REPARACIÓN #0248</span><strong>ESPERANDO TU CONFIRMACIÓN</strong></div>
            <div className="order-device"><span>Samsung Galaxy S10 · ingresó hoy a las 09:42</span><strong>Ya encontramos por qué no enciende.</strong></div>
            <div className="order-flow">
              <div className="done"><i /><span>Recibimos tu equipo</span><small>Listo</small></div><div className="done"><i /><span>Encontramos la falla</span><small>Listo</small></div>
              <div className="done"><i /><span>Te enviamos el precio</span><small>Bs 380</small></div><div className="active"><i /><span>Esperamos tu confirmación</span><small>Pendiente</small></div>
            </div>
            <div className="order-bottom"><span>SIGUIENTE PASO · TU APROBACIÓN</span><span>TIEMPO ESTIMADO · 2 DÍAS</span></div>
          </div>
        </section>

        <section className="contact" id="contacto">
          <div className="contact-meta"><span>CONTACTO DIRECTO</span><span>LA PAZ · BOLIVIA</span></div>
          <div className="contact-copy"><p>¿Tu celular necesita una revisión?</p><h2>Hablemos<br />del equipo.</h2></div>
          <a className="contact-button" href="https://wa.me/" aria-label="Consultar una reparación por WhatsApp"><span>Consultar por WhatsApp</span><IconoFlecha /></a>
        </section>
      </main>

      <footer><div className="wordmark"><span>ZION</span><i /><span>TECH</span></div><p>Reparación · Equipos revisados · Pantallas</p><p>Precios claros antes de reparar</p></footer>
    </div>
  )
}

export default PaginaInicio
