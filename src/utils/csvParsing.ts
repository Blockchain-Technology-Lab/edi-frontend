import Papa from 'papaparse'
import type { DataEntry } from '@/utils/types'
import DevLogger from './devLogger'

export type ParsedCsv = {
  rows: string[][]
  headers: string[]
}

/**
 * Per-row context handed to `onRow`: the real line number in the source
 * file (header line counts as line 1) and a helper to report a
 * semantic parse issue (e.g. invalid date) at that exact line.
 */
export type CsvRowContext = {
  line: number
  reportError: (reason: string) => void
}

type CsvRowHandlers = {
  /**
   * Return `false` to mark the row as skipped/invalid (e.g. it didn't have
   * a usable date or ledger). Return `true` or nothing to count it as
   * valid. Call `ctx.reportError(reason)` to log *why* a row was skipped.
   */
  onRow: (ctx: CsvRowContext, values: string[]) => boolean | void
  delimiter?: string
}

export function splitCsvContent(csv: string, delimiter = ','): ParsedCsv {
  const result = Papa.parse<string[]>(csv, {
    delimiter,
    skipEmptyLines: true,
  })
  const [headerRow = [], ...dataRows] = result.data
  return { rows: dataRows, headers: headerRow.map((h) => h.trim()) }
}

/**
 * Iterates the data rows of a parsed CSV, reporting malformed rows and a
 * final per-file summary via DevLogger so parse issues can be traced back
 * to an exact file name + line number.
 */
export function forEachCsvDataRow(
  rows: string[][],
  headers: string[],
  fileName: string,
  handlers: CsvRowHandlers
) {
  const { onRow } = handlers
  const totalRows = rows.length
  let validRows = 0

  rows.forEach((values, i) => {
    // Header occupies line 1, so the first data row is line 2.
    const line = i + 2

    if (values.length !== headers.length) {
      DevLogger.csvRowError(
        fileName,
        line,
        `expected ${headers.length} columns, got ${values.length}`
      )
      return
    }

    const reportError = (reason: string) =>
      DevLogger.csvRowError(fileName, line, reason)
    const isValid = onRow({ line, reportError }, values)
    if (isValid !== false) validRows++
  })

  DevLogger.csvParsed(fileName, validRows, totalRows)
}

export function parseCsvDate(value: string): Date | null {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || '').localeCompare(b.ledger || '')
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}

export async function fetchCsvText(
  csvPath: string,
  failureMessage: string,
  unknownErrorMessage = 'Unknown error occurred'
): Promise<string> {
  try {
    const response = await fetch(csvPath)

    if (!response.ok) {
      throw new Error(failureMessage)
    }

    return await response.text()
  } catch (error) {
    throw error instanceof Error ? error : new Error(unknownErrorMessage)
  }
}
