import { Logo, Menu, ThemeSwitcher } from "@/components"

export function Sidebar() {
  return (
    <div className="flex flex-col justify-between gap-5 py-5 h-full">
      <div className="flex flex-col gap-14">
        <header className="mt-4">
          <Logo />
        </header>
        <Menu />
      </div>
      <ThemeSwitcher />
    </div>
  )
}
