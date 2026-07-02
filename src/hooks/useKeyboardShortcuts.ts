import { useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LAYER_CONFIG, LAYER_KEYS } from '@/config/layers'
import { homeTo } from '@/routes/routePaths'

const scrollToTop = () => {
  const mainElement =
    document.querySelector('main[class*="overflow-y-auto"]') ||
    document.querySelector('main')
  if (mainElement) {
    mainElement.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const showShortcutFeedback = (message: string) => {
  document.dispatchEvent(new CustomEvent('shortcut-used', { detail: { message } }))
}

// Derived at module load time from LAYER_CONFIG so they stay in sync automatically.
const NAV_SHORTCUTS: Record<string, { to: string; message: string }> = {
  h: { to: homeTo, message: 'Navigated to Home' },
  '0': { to: homeTo, message: 'Navigated to Home' },
}

LAYER_KEYS
  .filter(key => LAYER_CONFIG[key].enabled)
  .forEach((key, i) => {
    NAV_SHORTCUTS[String(i + 1)] = {
      to: LAYER_CONFIG[key].path,
      message: `Navigated to ${LAYER_CONFIG[key].label} Layer`,
    }
  })

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const navigateToPath = useCallback(
    (to: string) => navigate({ to: to as never }),
    [navigate]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        target.tagName === 'SELECT'
      ) {
        return
      }

      if (!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
        const shortcut = NAV_SHORTCUTS[event.key.toLowerCase()]
        if (shortcut) {
          event.preventDefault()
          navigateToPath(shortcut.to)
          showShortcutFeedback(shortcut.message)
        }
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Home':
            event.preventDefault()
            scrollToTop()
            showShortcutFeedback('Scrolled to top')
            break
          case '/': {
            event.preventDefault()
            const searchInput = document.querySelector(
              'input[type="search"], input[placeholder*="search" i]'
            ) as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
              showShortcutFeedback('Focused search')
            }
            break
          }
        }
      }

      if (event.key === 'Escape') {
        const drawerToggle = document.getElementById('sidebar-toggle') as HTMLInputElement
        if (drawerToggle?.checked) {
          drawerToggle.checked = false
          showShortcutFeedback('Closed sidebar')
        }
        document.querySelectorAll('.modal-open').forEach(modal => {
          modal.classList.remove('modal-open')
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigateToPath])

  const layerShortcuts = Object.fromEntries(
    LAYER_KEYS
      .filter(key => LAYER_CONFIG[key].enabled)
      .map((key, i) => [String(i + 1), `${LAYER_CONFIG[key].label} Layer`])
  )

  return {
    shortcuts: {
      ...layerShortcuts,
      H: 'Home',
      'Ctrl/Cmd + Home': 'Back to top',
    }
  }
}
