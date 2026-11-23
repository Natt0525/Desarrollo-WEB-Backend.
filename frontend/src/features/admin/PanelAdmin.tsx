import { useEffect, useState } from 'react'
import CelularesPanel from './celulares/CelularesPanel'
import PantallasPanel from './pantallas/PantallasPanel'
import type { ModuloAdmin } from './compartido/tipos'

type Propiedades = { alSalir: () => void }

export default function PanelAdmin({ alSalir }: Propiedades) {
  const [modulo, setModulo] = useState<ModuloAdmin>('celulares')

  useEffect(() => {
    const barra = document.querySelector<HTMLElement>('.sales-rail nav')
    const boton = barra?.querySelector<HTMLElement>('button.active')
    if (barra && boton && window.innerWidth <= 860) {
      barra.scrollLeft = boton.offsetLeft - barra.offsetLeft - (barra.clientWidth - boton.clientWidth) / 2
    }
  }, [modulo])

  if (modulo === 'pantallas') {
    return <PantallasPanel alCambiarModulo={setModulo} alSalir={alSalir} />
  }

  return <CelularesPanel alCambiarModulo={setModulo} alSalir={alSalir} />
}
