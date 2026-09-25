// Gera a imagem de compartilhamento (og-image.png, 1200x630).
//
// Redes sociais ignoram SVG em og:image, entao o resultado precisa ser raster.
// O desenho reaproveita os pixel maps reais de src/game/sprite.ts, para a
// imagem nunca divergir do personagem que aparece no jogo.
//
// Uso: npm run og
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const SPRITE_FILE = new URL('../src/game/sprite.ts', import.meta.url)
// O SVG e so o intermediario; nao vai para public/ para nao ser publicado.
const BUILD_DIR = new URL('../build/', import.meta.url)
const OUT_SVG = new URL('../build/og-image.svg', import.meta.url)
const OUT_PNG = new URL('../public/og-image.png', import.meta.url)

const W = 1200
const H = 630
const GROUND_Y = 512

/* ------------------------------------------------ leitura dos sprites --- */

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

function drawSprite(rows, palette, originX, originY, scale) {
  const out = []
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = palette[row[x]]
      if (!fill) continue
      out.push(
        `<rect x="${originX + x * scale}" y="${originY + y * scale}" width="${scale}" height="${scale}" fill="${fill}"/>`,
      )
    }
  })
  return out.join('')
}

/* --------------------------------------------------------- pixel font --- */

const GLYPHS = {
  A: '01110,10001,10001,11111,10001,10001,10001',
  B: '11110,10001,10001,11110,10001,10001,11110',
  C: '01110,10001,10000,10000,10000,10001,01110',
  D: '11110,10001,10001,10001,10001,10001,11110',
  E: '11111,10000,10000,11110,10000,10000,11111',
  F: '11111,10000,10000,11110,10000,10000,10000',
  G: '01110,10001,10000,10111,10001,10001,01111',
  H: '10001,10001,10001,11111,10001,10001,10001',
  I: '11111,00100,00100,00100,00100,00100,11111',
  J: '00111,00010,00010,00010,00010,10010,01100',
  K: '10001,10010,10100,11000,10100,10010,10001',
  L: '10000,10000,10000,10000,10000,10000,11111',
  M: '10001,11011,10101,10101,10001,10001,10001',
  N: '10001,11001,10101,10011,10001,10001,10001',
  O: '01110,10001,10001,10001,10001,10001,01110',
  P: '11110,10001,10001,11110,10000,10000,10000',
  Q: '01110,10001,10001,10001,10101,10010,01101',
  R: '11110,10001,10001,11110,10100,10010,10001',
  S: '01111,10000,10000,01110,00001,00001,11110',
  T: '11111,00100,00100,00100,00100,00100,00100',
  U: '10001,10001,10001,10001,10001,10001,01110',
  V: '10001,10001,10001,10001,10001,01010,00100',
  W: '10001,10001,10001,10101,10101,11011,10001',
  X: '10001,10001,01010,00100,01010,10001,10001',
  Y: '10001,10001,01010,00100,00100,00100,00100',
  Z: '11111,00001,00010,00100,01000,10000,11111',
  '?': '01110,10001,00001,00110,00100,00000,00100',
  ' ': '00000,00000,00000,00000,00000,00000,00000',
}

function drawText(text, originX, originY, scale, fill) {
  const out = []
  let cursor = originX
  for (const char of text.toUpperCase()) {
    const glyph = GLYPHS[char]
    if (glyph) {
      glyph.split(',').forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] !== '1') continue
          out.push(
            `<rect x="${cursor + x * scale}" y="${originY + y * scale}" width="${scale}" height="${scale}" fill="${fill}"/>`,
          )
        }
      })
    }
    cursor += 6 * scale
  }
  return out.join('')
}

function textWidth(text, scale) {
  return text.length * 6 * scale - scale
}

/* ------------------------------------------------------------- cenario --- */

function stars(count) {
  const out = []
  let seed = 7
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  for (let i = 0; i < count; i++) {
    const x = Math.round(rand() * W)
    const y = Math.round(rand() * (GROUND_Y - 120))
    const size = rand() > 0.75 ? 3 : 2
    out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#ffffff" opacity="${0.25 + rand() * 0.5}"/>`)
  }
  return out.join('')
}

function questionBlock(x, y, size) {
  const b = size / 16
  return `
    <g>
      <ellipse cx="${x + size / 2}" cy="${y + size / 2}" rx="${size}" ry="${size * 0.8}" fill="#fbbf24" opacity="0.18"/>
      <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#130d2b"/>
      <rect x="${x + b}" y="${y + b}" width="${size - 2 * b}" height="${size - 2 * b}" fill="url(#gold)"/>
      <rect x="${x + b}" y="${y + b}" width="${size - 2 * b}" height="${b * 1.6}" fill="#fef3c7" opacity="0.7"/>
      <rect x="${x + b * 2}" y="${y + b * 2}" width="${b * 1.4}" height="${b * 1.4}" fill="#130d2b"/>
      <rect x="${x + size - b * 3.4}" y="${y + b * 2}" width="${b * 1.4}" height="${b * 1.4}" fill="#130d2b"/>
      <rect x="${x + b * 2}" y="${y + size - b * 3.4}" width="${b * 1.4}" height="${b * 1.4}" fill="#130d2b"/>
      <rect x="${x + size - b * 3.4}" y="${y + size - b * 3.4}" width="${b * 1.4}" height="${b * 1.4}" fill="#130d2b"/>
      ${drawText('?', x + size / 2 - b * 2.5, y + size / 2 - b * 3.5, b, '#130d2b')}
    </g>`
}

