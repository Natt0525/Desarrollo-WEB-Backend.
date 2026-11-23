export type TecnologiaPantalla = 'LCD' | 'Incell' | 'AMOLED'
export type VistaPantalla = 'ficha' | 'venta' | null

export type Pantalla = {
  id: string
  marca: string
  modelo: string
  compatibilidad: string
  tecnologia: TecnologiaPantalla
  tieneMarco: boolean
  panelOriginal: boolean
  calidad: string
  stock: number
  precio: number
  imagen?: string
  costo: number
  proveedor: string
  garantia: string
  ubicacion: string
  notas: string
}
