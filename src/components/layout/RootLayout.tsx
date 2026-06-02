import { Outlet } from '@tanstack/react-router'
import { Header, TopNav, Footer, GoogleAnalytics, Breadcrumb, LoadingBar } from '@/components'
import { useKeyboardShortcuts } from '@/hooks'

export function RootLayout() {
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <GoogleAnalytics />
      <LoadingBar />

      {/* Fixed header + nav bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        <TopNav />
      </div>

      {/* Spacer — same height as the fixed header+nav so content starts below it */}
      <div className="h-32 shrink-0" aria-hidden="true" />

      {/* Main content — window scrolls, no inner scroll container */}
      <main className="flex-1 pb-16">
        <div className="px-4 sm:px-6 py-5 sm:py-6">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <div className="bg-base-100 border-t border-base-300">
        <Footer />
      </div>
    </div>
  )
}
