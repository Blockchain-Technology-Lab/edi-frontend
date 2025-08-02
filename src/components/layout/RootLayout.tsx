import { Outlet } from '@tanstack/react-router';
import { Header, Sidebar, Footer, GoogleAnalytics, Breadcrumb, LoadingBar } from '@/components';
import { useKeyboardShortcuts } from '@/hooks';

export function RootLayout() {
    useKeyboardShortcuts();

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
                <label htmlFor="sidebar-toggle" className="btn btn-sm btn-ghost">
                    ☰ Menu
                </label>
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

                {/* Mobile Sidebar Drawer */}
                <div className="drawer md:hidden w-full">
                    <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Main Content - Mobile only */}
                        <main className="flex-1 overflow-y-auto bg-base-100 pb-20 mb-10">
                            <div className="p-6 min-h-full">
                                <Breadcrumb />
                                <Outlet />
                            </div>
                        </main>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="sidebar-toggle" className="drawer-overlay"></label>
                        <div className="w-64 min-h-full bg-base-200">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer - Full width */}
            <div className="bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-base-300">
                <Footer />
            </div>
        </div>
    );
}
