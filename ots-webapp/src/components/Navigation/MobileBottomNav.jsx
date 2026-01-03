import React from 'react'
import './MobileBottomNav.css'
import { useTranslation } from '../../context/LocalizationContext'

const navItems = [
  { id: 'dashboard', label_key: 'nav.dashboard', icon: '🏠', activeIcon: '🏡' },
  { id: 'orderlist', label_key: 'nav.orders', icon: '📦', activeIcon: '📬' },
  { id: 'orders', label_key: 'nav.importer', icon: '📥', activeIcon: '⬇️' },
  { id: 'finance', label_key: 'nav.finance', icon: '💹', activeIcon: '📈' },
  { id: 'settings', label_key: 'nav.settings', icon: '⚙️', activeIcon: '🔧' },
]

const MobileBottomNav = ({ activeTab, onTabChange, notificationCount = 0 }) => {
  const { t } = useTranslation()
  const handleTap = (id) => {
    // Haptic feedback for supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    onTabChange(id)
  }

  return (
    <nav className="mobile-bottom-nav">
      <div className="nav-backdrop"></div>
      <div className="nav-items-container">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleTap(item.id)}
            role="button"
            tabIndex={0}
            aria-label={t(item.label_key)}
            aria-pressed={activeTab === item.id}
          >
            <div className={`nav-icon-wrapper ${activeTab === item.id ? 'bounce' : ''}`}>
              <span className="nav-icon">
                {activeTab === item.id ? item.activeIcon : item.icon}
              </span>
              {item.id === 'orderlist' && notificationCount > 0 && (
                <span className="notification-badge pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>
            <span className="nav-label">{t(item.label_key)}</span>
            {activeTab === item.id && <div className="active-indicator"></div>}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default MobileBottomNav
