import { ReactNode } from "react"

type Props = {
  main: ReactNode
  footer: ReactNode
  sidebar: ReactNode
}

export function MainLayout({ main, footer, sidebar }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 min-w-[16rem] overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-4">
        {sidebar}
      </aside>

      {/* Main content + Footer */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 px-5 pt-1 tablet:px-6 tablet:pt-10 overflow-y-auto">
          {main}
        </main>

        <footer className="py-1 text-sm border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          {footer}
        </footer>
      </div>
    </div>
  )
}
