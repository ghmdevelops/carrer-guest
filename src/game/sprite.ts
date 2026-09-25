import { BUG_SCALE, DINO_SCALE, SPRITE_SCALE } from './constants'

type Palette = Record<string, string>

function toBoxShadow(rows: string[], scale: number, palette: Palette): string {
  const parts: string[] = []
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = palette[row[x]]
      if (color) parts.push(`${x * scale}px ${y * scale}px 0 0 ${color}`)
    }
  })
  return parts.join(',')
}

function withRows(base: string[], overrides: Record<number, string>): string[] {
  return base.map((row, i) => overrides[i] ?? row)
}

/* ---------------------------------------------------------------- player
 * Engenheiro de QA: headphones (silhueta caracteristica), moletom com ziper
 * ciano e tenis ciano. 16 x 18 pixels.
 */

const PLAYER_PALETTE: Palette = {
  K: '#130d2b',
  H: '#3b2a52',
  S: '#ffcfa4',
  C: '#22d3ee',
  P: '#6d28d9',
  Q: '#4c1d95',
  J: '#1f2937',
}

const IDLE = [
  '....CCCCCCCC....',
  '...CKKKKKKKKC...',
  '...CKHHHHHHKC...',
  '..CCKHHHHHHKCC..',
  '..CCKSSSSSSKCC..',
  '..CCKSKSSKSKCC..',
  '..CCKSSSSSSKCC..',
  '....KSSKKSSK....',
  '....KSSSSSSK....',
  '.....KSSSSK.....',
  '...KKPPPPPPKK...',
  '..KPPPPCCPPPPK..',
  '.KSPPPQCCQPPPSK.',
  '.KSPPPQCCQPPPSK.',
  '..KPPPPCCPPPPK..',
  '...KJJJJJJJJK...',
  '...KJJK..KJJK...',
  '...KCCK..KCCK...',
]

const RUN_A = withRows(IDLE, {
  12: 'KSPPPPQCCQPPPPSK',
  13: '.KPPPPQCCQPPPPK.',
  16: '..KJJK...KJJK...',
  17: '.KCCK.....KCCK..',
})

const RUN_B = withRows(IDLE, {
  17: '....KCCK.KCCK...',
})

const JUMP = withRows(IDLE, {
  11: '.SKPPPPCCPPPPKS.',
  12: '.SKPPPQCCQPPPKS.',
  13: '..KPPPQCCQPPPK..',
  16: '..KJJK....KJJK..',
  17: '..KCCK....KCCK..',
})

const FALL = withRows(IDLE, {
  12: 'KSPPPPQCCQPPPPSK',
  13: '.KPPPPQCCQPPPPK.',
  16: '...KJJKKKKJJK...',
  17: '..KCCK....KCCK..',
})

export type FrameName = 'idle' | 'runA' | 'runB' | 'jump' | 'fall'

export const FRAMES: Record<FrameName, string> = {
  idle: toBoxShadow(IDLE, SPRITE_SCALE, PLAYER_PALETTE),
  runA: toBoxShadow(RUN_A, SPRITE_SCALE, PLAYER_PALETTE),
  runB: toBoxShadow(RUN_B, SPRITE_SCALE, PLAYER_PALETTE),
  jump: toBoxShadow(JUMP, SPRITE_SCALE, PLAYER_PALETTE),
  fall: toBoxShadow(FALL, SPRITE_SCALE, PLAYER_PALETTE),
}

/* ------------------------------------------------------------------- bug */

const BUG_PALETTE: Palette = {
  K: '#140f2e',
  R: '#ef4444',
  D: '#991b1b',
  W: '#ffffff',
}

const BUG_WALK_A = [
  '..K......K..',
  '...K....K...',
  '..KKKKKKKK..',
  '.KRRRRRRRRK.',
  'KRWKRRRRKWRK',
  'KRRRDDDDRRRK',
  'KRKRRKKRRKRK',
  '.KRRRRRRRRK.',
  '..KKKKKKKK..',
  '.K..K..K..K.',
]

const BUG_WALK_B = withRows(BUG_WALK_A, {
  0: '.K........K.',
  1: '..K......K..',
  9: '..K.KK.KK.K.',
})

const BUG_SQUASHED = [
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
  '..KKKKKKKK..',
  '.KRRRRRRRRK.',
  'KRRKKKKKKRRK',
  '.KKKKKKKKKK.',
]

export type BugFrameName = 'walkA' | 'walkB' | 'squashed'

export const BUG_FRAMES: Record<BugFrameName, string> = {
  walkA: toBoxShadow(BUG_WALK_A, BUG_SCALE, BUG_PALETTE),
  walkB: toBoxShadow(BUG_WALK_B, BUG_SCALE, BUG_PALETTE),
  squashed: toBoxShadow(BUG_SQUASHED, BUG_SCALE, BUG_PALETTE),
}

/* ------------------------------------------------------------------ dino
 * Raptor: corpo teal, barriga clara, crista magenta no dorso e cauda erguida.
 * 18 x 14 pixels. O dorso (linha 6) define DINO_RIDE_OFFSET.
 */

const DINO_PALETTE: Palette = {
  K: '#130d2b',
  T: '#2dd4bf',
  B: '#a7f3d0',
  M: '#ff4d6d',
  W: '#ffffff',
  N: '#1e1b4b',
}

const DINO_IDLE = [
  '.............KKKK.',
  '............KTTTTK',
  '............KWKTTK',
  '............KTTTTK',
  '...........KKTTTKK',
  '....MMMMMMMKTTTTK.',
  '..KKTTTTTTTTTTTK..',
  'KTTTTTTTTTTTTTTK..',
  'KTTTTTTBBBBBTTTK..',
  '.KKTTTTBBBBBTTK...',
  '...KKTTTBBBTTTK...',
  '.....KTTKKKTTTK...',
  '.....KTTK.KTTTK...',
  '....KNNNK.KNNNNK..',
]

const DINO_WALK = withRows(DINO_IDLE, {
  11: '....KTTKK.KTTTK...',
  12: '....KTTK...KTTTK..',
  13: '...KNNNK...KNNNNK.',
})

export type DinoFrameName = 'idle' | 'walk'

export const DINO_FRAMES: Record<DinoFrameName, string> = {
  idle: toBoxShadow(DINO_IDLE, DINO_SCALE, DINO_PALETTE),
  walk: toBoxShadow(DINO_WALK, DINO_SCALE, DINO_PALETTE),
}
