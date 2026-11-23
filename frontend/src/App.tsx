import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import PaginaInicio from './features/public/inicio/PaginaInicio'
import './styles/site.css'

const AccesoAdmin = lazy(() => import('./features/admin/acceso/AccesoAdmin'))
const PanelAdmin = lazy(() => import('./features/admin/PanelAdmin'))
const CatalogoCelulares = lazy(() => import('./features/public/celulares/CatalogoCelulares'))

function limpiarRuta(ruta: string) {
  if (window.location.hash === ruta) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }
}

function App() {
  const [accesoAbierto, setAccesoAbierto] = useState(() => window.location.hash === '#administracion')
  const [panelAbierto, setPanelAbierto] = useState(() => window.location.hash === '#inventario')
  const [catalogoAbierto, setCatalogoAbierto] = useState(() => window.location.hash === '#celulares-disponibles')

  useEffect(() => {
    const actualizarVistaPublica = () => setCatalogoAbierto(window.location.hash === '#celulares-disponibles')
    window.addEventListener('hashchange', actualizarVistaPublica)
    return () => window.removeEventListener('hashchange', actualizarVistaPublica)
  }, [])

  const abrirAcceso = useCallback(() => {
    setAccesoAbierto(true)
    window.history.replaceState(null, '', '#administracion')
  }, [])

  const cerrarAcceso = useCallback(() => {
    setAccesoAbierto(false)
    limpiarRuta('#administracion')
  }, [])

  const abrirPanel = useCallback(() => {
    setAccesoAbierto(false)
    setPanelAbierto(true)
    window.history.replaceState(null, '', '#inventario')
  }, [])

  const cerrarPanel = useCallback(() => {
    setPanelAbierto(false)
    limpiarRuta('#inventario')
  }, [])

  if (panelAbierto) {
    return (
      <Suspense fallback={<div className="admin-loading" role="status">Cargando panel administrativo…</div>}>
        <PanelAdmin alSalir={cerrarPanel} />
      </Suspense>
    )
  }

  if (catalogoAbierto) {
    return (
      <Suspense fallback={<div className="admin-loading" role="status">Cargando celulares disponibles…</div>}>
        <CatalogoCelulares />
      </Suspense>
    )
  }

  return (
    <>
      <PaginaInicio alAbrirAdmin={abrirAcceso} />
      {accesoAbierto && (
        <Suspense fallback={<div className="admin-loading" role="status">Preparando acceso administrativo…</div>}>
          <AccesoAdmin abierto alCerrar={cerrarAcceso} alIngresar={abrirPanel} />
        </Suspense>
      )}
    </>
  )
}

export default App
