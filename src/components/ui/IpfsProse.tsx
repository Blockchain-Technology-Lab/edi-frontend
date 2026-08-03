import type { ReactNode } from 'react'

const PROSE_CLASSES = `
  text-sm text-base-content/70 leading-relaxed
  [&_h2]:text-base [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-base-content [&_h2]:mt-2
  [&_p]:leading-relaxed
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
  [&_li]:leading-relaxed
  [&_li_pre]:mt-2.5 [&_li_pre]:mb-1
  [&_strong]:font-semibold [&_strong]:text-base-content/90
  [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-base-200 [&_code]:text-base-content/85 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:break-words
  [&_pre]:rounded-xl [&_pre]:bg-base-300 [&_pre]:border [&_pre]:border-base-content/10 [&_pre]:p-4 [&_pre]:pr-11 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_pre]:shadow-sm [&_pre]:w-fit [&_pre]:max-w-full
  [&_pre_code]:bg-transparent [&_pre_code]:text-base-content/90 [&_pre_code]:p-0 [&_pre_code]:text-[13px] [&_pre_code]:leading-[1.7]
`

type IpfsProseProps = {
  children: ReactNode
  className?: string
}

export function IpfsProse({ children, className = '' }: IpfsProseProps) {
  return <div className={`${PROSE_CLASSES} ${className}`}>{children}</div>
}
