import { Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Header,
  Sidebar,
  Footer,
  GoogleAnalytics,
  Breadcrumb,
  LoadingBar
} from '@/components'
import { useKeyboardShortcuts } from '@/hooks'
import { Menu, X } from 'lucide-react'

export function RootLayout() {
  useKeyboardShortcuts()
  const { location } = useRouterState()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobileSidebarOpen])

  return (
    <div className="h-screen flex flex-col">
      <GoogleAnalytics />
      <LoadingBar />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-300">
        <Header />
      </div>

      {/* Mobile Menu Toggle - Fixed */}
      <div className="md:hidden fixed top-16 left-2 z-40">
        <button
          type="button"
          className="btn btn-sm btn-outline bg-base-100/90 backdrop-blur border-base-300 shadow-sm"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={16} />
          <span className="text-xs font-semibold tracking-wide">Layers</span>
        </button>
      </div>

      {/* Main Container with top padding to account for fixed header */}
      <div className="flex flex-1 pt-24">
        {/* Fixed Sidebar - Desktop only */}
        <div className="fixed left-0 top-28 bottom-1 z-30 w-48 hidden md:block">
          <div className="h-full overflow-y-auto bg-base-200 border-r border-base-300">
            <Sidebar />
          </div>
        </div>

        {/* Main Content - Desktop only */}
        <main className="flex-1 overflow-y-auto bg-base-100 pb-20 mb-10 hidden md:block ml-48">
          <div className="p-6 min-h-full">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-y-auto bg-base-100 pb-20 mb-10 md:hidden">
          <div className="p-6 min-h-full">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          aria-label="Close sidebar overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <aside
        className={`md:hidden fixed left-0 top-24 bottom-0 z-50 w-60 sm:w-64 bg-base-200/95 backdrop-blur-md border-r border-base-300 shadow-xl transform transition-transform duration-200 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileSidebarOpen}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-200/95 px-3 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/70">
            Navigation
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={14} />
          </button>
        </div>
        <div className="h-[calc(100%-41px)] overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* Fixed Footer - Full width */}
      <div className="bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-base-300">
        <Footer />
      </div>
    </div>
  )
}
