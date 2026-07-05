import { useRef, useState, type HTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'

export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — nothing sensible to fall back to.
    }
  }

  return (
    <div className="relative w-fit max-w-full">
      <pre ref={preRef} {...props} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-xl bg-gradient-to-l from-base-300 to-transparent" />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition-colors"
      >
        <FontAwesomeIcon
          icon={copied ? faCheck : faCopy}
          className={`w-3.5 h-3.5 ${copied ? 'text-success' : ''}`}
        />
      </button>
    </div>
  )
}
