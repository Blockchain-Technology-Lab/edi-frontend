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
}

export const IPFS_STEPS: IpfsStepConfig[] = [
  {
    key: 'step-1',
    label: 'Step 1',
    title: 'Prepare your dataset',
    content: IpfsStep1Content
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
    content: IpfsStep3Content
  },
  {
    key: 'step-4',
    label: 'Step 4',
    title: 'Send us the details',
    content: IpfsStep4Content
  },
  {
    key: 'faq',
    label: 'FAQ',
    title: 'FAQ / Troubleshooting',
    content: IpfsFaqContent
  }
]

export function getIpfsStep(key: string | undefined) {
  return IPFS_STEPS.find((step) => step.key === key)
}

export type IpfsTileTone = 'neutral' | 'primary'

// Background is deliberately excluded here — the right neutral shade
// depends on what a tile sits on (e.g. bg-base-300 on a page background,
// bg-base-200 inside an already-base-100 card), so callers add their own.
export const IPFS_TILE_TONE_CLASSES: Record<IpfsTileTone, string> = {
  neutral: 'border-base-300 hover:border-primary/40',
  primary:
    'border-primary/30 bg-primary/10 hover:border-primary/50 hover:bg-primary/15'
}

// Tailwind only scans .ts/.tsx files for class names, not .mdx, so any
// utility used exclusively in MDX content (e.g. step-2-upload.mdx's option
// tiles) never gets generated unless it also appears here.
export const IPFS_OPTION_TILE_BASE_CLASSES =
  'flex rounded-xl border bg-base-200 hover:shadow-sm transition-all p-3.5 no-underline'

export const IPFS_SKIP_CALLOUT_CLASSES =
  'flex items-center gap-2.5 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm text-primary w-1/2'
