import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'

const defaultWarn = console.warn
console.warn = (message, ...rest) => {
  if (!String(message).startsWith('No character metrics for')) {
    defaultWarn(message, ...rest)
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lectureDir = path.join(root, 'src', 'data', 'lectures')
const files = fs
  .readdirSync(lectureDir)
  .filter((name) => /^lecture-\d+\.ts$/.test(name))
  .sort()

const failures = []
let formulaCount = 0

function renderFormula(raw, displayMode, file) {
  const formula = raw
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .trim()
  if (!formula || formula.includes('${')) return
  formulaCount += 1
  try {
    katex.renderToString(formula, {
      displayMode,
      throwOnError: true,
      strict: 'ignore',
      trust: false,
    })
  } catch (error) {
    failures.push(`${file}: ${formula.slice(0, 100)} → ${error.message}`)
  }
}

for (const file of files) {
  const source = fs.readFileSync(path.join(lectureDir, file), 'utf8')
  const withoutBlocks = source.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    renderFormula(formula, true, file)
    return ' '
  })
  for (const match of withoutBlocks.matchAll(/(?<!\$)\$([^$\r\n]+?)\$(?!\$)/g)) {
    renderFormula(match[1], false, file)
  }
}

console.log(`KaTeX audit: ${formulaCount} formulas in ${files.length} lecture files`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('KaTeX audit passed with 0 parse errors')
}
