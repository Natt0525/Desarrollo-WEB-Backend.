export type EstadoCelular = 'Disponible' | 'Reservado' | 'Vendido'
export type VistaCelular = 'ficha' | 'venta' | null

export type Especificacion = {
  etiqueta: string
  valor: string
}

export type Celular = {
  id: string
  modelo: string
  almacenamiento: string
  ram: string
  color: string
  estadoEstetico: string
  bateria: number
  precio: number
  costo: number
  estado: EstadoCelular
  imagen: string
  componentes: string[]
  red: string
  garantia: string
  accesorios: string
  imei: string
  notas: string
  especificaciones: Especificacion[]
}
