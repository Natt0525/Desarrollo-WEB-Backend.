import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import '../operations/OperationsDashboard.css'

export function WorkshopDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('button, input')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const nodes = [...(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea, select, a[href]') ?? [])].filter(el => el.getClientRects().length)
      const first = nodes[0], last = nodes.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus() }
  }, [onClose])
  return <div className="workshop-modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby={id}>
    <button className="workshop-backdrop" aria-label="Cerrar" onClick={onClose} />
    <section className="workshop-dialog"><header><h2 id={id}>{title}</h2><button onClick={onClose} aria-label="Cerrar">×</button></header>{children}</section>
  </div>
}

export type Field = { name: string; label: string; type?: string; required?: boolean; min?: number; max?: number; options?: string[]; value?: string | number }
export default function WorkshopForm({ title, fields, onClose, onSave }: { title: string; fields: Field[]; onClose: () => void; onSave: (data: FormData) => void }) {
  const [error, setError] = useState('')
  return <WorkshopDialog title={title} onClose={onClose}><form className="workshop-form" onSubmit={event => {
    event.preventDefault()
    try {
      const data = new FormData(event.currentTarget)
      for (const field of fields) if (field.required && !String(data.get(field.name) ?? '').trim()) throw new Error('Completa ' + field.label.toLowerCase())
      onSave(data)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Revisa los datos.') }
  }}>
    {fields.map(field => <label key={field.name}><span>{field.label}</span>{field.options ? <select name={field.name} defaultValue={field.value} required={field.required}>{field.options.map(option => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea name={field.name} defaultValue={field.value} required={field.required} /> : <input name={field.name} type={field.type || 'text'} min={field.min} max={field.max} step={field.type === 'number' ? '0.01' : undefined} defaultValue={field.value} required={field.required} />}</label>)}
    {error && <p role="alert" className="form-error">{error}</p>}<button className="op-primary" type="submit">Guardar</button>
  </form></WorkshopDialog>
}
