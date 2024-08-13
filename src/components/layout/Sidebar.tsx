import { Logo, Menu, ThemeSwitcher } from "@/components"

export function Sidebar() {
  return (
    <div className="flex flex-col gap-7 py-5 tablet:gap-8 tablet:pb-0">
      <div className="flex flex-col gap-7 tablet:gap-14">
        <header className="mt-1 tablet:mt-4">
          <Logo />
        </header>
        <Menu />
      </div>
      <ThemeSwitcher />
    </div>
  )
}
