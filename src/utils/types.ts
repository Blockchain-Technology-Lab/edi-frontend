// src/utils/types.ts

type BaseDataEntry = {
  ledger?: string
  date: Date
}

export type DataEntry = BaseDataEntry & {
  [key: string]: number | string | Date | null | undefined
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
