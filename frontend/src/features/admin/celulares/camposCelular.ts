import type { CampoFormulario } from '../compartido/tipos'

export const camposCelular: CampoFormulario[] = [
  { nombre: 'modelo', etiqueta: 'Marca y modelo exactos', obligatorio: true },
  { nombre: 'almacenamiento', etiqueta: 'Almacenamiento', obligatorio: true },
  { nombre: 'ram', etiqueta: 'Memoria RAM', obligatorio: true },
  { nombre: 'color', etiqueta: 'Color', obligatorio: true },
  { nombre: 'estadoEstetico', etiqueta: 'Estado estético', obligatorio: true },
  { nombre: 'bateria', etiqueta: 'Salud de batería (%)', tipo: 'number', minimo: 0, maximo: 100, obligatorio: true },
  { nombre: 'precio', etiqueta: 'Precio de venta (Bs)', tipo: 'number', minimo: 0.01, obligatorio: true },
  { nombre: 'costo', etiqueta: 'Costo de compra (Bs)', tipo: 'number', minimo: 0, obligatorio: true },
  { nombre: 'imei', etiqueta: 'IMEI privado · 15 dígitos', obligatorio: true },
  { nombre: 'red', etiqueta: 'Red / conectividad', obligatorio: true },
  { nombre: 'garantia', etiqueta: 'Garantía ofrecida', obligatorio: true },
  { nombre: 'accesorios', etiqueta: 'Accesorios incluidos' },
  { nombre: 'glass', etiqueta: 'Glass', opciones: ['Original', 'Cambiado', 'Pendiente de verificar'] },
  { nombre: 'pantalla', etiqueta: 'Pantalla', opciones: ['Original', 'Cambiado', 'Pendiente de verificar'] },
  { nombre: 'bateriaComponente', etiqueta: 'Batería', opciones: ['Original', 'Cambiado', 'Pendiente de verificar'] },
  { nombre: 'notas', etiqueta: 'Observaciones y características adicionales', tipo: 'textarea' },
  { nombre: 'imagen', etiqueta: 'Fotografía de la unidad · JPG, PNG o WebP, hasta 3 MB', tipo: 'file' },
]
