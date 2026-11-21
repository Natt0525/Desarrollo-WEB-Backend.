import { lazy, Suspense, useCallback, useState } from 'react'
import HomePage from './features/public/home/HomePage'
import './styles/site.css'

const AdminLogin = lazy(() => import('./features/admin/auth/AdminLogin'))
const AdminWorkspace = lazy(() => import('./features/admin/AdminWorkspace'))

function clearHash(hash: string) {
  if (window.location.hash === hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }
}

function App() {
  const [loginOpen, setLoginOpen] = useState(() => window.location.hash === '#administracion')
  const [adminOpen, setAdminOpen] = useState(() => window.location.hash === '#inventario')

  const openLogin = useCallback(() => {
    setLoginOpen(true)
    window.history.replaceState(null, '', '#administracion')
  }, [])

  const closeLogin = useCallback(() => {
    setLoginOpen(false)
    clearHash('#administracion')
  }, [])

  const openAdmin = useCallback(() => {
    setLoginOpen(false)
    setAdminOpen(true)
    window.history.replaceState(null, '', '#inventario')
  }, [])

  const closeAdmin = useCallback(() => {
    setAdminOpen(false)
    clearHash('#inventario')
  }, [])

  if (adminOpen) {
    return (
      <Suspense fallback={<div className="admin-loading" role="status">Cargando panel administrativo…</div>}>
        <AdminWorkspace onExit={closeAdmin} />
      </Suspense>
    )
  }

  return (
    <>
      <HomePage onOpenAdmin={openLogin} />
      {loginOpen && (
        <Suspense fallback={<div className="admin-loading" role="status">Preparando acceso administrativo…</div>}>
          <AdminLogin open onClose={closeLogin} onEnter={openAdmin} />
        </Suspense>
      )}
    </>
  )
}

export default App
