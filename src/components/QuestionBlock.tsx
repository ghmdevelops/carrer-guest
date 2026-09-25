import { memo } from 'react'
import { BLOCK_SIZE, GROUND_H } from '../game/constants'
import type { LevelBlock } from '../game/level'
import type { TimelineEntry } from '../data/career'

interface Props {
  block: LevelBlock
  entry: TimelineEntry
  discovered: boolean
  register: (index: number, el: HTMLElement | null) => void
}

export const QuestionBlock = memo(function QuestionBlock({ block, entry, discovered, register }: Props) {
  const isBonus = entry.kind === 'bonus'

  return (
    <div
      className="absolute"
      style={{ left: block.x, bottom: GROUND_H + block.y, width: BLOCK_SIZE, height: BLOCK_SIZE }}
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-full blur-2xl transition-opacity duration-500"
        style={{ background: entry.accent, opacity: discovered ? 0.1 : 0.24 }}
      />
      <div
        ref={(el) => {
          register(block.index, el)
        }}
        className={`qblock absolute inset-0 grid place-items-center ${isBonus ? 'is-bonus' : ''} ${
          discovered ? 'is-used' : ''
        }`}
      >
        {discovered ? (
          <span className="font-pixel text-[9px]" style={{ color: entry.accent }}>
            {entry.badge}
          </span>
        ) : (
          <span className={`font-pixel text-[20px] ${isBonus ? 'text-white' : 'text-[#140f2e]'}`}>
            {isBonus ? '+' : '?'}
          </span>
        )}
      </div>
    </div>
  )
})
