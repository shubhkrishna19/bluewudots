import React, { useState } from 'react';
import TwoFactorAuth from './TwoFactorAuth';
import IPWhitelistManager from './IPWhitelistManager';

const SettingsPanel = () => {
    const [settings, setSettings] = useState({
        companyName: 'Bluewud',
        defaultCarrier: 'delhivery',
        gstNumber: '29AABCU9603R1ZM',
        warehouse: 'Bangalore',
        autoAssignCarrier: true,
        emailNotifications: true,
        smsAlerts: false,
        pushNotifications: false,
        minMargin: 12.0,
        criticalMargin: 5.0
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="settings-panel animate-fade">
            <div className="section-header">
                <h2>System Configuration</h2>
                <p className="text-muted">Application Settings & Preferences</p>
            </div>

            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>

                {/* Company Settings */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🏢 Company Profile</h3>
                    <div className="setting-item" style={{ marginBottom: '16px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>COMPANY NAME</label>
                        <input
                            type="text"
                            value={settings.companyName}
                            onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div className="setting-item" style={{ marginBottom: '16px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>GST NUMBER</label>
                        <input
                            type="text"
                            value={settings.gstNumber}
                            onChange={(e) => setSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                </div>

                {/* Logistics Settings */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🚚 Logistics Preferences</h3>
                    <div className="setting-item" style={{ marginBottom: '16px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>DEFAULT CARRIER</label>
                        <select
                            value={settings.defaultCarrier}
                            onChange={(e) => setSettings(prev => ({ ...prev, defaultCarrier: e.target.value }))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        >
                            <option value="delhivery">Delhivery</option>
                            <option value="bluedart">BlueDart</option>
                            <option value="xpressbees">XpressBees</option>
                        </select>
                    </div>
                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                        <p style={{ fontWeight: '600' }}>Auto-Assign Carrier</p>
                        <div
                            className="toggle"
                            style={{ width: '44px', height: '22px', background: settings.autoAssignCarrier ? 'var(--primary)' : 'var(--glass-border)', borderRadius: '11px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => handleToggle('autoAssignCarrier')}
                        >
                            <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.autoAssignCarrier ? '24px' : '2px', transition: '0.2s' }} />
                        </div>
                    </div>
                </div>

                {/* Financial Guardrails */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🛡️ Financial Guardrails</h3>
                    <div className="setting-item" style={{ marginBottom: '16px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>TARGET MARGIN (%)</label>
                        <input
                            type="number"
                            value={settings.minMargin}
                            onChange={(e) => setSettings(prev => ({ ...prev, minMargin: parseFloat(e.target.value) }))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div className="setting-item">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>CRITICAL MARGIN BLOCK (%)</label>
                        <input
                            type="number"
                            value={settings.criticalMargin}
                            onChange={(e) => setSettings(prev => ({ ...prev, criticalMargin: parseFloat(e.target.value) }))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--danger)' }}
                        />
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🔔 Notifications</h3>
                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontWeight: '600' }}>Push Notifications</p>
                        <div
                            className="toggle"
                            style={{ width: '44px', height: '22px', background: settings.pushNotifications ? 'var(--primary)' : 'var(--glass-border)', borderRadius: '11px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => handleToggle('pushNotifications')}
                        >
                            <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.pushNotifications ? '24px' : '2px', transition: '0.2s' }} />
                        </div>
                    </div>
                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                        <p style={{ fontWeight: '600' }}>WhatsApp Alerts</p>
                        <div
                            className="toggle"
                            style={{ width: '44px', height: '22px', background: settings.smsAlerts ? 'var(--primary)' : 'var(--glass-border)', borderRadius: '11px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => handleToggle('smsAlerts')}
                        >
                            <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.smsAlerts ? '24px' : '2px', transition: '0.2s' }} />
                        </div>
                    </div>
                </div>

                {/* Security Settings (Enterprise Integration) */}
                <div className="settings-card glass" style={{ padding: '24px', gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '20px' }}>🔐 Enterprise Security Suite</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <TwoFactorAuth
                            userId="ADMIN-001"
                            onVerificationSuccess={() => console.log('2FA Enabled')}
                            onCancel={() => console.log('2FA Setup Cancelled')}
                        />
                        <IPWhitelistManager onIpListUpdate={(list) => console.log('IP Whitelist Updated', list)} />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <button className="btn-primary glass-hover" style={{ padding: '14px 40px' }}>
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;
