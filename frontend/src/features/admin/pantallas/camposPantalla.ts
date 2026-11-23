import type { CampoFormulario } from '../compartido/tipos'

export const camposPantalla: CampoFormulario[] = [
  { nombre: 'marca', etiqueta: 'Marca', obligatorio: true },
  { nombre: 'modelo', etiqueta: 'Modelo exacto', obligatorio: true },
  { nombre: 'compatibilidad', etiqueta: 'Códigos de modelos compatibles', obligatorio: true },
  { nombre: 'tecnologia', etiqueta: 'Tecnología', opciones: ['LCD', 'Incell', 'AMOLED'] },
  { nombre: 'marco', etiqueta: 'Marco', opciones: ['Con marco', 'Sin marco'] },
  { nombre: 'panelOriginal', etiqueta: 'Panel original con glass cambiado', opciones: ['No', 'Sí'] },
  { nombre: 'calidad', etiqueta: 'Calidad / procedencia del módulo', obligatorio: true },
  { nombre: 'stock', etiqueta: 'Unidades disponibles', tipo: 'number', minimo: 0, obligatorio: true },
  { nombre: 'precio', etiqueta: 'Precio unitario (Bs)', tipo: 'number', minimo: 0.01, obligatorio: true },
  { nombre: 'costo', etiqueta: 'Costo unitario (Bs)', tipo: 'number', minimo: 0, obligatorio: true },
  { nombre: 'proveedor', etiqueta: 'Proveedor · privado', obligatorio: true },
  { nombre: 'garantia', etiqueta: 'Cobertura de garantía', obligatorio: true },
  { nombre: 'ubicacion', etiqueta: 'Ubicación en almacén', obligatorio: true },
  { nombre: 'notas', etiqueta: 'Notas de prueba y compatibilidad', tipo: 'textarea' },
  { nombre: 'imagen', etiqueta: 'Foto exacta · JPG, PNG o WebP, hasta 3 MB', tipo: 'file' },
]
