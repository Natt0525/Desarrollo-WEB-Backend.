import { useEffect, useRef, useState } from 'react'
import openingImage from '../../../assets/anatomy/01-apertura.jpg'
import disconnectImage from '../../../assets/anatomy/02-desconexion.jpg'
import boardImage from '../../../assets/anatomy/03-placa.jpg'
import extractionImage from '../../../assets/anatomy/04-extraccion.jpg'

const etapas = [
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

function AnatomiaReparacion() {
  const [activa, setActiva] = useState(2)
  const [recorrido, setRecorrido] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const marcoRef = useRef<HTMLDivElement>(null)
  const pestanasRef = useRef<Array<HTMLButtonElement | null>>([])
  const etapa = etapas[activa]

  useEffect(() => {
    if (!recorrido || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const temporizador = window.setInterval(() => setActiva((actual) => (actual + 1) % etapas.length), 5200)
    return () => window.clearInterval(temporizador)
  }, [recorrido])

  const elegir = (indice: number) => {
    setRecorrido(false)
    setActiva(indice)
  }

  const controlarTeclado = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    let siguiente: number | null = null
    if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
      siguiente = (activa + 1) % etapas.length
    }
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
      siguiente = (activa - 1 + etapas.length) % etapas.length
    }
    if (evento.key === 'Home') siguiente = 0
    if (evento.key === 'End') siguiente = etapas.length - 1
    if (siguiente !== null) {
      evento.preventDefault()
      elegir(siguiente)
      pestanasRef.current[siguiente]?.focus()
    }
  }

  return (
    <div className="anatomy-station" ref={marcoRef} role="group"
      aria-label="Desmontaje real de un teléfono en cuatro etapas">
      <div className="station-topline">
        <span className="station-live"><i /> REGISTRO REAL</span>
      </div>

      <div className="station-viewport" id="anatomy-panel" role="tabpanel"
        aria-labelledby={`anatomy-tab-${activa}`} tabIndex={0}>
        {etapas.map((item, indice) => (
          <img key={item.index} className={indice === activa ? 'active' : ''} src={item.image}
            alt={indice === activa ? `${item.label}: ${item.title}` : ''} aria-hidden={indice !== activa}
            style={{ objectPosition: item.position }} />
        ))}
        <div className="station-shade" aria-hidden="true" />
        <div className="focus-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="station-counter" aria-hidden="true"><strong>{etapa.index}</strong><span>/ 04</span></div>
        <div className="station-caption" aria-live="polite">
          <span>{etapa.label}</span><h2>{etapa.title}</h2><p>{etapa.description}</p>
        </div>
      </div>

      <div className="station-controls">
        <div className="stage-list" role="tablist" aria-label="Etapas del desmontaje" onKeyDown={controlarTeclado}>
          {etapas.map((item, indice) => (
            <button key={item.index} ref={(elemento) => { pestanasRef.current[indice] = elemento }} type="button"
              id={`anatomy-tab-${indice}`} role="tab" aria-selected={indice === activa}
              aria-controls="anatomy-panel" tabIndex={indice === activa ? 0 : -1}
              className={indice === activa ? 'active' : ''} onClick={() => elegir(indice)}>
              <span>{item.index}</span><strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <div className="station-readout">
          <div><span>ESTADO</span><strong>{etapa.readout}</strong></div>
          <button type="button" className="tour-toggle" aria-pressed={!recorrido}
            onClick={() => setRecorrido((actual) => !actual)}>
            {recorrido ? 'Pausar recorrido' : 'Reanudar recorrido'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnatomiaReparacion
