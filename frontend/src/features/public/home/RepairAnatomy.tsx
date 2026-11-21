import { useEffect, useRef, useState } from 'react'
import openingImage from '../../../assets/anatomy/01-apertura.jpg'
import disconnectImage from '../../../assets/anatomy/02-desconexion.jpg'
import boardImage from '../../../assets/anatomy/03-placa.jpg'
import extractionImage from '../../../assets/anatomy/04-extraccion.jpg'

const stages = [
  {
    index: '01', label: 'Apertura', title: 'Acceso sin forzar el equipo',
    description: 'Se separa la tapa siguiendo la línea real del adhesivo y se documenta el estado de recepción.',
    readout: 'Tapa liberada · chasis expuesto', image: openingImage, position: '50% 54%',
  },
  {
    index: '02', label: 'Aislamiento', title: 'Primero se corta la energía',
    description: 'La batería se desconecta antes de intervenir cámaras, flex o placa para proteger los circuitos.',
    readout: 'Batería aislada · zona segura', image: disconnectImage, position: '54% 50%',
  },
  {
    index: '03', label: 'Diagnóstico', title: 'Cada tornillo deja una señal',
    description: 'La inspección revela blindajes, conectores, humedad, golpes y piezas que ya fueron manipuladas.',
    readout: 'Placa visible · 3 fijaciones', image: boardImage, position: '50% 50%',
  },
  {
    index: '04', label: 'Intervención', title: 'La placa sale como un conjunto',
    description: 'La extracción controlada mantiene libres los flex y conserva el historial físico del dispositivo.',
    readout: 'Placa principal · extracción', image: extractionImage, position: '50% 50%',
  },
] as const

function RepairAnatomy() {
  const [active, setActive] = useState(2)
  const [touring, setTouring] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const frame = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const stage = stages[active]

  useEffect(() => {
    if (!touring || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % stages.length), 5200)
    return () => window.clearInterval(timer)
  }, [touring])

  const choose = (index: number) => {
    setTouring(false)
    setActive(index)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (active + 1) % stages.length
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (active - 1 + stages.length) % stages.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = stages.length - 1
    if (nextIndex !== null) {
      event.preventDefault()
      choose(nextIndex)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="anatomy-station" ref={frame} role="group"
      aria-label="Desmontaje real de un teléfono en cuatro etapas">
      <div className="station-topline">
        <span className="station-live"><i /> REGISTRO REAL</span>
      </div>

      <div className="station-viewport" id="anatomy-panel" role="tabpanel"
        aria-labelledby={`anatomy-tab-${active}`} tabIndex={0}>
        {stages.map((item, index) => (
          <img key={item.index} className={`${index === active ? 'active' : ''}${index >= 2 ? ' mirrored' : ''}`} src={item.image}
            alt={index === active ? `${item.label}: ${item.title}` : ''} aria-hidden={index !== active}
            style={{ objectPosition: item.position }} />
        ))}
        <div className="station-shade" aria-hidden="true" />
        <div className="focus-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="station-counter" aria-hidden="true"><strong>{stage.index}</strong><span>/ 04</span></div>
        <div className="station-caption" aria-live="polite">
          <span>{stage.label}</span><h2>{stage.title}</h2><p>{stage.description}</p>
        </div>
      </div>

      <div className="station-controls">
        <div className="stage-list" role="tablist" aria-label="Etapas del desmontaje" onKeyDown={onKeyDown}>
          {stages.map((item, index) => (
            <button key={item.index} ref={(element) => { tabRefs.current[index] = element }} type="button"
              id={`anatomy-tab-${index}`} role="tab" aria-selected={index === active}
              aria-controls="anatomy-panel" tabIndex={index === active ? 0 : -1}
              className={index === active ? 'active' : ''} onClick={() => choose(index)}>
              <span>{item.index}</span><strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <div className="station-readout">
          <div><span>ESTADO</span><strong>{stage.readout}</strong></div>
          <button type="button" className="tour-toggle" aria-pressed={!touring}
            onClick={() => setTouring((current) => !current)}>
            {touring ? 'Pausar recorrido' : 'Reanudar recorrido'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepairAnatomy
