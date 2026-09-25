import type { EntryKind } from '../data/career'
import {
  BLOCK_BOTTOM,
  BLOCK_SIZE,
  BLOCK_SPACING,
  BUG_SPEED,
  BUG_W,
  FIRST_BLOCK_X,
  FLAG_OFFSET,
  LEVEL_TAIL,
  POWERUP_SIZE,
} from './constants'

export interface LevelBlock {
  index: number
  x: number
  y: number
  kind: EntryKind
}

export interface LevelCoin {
  index: number
  x: number
  y: number
}

export interface LevelEnemy {
  index: number
  from: number
  to: number
  speed: number
}

export interface LevelProp {
  kind: 'bush' | 'rock' | 'sign'
  x: number
  scale: number
}

export type PowerUpKind = 'coffee' | 'shield' | 'dino'

export interface LevelPowerUp {
  index: number
  blockIndex: number
  kind: PowerUpKind
  x: number
  y: number
}

export interface Level {
  blocks: LevelBlock[]
  coins: LevelCoin[]
  enemies: LevelEnemy[]
  powerUps: LevelPowerUp[]
  props: LevelProp[]
  flagX: number
  width: number
}

const COIN_ARC = [44, 92, 118, 92, 44]
const PATROL_CENTER = 520
const PATROL_RANGE = 90

// Nem todo bloco solta item. O dino sai cedo para o jogador aproveitar a fase
// inteira montado; o escudo e o segundo cafe ficam no meio.
function powerUpFor(index: number, total: number): PowerUpKind | null {
  if (index === 1) return 'coffee'
  if (index === 2) return 'dino'
  if (total > 4 && index === 4) return 'shield'
  if (total > 6 && index === 6) return 'coffee'
  return null
}

export function buildLevel(kinds: EntryKind[]): Level {
  const blocks: LevelBlock[] = []
  const coins: LevelCoin[] = []
  const enemies: LevelEnemy[] = []
  const powerUps: LevelPowerUp[] = []
  const props: LevelProp[] = []

  kinds.forEach((kind, i) => {
    const x = FIRST_BLOCK_X + i * BLOCK_SPACING
    blocks.push({ index: i, x, y: BLOCK_BOTTOM, kind })

    const drop = powerUpFor(i, kinds.length)
    if (drop) {
      powerUps.push({
        index: powerUps.length,
        blockIndex: i,
        kind: drop,
        x: x + BLOCK_SIZE / 2 - POWERUP_SIZE / 2,
        y: BLOCK_BOTTOM + BLOCK_SIZE,
      })
    }

    COIN_ARC.forEach((height, step) => {
      coins.push({ index: coins.length, x: x + BLOCK_SIZE + 90 + step * 56, y: height })
    })

    // Sem inimigo no primeiro trecho: o jogador aprende a andar e pular antes.
    if (i >= 1 && i < kinds.length - 1) {
      const center = x + PATROL_CENTER
      enemies.push({
        index: enemies.length,
        from: center - PATROL_RANGE,
        to: center + PATROL_RANGE - BUG_W,
        speed: BUG_SPEED + (i % 3) * 14,
      })
    }

    props.push({ kind: i % 2 === 0 ? 'bush' : 'rock', x: x - 210, scale: 0.9 + (i % 3) * 0.15 })
  })

  const lastBlockX = FIRST_BLOCK_X + Math.max(0, kinds.length - 1) * BLOCK_SPACING
  const flagX = lastBlockX + FLAG_OFFSET + BLOCK_SIZE
  props.push({ kind: 'sign', x: 230, scale: 1 })

  return { blocks, coins, enemies, powerUps, props, flagX, width: flagX + LEVEL_TAIL }
}
