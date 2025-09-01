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

export interface GovernanceDataEntry {
  date: Date
  ledger: string
  // Gini activeness fields
  gini_coefficient?: number
  // Posts/Comments/Users fields
  posts?: number
  comments?: number
  users?: number
  posts_per_user?: number
  comments_per_post?: number
  comments_per_user?: number
  // Unified metric for multi-line charts
  unified_metric?: number
  // Community modularity fields
  nodes?: number
  edges?: number
  communities?: number
  modularity?: number
  // Top authors fields
  author?: string
  percentage?: number
}
