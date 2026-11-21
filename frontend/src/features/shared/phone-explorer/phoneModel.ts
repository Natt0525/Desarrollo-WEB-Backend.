export type PhonePartId =
  | 'cover'
  | 'frame'
  | 'battery'
  | 'mainboard'
  | 'rearCameras'
  | 'frontCamera'
  | 'usb'
  | 'speaker'
  | 'vibration'
  | 'flex'
  | 'oled'
  | 'touch'
  | 'glass'

export type PhonePart = {
  id: PhonePartId
  index: string
  name: string
  shortName: string
  description: string
  material: string
  offset: [number, number, number]
  order: number
}

export const PHONE_PARTS: PhonePart[] = [
  {
    id: 'cover',
    index: '01',
    name: 'Tapa trasera',
    shortName: 'Tapa trasera',
    description: 'Cierra el conjunto y protege los módulos internos.',
    material: 'Polímero mate',
    offset: [0.35, 0.1, -4.8],
    order: 0,
  },
  {
    id: 'rearCameras',
    index: '02',
    name: 'Cámaras traseras',
    shortName: 'Cámaras',
    description: 'Capturan la imagen y conectan directamente con la placa principal.',
    material: 'Vidrio óptico',
    offset: [-3.65, 2.25, 1.75],
    order: 1,
  },
  {
    id: 'mainboard',
    index: '03',
    name: 'Placa principal',
    shortName: 'Placa principal',
    description: 'Coordina el procesador, la memoria, las cámaras y las comunicaciones.',
    material: 'PCB + blindajes',
    offset: [-3.75, 0.55, 1.25],
    order: 2,
  },
  {
    id: 'frontCamera',
    index: '04',
    name: 'Cámara frontal',
    shortName: 'Cámara frontal',
    description: 'Se alinea con la perforación circular de la pantalla.',
    material: 'Vidrio óptico',
    offset: [3.4, 2.65, 2.2],
    order: 3,
  },
  {
    id: 'battery',
    index: '05',
    name: 'Batería',
    shortName: 'Batería',
    description: 'Almacena la energía y ocupa el centro estructural del equipo.',
    material: 'Celda Li-ion',
    offset: [3.9, 0.35, 1.1],
    order: 4,
  },
  {
    id: 'vibration',
    index: '06',
    name: 'Motor de vibración',
    shortName: 'Vibración',
    description: 'Produce la respuesta háptica para avisos y pulsaciones.',
    material: 'Acero',
    offset: [-3.2, -2.15, 1.6],
    order: 5,
  },
  {
    id: 'speaker',
    index: '07',
    name: 'Altavoz',
    shortName: 'Altavoz',
    description: 'Convierte la señal eléctrica en sonido desde la cámara inferior.',
    material: 'Polímero acústico',
    offset: [3.45, -2.45, 1.75],
    order: 6,
  },
  {
    id: 'usb',
    index: '08',
    name: 'Módulo USB-C',
    shortName: 'USB-C',
    description: 'Gestiona la carga y se alinea con la abertura inferior del marco.',
    material: 'PCB + acero',
    offset: [0.1, -3.9, 1.85],
    order: 7,
  },
  {
    id: 'flex',
    index: '09',
    name: 'Cables flex',
    shortName: 'Cables flex',
    description: 'Unen pantalla, batería y módulos mediante pistas de cobre flexibles.',
    material: 'Cobre flexible',
    offset: [-0.35, 2.95, 2.1],
    order: 8,
  },
  {
    id: 'frame',
    index: '10',
    name: 'Marco y chasis',
    shortName: 'Marco',
    description: 'Sostiene cada pieza y conserva su posición original durante la apertura.',
    material: 'Aluminio satinado',
    offset: [0, 0, 0],
    order: 9,
  },
  {
    id: 'oled',
    index: '11',
    name: 'Panel OLED',
    shortName: 'Panel OLED',
    description: 'Genera luz y color píxel a píxel sin retroiluminación.',
    material: 'OLED',
    offset: [-2.15, -0.2, 3.45],
    order: 10,
  },
  {
    id: 'touch',
    index: '12',
    name: 'Capa táctil',
    shortName: 'Capa táctil',
    description: 'Detecta dónde tocas la pantalla y transmite la posición al sistema.',
    material: 'Film capacitivo',
    offset: [0, 0.05, 4.65],
    order: 11,
  },
  {
    id: 'glass',
    index: '13',
    name: 'Vidrio protector',
    shortName: 'Vidrio',
    description: 'Protege el panel y aporta la superficie reflectante del frente.',
    material: 'Vidrio reforzado',
    offset: [2.25, 0.25, 5.8],
    order: 12,
  },
]

export const PART_BY_ID = Object.fromEntries(
  PHONE_PARTS.map((part) => [part.id, part]),
) as Record<PhonePartId, PhonePart>

