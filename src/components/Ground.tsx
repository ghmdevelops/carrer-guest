import { GROUND_H } from '../game/constants'
import type { LevelProp } from '../game/level'

function Prop({ prop }: { prop: LevelProp }) {
  if (prop.kind === 'sign') {
    return (
      <div className="absolute flex flex-col items-center" style={{ left: prop.x, bottom: GROUND_H - 2 }}>
        <div className="grid h-11 w-20 place-items-center rounded-sm border-[3px] border-[#140f2e] bg-gradient-to-b from-[#5b4bb5] to-[#342a7a] shadow-[0_0_18px_rgba(124,58,237,0.35)]">
          <span className="font-pixel text-[11px] text-neon">{'>>'}</span>
        </div>
        <div className="h-14 w-2.5 bg-[#2b2158]" />
      </div>
    )
  }

  if (prop.kind === 'rock') {
    return (
      <div
        className="absolute rounded-t-[10px] bg-[#1b1440] shadow-[inset_0_3px_0_rgba(255,255,255,0.08)]"
        style={{
          left: prop.x,
          bottom: GROUND_H - 2,
          width: 46 * prop.scale,
          height: 26 * prop.scale,
        }}
      />
    )
  }

  return (
    <div
      className="absolute"
      style={{ left: prop.x, bottom: GROUND_H - 2, transform: `scale(${prop.scale})`, transformOrigin: 'bottom left' }}
    >
      <div className="flex items-end gap-[3px]">
        <div className="h-5 w-6 rounded-t-full bg-[#15803d]" />
        <div className="h-8 w-8 rounded-t-full bg-[#166534]" />
        <div className="h-4 w-5 rounded-t-full bg-[#15803d]" />
      </div>
    </div>
  )
}

export function Ground({ width, props: sceneProps }: { width: number; props: LevelProp[] }) {
  return (
    <>
      {sceneProps.map((prop, i) => (
        <Prop key={`${prop.kind}-${i}`} prop={prop} />
      ))}
      <div className="absolute bottom-0 left-0" style={{ width, height: GROUND_H }}>
        <div className="ground-body absolute inset-x-0 bottom-0" style={{ top: 14 }} />
        <div className="ground-teeth absolute inset-x-0" style={{ top: 14, height: 8 }} />
        <div className="ground-crust absolute inset-x-0 top-0" style={{ height: 14 }} />
      </div>
    </>
  )
}
