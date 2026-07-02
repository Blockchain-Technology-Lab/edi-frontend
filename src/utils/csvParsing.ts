import Papa from 'papaparse'
import type { DataEntry } from '@/utils/types'

export type ParsedCsv = {
  rows: string[][]
  headers: string[]
}

type CsvRowHandlers = {
  onRow: (rowIndex: number, values: string[]) => void
  onMalformedRow?: (
    rowIndex: number,
    actualColumns: number,
    expectedColumns: number
  ) => void
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

export function forEachCsvDataRow(
  rows: string[][],
  headers: string[],
  handlers: CsvRowHandlers
) {
  const { onRow, onMalformedRow } = handlers

  rows.forEach((values, i) => {
    if (values.length !== headers.length) {
      onMalformedRow?.(i + 1, values.length, headers.length)
      return
    }
    onRow(i + 1, values)
  })
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
