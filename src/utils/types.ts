// src/utils/types.ts

type BaseDataEntry = {
  ledger?: string
  date: Date
}

export type DataEntry = BaseDataEntry & {
  [key: string]: number | string | Date | null | undefined
}

export type CsvParseEntry = Record<string, unknown> & {
  date?: Date
  ledger?: string
}

export type DoughnutDataEntry = {
  author: string
  commits: number
}

export interface FinalData {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
    dataVisibility: boolean[]
  }[]
}
