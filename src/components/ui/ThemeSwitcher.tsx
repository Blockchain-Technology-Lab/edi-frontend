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
    <div className="flex">
      <ThemeButton
        theme="light"
        label="Light Mode"
        icon={<Sun width={13} height={13} />}
      />
      <ThemeButton
        theme="dark"
        label="Dark Mode"
        icon={<Moon width={13} height={13} />}
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
  const { theme: activeTheme, setTheme } = useTheme()
  const isActive = activeTheme === theme
  return (
    <button
      title={label}
      onClick={() => setTheme(theme)}
      className={twJoin(
        "flex items-center justify-center w-8 h-8",
        isActive
          ? "text-black dark:text-white"
          : "text-black/30 dark:text-white/60"
      )}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  )
}
