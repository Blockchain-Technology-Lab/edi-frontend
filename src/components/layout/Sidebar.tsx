import { Logo, Menu, ThemeSwitcher } from "@/components"

export function Sidebar() {
  return (
    <div className="flex flex-col gap-8 py-5 tablet:pb-0">
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
