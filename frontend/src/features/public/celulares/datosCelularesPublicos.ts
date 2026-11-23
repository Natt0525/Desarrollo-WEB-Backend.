import galaxyS22 from '../../../assets/phones/samsung-galaxy-s22-phantom-black.jpg'
import iphone12 from '../../../assets/phones/iphone-12-blue.jpg'
import xiaomi12Lite from '../../../assets/phones/xiaomi-12-lite-black.png'

export type CelularPublico = {
  id: string
  modelo: string
  almacenamiento: string
  ram: string
  color: string
  estadoEstetico: string
  bateria: number
  precio: number
  estado: 'Disponible' | 'Reservado'
  garantia: string
  accesorios: string
  imagen: string
  componentes: string[]
}

export const celularesPublicos: CelularPublico[] = [
  {
    id: 'ZT-0284',
    modelo: 'Samsung Galaxy S22',
    almacenamiento: '128 GB',
    ram: '8 GB',
    color: 'Phantom Black',
    estadoEstetico: '9/10',
    bateria: 88,
    precio: 2350,
    estado: 'Disponible',
    garantia: '90 días',
    accesorios: 'Cable USB-C',
    imagen: galaxyS22,
    componentes: ['Pantalla original', 'Glass original', 'Batería original'],
  },
  {
    id: 'ZT-0281',
    modelo: 'iPhone 12',
    almacenamiento: '64 GB',
    ram: '4 GB',
    color: 'Azul',
    estadoEstetico: '8.5/10',
    bateria: 84,
    precio: 3100,
    estado: 'Reservado',
    garantia: '60 días',
    accesorios: 'Cable Lightning',
    imagen: iphone12,
    componentes: ['Pantalla original', 'Glass cambiado', 'Batería original'],
  },
  {
    id: 'ZT-0279',
    modelo: 'Xiaomi 12 Lite',
    almacenamiento: '256 GB',
    ram: '8 GB',
    color: 'Negro',
    estadoEstetico: '9/10',
    bateria: 91,
    precio: 1750,
    estado: 'Disponible',
    garantia: '90 días',
    accesorios: 'Caja y cargador 67 W',
    imagen: xiaomi12Lite,
    componentes: ['Pantalla AMOLED cambiada', 'Tapa original', 'Batería original'],
  },
]
