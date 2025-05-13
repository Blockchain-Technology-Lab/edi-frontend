import { useEffect, useState } from "react"

export function useWithoutTorToggle() {
  const [showWithoutTor, setShowWithoutTor] = useState(false)

  useEffect(() => {
    const storedValue = localStorage.getItem("showWithoutTor")
    setShowWithoutTor(storedValue === "true")
  }, [])

  const handleToggle = (value: boolean) => {
    setShowWithoutTor(value)
    localStorage.setItem("showWithoutTor", String(value))
  }

  return { showWithoutTor, handleToggle }
}
