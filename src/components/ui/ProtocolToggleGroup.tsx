import { BASE_LEDGERS } from "@/utils"
import { useState } from "react"

interface ProtocolToggleGroupProps {
  items: Array<{ protocol: string }>
  selectedIndices: Set<number>
  onChange: (index: number) => void
  className?: string
  recentlyClickedIndex?: number | null
  onHoverChange?: (index: number | null) => void
}

export function ProtocolToggleGroup({
  items,
  selectedIndices,
  onChange,
  className = "",
  recentlyClickedIndex = null,
  onHoverChange
}: ProtocolToggleGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  return (
    <div className={`mb-1 sm:mb-4 ${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {items.map((item, index) => {
          const ledger =
            BASE_LEDGERS[
              item.protocol.toLowerCase() as keyof typeof BASE_LEDGERS
            ]
          const color = ledger?.color || "rgba(128, 128, 128, 1)"
          const isChecked = selectedIndices.has(index)

          return (
            <div
              key={item.protocol}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-base-300 hover:bg-base-200 transition-all whitespace-nowrap ${
                recentlyClickedIndex === index ? "scale-105" : ""
              } ${hoveredIndex === index ? "ring-1 ring-offset-0" : ""}`}
              onMouseEnter={() => {
                setHoveredIndex(index)
                onHoverChange?.(index)
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
                onHoverChange?.(null)
              }}
              style={
                recentlyClickedIndex === index
                  ? {
                      boxShadow: `0 0 0 2px ${
                        BASE_LEDGERS[
                          item.protocol.toLowerCase() as keyof typeof BASE_LEDGERS
                        ]?.color || "rgba(128, 128, 128, 1)"
                      }`,
                      transition: "all 0.3s ease-out"
                    }
                  : hoveredIndex === index
                    ? {
                        boxShadow: `0 0 8px ${color}80`,
                        transition: "all 0.2s ease-out"
                      }
                    : { transition: "all 0.3s ease-out" }
              }
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    backgroundColor: color
                  }}
                />
                <span className="text-xs sm:text-sm font-medium capitalize">
                  {item.protocol}
                </span>
              </div>

              {/* iOS-Style Toggle Switch */}
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onChange(index)}
                  className="sr-only peer"
                />
                <div
                  className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-all duration-300 peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all ${
                    isChecked ? "bg-opacity-100" : "bg-base-200"
                  }`}
                  style={
                    isChecked
                      ? {
                          backgroundColor: color
                        }
                      : {}
                  }
                ></div>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
