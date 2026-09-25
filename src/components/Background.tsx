import { GROUND_H } from '../game/constants'

export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora" />
      <div className="layer layer-stars" style={{ top: 0, height: '64%' }} />
      <div className="cloud-drift">
        <div className="layer layer-clouds" style={{ top: '8%', height: 130 }} />
      </div>
      <div className="layer layer-mountains" style={{ bottom: GROUND_H - 10, height: 280 }} />
      <div className="layer layer-city" style={{ bottom: GROUND_H - 6, height: 230 }} />
      <div className="layer layer-hills" style={{ bottom: GROUND_H - 14, height: 170 }} />
    </div>
  )
}
