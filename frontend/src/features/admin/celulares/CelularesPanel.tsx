import { useCallback, useEffect, useMemo, useState } from 'react'
import sinFoto from '../../../assets/no-photo.svg'
import { NavegacionAdmin } from '../compartido/NavegacionAdmin'
import FormularioTaller from '../compartido/FormularioTaller'
import { useEstadoTemporal } from '../compartido/estadoTemporal'
import { crearCodigo, leerImagen, leerTexto, moneda, normalizarTelefono } from '../compartido/formatos'
import type { ModuloAdmin } from '../compartido/tipos'
import { camposCelular } from './camposCelular'
import { celularesIniciales } from './datosCelulares'
import type { Celular, EstadoCelular, VistaCelular } from './modelo'
import '../estilos/panel-admin.css'

type Propiedades = {
  alCambiarModulo: (modulo: ModuloAdmin) => void
  alSalir: () => void
}

const estados: Array<'Todos' | EstadoCelular> = ['Todos', 'Disponible', 'Reservado', 'Vendido']

function crearCelular(datos: FormData): Celular {
  const notas = leerTexto(datos, 'notas')
  const componente = (nombre: string, campo: string) => `${nombre}: ${leerTexto(datos, campo)}`

  return {
    id: crearCodigo('ZT'),
    modelo: leerTexto(datos, 'modelo'),
    almacenamiento: leerTexto(datos, 'almacenamiento'),
    ram: leerTexto(datos, 'ram'),
    color: leerTexto(datos, 'color'),
    estadoEstetico: leerTexto(datos, 'estadoEstetico'),
    bateria: Number(leerTexto(datos, 'bateria')),
    precio: Number(leerTexto(datos, 'precio')),
    costo: Number(leerTexto(datos, 'costo')),
    estado: 'Disponible',
    imagen: leerImagen(datos, sinFoto),
    componentes: [
      componente('Glass', 'glass'),
      componente('Pantalla', 'pantalla'),
      componente('Batería', 'bateriaComponente'),
    ],
    red: leerTexto(datos, 'red'),
    garantia: leerTexto(datos, 'garantia'),
    accesorios: leerTexto(datos, 'accesorios') || 'Sin accesorios',
    imei: leerTexto(datos, 'imei'),
    notas,
    especificaciones: [
      { etiqueta: 'Memoria', valor: `${leerTexto(datos, 'ram')} RAM · ${leerTexto(datos, 'almacenamiento')}` },
      { etiqueta: 'Red', valor: leerTexto(datos, 'red') },
      { etiqueta: 'Características adicionales', valor: notas || 'Pendientes de verificar' },
    ],
  }
}

export default function CelularesPanel({ alCambiarModulo, alSalir }: Propiedades) {
  const [celulares, setCelulares] = useEstadoTemporal('celulares', celularesIniciales)
  const [seleccionadoId, setSeleccionadoId] = useState(celularesIniciales[0].id)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'Todos' | EstadoCelular>('Todos')
  const [aviso, setAviso] = useState('')
  const [vista, setVista] = useState<VistaCelular>(null)
  const [registrando, setRegistrando] = useState(false)
  const [notas, setNotas] = useEstadoTemporal<Record<string, string>>(
    'notasCelulares',
    Object.fromEntries(celularesIniciales.map((celular) => [celular.id, celular.notas])),
  )

  const cerrarRegistro = useCallback(() => setRegistrando(false), [])
  const celular = celulares.find((item) => item.id === seleccionadoId) ?? celulares[0]
  const disponibles = celulares.filter((item) => item.estado === 'Disponible').length

  const filtrados = useMemo(() => celulares.filter((item) => {
    const texto = `${item.modelo} ${item.almacenamiento} ${item.id}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase()) && (filtro === 'Todos' || item.estado === filtro)
  }), [busqueda, celulares, filtro])

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
    const imei = leerTexto(datos, 'imei')
    if (!/^\d{15}$/.test(imei)) throw new Error('El IMEI debe contener 15 dígitos.')
    if (celulares.some((item) => item.imei === imei)) throw new Error('Ese IMEI ya está registrado.')

    const nuevo = crearCelular(datos)
    setCelulares((actuales) => [nuevo, ...actuales])
    setNotas((actuales) => ({ ...actuales, [nuevo.id]: nuevo.notas }))
    setSeleccionadoId(nuevo.id)
    setBusqueda('')
    setFiltro('Todos')
    cerrarRegistro()
    setAviso('Celular registrado en esta sesión.')
  }

  const seleccionar = (id: string) => {
    setSeleccionadoId(id)
    if (window.matchMedia('(max-width: 1050px)').matches) setVista('ficha')
  }

  const vender = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const cliente = leerTexto(datos, 'cliente')
    const telefono = leerTexto(datos, 'telefono')
    const precio = Number(leerTexto(datos, 'precioVenta'))

    if (!cliente || normalizarTelefono(telefono).length < 7 || !Number.isFinite(precio) || precio <= 0 || celular.estado === 'Vendido') {
      setAviso('Revisa el cliente, teléfono y precio.')
      setVista(null)
      return
    }

    setCelulares((actuales) => actuales.map((item) => (
      item.id === celular.id ? { ...item, estado: 'Vendido', precio } : item
    )))
    setAviso(`Venta registrada: ${celular.modelo} para ${cliente}, Bs ${moneda.format(precio)}. Se guardará definitivamente al conectar el backend.`)
    setVista(null)
  }

  const ficha = (
    <>
      <div className="detail-hero">
        <img src={celular.imagen} alt={`${celular.modelo} ${celular.color}`} />
        <div><span>{celular.estado}</span><b>Bs {moneda.format(celular.precio)}</b><small>{celular.color} · {celular.estadoEstetico}</small></div>
      </div>
      <div className="spec-sheet">
        {celular.especificaciones.map((dato) => <div key={dato.etiqueta}><span>{dato.etiqueta}</span><b>{dato.valor}</b></div>)}
      </div>
      <div className="unit-inspection">
        <h3>Estado de esta unidad</h3>
        <p><span>Salud de batería</span><b>{celular.bateria}%</b></p>
        <p><span>Red</span><b>{celular.red}</b></p>
        <p><span>Garantía ZION TECH</span><b>{celular.garantia}</b></p>
        <p><span>Accesorios</span><b>{celular.accesorios}</b></p>
      </div>
      <div className="detail-note"><span>Nota interna</span><p>{notas[celular.id]}</p></div>
      <button className="drawer-primary" type="button" disabled={celular.estado === 'Vendido'} onClick={() => setVista('venta')}>
        {celular.estado === 'Vendido' ? 'Este equipo ya fue vendido' : 'Vender este equipo'}
      </button>
    </>
  )

  return (
    <main className="sales-shell">
      <NavegacionAdmin activo="celulares" alCambiar={alCambiarModulo} alSalir={alSalir} />

      <section className="sales-workspace">
        <header className="sales-topbar">
          <div><p>Inventario de celulares</p><span>{disponibles} equipos disponibles hoy</span></div>
          <div className="sales-top-actions"><button type="button" onClick={() => setRegistrando(true)}>+ Registrar celular</button><button className="exit-dashboard" type="button" onClick={alSalir}>Salir</button></div>
        </header>

        <div className="inventory-toolbar">
          <label className="inventory-search"><span>Buscar</span><input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Marca, modelo o código" /></label>
          <div className="status-filters" aria-label="Filtrar inventario">
            {estados.map((estado) => <button className={filtro === estado ? 'active' : ''} aria-pressed={filtro === estado} type="button" key={estado} onClick={() => setFiltro(estado)}>{estado}</button>)}
          </div>
        </div>

        {aviso && <div className="dashboard-notice" role="status"><span>{aviso}</span><button type="button" onClick={() => setAviso('')}>Cerrar</button></div>}

        <div className="sales-grid">
          <section className="inventory-ledger" aria-label="Equipos registrados">
            <div className="ledger-head"><span>Equipo</span><span>Estado</span><span>Batería</span><span>Precio</span></div>
            {filtrados.length ? filtrados.map((item) => (
              <button className={`ledger-row ${celular.id === item.id ? 'selected' : ''}`} aria-pressed={celular.id === item.id} type="button" key={item.id} onClick={() => seleccionar(item.id)}>
                <span className="device-name"><small>{item.id}</small><b>{item.modelo}</b><em>{item.almacenamiento} · {item.color}</em></span>
                <span><i className={`status-dot ${item.estado.toLowerCase()}`} />{item.estado}</span>
                <span className="battery-value"><b>{item.bateria}%</b><i><u style={{ width: `${item.bateria}%` }} /></i></span>
                <span className="row-price"><b>Bs {moneda.format(item.precio)}</b><small>Ver ficha →</small></span>
              </button>
            )) : <div className="inventory-empty"><b>No encontramos equipos.</b><span>Prueba otra marca, modelo o estado.</span></div>}
          </section>

          <aside className="device-passport" aria-label={`Ficha de ${celular.modelo}`}>
            <div className="passport-photo"><img src={celular.imagen} alt={`${celular.modelo} ${celular.color}, imagen de referencia del modelo`} /><span>{celular.estado}</span><small>FOTO DE REFERENCIA · VERIFICAR UNIDAD</small></div>
            <div className="passport-title"><div><span>{celular.id}</span><h1>{celular.modelo}</h1><p>{celular.ram} RAM · {celular.almacenamiento} · {celular.color} · Estado {celular.estadoEstetico}</p></div></div>
            <div className="passport-price"><span>Precio publicado</span><b>Bs {moneda.format(celular.precio)}</b></div>
            <div className="passport-actions"><button type="button" onClick={() => setVista('ficha')}>Ficha completa</button><button className="sell-device" type="button" disabled={celular.estado === 'Vendido'} onClick={() => setVista('venta')}>{celular.estado === 'Vendido' ? 'Equipo vendido' : 'Vender equipo'}</button></div>
            <dl className="inspection-grid"><div><dt>Batería</dt><dd>{celular.bateria}%</dd></div><div><dt>Red</dt><dd>{celular.red}</dd></div><div><dt>Garantía</dt><dd>{celular.garantia}</dd></div><div><dt>Incluye</dt><dd>{celular.accesorios}</dd></div></dl>
            <div className="repair-record"><h2>Historial de componentes</h2>{celular.componentes.map((dato) => <p key={dato}><i />{dato}</p>)}</div>
            <div className="notes-record"><label htmlFor={`notas-${celular.id}`}>Notas internas</label><textarea id={`notas-${celular.id}`} value={notas[celular.id] ?? ''} onChange={(evento) => setNotas((actuales) => ({ ...actuales, [celular.id]: evento.target.value }))} /><button type="button" onClick={() => setAviso(`Notas de ${celular.modelo} guardadas temporalmente.`)}>Guardar notas</button></div>
            <div className="private-record"><span>Dato privado</span><b>IMEI {celular.imei}</b><small>Visible solo para personal autorizado</small></div>
          </aside>
        </div>
      </section>

      {vista && (
        <div className="device-overlay" role="dialog" aria-modal="true" aria-labelledby="detalle-celular-titulo">
          <button className="overlay-backdrop" type="button" onClick={() => setVista(null)} aria-label="Cerrar ventana" />
          <section className={`detail-drawer ${vista === 'venta' ? 'sale-drawer' : ''}`}>
            <header><div><span>{celular.id}</span><h2 id="detalle-celular-titulo">{vista === 'venta' ? 'Registrar venta' : celular.modelo}</h2><p>{vista === 'venta' ? `${celular.modelo} · ${celular.almacenamiento}` : 'Características del modelo y estado de esta unidad'}</p></div><button type="button" onClick={() => setVista(null)} aria-label="Cerrar">×</button></header>
            {vista === 'ficha' ? ficha : (
              <form className="sale-form" onSubmit={vender}>
                <div className="sale-summary"><img src={celular.imagen} alt="" /><div><b>{celular.modelo}</b><span>{celular.almacenamiento} · {celular.color}</span><strong>Bs {moneda.format(celular.precio)}</strong></div></div>
                <label><span>Cliente</span><input name="cliente" placeholder="Nombre completo" required /></label>
                <label><span>Teléfono</span><input name="telefono" type="tel" placeholder="Número de contacto" required /></label>
                <label><span>Precio final en Bs</span><input name="precioVenta" type="number" min="0.01" step="0.01" defaultValue={celular.precio} required /></label>
                <label><span>Método de pago</span><select name="metodoPago" defaultValue="Efectivo"><option>Efectivo</option><option>Transferencia</option><option>QR</option><option>Mixto</option></select></label>
                <label><span>Notas de la venta</span><textarea name="notasVenta" placeholder="Accesorios entregados, garantía u observaciones" /></label>
                <label className="sale-check"><input type="checkbox" required /><span>Confirmo que el IMEI y el estado del equipo fueron verificados.</span></label>
                <button className="drawer-primary" type="submit">Confirmar venta</button>
                <small>En esta etapa la venta se conserva hasta recargar la página. El backend añadirá el registro definitivo y el comprobante.</small>
              </form>
            )}
          </section>
        </div>
      )}

      {registrando && <FormularioTaller titulo="Registrar celular" campos={camposCelular} alCerrar={cerrarRegistro} alGuardar={registrar} />}
    </main>
  )
}
