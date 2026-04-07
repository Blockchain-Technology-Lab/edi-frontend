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
