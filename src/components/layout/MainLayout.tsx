import { ReactNode } from "react"

type Props = {
  main: ReactNode
  footer: ReactNode
  sidebar: ReactNode
}

export function MainLayout({ main, footer, sidebar }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 min-w-[16rem] overflow-y-auto border-r pl-4">
        {sidebar}
      </aside>

      {/* Main content + Footer */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 px-5 tablet:px-6 tablet:pt-10 overflow-y-auto pt-4">
          {main}
        </main>

        <footer className="py-1 text-sm border-t ">{footer}</footer>
      </div>
    </div>
  )
}
