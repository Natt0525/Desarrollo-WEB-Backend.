import galaxyA54 from '../../../assets/screens/samsung-galaxy-a54-frame.jpg'
import iphone12 from '../../../assets/screens/iphone-12-oled.jpg'
import iphone11 from '../../../assets/screens/iphone-11-incell.jpg'
import redmiNote11 from '../../../assets/screens/redmi-note-11-amoled.jpg'
import motoG54 from '../../../assets/screens/motorola-moto-g54-frame.png'
import redmiNote10Pro from '../../../assets/screens/redmi-note-10-pro-amoled.png'
import sinFoto from '../../../assets/no-photo.svg'
import type { Pantalla } from './modelo'

export const pantallasIniciales: Pantalla[] = [
  { id: 'PT-0418', marca: 'Samsung', modelo: 'Galaxy A54 5G', compatibilidad: 'SM-A546E / A546B', tecnologia: 'AMOLED', tieneMarco: true, panelOriginal: false, calidad: 'Service Pack compatible', stock: 4, precio: 980, costo: 690, proveedor: 'Importadora Andes', garantia: '90 días', ubicacion: 'Gaveta A-04', notas: 'Marco negro. Incluye adhesivo; verificar huella antes de instalar.' },
  { id: 'PT-0412', marca: 'Apple', modelo: 'iPhone 12 / 12 Pro', compatibilidad: 'A2172 / A2402 / A2403', tecnologia: 'AMOLED', tieneMarco: false, panelOriginal: true, calidad: 'Panel original · glass cambiado', stock: 2, precio: 1250, costo: 920, proveedor: 'Mobile Parts LP', garantia: '60 días', ubicacion: 'Gaveta B-02', notas: 'Conserva True Tone después de transferir IC. Probar brillo y táctil completo.' },
  { id: 'PT-0409', marca: 'Apple', modelo: 'iPhone 11', compatibilidad: 'A2111 / A2221 / A2223', tecnologia: 'Incell', tieneMarco: false, panelOriginal: false, calidad: 'Premium COF', stock: 7, precio: 490, costo: 305, proveedor: 'Tecno Repuestos BO', garantia: '45 días', ubicacion: 'Gaveta B-06', notas: 'Tono frío calibrado. Requiere adhesivo perimetral nuevo.' },
  { id: 'PT-0401', marca: 'Xiaomi', modelo: 'Redmi Note 11', compatibilidad: '2201117TG / 2201117TY', tecnologia: 'AMOLED', tieneMarco: true, panelOriginal: false, calidad: 'Compatible AAA', stock: 1, precio: 620, costo: 405, proveedor: 'Importadora Andes', garantia: '45 días', ubicacion: 'Gaveta C-03', notas: 'Probar sensor de proximidad y brillo automático antes del sellado.' },
  { id: 'PT-0397', marca: 'Motorola', modelo: 'Moto G54 5G', compatibilidad: 'XT2343-1 / XT2343-2', tecnologia: 'LCD', tieneMarco: true, panelOriginal: false, calidad: 'Compatible premium', stock: 3, precio: 430, costo: 270, proveedor: 'Tecno Repuestos BO', garantia: '30 días', ubicacion: 'Gaveta C-08', notas: 'Marco azul oscuro. Revisar versión exacta antes de retirar el protector.' },
  { id: 'PT-0400', marca: 'Xiaomi', modelo: 'Redmi Note 10 Pro', compatibilidad: 'M2101K6G / M2101K6I', tecnologia: 'AMOLED', tieneMarco: false, panelOriginal: true, calidad: 'Panel original · glass cambiado', stock: 0, precio: 760, costo: 550, proveedor: 'Mobile Parts LP', garantia: '60 días', ubicacion: 'Sin ubicación', notas: 'Agotada. Mantener visible para consultas y reposición.' },
]

const imagenes: Record<string, string> = {
  'PT-0418': galaxyA54,
  'PT-0412': iphone12,
  'PT-0409': iphone11,
  'PT-0401': redmiNote11,
  'PT-0397': motoG54,
  'PT-0400': redmiNote10Pro,
}

export function imagenPantalla(pantalla: Pantalla) {
  return pantalla.imagen || imagenes[pantalla.id] || sinFoto
}

export function estadoStock(stock: number) {
  if (stock === 0) return 'Agotada'
  if (stock <= 2) return 'Stock bajo'
  return 'Disponible'
}
