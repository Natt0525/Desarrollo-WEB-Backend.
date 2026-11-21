import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const PhoneExplorer = lazy(() => import('../../shared/phone-explorer/PhoneExplorer'))

type AdminLoginProps = {
  open: boolean
  onClose: () => void
  onEnter: () => void
}

function AdminLogin({ open, onClose, onEnter }: AdminLoginProps) {
  const emailRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [phoneExploded, setPhoneExploded] = useState(true)
  const [showPhoneModel, setShowPhoneModel] = useState(() => window.matchMedia('(min-width: 821px)').matches)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 821px)')
    const updateLayout = () => setShowPhoneModel(desktop.matches)
    desktop.addEventListener('change', updateLayout)
    return () => desktop.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = Array.from(document.querySelectorAll<HTMLElement>('.site > :not(.admin-login)'))
    background.forEach((element) => { element.inert = true })
    const focusTimer = window.setTimeout(() => emailRef.current?.focus(), 80)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => !element.hidden)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      background.forEach((element) => { element.inert = false })
      returnFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={dialogRef} className="admin-login" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <button className="admin-close" type="button" onClick={onClose} aria-label="Cerrar acceso administrativo">
        <span /><span />
      </button>

      {showPhoneModel && (
        <section className="admin-visual" aria-label="Panel de control del taller">
          <div className="admin-phone-scene" aria-hidden="true">
            <Suspense fallback={<div className="phone-model-loading">Preparando modelo 3D…</div>}>
              <PhoneExplorer exploded={phoneExploded} selected={null} onSelect={() => undefined} />
            </Suspense>
          </div>
          <div className="admin-visual-shade" />
          <div className="admin-visual-top"><span>ZION TECH</span><span><i /> SISTEMA DISPONIBLE</span></div>
          <div className="admin-phone-tools">
            <span>MODELO 3D · ARRASTRA PARA GIRAR</span>
            <button type="button" aria-pressed={phoneExploded} onClick={() => setPhoneExploded((exploded) => !exploded)}>
              {phoneExploded ? 'Armar teléfono' : 'Separar piezas'}
            </button>
          </div>
        </section>
      )}

      <section className="login-panel">
        <div className="login-heading">
          <p>Administración</p>
          <h1 id="admin-title">Ingresa al taller.</h1>
          <span>Usa la cuenta asignada por el propietario.</span>
        </div>

        <form className="login-form" onSubmit={(event) => {
          event.preventDefault()
          onEnter()
        }}>
          <label>
            <span>Correo o usuario</span>
            <input ref={emailRef} name="username" type="text" autoComplete="username" placeholder="nombre@taller.com" required />
          </label>
          <label>
            <span>Contraseña</span>
            <div className="password-field">
              <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Tu contraseña" required />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Ocultar' : 'Mostrar'}</button>
            </div>
          </label>
          <div className="login-options">
            <label className="remember"><input type="checkbox" name="remember" /><span>Recordar este equipo</span></label>
            <button type="button" className="forgot" onClick={() => setMessage('La recuperación de contraseña se habilitará con el servicio de acceso.')}>¿Olvidaste tu contraseña?</button>
          </div>
          <button className="login-submit" type="submit"><span>Ingresar al panel</span><b>→</b></button>
          <p className="login-message" aria-live="polite">{message}</p>
        </form>

        <div className="login-security"><i /><span>Acceso exclusivo para personal autorizado</span></div>
      </section>
    </div>
  )
}

export default AdminLogin
