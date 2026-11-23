import workshopImage from '../../../assets/editorial/reparacion-real.jpg'
import usedPhoneImage from '../../../assets/editorial/celular-usado-real.jpg'
import screensImage from '../../../assets/screens/redmi-note-11-amoled.jpg'

export const servicios = [
  {
    number: '01',
    title: 'Reparamos tu celular',
    copy: 'Recibimos el equipo, identificamos la falla, te enviamos el presupuesto y registramos la entrega.',
    href: '#contacto',
    accion: 'Consultar',
    image: workshopImage,
    alt: 'Técnico revisando un celular abierto con un microscopio en el taller',
  },
  {
    number: '02',
    title: 'Celulares de medio uso',
    copy: 'Vendemos celulares de medio uso, revisados uno por uno, con fotografías reales, estado y precio claros.',
    href: '#celulares-disponibles',
    accion: 'Ver disponibles',
    image: usedPhoneImage,
    alt: 'Celular de medio uso visto desde la parte posterior',
  },
  {
    number: '03',
    title: 'Venta de pantallas',
    copy: 'Encuentra una pantalla compatible con tu modelo y consulta la tecnología, el marco, la disponibilidad y el precio.',
    href: '#contacto',
    accion: 'Consultar',
    image: screensImage,
    alt: 'Pantalla AMOLED de repuesto mostrada de frente y por la parte posterior con su marco y conectores',
  },
] as const

export const secciones = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'taller', label: 'Taller' },
  { id: 'contacto', label: 'Contacto' },
] as const
