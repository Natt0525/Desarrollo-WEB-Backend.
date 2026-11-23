import { celularesPublicos } from './datosCelularesPublicos'
import './catalogoCelulares.css'

const moneda = new Intl.NumberFormat('es-BO')

function IconoFlecha() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

function IconoVolver() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" /></svg>
}

function CatalogoCelulares() {
  const prioridadEstado = { Disponible: 0, Reservado: 1 } as const
  const celularesOrdenados = [...celularesPublicos].sort(
    (primero, segundo) => prioridadEstado[primero.estado] - prioridadEstado[segundo.estado],
  )
  const disponibles = celularesPublicos.filter((celular) => celular.estado === 'Disponible').length
  const reservados = celularesPublicos.filter((celular) => celular.estado === 'Reservado').length

  return (
    <div className="catalogo-publico">
      <a className="skip-link" href="#catalogo-lista">Saltar al catálogo</a>

      <header className="catalogo-nav">
        <a className="catalogo-volver" href="#inicio" aria-label="Volver al menú principal">
          <IconoVolver />
          <span className="volver-completo">Volver al menú principal</span>
          <span className="volver-corto">Menú principal</span>
        </a>
        <a className="wordmark" href="#inicio" aria-label="Zion Tech"><span>ZION</span><i /><span>TECH</span></a>
        <span>CELULARES DE MEDIO USO</span>
      </header>

      <main>
        <section className="catalogo-portada" aria-labelledby="catalogo-titulo">
          <div>
            <p>DISPONIBLES HOY · LA PAZ</p>
            <h1 id="catalogo-titulo">Celulares listos<br />para una nueva vida.</h1>
          </div>
          <div className="catalogo-intro">
            <strong>{disponibles} disponibles · {reservados} reservado</strong>
          </div>
        </section>

        <section className="catalogo-lista" id="catalogo-lista" aria-label="Celulares disponibles">
          {celularesOrdenados.map((celular) => {
            const mensaje = encodeURIComponent(`Hola, quiero consultar por el ${celular.modelo} (${celular.id}) de Bs ${moneda.format(celular.precio)}.`)
            return (
              <article className="celular-publico" key={celular.id}>
                <div className="celular-publico-imagen">
                  <img src={celular.imagen} alt={`${celular.modelo} en color ${celular.color}`} />
                  <span className={celular.estado === 'Reservado' ? 'reservado' : ''}><i /> {celular.estado}</span>
                </div>

                <div className="celular-publico-info">
                  <div className="celular-publico-encabezado">
                    <span>{celular.id}</span>
                    <h2>{celular.modelo}</h2>
                    <p>{celular.ram} RAM · {celular.almacenamiento} · {celular.color}</p>
                  </div>

                  <strong className="celular-publico-precio"><span>Precio publicado</span>Bs {moneda.format(celular.precio)}</strong>

                  <dl className="celular-publico-datos">
                    <div><dt>Estado estético</dt><dd>{celular.estadoEstetico}</dd></div>
                    <div><dt>Salud de batería</dt><dd>{celular.bateria}%</dd></div>
                    <div><dt>Garantía</dt><dd>{celular.garantia}</dd></div>
                    <div><dt>Incluye</dt><dd>{celular.accesorios}</dd></div>
                  </dl>

                  <div className="celular-publico-componentes">
                    <span>LO QUE REVISAMOS</span>
                    <ul>{celular.componentes.map((componente) => <li key={componente}><i />{componente}</li>)}</ul>
                  </div>

                  <a className="celular-publico-accion" href={`https://wa.me/?text=${mensaje}`} aria-label={`Consultar por WhatsApp sobre ${celular.modelo}`}>
                    {celular.estado === 'Reservado' ? 'Consultar la reserva' : 'Consultar este equipo'} <IconoFlecha />
                  </a>
                </div>
              </article>
            )
          })}
        </section>

        <section className="catalogo-aviso" aria-label="Información sobre disponibilidad">
          <span>¿Buscas otro modelo?</span>
          <p>La disponibilidad cambia. Escríbenos y te contamos qué equipos están por ingresar.</p>
          <a href="https://wa.me/?text=Hola%2C%20busco%20un%20celular%20de%20medio%20uso.">Preguntar por otro modelo <IconoFlecha /></a>
        </section>
      </main>

      <div className="catalogo-pie"><div className="wordmark"><span>ZION</span><i /><span>TECH</span></div><p>Equipos revisados · Precios claros</p></div>
    </div>
  )
}

export default CatalogoCelulares
