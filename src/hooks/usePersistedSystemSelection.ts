import { useCallback, useState } from 'react'

function loadPersistedSystems(
  storageKey: string,
  defaultSystems: string[]
): Set<string> {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? new Set(JSON.parse(saved)) : new Set(defaultSystems)
  } catch {
    return new Set(defaultSystems)
  }
}

export function usePersistedSystemSelection(
  storageKey: string,
  defaultSystems: string[]
) {
  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(() =>
    loadPersistedSystems(storageKey, defaultSystems)
  )

  const persist = useCallback(
    (systems: Set<string>) => {
      localStorage.setItem(storageKey, JSON.stringify([...systems]))
    },
    [storageKey]
  )

  const handleSelectionChange = useCallback(
    (selected: Set<string>) => {
      setSelectedSystems(selected)
      persist(selected)
    },
    [persist]
  )

  const handleSystemToggle = useCallback(
    (system: string) => {
      const next = new Set(selectedSystems)
      if (next.has(system)) {
        next.delete(system)
      } else {
        next.add(system)
      }
      setSelectedSystems(next)
      persist(next)
    },
    [selectedSystems, persist]
  )

  return {
    selectedSystems,
    setSelectedSystems,
    handleSelectionChange,
    handleSystemToggle
  }
}
