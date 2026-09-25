import { memo, useEffect, useRef } from 'react'
import { BUG_H, BUG_SCALE, BUG_SPRITE_H, BUG_SPRITE_W, BUG_W, GROUND_H } from '../game/constants'
import { BUG_FRAMES } from '../game/sprite'
import type { LevelEnemy } from '../game/level'
import type { EnemyElements } from '../game/useGameEngine'

interface Props {
  enemy: LevelEnemy
  register: (index: number, elements: EnemyElements | null) => void
}

export const Enemy = memo(function Enemy({ enemy, register }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const sprite = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { index } = enemy
    if (root.current && sprite.current) register(index, { root: root.current, sprite: sprite.current })
    return () => register(index, null)
  }, [enemy, register])

  return (
    <div
      ref={root}
      className="absolute left-0 will-change-transform"
      style={{ bottom: GROUND_H, width: BUG_W, height: BUG_H }}
    >
      <div
        className="absolute rounded-[50%] bg-black/40 blur-[2px]"
        style={{ width: BUG_W + 10, height: 7, left: -5, bottom: -3 }}
      />
      <div
        className="absolute"
        style={{ left: (BUG_W - BUG_SPRITE_W) / 2, bottom: 0, width: BUG_SPRITE_W, height: BUG_SPRITE_H }}
      >
        <div
          ref={sprite}
          style={{
            width: BUG_SCALE,
            height: BUG_SCALE,
            boxShadow: BUG_FRAMES.walkA,
            transformOrigin: `${BUG_SPRITE_W / 2}px ${BUG_SPRITE_H}px`,
          }}
        />
      </div>
    </div>
  )
})
