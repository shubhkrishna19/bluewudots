import React from 'react';
import './MobileBottomNav.css';

const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠', activeIcon: '🏡' },
    { id: 'orderlist', label: 'Orders', icon: '📦', activeIcon: '📬' },
    { id: 'orders', label: 'Import', icon: '📥', activeIcon: '⬇️' },
    { id: 'finance', label: 'P&L', icon: '💹', activeIcon: '📈' },
    { id: 'settings', label: 'More', icon: '⚙️', activeIcon: '🔧' }
];

const MobileBottomNav = ({ activeTab, onTabChange, notificationCount = 0 }) => {
    const handleTap = (id) => {
        // Haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        onTabChange(id);
    };

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
                        aria-label={item.label}
                    >
                        <div className="nav-icon-wrapper">
                            <span className="nav-icon">
                                {activeTab === item.id ? item.activeIcon : item.icon}
                            </span>
                            {item.id === 'orderlist' && notificationCount > 0 && (
                                <span className="notification-badge">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </div>
                        <span className="nav-label">{item.label}</span>
                        {activeTab === item.id && <div className="active-indicator"></div>}
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
