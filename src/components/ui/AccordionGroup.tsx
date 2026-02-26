import { useState } from 'react'

interface AccordionItem {
  id: string | number
  title: React.ReactNode
  content: React.ReactNode
  icon?: React.ComponentType<{
    size?: number
    className?: string
    style?: React.CSSProperties
  }>
}

interface AccordionGroupProps {
  items: AccordionItem[]
  label?: string
  className?: string
  itemClassName?: string
  titleClassName?: string
  contentClassName?: string
  iconSize?: number
  iconColor?: string
  allowMultiple?: boolean
}

export function AccordionGroup({
  items,
  label,
  className = '',
  itemClassName = 'collapse collapse-arrow bg-base-300 border border-base-300',
  titleClassName = 'collapse-title text-sm sm:text-base font-semibold cursor-pointer py-2 sm:py-3',
  contentClassName = 'collapse-content text-xs sm:text-sm',
  iconSize = 14,
  iconColor = 'rgba(128, 128, 128, 1)',
  allowMultiple = false
}: AccordionGroupProps) {
  const [openIndices, setOpenIndices] = useState<Set<string | number>>(
    new Set()
  )

  const handleToggle = (id: string | number) => {
    const newOpenIndices = new Set(openIndices)

    if (allowMultiple) {
      if (newOpenIndices.has(id)) {
        newOpenIndices.delete(id)
      } else {
        newOpenIndices.add(id)
      }
    } else {
      if (newOpenIndices.has(id)) {
        newOpenIndices.clear()
      } else {
        newOpenIndices.clear()
        newOpenIndices.add(id)
      }
    }

    setOpenIndices(newOpenIndices)
  }

  return (
    <div className={className}>
      {label && (
        <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
          {label}
        </h4>
      )}
      <div className="space-y-2">
        {items.map((item) => {
          const isOpen = openIndices.has(item.id)
          const Icon = item.icon

          return (
            <div key={item.id} className={itemClassName}>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={() => handleToggle(item.id)}
              />
              <div
                className={titleClassName}
                onClick={() => handleToggle(item.id)}
              >
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon
                      size={iconSize}
                      style={{ color: iconColor }}
                      className="flex-shrink-0 sm:w-4 sm:h-4"
                    />
                  )}
                  <span>{item.title}</span>
                </div>
              </div>
              <div
                className={`${contentClassName} ${
                  isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
                }`}
              >
                <div className="pt-1 sm:pt-2">
                  {typeof item.content === 'string' ? (
                    <p className="text-base-content/80 leading-relaxed">
                      {item.content}
                    </p>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
