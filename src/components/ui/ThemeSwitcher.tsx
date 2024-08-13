import { ReactNode, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "@/components"
import { twJoin } from "tailwind-merge"

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      role="group"
      aria-label="Theme Switcher"
      className="flex items-center gap-1"
    >
      <ThemeButton
        theme="dark"
        label="Dark Mode"
        icon={<Moon width={14} height={14} />}
      />
      <ThemeButton
        theme="light"
        label="Light Mode"
        icon={<Sun width={16} height={16} />}
      />
    </div>
  )
}

type ThemeButtonProps = {
  icon: ReactNode
  label: string
  theme: "light" | "dark"
}

function ThemeButton({ icon, label, theme }: ThemeButtonProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isActive = resolvedTheme === theme
  return (
    <button
      role="radio"
      aria-checked={isActive}
      title={label}
      onClick={() => setTheme(theme)}
      className={twJoin(
        "flex items-center justify-center w-8 h-8",
        isActive && "bg-black/10 dark:bg-white/10 rounded-md",
        !isActive && "opacity-40"
      )}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  )
}
