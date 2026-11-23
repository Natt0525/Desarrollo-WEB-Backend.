export type CampoFormulario = {
  nombre: string
  etiqueta: string
  tipo?: string
  obligatorio?: boolean
  minimo?: number
  maximo?: number
  opciones?: string[]
  valor?: string | number
}

export type ModuloAdmin = 'celulares' | 'pantallas'
