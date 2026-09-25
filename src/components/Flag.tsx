import { GROUND_H } from '../game/constants'

export function Flag({ x, reached }: { x: number; reached: boolean }) {
  return (
    <div className="absolute" style={{ left: x, bottom: GROUND_H }}>
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-48 rounded-full blur-3xl transition-opacity duration-700"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent 70%)', opacity: reached ? 0.5 : 0.18 }}
      />
      <div className="absolute bottom-0 left-[-14px] h-4 w-10 rounded-sm bg-[#3b2f6b]" />
      <div className="absolute bottom-0 h-64 w-[6px] bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600" />
      <div className="flag-cloth absolute bottom-[196px] left-[6px] h-14 w-24 origin-left" />
      <div className="absolute bottom-[254px] left-[-5px] h-4 w-4 rotate-45 bg-gold shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
    </div>
  )
}
