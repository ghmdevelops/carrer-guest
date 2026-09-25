import { memo, useEffect, useRef } from 'react'
import { GROUND_H, POWERUP_SIZE } from '../game/constants'
import type { LevelPowerUp } from '../game/level'

interface Props {
  item: LevelPowerUp
  register: (index: number, el: HTMLElement | null) => void
}

const GLOW: Record<LevelPowerUp['kind'], string> = {
  coffee: 'rgba(251, 191, 36, 0.55)',
  shield: 'rgba(52, 211, 153, 0.55)',
  dino: 'rgba(34, 197, 94, 0.55)',
}

function CoffeeIcon() {
  return (
    <div className="relative size-full">
      <div className="absolute left-[9px] top-[2px] h-[6px] w-[2px] rounded-full bg-white/55" />
      <div className="absolute left-[16px] top-[1px] h-[7px] w-[2px] rounded-full bg-white/40" />
      <div className="absolute right-[3px] top-[14px] h-[9px] w-[8px] rounded-r-full border-[3px] border-l-0 border-void" />
      <div className="absolute left-[5px] top-[10px] h-[18px] w-[19px] rounded-b-[6px] border-[3px] border-void bg-gradient-to-b from-amber-50 to-amber-200" />
      <div className="absolute left-[8px] top-[13px] h-[4px] w-[13px] rounded-[2px] bg-amber-900" />
    </div>
  )
}

const SHIELD_CLIP = 'polygon(50% 0%, 100% 18%, 100% 58%, 50% 100%, 0% 58%, 0% 18%)'

function ShieldIcon() {
  return (
    <div className="relative size-full">
      <div className="absolute inset-[2px] bg-void" style={{ clipPath: SHIELD_CLIP }} />
      <div
        className="absolute inset-[5px] bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-700"
        style={{ clipPath: SHIELD_CLIP }}
      />
      <div className="absolute left-1/2 top-[9px] h-[13px] w-[3px] -translate-x-1/2 bg-void/70" />
      <div className="absolute left-1/2 top-[13px] h-[3px] w-[13px] -translate-x-1/2 bg-void/70" />
    </div>
  )
}

function EggIcon() {
  return (
    <div className="relative size-full">
      <div
        className="absolute inset-0 border-[3px] border-void bg-gradient-to-b from-white to-slate-300"
        style={{ borderRadius: '50% 50% 46% 46% / 62% 62% 38% 38%' }}
      />
      <span className="absolute left-[6px] top-[12px] size-[7px] rounded-full bg-green-500" />
      <span className="absolute right-[5px] top-[17px] size-[6px] rounded-full bg-green-500" />
      <span className="absolute bottom-[4px] left-[13px] size-[6px] rounded-full bg-green-500" />
    </div>
  )
}

export const PowerUp = memo(function PowerUp({ item, register }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { index } = item
    register(index, root.current)
    return () => register(index, null)
  }, [item, register])

  return (
    <div
      ref={root}
      className="powerup absolute left-0 will-change-transform"
      style={{ bottom: GROUND_H, width: POWERUP_SIZE, height: POWERUP_SIZE, opacity: 0 }}
    >
      <div
        className="pointer-events-none absolute -inset-3 rounded-full blur-lg"
        style={{ background: GLOW[item.kind] }}
      />
      <div className="powerup-bob relative size-full">
        {item.kind === 'coffee' && <CoffeeIcon />}
        {item.kind === 'shield' && <ShieldIcon />}
        {item.kind === 'dino' && <EggIcon />}
      </div>
    </div>
  )
})
