import { useSyncExternalStore } from 'react'

type Actualizador<T> = T | ((anterior: T) => T)

// Almacén temporal del prototipo. La API reemplazará este módulo sin afectar las pantallas.
const valores = new Map<string, unknown>()
const suscriptores = new Set<() => void>()

function leer<T>(clave: string, inicial: T): T {
  if (!valores.has(clave)) valores.set(clave, inicial)
  return valores.get(clave) as T
}

function guardar<T>(clave: string, siguiente: Actualizador<T>, inicial: T) {
  const anterior = leer(clave, inicial)
  const valor = typeof siguiente === 'function'
    ? (siguiente as (actual: T) => T)(anterior)
    : siguiente

  valores.set(clave, valor)
  suscriptores.forEach((avisar) => avisar())
}

export function useEstadoTemporal<T>(clave: string, inicial: T) {
  const valor = useSyncExternalStore(
    (avisar) => {
      suscriptores.add(avisar)
      return () => { suscriptores.delete(avisar) }
    },
    () => leer(clave, inicial),
  )

  const actualizar = (siguiente: Actualizador<T>) => guardar(clave, siguiente, inicial)
  return [valor, actualizar] as const
}
