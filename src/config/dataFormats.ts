import type { ComponentType } from 'react'
import { DataFormatConsensusContent, DataFormatTokenomicsContent } from '@/content'

export type DataFormatLayerStatus = 'available' | 'coming-soon'

export type DataFormatLayer = {
  key: string
  label: string
  status: DataFormatLayerStatus
  content: ComponentType<Record<string, unknown>>
}

export const DATA_FORMAT_LAYERS: DataFormatLayer[] = [
  {
    key: 'consensus',
    label: 'Consensus',
    status: 'available',
    content: DataFormatConsensusContent
  },
  {
    key: 'tokenomics',
    label: 'Tokenomics',
    status: 'coming-soon',
    content: DataFormatTokenomicsContent
  }
]
