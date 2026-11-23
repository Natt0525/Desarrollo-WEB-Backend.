import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const ExploradorCelular = lazy(() => import('../../shared/phone-explorer/PhoneExplorer'))

type Propiedades = {
  abierto: boolean
  alCerrar: () => void
  alIngresar: () => void
}

export default function AccesoAdmin({ abierto, alCerrar, alIngresar }: Propiedades) {
  const usuarioRef = useRef<HTMLInputElement>(null)
  const dialogoRef = useRef<HTMLDivElement>(null)
  const focoAnteriorRef = useRef<HTMLElement | null>(null)
  const [verClave, setVerClave] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [desarmado, setDesarmado] = useState(true)
  const [mostrarModelo, setMostrarModelo] = useState(() => window.matchMedia('(min-width: 821px)').matches)

  useEffect(() => {
    const consulta = window.matchMedia('(min-width: 821px)')
    const actualizar = () => setMostrarModelo(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useEffect(() => {
    if (!abierto) return

    focoAnteriorRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const desbordeAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const fondo = Array.from(document.querySelectorAll<HTMLElement>('.site > :not(.admin-login)'))
    fondo.forEach((elemento) => { elemento.inert = true })
    const temporizador = window.setTimeout(() => usuarioRef.current?.focus(), 80)

    const controlarTeclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') alCerrar()
      if (evento.key !== 'Tab') return

      const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      const controles = Array.from(dialogoRef.current?.querySelectorAll<HTMLElement>(selector) ?? [])
        .filter((elemento) => !elemento.hidden)
      if (!controles.length) return

      const primero = controles[0]
      const ultimo = controles.at(-1)
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo?.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }

    window.addEventListener('keydown', controlarTeclado)
    return () => {
      window.clearTimeout(temporizador)
      window.removeEventListener('keydown', controlarTeclado)
      document.body.style.overflow = desbordeAnterior
      fondo.forEach((elemento) => { elemento.inert = false })
      focoAnteriorRef.current?.focus()
    }
  }, [abierto, alCerrar])

  if (!abierto) return null

  return (
    <div ref={dialogoRef} className="admin-login" role="dialog" aria-modal="true" aria-labelledby="titulo-acceso">
      <button className="admin-close" type="button" onClick={alCerrar} aria-label="Cerrar acceso administrativo"><span /><span /></button>

      {mostrarModelo && (
        <section className="admin-visual" aria-label="Panel de control del taller">
          <div className="admin-phone-scene" aria-hidden="true">
            <Suspense fallback={<div className="phone-model-loading">Preparando modelo 3D…</div>}>
              <ExploradorCelular exploded={desarmado} selected={null} onSelect={() => undefined} />
            </Suspense>
          </div>
          <div className="admin-visual-shade" />
          <div className="admin-visual-top"><span>ZION TECH</span><span><i /> SISTEMA DISPONIBLE</span></div>
          <div className="admin-phone-tools">
            <span>MODELO 3D · ARRASTRA PARA GIRAR</span>
            <button type="button" aria-pressed={desarmado} onClick={() => setDesarmado((valor) => !valor)}>
              {desarmado ? 'Armar teléfono' : 'Separar piezas'}
            </button>
          </div>
        </section>
      )}

      <section className="login-panel">
        <div className="login-heading"><p>Administración</p><h1 id="titulo-acceso">Ingresa al taller.</h1><span>Usa la cuenta asignada por el propietario.</span></div>
        <form className="login-form" onSubmit={(evento) => { evento.preventDefault(); alIngresar() }}>
          <label><span>Correo o usuario</span><input ref={usuarioRef} name="usuario" type="text" autoComplete="username" placeholder="nombre@taller.com" required /></label>
          <label>
            <span>Contraseña</span>
            <div className="password-field"><input name="clave" type={verClave ? 'text' : 'password'} autoComplete="current-password" placeholder="Tu contraseña" required /><button type="button" onClick={() => setVerClave((valor) => !valor)}>{verClave ? 'Ocultar' : 'Mostrar'}</button></div>
          </label>
          <div className="login-options">
            <label className="remember"><input type="checkbox" name="recordar" /><span>Recordar este equipo</span></label>
            <button type="button" className="forgot" onClick={() => setMensaje('La recuperación de contraseña se habilitará con el servicio de acceso.')}>¿Olvidaste tu contraseña?</button>
          </div>
          <button className="login-submit" type="submit"><span>Ingresar al panel</span><b>→</b></button>
          <p className="login-message" aria-live="polite">{mensaje}</p>
        </form>
        <div className="login-security"><i /><span>Acceso exclusivo para personal autorizado</span></div>
      </section>
    </div>
  )
}
