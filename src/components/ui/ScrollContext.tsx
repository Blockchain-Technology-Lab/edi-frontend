// src/context/ScrollContext.tsx
import {
  createContext,
  useRef,
  useContext,
  useCallback,
  ReactNode
} from "react"

type ScrollContextType = {
  scrollToSection: (sectionId: string) => void
  registerRef: (id: string, ref: React.RefObject<HTMLElement>) => void
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

const refMap: Record<string, React.RefObject<HTMLElement>> = {}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const registerRef = useCallback(
    (id: string, ref: React.RefObject<HTMLElement>) => {
      refMap[id] = ref
    },
    []
  )

  const scrollToSection = useCallback((id: string) => {
    const ref = refMap[id]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const contextValue: ScrollContextType = {
    scrollToSection,
    registerRef
  }

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}
