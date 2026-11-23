import { useCallback, useEffect, useMemo, useState } from 'react'
import sinFoto from '../../../assets/no-photo.svg'
import { NavegacionAdmin } from '../compartido/NavegacionAdmin'
import FormularioTaller from '../compartido/FormularioTaller'
import { useEstadoTemporal } from '../compartido/estadoTemporal'
import { crearCodigo, leerImagen, leerTexto, moneda } from '../compartido/formatos'
import type { ModuloAdmin } from '../compartido/tipos'
import { camposPantalla } from './camposPantalla'
import { estadoStock, imagenPantalla, pantallasIniciales } from './datosPantallas'
import type { Pantalla, TecnologiaPantalla, VistaPantalla } from './modelo'
import '../estilos/panel-admin.css'
import '../estilos/pantallas.css'

type Propiedades = {
  alCambiarModulo: (modulo: ModuloAdmin) => void
  alSalir: () => void
}

const tecnologias: Array<'Todas' | TecnologiaPantalla> = ['Todas', 'LCD', 'Incell', 'AMOLED']

function crearPantalla(datos: FormData): Pantalla {
  const stock = Number(leerTexto(datos, 'stock'))
  if (!Number.isInteger(stock)) throw new Error('El stock debe ser un número entero.')

  return {
    id: crearCodigo('PT'),
    marca: leerTexto(datos, 'marca'),
    modelo: leerTexto(datos, 'modelo'),
    compatibilidad: leerTexto(datos, 'compatibilidad'),
    tecnologia: leerTexto(datos, 'tecnologia') as TecnologiaPantalla,
    tieneMarco: leerTexto(datos, 'marco') === 'Con marco',
    panelOriginal: leerTexto(datos, 'panelOriginal') === 'Sí',
    calidad: leerTexto(datos, 'calidad'),
    stock,
    precio: Number(leerTexto(datos, 'precio')),
    costo: Number(leerTexto(datos, 'costo')),
    proveedor: leerTexto(datos, 'proveedor'),
    garantia: leerTexto(datos, 'garantia'),
    ubicacion: leerTexto(datos, 'ubicacion'),
    notas: leerTexto(datos, 'notas'),
    imagen: leerImagen(datos, sinFoto),
  }
}

export default function PantallasPanel({ alCambiarModulo, alSalir }: Propiedades) {
  const [pantallas, setPantallas] = useEstadoTemporal('pantallas', pantallasIniciales)
  const [seleccionadaId, setSeleccionadaId] = useState(pantallasIniciales[0].id)
  const [busqueda, setBusqueda] = useState('')
  const [tecnologia, setTecnologia] = useState<'Todas' | TecnologiaPantalla>('Todas')
  const [vista, setVista] = useState<VistaPantalla>(null)
  const [aviso, setAviso] = useState('')
  const [registrando, setRegistrando] = useState(false)

  const cerrarRegistro = useCallback(() => setRegistrando(false), [])
  const pantalla = pantallas.find((item) => item.id === seleccionadaId) ?? pantallas[0]

  const filtradas = useMemo(() => pantallas.filter((item) => {
    const texto = `${item.marca} ${item.modelo} ${item.compatibilidad} ${item.id}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase()) && (tecnologia === 'Todas' || item.tecnologia === tecnologia)
  }), [busqueda, pantallas, tecnologia])

  const unidades = pantallas.reduce((total, item) => total + item.stock, 0)
  const stockBajo = pantallas.filter((item) => item.stock > 0 && item.stock <= 2).length
  const valorInventario = pantallas.reduce((total, item) => total + item.stock * item.costo, 0)

  useEffect(() => {
    if (!vista) return
    const desbordeAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const cerrarConEscape = (evento: KeyboardEvent) => evento.key === 'Escape' && setVista(null)
    window.addEventListener('keydown', cerrarConEscape)
    return () => {
      document.body.style.overflow = desbordeAnterior
      window.removeEventListener('keydown', cerrarConEscape)
    }
  }, [vista])

  const registrar = (datos: FormData) => {
    const nueva = crearPantalla(datos)
    setPantallas((actuales) => [nueva, ...actuales])
    setSeleccionadaId(nueva.id)
    setBusqueda('')
    setTecnologia('Todas')
    cerrarRegistro()
    setAviso('Pantalla registrada en esta sesión.')
  }

  const seleccionar = (id: string) => {
    setSeleccionadaId(id)
    if (window.matchMedia('(max-width: 1050px)').matches) setVista('ficha')
  }

  const vender = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const cantidad = Number(leerTexto(datos, 'cantidad'))
    const cliente = leerTexto(datos, 'cliente')
    const precio = Number(leerTexto(datos, 'precioVenta'))

    if (!cliente || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > pantalla.stock || !Number.isFinite(precio) || precio <= 0) {
      setAviso('Revisa la cantidad, el precio y el cliente.')
      setVista(null)
      return
    }

    setPantallas((actuales) => actuales.map((item) => (
      item.id === pantalla.id ? { ...item, stock: item.stock - cantidad } : item
    )))
    setAviso(`Venta registrada: ${cantidad} pantalla${cantidad > 1 ? 's' : ''} para ${cliente}, Bs ${moneda.format(precio * cantidad)}.`)
    setVista(null)
  }

  const ficha = (
    <>
      <div className="screen-detail-hero">
        <div className="screen-photo"><img src={imagenPantalla(pantalla)} alt={`Pantalla de repuesto compatible con ${pantalla.modelo}`} /><span>{pantalla.tecnologia}</span></div>
        <div><small>{pantalla.id} · {pantalla.marca}</small><h2>{pantalla.modelo}</h2><p>{pantalla.calidad}</p><b>Bs {moneda.format(pantalla.precio)}</b></div>
      </div>
      <div className="screen-facts">
        <div><span>Compatibilidad</span><b>{pantalla.compatibilidad}</b></div>
        <div><span>Presentación</span><b>{pantalla.tieneMarco ? 'Con marco' : 'Sin marco'}</b></div>
        <div><span>Procedencia del panel</span><b>{pantalla.panelOriginal ? 'Panel original con glass cambiado' : pantalla.calidad}</b></div>
        <div><span>Disponibilidad</span><b>{pantalla.stock} unidades · {estadoStock(pantalla.stock)}</b></div>
      </div>
      <section className="screen-private">
        <div><span>Proveedor privado</span><b>{pantalla.proveedor}</b></div>
        <div><span>Cobertura</span><b>{pantalla.garantia}</b></div>
        <div><span>Ubicación</span><b>{pantalla.ubicacion}</b></div>
      </section>
      <div className="screen-note"><span>Control antes de instalar</span><p>{pantalla.notas}</p></div>
      <button className="drawer-primary" type="button" disabled={pantalla.stock === 0} onClick={() => setVista('venta')}>
        {pantalla.stock === 0 ? 'Sin stock para vender' : 'Vender esta pantalla'}
      </button>
    </>
  )

  return (
    <main className="sales-shell screen-shell">
      <NavegacionAdmin activo="pantallas" alCambiar={alCambiarModulo} alSalir={alSalir} />

      <section className="sales-workspace screen-workspace">
        <header className="sales-topbar">
          <div><p>Venta de pantallas</p><span>Compatibilidad y stock listos para mostrador</span></div>
          <div className="sales-top-actions"><button type="button" onClick={() => setRegistrando(true)}>+ Registrar pantalla</button><button className="exit-dashboard" type="button" onClick={alSalir}>Salir</button></div>
        </header>

        <section className="screen-totals" aria-label="Resumen del inventario">
          <div><span>Unidades disponibles</span><b>{unidades}</b></div>
          <div><span>Referencias con stock bajo</span><b>{stockBajo}</b></div>
          <div><span>Valor invertido</span><b>Bs {moneda.format(valorInventario)}</b></div>
        </section>

        <div className="inventory-toolbar screen-toolbar">
          <label className="inventory-search"><span>Buscar</span><input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Marca, modelo o código compatible" /></label>
          <div className="status-filters" aria-label="Filtrar por tecnología">
            {tecnologias.map((opcion) => <button className={tecnologia === opcion ? 'active' : ''} aria-pressed={tecnologia === opcion} type="button" key={opcion} onClick={() => setTecnologia(opcion)}>{opcion}</button>)}
          </div>
        </div>

        {aviso && <div className="dashboard-notice" role="status"><span>{aviso}</span><button type="button" onClick={() => setAviso('')}>Cerrar</button></div>}

        <div className="screen-layout">
          <section className="screen-catalog" aria-label="Pantallas registradas">
            <div className="catalog-heading"><span>{filtradas.length} referencias</span><span>Selecciona una pieza para revisar o vender</span></div>
            {filtradas.length ? filtradas.map((item) => (
              <button className={`screen-row technology-${item.tecnologia.toLowerCase()} ${pantalla.id === item.id ? 'selected' : ''}`} aria-pressed={pantalla.id === item.id} type="button" key={item.id} onClick={() => seleccionar(item.id)}>
                <span className="screen-thumb"><img src={imagenPantalla(item)} alt={`Módulo de pantalla para ${item.modelo}`} /><i>{item.tecnologia}</i></span>
                <span className="screen-identity"><small>{item.id} · {item.marca}</small><b>{item.modelo}</b><em>{item.compatibilidad}</em><u>{item.tieneMarco ? 'Con marco' : 'Sin marco'}{item.panelOriginal ? ' · panel original' : ''}</u></span>
                <span className={`screen-stock ${item.stock === 0 ? 'out' : item.stock <= 2 ? 'low' : ''}`}><i />{item.stock} u.<small>{estadoStock(item.stock)}</small></span>
                <span className="screen-price"><b>Bs {moneda.format(item.precio)}</b><small>Ver ficha →</small></span>
              </button>
            )) : <div className="inventory-empty"><b>No encontramos pantallas.</b><span>Prueba otro modelo o tecnología.</span></div>}
          </section>

          <aside className="screen-inspector" aria-label={`Ficha de ${pantalla.modelo}`}>{ficha}</aside>
        </div>
      </section>

      {vista && (
        <div className="device-overlay" role="dialog" aria-modal="true" aria-labelledby="detalle-pantalla-titulo">
          <button className="overlay-backdrop" type="button" onClick={() => setVista(null)} aria-label="Cerrar ventana" />
          <section className="detail-drawer screen-drawer">
            <header><div><span>{pantalla.id}</span><h2 id="detalle-pantalla-titulo">{vista === 'venta' ? 'Registrar venta' : pantalla.modelo}</h2><p>{vista === 'venta' ? `${pantalla.marca} · ${pantalla.tecnologia}` : 'Compatibilidad, calidad y datos privados de esta pieza'}</p></div><button type="button" onClick={() => setVista(null)} aria-label="Cerrar">×</button></header>
            {vista === 'ficha' ? ficha : (
              <form className="sale-form screen-sale-form" onSubmit={vender}>
                <div className="sale-summary"><img src={imagenPantalla(pantalla)} alt={`Pantalla para ${pantalla.modelo}`} /><div><b>{pantalla.modelo}</b><span>{pantalla.tecnologia} · {pantalla.tieneMarco ? 'con marco' : 'sin marco'}</span><strong>Bs {moneda.format(pantalla.precio)}</strong></div></div>
                <label><span>Cliente</span><input name="cliente" placeholder="Nombre completo" required /></label>
                <div className="sale-form-pair"><label><span>Cantidad</span><input name="cantidad" type="number" min="1" max={pantalla.stock} defaultValue="1" required /></label><label><span>Precio unitario en Bs</span><input name="precioVenta" type="number" min="0.01" step="0.01" defaultValue={pantalla.precio} required /></label></div>
                <label><span>Destino</span><select name="destino" defaultValue="Venta de repuesto"><option>Venta de repuesto</option></select></label>
                <label><span>Método de pago</span><select name="metodoPago" defaultValue="Efectivo"><option>Efectivo</option><option>QR</option><option>Transferencia</option><option>Mixto</option></select></label>
                <label><span>Observaciones</span><textarea name="notas" placeholder="Prueba realizada, garantía o técnico responsable" /></label>
                <label className="sale-check"><input type="checkbox" required /><span>Confirmo que modelo, tecnología y flex fueron verificados antes de entregar.</span></label>
                <button className="drawer-primary" type="submit">Confirmar venta y descontar stock</button>
                <small>La venta quedará registrada con su movimiento, garantía y proveedor.</small>
              </form>
            )}
          </section>
        </div>
      )}

      {registrando && <FormularioTaller titulo="Registrar pantalla" campos={camposPantalla} alCerrar={cerrarRegistro} alGuardar={registrar} />}
    </main>
  )
}
