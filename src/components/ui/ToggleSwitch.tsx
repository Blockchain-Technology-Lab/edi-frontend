"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

type ToggleSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked
              ? isDark
                ? "bg-blue-600"
                : "bg-blue-400"
              : isDark
                ? "bg-gray-700"
                : "bg-gray-300"
          }`}
        />
        <span
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </label>
    </div>
  )
}
