import React from 'react';
import './MobileBottomNav.css';

const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'orderlist', label: 'Orders', icon: '📦' },
    { id: 'orders', label: 'Import', icon: '📥' },
    { id: 'finance', label: 'P&L', icon: '💹' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
];

const MobileBottomNav = ({ activeTab, onTabChange }) => {
    return (
        <nav className="mobile-bottom-nav glass">
            {navItems.map((item) => (
                <div
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </div>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
