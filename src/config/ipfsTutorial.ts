import type { ComponentType } from 'react'
import {
  IpfsStep1Content,
  IpfsStep2Content,
  IpfsStep3Content,
  IpfsStep4Content,
  IpfsFaqContent
} from '@/content'

export type IpfsStepConfig = {
  key: string
  label: string
  title: string
  content: ComponentType<Record<string, unknown>>
  contentWidth?: 'full' | 'prose'
}

export const IPFS_STEPS: IpfsStepConfig[] = [
  {
    key: 'step-1',
    label: 'Step 1',
    title: 'Prepare your dataset',
    content: IpfsStep1Content,
    contentWidth: 'prose'
  },
  {
    key: 'step-2',
    label: 'Step 2',
    title: 'Choose how to upload it',
    content: IpfsStep2Content
  },
  {
    key: 'step-3',
    label: 'Step 3',
    title: 'Keep your node online',
    content: IpfsStep3Content,
    contentWidth: 'prose'
  },
  {
    key: 'step-4',
    label: 'Step 4',
    title: 'Send us the details',
    content: IpfsStep4Content,
    contentWidth: 'prose'
  },
  {
    key: 'faq',
    label: 'FAQ',
    title: 'FAQ / Troubleshooting',
    content: IpfsFaqContent,
    contentWidth: 'prose'
  }
]

export function getIpfsStep(key: string | undefined) {
  return IPFS_STEPS.find((step) => step.key === key)
}

export type IpfsTileTone = 'neutral' | 'primary' | 'info'

export const IPFS_TILE_TONE_CLASSES: Record<IpfsTileTone, string> = {
  neutral: 'border-base-300 hover:border-primary/40',
  primary:
    'border-primary/30 bg-primary/10 hover:border-primary/50 hover:bg-primary/15',
  info: 'border-info/40 bg-info/10 hover:border-info/60 hover:bg-info/15'
}


export const IPFS_HIGHLIGHT_CARD_CLASSES = 'border-2 border-info/50 shadow-md'
export const IPFS_HIGHLIGHT_HEADER_CLASSES = 'border-b border-info/30 bg-info/15'
export const IPFS_HIGHLIGHT_TEXT_CLASSES = 'text-info'

export const IPFS_OPTION_TILE_BASE_CLASSES =
  'flex rounded-xl border bg-base-200 hover:shadow-sm transition-all p-3.5 no-underline'

export const IPFS_SKIP_CALLOUT_CLASSES =
  'flex items-center gap-2.5 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm text-primary'

export const IPFS_EXPLAINER_YOUTUBE_ID = ''

export const IPFS_EXPLAINER_VIDEO_LOCAL = {
  src: '/videos/ipfs-terminal-explainer.mp4',
  poster: '/videos/ipfs-terminal-poster.png'
}
