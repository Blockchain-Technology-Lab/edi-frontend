import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300)
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility()
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-50 btn btn-circle btn-primary shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible
          ? 'opacity-90 translate-y-0 hover:opacity-100 hover:scale-110'
          : 'opacity-0 translate-y-16 pointer-events-none'
        }
      `}
      aria-label="Back to top"
      title="Back to top (Ctrl + Home)"
    >
      <FontAwesomeIcon icon={faArrowUp} size="lg" />
    </button>
  )
}
