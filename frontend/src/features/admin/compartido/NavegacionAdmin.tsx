import type { ModuloAdmin } from './tipos'

type Propiedades = {
  activo: ModuloAdmin
  alCambiar: (modulo: ModuloAdmin) => void
  alSalir: () => void
}

const modulos: Array<{ id: ModuloAdmin; icono: string; texto: string }> = [
  { id: 'celulares', icono: '▣', texto: 'Celulares' },
  { id: 'pantallas', icono: '▤', texto: 'Pantallas' },
]

export function NavegacionAdmin({ activo, alCambiar, alSalir }: Propiedades) {
  return (
    <aside className="sales-rail">
      <button className="sales-mark" type="button" onClick={alSalir} aria-label="Volver a la portada">
        <b>Z</b><span>ZION<br />TECH</span>
      </button>

      <nav aria-label="Módulos administrativos">
        {modulos.map((modulo) => (
          <button
            className={activo === modulo.id ? 'active' : ''}
            type="button"
            key={modulo.id}
            aria-current={activo === modulo.id ? 'page' : undefined}
            onClick={() => alCambiar(modulo.id)}
          >
            <i aria-hidden="true">{modulo.icono}</i>
            <span>{modulo.texto}</span>
          </button>
        ))}
      </nav>

      <div className="rail-user">
        <span>ZT</span>
        <div><b>Propietario</b><small>Administrador</small></div>
      </div>
    </aside>
  )
}
