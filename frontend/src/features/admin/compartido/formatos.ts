export const moneda = new Intl.NumberFormat('es-BO')

export function leerTexto(datos: FormData, campo: string) {
  return String(datos.get(campo) ?? '').trim()
}

export function crearCodigo(prefijo: string) {
  return `${prefijo}-${crypto.randomUUID().slice(0, 8)}`
}

export function normalizarTelefono(telefono: string) {
  return telefono.replace(/\D/g, '').replace(/^591/, '')
}

export function leerImagen(datos: FormData, imagenAlternativa: string) {
  const archivo = datos.get('imagen')

  if (!(archivo instanceof File) || !archivo.size) return imagenAlternativa

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
  const tamanoMaximo = 3 * 1024 * 1024

  if (!tiposPermitidos.includes(archivo.type) || archivo.size > tamanoMaximo) {
    throw new Error('Usa una imagen JPG, PNG o WebP de hasta 3 MB.')
  }

  return URL.createObjectURL(archivo)
}
