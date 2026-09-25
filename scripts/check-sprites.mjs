// Os sprites sao arrays de strings. Uma coluna a mais ou a menos deforma o
// desenho inteiro e o TypeScript nao tem como perceber. Este script garante
// que todas as linhas de um mesmo sprite tenham a mesma largura.
import { readFileSync } from 'node:fs'

const FILE = new URL('../src/game/sprite.ts', import.meta.url)
const source = readFileSync(FILE, 'utf8')

const LITERAL = /const (\w+) = \[([\s\S]*?)\n\]/g
const OVERRIDE = /const (\w+) = withRows\(\w+, \{([\s\S]*?)\n\}\)/g

let failures = 0

function report(name, rows, label) {
  const widths = [...new Set(rows.map((row) => row.length))]
  if (widths.length === 1) return
  failures++
  console.error(`FALHA ${name}: ${label} com larguras ${widths.join(', ')}`)
  rows.forEach((row, i) => {
    if (row.length !== widths[0]) console.error(`  linha ${i}: ${row.length} colunas -> "${row}"`)
  })
}

for (const [, name, body] of source.matchAll(LITERAL)) {
  const rows = [...body.matchAll(/'([^']*)'/g)].map((m) => m[1])
  if (rows.length) report(name, rows, `${rows.length} linhas`)
}

for (const [, name, body] of source.matchAll(OVERRIDE)) {
  const rows = [...body.matchAll(/\d+:\s*'([^']*)'/g)].map((m) => m[1])
  if (rows.length) report(name, rows, `${rows.length} linhas de override`)
}

if (failures > 0) {
  console.error(`\n${failures} sprite(s) com linha torta.`)
  process.exit(1)
}

console.log('Sprites consistentes.')
