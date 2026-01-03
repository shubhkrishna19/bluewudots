/**
 * ResponsiveLayout.jsx
 * Responsive layout component for Bluewud OTS
 * Provides adaptive layouts for desktop, tablet, and mobile views
 * Uses Bluewud Dark Elite glassmorphism theme
 */

import React, { useState, useCallback } from 'react'

const ResponsiveLayout = ({
  children,
  sidebar = null,
  header = null,
  footer = null,
  theme = 'dark',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    type: 'desktop',
  })

  // Determine viewport type
  const getViewportType = (width) => {
    if (width < 640) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  // Handle window resize
  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const height = window.innerHeight
      setViewportSize({
        width,
        height,
        type: getViewportType(width),
      })
      // Auto-collapse sidebar on mobile
      if (width < 1024) setSidebarOpen(false)
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const isMobile = viewportSize.type === 'mobile'
  const isTablet = viewportSize.type === 'tablet'
  const isDesktop = viewportSize.type === 'desktop'

  return (
    <div className={`responsive-layout theme-${theme}`}>
      {/* Header */}
      {header && (
        <header className="layout-header glass">
          {!isDesktop && sidebar && (
            <button
              className="sidebar-toggle glass-hover"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          )}
          {header}
        </header>
      )}

      {/* Main Layout */}
      <div className="layout-main">
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={`layout-sidebar glass ${sidebarOpen ? 'open' : 'closed'}`}
            role="complementary"
          >
            {sidebar}
          </aside>
        )}

        {/* Content */}
        <main className="layout-content">{children}</main>
      </div>

      {/* Footer */}
      {footer && <footer className="layout-footer glass">{footer}</footer>}

      <style>{`
        .responsive-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .layout-header {
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 100;
        }

        .layout-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .layout-sidebar {
          width: 280px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: auto;
          transition: all 0.3s ease;
          padding: 1rem;
        }

        .layout-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .layout-footer {
          padding: 1rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .sidebar-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .layout-sidebar {
            position: absolute;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 99;
            transform: translateX(-100%);
            width: 260px;
          }

          .layout-sidebar.open {
            transform: translateX(0);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          }

          .sidebar-toggle {
            display: block;
          }

          .layout-content {
            width: 100%;
          }
        }

        /* Mobile */
        @media (max-width: 639px) {
          .layout-header {
            padding: 0.75rem 1rem;
          }

          .layout-content {
            padding: 1rem;
          }

          .layout-footer {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .layout-sidebar {
            width: 240px;
          }
        }

        /* Glass morphism theme */
        .glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .glass-hover:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}

export default ResponsiveLayout
