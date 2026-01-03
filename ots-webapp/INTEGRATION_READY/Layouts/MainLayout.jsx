import React from 'react'
import { Outlet } from 'react-router-dom'
import KeyboardShortcutsHud from '../Components/KeyboardShortcutsHud'
import OrderNotificationCenter from '../Components/OrderNotificationCenter'

/**
 * MainLayout Component
 * Primary layout wrapper for authenticated pages
 * Includes header, sidebar, main content area, and footer
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Bluewud OTS</h1>
          </div>
          <div className="flex items-center gap-4">
            <OrderNotificationCenter />
            <KeyboardShortcutsHud />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
          <p>© 2026 Bluewud Order Tracking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
