#!/usr/bin/env node
/**
 * validate-csvs.mjs
 *
 * Validates every *.csv file under public/output/ and writes a report to
 * csv-validation-report.txt (uploaded as a CI artifact on failure).
 *
 * Exit codes:
 *   0 – all files passed (warnings are allowed)
 *   1 – one or more files have hard errors
 */

import { readFileSync, statSync, readdirSync } from 'fs'
import { resolve, relative, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'
import chalk from 'chalk'

// ── Config ──────────────────────────────────────────────────────────────────

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_DIR = join(ROOT, 'public', 'output')

// Column-count variance above this fraction of total rows becomes an error.
// e.g. 0.05 = up to 5 % of rows may differ → warning only; above → error.
const COL_ERROR_THRESHOLD = 0.05

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect all *.csv paths under a directory. */
function collectCsvFiles(dir) {
  const results = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      results.push(...collectCsvFiles(full))
    } else if (name.endsWith('.csv')) {
      results.push(full)
    }
  }
  return results
}

/**
 * Validate a single CSV file.
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validateFile(filePath) {
  const errors = []
  const warnings = []
  const rel = relative(ROOT, filePath)

  // 1. Non-empty file
  const { size } = statSync(filePath)
  if (size === 0) {
    errors.push('File is empty (0 bytes).')
    return { errors, warnings }
  }

  // 2. Readable as UTF-8
  let content
  try {
    content = readFileSync(filePath, 'utf8')
  } catch (err) {
    errors.push(`Cannot read file: ${err.message}`)
    return { errors, warnings }
  }

  // 3. No null bytes (binary corruption / wrong file type)
  if (content.includes('\0')) {
    errors.push('File contains null bytes — possible binary corruption or wrong file type.')
    return { errors, warnings }
  }

  // 4. Blank lines (empty or whitespace-only), ignoring the standard trailing newline
  const rawLines = content.split('\n')
  const blankLines = rawLines
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line, num }) => {
      if (num === rawLines.length && line === '') return false // trailing newline — fine
      return line.trim() === ''
    })
  if (blankLines.length > 0) {
    errors.push(
      `Blank/whitespace-only line(s) found at: ${blankLines.map((l) => `line ${l.num}`).join(', ')}.`
    )
  }

  // 5. Trailing whitespace on any line
  const trailingWsLines = rawLines
    .map((line, i) => ({ line: line.replace(/\r$/, ''), num: i + 1 }))
    .filter(({ line }) => /[ \t]+$/.test(line))
  if (trailingWsLines.length > 0) {
    errors.push(
      `Trailing whitespace found on: ${trailingWsLines.map((l) => `line ${l.num}`).join(', ')}.`
    )
  }

  // 6. Parseable CSV
  const parsed = Papa.parse(content, { skipEmptyLines: true, header: false })

  const criticalParseErrors = parsed.errors.filter(
    (e) => e.type === 'Delimiter' || e.type === 'MissingQuotes'
  )
  if (criticalParseErrors.length > 0) {
    criticalParseErrors.forEach((e) =>
      errors.push(`CSV parse error at row ${e.row ?? '?'}: ${e.message}`)
    )
    return { errors, warnings }
  }

  const rows = parsed.data

  // 7. At least a header row + one data row
  if (rows.length === 0) {
    errors.push('No rows found after parsing.')
    return { errors, warnings }
  }
  if (rows.length === 1) {
    warnings.push('Only one row found — expected a header row plus at least one data row.')
  }

  // 8. Header must have at least one non-empty column
  const headerCols = rows[0].length
  if (headerCols === 0) {
    errors.push('Header row has no columns.')
    return { errors, warnings }
  }

  // 9. Leading/trailing whitespace in any cell value
  const paddedCells = []
  for (const [rowIdx, row] of rows.entries()) {
    for (const [colIdx, cell] of row.entries()) {
      if (typeof cell === 'string' && cell.length > 0 && cell !== cell.trim()) {
        paddedCells.push(`row ${rowIdx + 1} col ${colIdx + 1}: "${cell}"`)
      }
    }
  }
  if (paddedCells.length > 0) {
    errors.push(
      `Cell(s) with leading/trailing whitespace:\n` +
      paddedCells.slice(0, 10).map((c) => `     ${c}`).join('\n') +
      (paddedCells.length > 10 ? `\n     … and ${paddedCells.length - 10} more` : '')
    )
  }

  // 10. Column-count consistency across data rows
  if (rows.length > 1) {
    const dataRows = rows.slice(1)
    const inconsistent = dataRows.filter((r) => r.length !== headerCols)
    const inconsistencyRatio = inconsistent.length / dataRows.length

    if (inconsistent.length > 0) {
      const msg =
        `${inconsistent.length} of ${dataRows.length} data row(s) have a ` +
        `different column count than the header (${headerCols} cols). ` +
        `Inconsistency: ${(inconsistencyRatio * 100).toFixed(1)} %.`

      if (inconsistencyRatio > COL_ERROR_THRESHOLD) {
        errors.push(msg)
      } else {
        warnings.push(msg + ' (within tolerance — treated as warning)')
      }
    }
  }

  // 11. Duplicate header column names (skip intentionally empty first cell)
  const headerRow = rows[0].map((h) => h.trim())
  const nonEmptyHeaders = headerRow.filter((h) => h !== '')
  const seen = new Set()
  const dupes = []
  for (const h of nonEmptyHeaders) {
    if (seen.has(h)) dupes.push(h)
    else seen.add(h)
  }
  if (dupes.length > 0) {
    errors.push(`Duplicate header column name(s): ${dupes.map((d) => `"${d}"`).join(', ')}.`)
  }

  return { errors, warnings }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = collectCsvFiles(OUTPUT_DIR)

let totalErrors = 0
let totalWarnings = 0

const banner = `CSV Validation — public/output/  (${files.length} files)\n${'─'.repeat(60)}`
console.log(chalk.bold('\n' + banner + '\n'))

for (const file of files) {
  const rel = relative(ROOT, file)
  const { errors, warnings } = validateFile(file)

  if (errors.length > 0) {
    console.log(chalk.red(`✗  ${rel}`))
    for (const e of errors) console.log(chalk.red(`   ERROR: ${e}`))
    totalErrors += errors.length
  }

  if (warnings.length > 0) {
    if (errors.length === 0) console.log(chalk.yellow(`⚠  ${rel}`))
    for (const w of warnings) console.log(chalk.yellow(`   WARN:  ${w}`))
    totalWarnings += warnings.length
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green(`✓  ${rel}`))
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60))

if (totalErrors > 0) {
  console.log(chalk.red.bold(
    `\n✗  Validation FAILED — ${totalErrors} error(s) found` +
    (totalWarnings > 0 ? `, ${totalWarnings} warning(s)` : '') + '.'
  ))
} else {
  console.log(chalk.green.bold(
    `\n✓  All ${files.length} CSV files passed` +
    (totalWarnings > 0 ? ` (${totalWarnings} warning(s))` : '') + '.'
  ))
}

process.exit(totalErrors > 0 ? 1 : 0)
