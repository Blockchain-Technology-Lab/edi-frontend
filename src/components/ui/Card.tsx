import { ReactNode } from "react"

type CardsProps = {
  title: string
  children: ReactNode
}

export function Card({ title, children }: CardsProps) {
  return (
    <div className="border rounded-md border-black/[0.175] dark:border-white/15">
      <div className="px-4 py-2 border-b border-black/[0.175] bg-slate-800/[0.03] dark:border-white/15 dark:bg-slate-200/[0.03]">
        <h2>{title}</h2>
      </div>
      <div className="styled-content p-4">{children}</div>
    </div>
  )
}
