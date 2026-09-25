// Renderiza os sprites ampliados, com grade, em build/sprites-preview.png.
// Serve para conferir o desenho sem precisar abrir o jogo.
//
// Uso: npm run preview:sprites
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const SPRITE_FILE = new URL('../src/game/sprite.ts', import.meta.url)
const OUT_DIR = new URL('../build/', import.meta.url)
const OUT_PNG = new URL('../build/sprites-preview.png', import.meta.url)

const source = readFileSync(SPRITE_FILE, 'utf8')

function readPixelMap(name) {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!match) throw new Error(`pixel map ${name} nao encontrado`)
  return [...match[1].matchAll(/'([^']*)'/g)].map((m) => m[1])
}

function readPalette(name) {
  const match = source.match(new RegExp(`const ${name}: Palette = \\{([\\s\\S]*?)\\n\\}`))
  if (!match) throw new Error(`paleta ${name} nao encontrada`)
  return Object.fromEntries([...match[1].matchAll(/(\w):\s*'(#[0-9a-fA-F]+)'/g)].map((m) => [m[1], m[2]]))
}

const SCALE = 11
const TOP = 62
const GAP = 56

const SPRITES = [
  ['IDLE', 'PLAYER_PALETTE'],
  ['BUG_WALK_A', 'BUG_PALETTE'],
  ['DINO_IDLE', 'DINO_PALETTE'],
]

let cursor = 30
let tallest = 0
const parts = []

for (const [mapName, paletteName] of SPRITES) {
  const rows = readPixelMap(mapName)
  const palette = readPalette(paletteName)
  const width = rows[0].length * SCALE
  const height = rows.length * SCALE
  tallest = Math.max(tallest, height)

  let cells = ''
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = palette[row[x]]
      if (!fill) continue
      cells += `<rect x="${cursor + x * SCALE}" y="${TOP + y * SCALE}" width="${SCALE}" height="${SCALE}" fill="${fill}"/>`
    }
  })

  let grid = ''
  for (let i = 0; i <= rows[0].length; i++) {
    grid += `<line x1="${cursor + i * SCALE}" y1="${TOP}" x2="${cursor + i * SCALE}" y2="${TOP + height}" stroke="#64748b" stroke-width="0.4" opacity="0.4"/>`
  }
  for (let i = 0; i <= rows.length; i++) {
    grid += `<line x1="${cursor}" y1="${TOP + i * SCALE}" x2="${cursor + width}" y2="${TOP + i * SCALE}" stroke="#64748b" stroke-width="0.4" opacity="0.4"/>`
  }

  parts.push(
    `<text x="${cursor}" y="46" font-family="Arial, sans-serif" font-size="17" fill="#0f172a">${mapName} — ${rows[0].length}x${rows.length}</text>${cells}${grid}`,
  )
  cursor += width + GAP
}

const W = cursor - GAP + 30
const H = tallest + TOP + 40

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#e2e8f0"/>
  ${parts.join('')}
</svg>`

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT_PNG, new Resvg(svg).render().asPng())
console.log(`build/sprites-preview.png  ${W}x${H}`)
