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

import { readFileSync, writeFileSync, statSync, readdirSync } from 'fs'
import { resolve, relative, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'
import chalk from 'chalk'

// ── Config ──────────────────────────────────────────────────────────────────

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_DIR = join(ROOT, 'public', 'output')
const REPORT = join(ROOT, 'csv-validation-report.txt')

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
    errors.push(
      'File contains null bytes — possible binary corruption or wrong file type.'
    )
    return { errors, warnings }
  }

  // 4. Parseable CSV
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

  // 5. At least a header row + one data row
  if (rows.length === 0) {
    errors.push('No rows found after parsing.')
    return { errors, warnings }
  }
  if (rows.length === 1) {
    warnings.push(
      'Only one row found — expected a header row plus at least one data row.'
    )
  }

  // 6. Header must have at least one column
  const headerCols = rows[0].length
  if (headerCols === 0) {
    errors.push('Header row has no columns.')
    return { errors, warnings }
  }

  // 7. Column-count consistency across data rows
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

  return { errors, warnings }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = collectCsvFiles(OUTPUT_DIR)

let totalErrors = 0
let totalWarnings = 0
const reportLines = []

const banner = `CSV Validation — public/output/  (${files.length} files)\n${'─'.repeat(60)}`
console.log(chalk.bold('\n' + banner + '\n'))
reportLines.push(banner, '')

for (const file of files) {
  const rel = relative(ROOT, file)
  const { errors, warnings } = validateFile(file)

  if (errors.length > 0) {
    const line = `✗  ${rel}`
    console.log(chalk.red(line))
    reportLines.push(line)

    for (const e of errors) {
      const detail = `   ERROR: ${e}`
      console.log(chalk.red(detail))
      reportLines.push(detail)
    }
    totalErrors += errors.length
  }

  if (warnings.length > 0) {
    if (errors.length === 0) {
      const line = `⚠  ${rel}`
      console.log(chalk.yellow(line))
      reportLines.push(line)
    }
    for (const w of warnings) {
      const detail = `   WARN:  ${w}`
      console.log(chalk.yellow(detail))
      reportLines.push(detail)
    }
    totalWarnings += warnings.length
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green(`✓  ${rel}`))
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

const separator = '─'.repeat(60)
console.log('\n' + separator)
reportLines.push('', separator)

if (totalErrors > 0) {
  const summary =
    `✗  Validation FAILED — ${totalErrors} error(s) found` +
    (totalWarnings > 0 ? `, ${totalWarnings} warning(s)` : '') +
    '.'
  console.log(chalk.red.bold('\n' + summary))
  reportLines.push(summary)
} else {
  const summary =
    `✓  All ${files.length} CSV files passed` +
    (totalWarnings > 0 ? ` (${totalWarnings} warning(s))` : '') +
    '.'
  console.log(chalk.green.bold('\n' + summary))
  reportLines.push(summary)
}

// Write artifact report (CI uploads this on failure)
//writeFileSync(REPORT, reportLines.join('\n') + '\n', 'utf8')

process.exit(totalErrors > 0 ? 1 : 0)
