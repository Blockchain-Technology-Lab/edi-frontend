import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"

type CardsProps = {
  title: string
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
  titleAppearance?: "xl" | "lg" | "md"
  children: ReactNode
}

export function Card({
  title,
  titleAs = "h4",
  titleAppearance = "md",
  children
}: CardsProps) {
  const Title = titleAs

  let titleClassName
  if (titleAppearance === "lg") titleClassName = "t-20"
  else if (titleAppearance === "xl") titleClassName = "t-30"

  return (
    <div className="border rounded-md border-black/[0.175] dark:border-white/15">
      <div className="px-4 py-3 border-b border-black/[0.175] bg-slate-800/[0.03] dark:border-white/15 dark:bg-slate-200/[0.03]">
        <Title className={twJoin(titleClassName, "font-bold leading-tight")}>
          {title}
        </Title>
      </div>
      <div className="styled-content p-4">{children}</div>
    </div>
  )
}
