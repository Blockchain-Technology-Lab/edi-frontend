import type { DataEntry } from '@/utils/types'

export function splitCsvContent(csv: string, delimiter = ',') {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(delimiter).map((h) => h.trim())
  return { lines, headers }
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

export function forEachCsvDataRow(
  lines: string[],
  headers: string[],
  handlers: CsvRowHandlers
) {
  const { onRow, onMalformedRow, delimiter = ',' } = handlers

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter)

    if (values.length !== headers.length) {
      onMalformedRow?.(i, values.length, headers.length)
      continue
    }

    onRow(i, values)
  }
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