/* ----------------------------------------------------------------- svg --- */

const playerRows = readPixelMap('IDLE')
const playerPalette = readPalette('PLAYER_PALETTE')
const bugRows = readPixelMap('BUG_WALK_A')
const bugPalette = readPalette('BUG_PALETTE')
const dinoRows = readPixelMap('DINO_IDLE')
const dinoPalette = readPalette('DINO_PALETTE')

const PLAYER_SCALE = 6
const playerH = playerRows.length * PLAYER_SCALE
const BUG_SCALE = 6
const bugH = bugRows.length * BUG_SCALE
const DINO_SCALE = 6
const dinoH = dinoRows.length * DINO_SCALE

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#06051a"/>
      <stop offset="0.45" stop-color="#0d0930"/>
      <stop offset="0.8" stop-color="#241354"/>
      <stop offset="1" stop-color="#45215c"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.15" cy="0.1" r="0.7">
      <stop offset="0" stop-color="#7c3aed" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0" stop-color="#0891b2" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#0891b2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fde68a"/>
      <stop offset="0.45" stop-color="#fbbf24"/>
      <stop offset="1" stop-color="#ea9a10"/>
    </linearGradient>
    <linearGradient id="titleA" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#67e8f9"/>
      <stop offset="0.5" stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="titleB" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fbbf24"/>
      <stop offset="0.6" stop-color="#ff4d6d"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#34d399"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
    <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2e2154"/>
      <stop offset="1" stop-color="#160f30"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  ${stars(90)}

  <path d="M0 ${GROUND_Y} L0 400 L150 300 L300 400 L430 320 L560 420 L700 330 L860 430 L1010 340 L1200 430 L1200 ${GROUND_Y} Z" fill="#150e3d" opacity="0.85"/>

  ${questionBlock(905, 250, 112)}
  ${drawSprite(dinoRows, dinoPalette, 965, GROUND_Y - dinoH, DINO_SCALE)}
  ${drawSprite(playerRows, playerPalette, 810, GROUND_Y - playerH, PLAYER_SCALE)}
  ${drawSprite(bugRows, bugPalette, 700, GROUND_Y - bugH, BUG_SCALE)}

  <rect x="0" y="${GROUND_Y}" width="${W}" height="${H - GROUND_Y}" fill="url(#soil)"/>
  <rect x="0" y="${GROUND_Y}" width="${W}" height="14" fill="url(#crust)"/>
  <rect x="0" y="${GROUND_Y}" width="${W}" height="3" fill="#a7f3d0" opacity="0.6"/>

  <g font-family="Segoe UI, Arial, Helvetica, sans-serif">
    <text x="80" y="128" fill="#22d3ee" font-size="21" font-weight="700" letter-spacing="7">CURRÍCULO INTERATIVO</text>

    ${drawText('CAREER', 80, 158, 9, 'url(#titleA)')}
    ${drawText('QUEST', 80, 236, 9, 'url(#titleB)')}

    <rect x="80" y="322" width="96" height="4" fill="#22d3ee"/>

    <text x="80" y="382" fill="#ffffff" font-size="40" font-weight="700">Gehaime Barros</text>
    <text x="80" y="420" fill="#a78bfa" font-size="23" font-weight="600">Lead Quality Engineer · Desenvolvedor Full Stack</text>
    <text x="80" y="466" fill="#cfc9f5" font-size="20">Um portfólio que se joga: pule nos blocos e</text>
    <text x="80" y="492" fill="#cfc9f5" font-size="20">descubra 10 anos de carreira em QA e código.</text>
  </g>

  <g font-family="Segoe UI, Arial, Helvetica, sans-serif">
    <text x="80" y="588" fill="#8b84c9" font-size="18">React · TypeScript · física e pixel art feitos do zero</text>
  </g>
</svg>
`

mkdirSync(BUILD_DIR, { recursive: true })
writeFileSync(OUT_SVG, svg, 'utf8')

const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng()
writeFileSync(OUT_PNG, png)

console.log(`build/og-image.svg  ${svg.length.toLocaleString('pt-BR')} bytes`)
console.log(`og-image.png  ${png.length.toLocaleString('pt-BR')} bytes  (${W}x${H})`)
console.log(`titulo CAREER = ${textWidth('CAREER', 9)}px, QUEST = ${textWidth('QUEST', 9)}px`)
