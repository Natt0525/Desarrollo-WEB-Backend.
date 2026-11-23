import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { CampoFormulario } from './tipos'
import '../estilos/formulario.css'

type PropiedadesDialogo = {
  titulo: string
  alCerrar: () => void
  children: ReactNode
}

export function DialogoTaller({ titulo, alCerrar, children }: PropiedadesDialogo) {
  const dialogoRef = useRef<HTMLDivElement>(null)
  const tituloId = useId()

  useEffect(() => {
    const focoAnterior = document.activeElement as HTMLElement | null
    const desbordeAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogoRef.current?.querySelector<HTMLElement>('button, input')?.focus()

    const controlarTeclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') alCerrar()
      if (evento.key !== 'Tab') return

      const selector = 'button:not(:disabled), input:not(:disabled), textarea, select, a[href]'
      const controles = [...(dialogoRef.current?.querySelectorAll<HTMLElement>(selector) ?? [])]
        .filter((control) => control.getClientRects().length)
      const primero = controles[0]
      const ultimo = controles.at(-1)

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo?.focus()
      }
      if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero?.focus()
      }
    }

    document.addEventListener('keydown', controlarTeclado)
    return () => {
      document.body.style.overflow = desbordeAnterior
      document.removeEventListener('keydown', controlarTeclado)
      focoAnterior?.focus()
    }
  }, [alCerrar])

  return (
    <div className="workshop-modal" ref={dialogoRef} role="dialog" aria-modal="true" aria-labelledby={tituloId}>
      <button className="workshop-backdrop" type="button" aria-label="Cerrar" onClick={alCerrar} />
      <section className="workshop-dialog">
        <header><h2 id={tituloId}>{titulo}</h2><button type="button" onClick={alCerrar} aria-label="Cerrar">×</button></header>
        {children}
      </section>
    </div>
  )
}

type PropiedadesFormulario = {
  titulo: string
  campos: CampoFormulario[]
  alCerrar: () => void
  alGuardar: (datos: FormData) => void
}

export default function FormularioTaller({ titulo, campos, alCerrar, alGuardar }: PropiedadesFormulario) {
  const [error, setError] = useState('')

  const guardar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    try {
      const datos = new FormData(evento.currentTarget)
      for (const campo of campos) {
        if (campo.obligatorio && !String(datos.get(campo.nombre) ?? '').trim()) {
          throw new Error(`Completa ${campo.etiqueta.toLowerCase()}`)
        }
      }
      alGuardar(datos)
    } catch (motivo) {
      setError(motivo instanceof Error ? motivo.message : 'Revisa los datos.')
    }
  }

  return (
    <DialogoTaller titulo={titulo} alCerrar={alCerrar}>
      <form className="workshop-form" onSubmit={guardar}>
        {campos.map((campo) => (
          <label key={campo.nombre}>
            <span>{campo.etiqueta}</span>
            {campo.opciones ? (
              <select name={campo.nombre} defaultValue={campo.valor} required={campo.obligatorio}>
                {campo.opciones.map((opcion) => <option key={opcion}>{opcion}</option>)}
              </select>
            ) : campo.tipo === 'textarea' ? (
              <textarea name={campo.nombre} defaultValue={campo.valor} required={campo.obligatorio} />
            ) : (
              <input
                name={campo.nombre}
                type={campo.tipo || 'text'}
                min={campo.minimo}
                max={campo.maximo}
                step={campo.tipo === 'number' ? '0.01' : undefined}
                defaultValue={campo.valor}
                required={campo.obligatorio}
              />
            )}
          </label>
        ))}
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="op-primary" type="submit">Guardar</button>
      </form>
    </DialogoTaller>
  )
}
