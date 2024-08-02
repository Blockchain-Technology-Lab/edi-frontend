import { Logo, ThemeSwitcher } from "@/components"

export function Sidebar() {
  return (
    <div className="flex flex-col justify-between gap-5 py-5 h-full">
      <div className="flex flex-col gap-5">
        <header>
          <Logo />
        </header>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Consensus</li>
            <li>Takonomics</li>
          </ul>
        </nav>
      </div>
      <ThemeSwitcher />
    </div>
  )
}
