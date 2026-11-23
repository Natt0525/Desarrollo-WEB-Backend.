import galaxyS22 from '../../../assets/phones/samsung-galaxy-s22-phantom-black.jpg'
import iphone12 from '../../../assets/phones/iphone-12-blue.jpg'
import xiaomi12Lite from '../../../assets/phones/xiaomi-12-lite-black.png'
import galaxyA54 from '../../../assets/phones/samsung-galaxy-a54-awesome-lime.jpg'
import type { Celular } from './modelo'

export const celularesIniciales: Celular[] = [
  {
    id: 'ZT-0284', modelo: 'Samsung Galaxy S22', almacenamiento: '128 GB', ram: '8 GB',
    color: 'Phantom Black', estadoEstetico: '9/10', bateria: 88, precio: 2350, costo: 1740,
    estado: 'Disponible', imagen: galaxyS22, red: '5G · Nano-SIM + eSIM', garantia: '90 días',
    accesorios: 'Cable USB-C', imei: '358321•••••4821',
    componentes: ['Batería original', 'Pantalla original', 'Glass original'],
    notas: 'Marco con una marca leve en la esquina inferior. Cámaras y carga inalámbrica verificadas.',
    especificaciones: [
      { etiqueta: 'Pantalla', valor: '6.1″ Dynamic AMOLED 2X · 120 Hz' },
      { etiqueta: 'Procesador', valor: 'Snapdragon 8 Gen 1 / Exynos 2200' },
      { etiqueta: 'Memoria', valor: '8 GB RAM · 128 GB' },
      { etiqueta: 'Cámaras', valor: '50 MP + 12 MP + 10 MP · frontal 10 MP' },
      { etiqueta: 'Batería', valor: '3.700 mAh · carga 25 W · inalámbrica 15 W' },
      { etiqueta: 'Protección', valor: 'IP68 · Gorilla Glass Victus+' },
      { etiqueta: 'Sistema', valor: 'Android · One UI' },
      { etiqueta: 'Conectividad', valor: '5G · Wi-Fi 6 · Bluetooth 5.2 · NFC' },
    ],
  },
  {
    id: 'ZT-0281', modelo: 'iPhone 12', almacenamiento: '64 GB', ram: '4 GB', color: 'Azul',
    estadoEstetico: '8.5/10', bateria: 84, precio: 3100, costo: 2450, estado: 'Reservado',
    imagen: iphone12, red: '5G · Nano-SIM + eSIM', garantia: '60 días', accesorios: 'Cable Lightning',
    imei: '353910•••••1278', componentes: ['Batería original', 'Glass cambiado', 'Pantalla original'],
    notas: 'Face ID y True Tone activos. Reserva vigente hasta el viernes a las 18:00.',
    especificaciones: [
      { etiqueta: 'Pantalla', valor: '6.1″ Super Retina XDR OLED' },
      { etiqueta: 'Procesador', valor: 'Apple A14 Bionic' },
      { etiqueta: 'Memoria', valor: '4 GB RAM · 64 GB' },
      { etiqueta: 'Cámaras', valor: 'Dual 12 MP · frontal TrueDepth 12 MP' },
      { etiqueta: 'Batería', valor: 'Hasta 17 h de video · MagSafe 15 W' },
      { etiqueta: 'Protección', valor: 'IP68 · Ceramic Shield' },
      { etiqueta: 'Sistema', valor: 'iOS' },
      { etiqueta: 'Conectividad', valor: '5G · Wi-Fi 6 · Bluetooth 5.0 · NFC' },
    ],
  },
  {
    id: 'ZT-0279', modelo: 'Xiaomi 12 Lite', almacenamiento: '256 GB', ram: '8 GB', color: 'Negro',
    estadoEstetico: '9/10', bateria: 91, precio: 1750, costo: 1350, estado: 'Disponible',
    imagen: xiaomi12Lite, red: '5G · Dual SIM', garantia: '90 días', accesorios: 'Caja y cargador 67 W',
    imei: '867541•••••9054', componentes: ['Batería original', 'Pantalla cambiada AMOLED', 'Tapa original'],
    notas: 'Pantalla AMOLED compatible instalada y calibrada. Se entrega con cargador original.',
    especificaciones: [
      { etiqueta: 'Pantalla', valor: '6.55″ AMOLED · 120 Hz · Dolby Vision' },
      { etiqueta: 'Procesador', valor: 'Snapdragon 778G 5G' },
      { etiqueta: 'Memoria', valor: '8 GB RAM · 256 GB' },
      { etiqueta: 'Cámaras', valor: '108 MP + 8 MP + 2 MP · frontal 32 MP' },
      { etiqueta: 'Batería', valor: '4.300 mAh · carga rápida 67 W' },
      { etiqueta: 'Protección', valor: 'Gorilla Glass 5' },
      { etiqueta: 'Sistema', valor: 'Android · MIUI' },
      { etiqueta: 'Conectividad', valor: '5G · Wi-Fi 6 · Bluetooth 5.2 · NFC' },
    ],
  },
  {
    id: 'ZT-0274', modelo: 'Samsung Galaxy A54 5G', almacenamiento: '128 GB', ram: '8 GB',
    color: 'Awesome Lime', estadoEstetico: '8/10', bateria: 86, precio: 1850, costo: 1420,
    estado: 'Vendido', imagen: galaxyA54, red: '5G · Dual SIM', garantia: '90 días',
    accesorios: 'Solo equipo', imei: '352099•••••6603',
    componentes: ['Batería cambiada', 'Pantalla original', 'Glass original'],
    notas: 'Vendido. Conservar fotografías internas y diagnóstico para atención de garantía.',
    especificaciones: [
      { etiqueta: 'Pantalla', valor: '6.4″ Super AMOLED · 120 Hz' },
      { etiqueta: 'Procesador', valor: 'Exynos 1380' },
      { etiqueta: 'Memoria', valor: '8 GB RAM · 128 GB · microSD' },
      { etiqueta: 'Cámaras', valor: '50 MP + 12 MP + 5 MP · frontal 32 MP' },
      { etiqueta: 'Batería', valor: '5.000 mAh · carga 25 W' },
      { etiqueta: 'Protección', valor: 'IP67 · Gorilla Glass 5' },
      { etiqueta: 'Sistema', valor: 'Android · One UI' },
      { etiqueta: 'Conectividad', valor: '5G · Wi-Fi 6 · Bluetooth 5.3 · NFC' },
    ],
  },
]
