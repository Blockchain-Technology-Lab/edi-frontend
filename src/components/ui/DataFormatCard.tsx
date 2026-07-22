import type { ReactNode } from 'react'

type DataFormatCardProps = {
  children: ReactNode
}

export function DataFormatCard({ children }: DataFormatCardProps) {
  return (
    <div className="min-w-0 break-inside-avoid mb-4 rounded-xl border border-base-300 bg-base-200/40 p-4 space-y-3 [&>div]:w-full! [&_pre]:w-full!">
      {children}
    </div>
  )
}
