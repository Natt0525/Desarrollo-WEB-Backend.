import { useSyncExternalStore } from 'react'
import { initialClients, initialOrders, initialSales, initialTechnicians, type Client, type RepairOrder, type Sale } from './workshopData'

// Session-only demo data: changing modules preserves changes; a reload starts a new demo.
const values = new Map<string, unknown>([['orders', initialOrders], ['clients', initialClients], ['sales', initialSales], ['technicians', initialTechnicians]])
const listeners = new Set<() => void>()
export function readDemo<T>(key: string, initial: T): T {
  if (!values.has(key)) values.set(key, initial)
  return values.get(key) as T
}
export function writeDemo<T>(key: string, value: T | ((previous: T) => T), initial: T) {
  const previous = readDemo(key, initial)
  values.set(key, typeof value === 'function' ? (value as (previous: T) => T)(previous) : value)
  listeners.forEach(listener => listener())
}
export function useDemoState<T>(key: string, initial: T): [T, (value: T | ((previous: T) => T)) => void] {
  const value = useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener) } }, () => readDemo(key, initial))
  return [value, next => writeDemo(key, next, initial)]
}
export const timestamp = () => new Date().toLocaleString('es-BO')
export function uploadedImage(data: FormData, fallback: string) {
  const file = data.get('image')
  if (!(file instanceof File) || !file.size) return fallback
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) throw new Error('Usa una imagen JPG, PNG o WebP de hasta 3 MB.')
  return URL.createObjectURL(file)
}
export const normalizePhone = (phone: string) => phone.replace(/\D/g, '').replace(/^591/, '')
export function ensureClient(name: string, phone = '') {
  const clients = readDemo('clients', initialClients)
  const sameName = (client: Client) => client.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase()
  const found = clients.find(c => phone ? normalizePhone(c.phone) === normalizePhone(phone) : sameName(c)) ?? clients.find(c => !c.phone && sameName(c))
  if (found) {
    if (phone && !found.phone) {
      const updated = { ...found, phone }
      writeDemo('clients', clients.map(client => client.id === found.id ? updated : client), initialClients)
      return updated
    }
    return found
  }
  const client: Client = { id: 'CL-' + crypto.randomUUID().slice(0, 8), name: name.trim(), phone, email: '', neighborhood: '', joined: 'Registrado ' + timestamp(), lastContact: timestamp(), notes: '', devices: [] }
  writeDemo('clients', [...clients, client], initialClients)
  return client
}
export function recordSale(sale: Omit<Sale, 'id' | 'time'>) {
  writeDemo<Sale[]>('sales', current => [{ ...sale, id: 'MV-' + crypto.randomUUID().slice(0, 8), time: timestamp() }, ...current], initialSales)
}
export function commitOrder(order: RepairOrder) {
  const client = ensureClient(order.client, order.phone)
  order = { ...order, client: client.name }
  writeDemo<RepairOrder[]>('orders', current => current.some(item => item.id === order.id) ? current.map(item => item.id === order.id ? order : item) : [order, ...current], initialOrders)
}

// Seed relationships once, just as an API would return linked records.
for (const order of initialOrders) ensureClient(order.client, order.phone)
