import { ReactNode } from "react"

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="t-12 font-bold bg-aqua-500 text-black px-2 py-1 rounded-md">
      {children}
    </span>
  )
}
