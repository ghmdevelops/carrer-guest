import type { RefObject } from 'react'
import {
  DINO_SCALE,
  DINO_SPRITE_H,
  DINO_SPRITE_W,
  GROUND_H,
  PLAYER_H,
  PLAYER_W,
  SPRITE_H,
  SPRITE_SCALE,
  SPRITE_W,
} from '../game/constants'
import { DINO_FRAMES, FRAMES } from '../game/sprite'

interface Props {
  rootRef: RefObject<HTMLDivElement | null>
  spriteRef: RefObject<HTMLDivElement | null>
  spriteWrapRef: RefObject<HTMLDivElement | null>
  dinoRef: RefObject<HTMLDivElement | null>
  dinoSpriteRef: RefObject<HTMLDivElement | null>
  shieldRef: RefObject<HTMLDivElement | null>
}

export function Player({ rootRef, spriteRef, spriteWrapRef, dinoRef, dinoSpriteRef, shieldRef }: Props) {
  return (
    <div
      ref={rootRef}
      className="absolute left-0 will-change-transform"
      style={{ bottom: GROUND_H, width: PLAYER_W, height: PLAYER_H }}
    >
      <div
        className="absolute rounded-[50%] bg-black/45 blur-[3px]"
        style={{ width: PLAYER_W + 14, height: 9, left: -7, bottom: -5 }}
      />

      <div
        ref={shieldRef}
        className="shield-ring pointer-events-none absolute"
        style={{ left: -24, bottom: -10, width: PLAYER_W + 48, height: PLAYER_H + 30, opacity: 0 }}
      />

      <div
        ref={dinoRef}
        className="absolute"
        style={{
          display: 'none',
          left: (PLAYER_W - DINO_SPRITE_W) / 2,
          bottom: 0,
          width: DINO_SPRITE_W,
          height: DINO_SPRITE_H,
        }}
      >
        <div
          ref={dinoSpriteRef}
          style={{
            width: DINO_SCALE,
            height: DINO_SCALE,
            boxShadow: DINO_FRAMES.idle,
            transformOrigin: `${DINO_SPRITE_W / 2}px ${DINO_SPRITE_H}px`,
          }}
        />
      </div>

      <div
        ref={spriteWrapRef}
        className="absolute"
        style={{ left: (PLAYER_W - SPRITE_W) / 2, bottom: 0, width: SPRITE_W, height: SPRITE_H }}
      >
        <div
          ref={spriteRef}
          style={{
            width: SPRITE_SCALE,
            height: SPRITE_SCALE,
            boxShadow: FRAMES.idle,
            transformOrigin: `${SPRITE_W / 2}px ${SPRITE_H}px`,
          }}
        />
      </div>
    </div>
  )
}
