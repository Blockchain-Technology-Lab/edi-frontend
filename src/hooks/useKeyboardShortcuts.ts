import { useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

// Helper function to scroll to top
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

// Helper function to show shortcut feedback
const showShortcutFeedback = (message: string) => {
  const event = new CustomEvent('shortcut-used', {
    detail: { message }
  })
  document.dispatchEvent(event)
}

const NAV_SHORTCUTS: Record<string, { to: string; message: string }> = {
  '1': { to: '/consensus', message: 'Navigated to Consensus Layer' },
  '2': { to: '/tokenomics', message: 'Navigated to Tokenomics Layer' },
  '3': { to: '/network', message: 'Navigated to Network Layer' },
  '4': { to: '/software', message: 'Navigated to Software Layer' },
  '5': { to: '/geography', message: 'Navigated to Geography Layer' },
  '6': { to: '/governance', message: 'Navigated to Governance Layer' },
  h: { to: '/', message: 'Navigated to Home' }
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const navigateToPath = useCallback(
    (to: string) => navigate({ to: to as never }),
    [navigate]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input or textarea
      const target = event.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        target.tagName === 'SELECT'
      ) {
        return
      }

      // Simple number and letter shortcuts (no modifiers needed)
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey
      ) {
        const shortcut = NAV_SHORTCUTS[event.key.toLowerCase()]
        if (shortcut) {
          event.preventDefault()
          navigateToPath(shortcut.to)
          showShortcutFeedback(shortcut.message)
        }
      }

      // Keyboard shortcuts with modifiers
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Home':
            // Ctrl/Cmd + Home = Back to top
            event.preventDefault()
            scrollToTop()
            showShortcutFeedback('Scrolled to top')
            break
          case '/':
            {
              // Focus search if it exists
              event.preventDefault()
              const searchInput = document.querySelector(
                'input[type="search"], input[placeholder*="search" i]'
              ) as HTMLInputElement
              if (searchInput) {
                searchInput.focus()
                showShortcutFeedback('Focused search')
              }
            }
            break
        }
      }

      // Other shortcuts
      if (event.key === 'Escape') {
        const drawerToggle = document.getElementById(
          'sidebar-toggle'
        ) as HTMLInputElement
        if (drawerToggle?.checked) {
          drawerToggle.checked = false
          showShortcutFeedback('Closed sidebar')
        }

        const modals = document.querySelectorAll('.modal-open')
        if (modals.length > 0) {
          modals.forEach((modal) => {
            modal.classList.remove('modal-open')
          })
          showShortcutFeedback('Closed modals')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, { passive: false })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigateToPath])

  return {
    shortcuts: {
      '1': 'Consensus Layer',
      '2': 'Tokenomics Layer',
      '3': 'Network Layer',
      '4': 'Software Layer',
      '5': 'Geography Layer',
      '6': 'Governance Layer',
      H: 'Home',
      'Ctrl/Cmd + Home': 'Back to top'
    }
  }
}
