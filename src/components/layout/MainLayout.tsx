import { ReactNode } from "react"

type Props = {
  main: ReactNode
  footer: ReactNode
  sidebar: ReactNode
}

export function MainLayout({ main, footer, sidebar }: Props) {
  return (
    <div className="px-5 tablet:px-6">
      <div className="flex flex-col gap-5 tablet:flex-row">
        <div className="tablet:sticky tablet:top-0 tablet:min-w-60 tablet:w-1/5 tablet:h-screen">
          {sidebar}
        </div>
        <main className="flex-1 tablet:pt-10">{main}</main>
      </div>
      {footer}
    </div>
  )
}
