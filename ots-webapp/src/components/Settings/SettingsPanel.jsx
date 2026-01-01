import React, { useState } from 'react';

const SettingsPanel = () => {
    const [settings, setSettings] = useState({
        companyName: 'Bluewud',
        defaultCarrier: 'delhivery',
        gstNumber: '29AABCU9603R1ZM',
        warehouse: 'Bangalore',
        autoAssignCarrier: true,
        emailNotifications: true,
        smsAlerts: false,
        pushNotifications: false
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
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div className="setting-item" style={{ marginBottom: '16px' }}>
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>GST NUMBER</label>
                        <input
                            type="text"
                            value={settings.gstNumber}
                            onChange={(e) => setSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div className="setting-item">
                        <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>PRIMARY WAREHOUSE</label>
                        <select
                            value={settings.warehouse}
                            onChange={(e) => setSettings(prev => ({ ...prev, warehouse: e.target.value }))}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="Bangalore">Bangalore, Karnataka</option>
                            <option value="Mumbai">Mumbai, Maharashtra</option>
                            <option value="Delhi">Delhi NCR</option>
                        </select>
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
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="delhivery">Delhivery</option>
                            <option value="bluedart">BlueDart</option>
                            <option value="xpressbees">XpressBees</option>
                            <option value="ecom">Ecom Express</option>
                        </select>
                    </div>

                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>Auto-Assign Carrier</p>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Automatically select cheapest carrier</span>
                        </div>
                        <div
                            className="toggle"
                            style={{
                                width: '50px',
                                height: '26px',
                                background: settings.autoAssignCarrier ? 'var(--primary)' : 'var(--glass-border)',
                                borderRadius: '13px',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background 0.3s'
                            }}
                            onClick={() => handleToggle('autoAssignCarrier')}
                        >
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: settings.autoAssignCarrier ? '26px' : '2px',
                                transition: 'left 0.3s'
                            }}></div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🔔 Notifications</h3>

                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>Email Notifications</p>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Order updates via email</span>
                        </div>
                        <div
                            className="toggle"
                            style={{
                                width: '50px',
                                height: '26px',
                                background: settings.emailNotifications ? 'var(--primary)' : 'var(--glass-border)',
                                borderRadius: '13px',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background 0.3s'
                            }}
                            onClick={() => handleToggle('emailNotifications')}
                        >
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: settings.emailNotifications ? '26px' : '2px',
                                transition: 'left 0.3s'
                            }}></div>
                        </div>
                    </div>

                    <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>SMS Alerts</p>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Critical alerts via SMS</span>
                        </div>
                        <div
                            className="toggle"
                            style={{
                                width: '50px',
                                height: '26px',
                                background: settings.smsAlerts ? 'var(--primary)' : 'var(--glass-border)',
                                borderRadius: '13px',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background 0.3s'
                            }}
                            onClick={() => handleToggle('smsAlerts')}
                        >
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: settings.smsAlerts ? '26px' : '2px',
                                transition: 'left 0.3s'
                            }}></div>
                        </div>
                    </div>
                </div>

                {/* Push Notification Toggle */}
                <div className="setting-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                    <div>
                        <p style={{ fontWeight: '600' }}>Push Notifications</p>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Real‑time web push alerts</span>
                    </div>
                    <div
                        className="toggle"
                        style={{
                            width: '50px',
                            height: '26px',
                            background: settings.pushNotifications ? 'var(--primary)' : 'var(--glass-border)',
                            borderRadius: '13px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'background 0.3s'
                        }}
                        onClick={() => handleToggle('pushNotifications')}
                    >
                        <div style={{
                            width: '22px',
                            height: '22px',
                            background: '#fff',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: settings.pushNotifications ? '26px' : '2px',
                            transition: 'left 0.3s'
                        }}></div>
                    </div>
                </div>

                {/* API Status */}
                <div className="settings-card glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>🔗 API Connections</h3>

                    <div className="api-status" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-accent)', borderRadius: '8px' }}>
                            <span>Zoho CRM</span>
                            <span className="badge" style={{ background: 'var(--warning)' }}>PENDING</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-accent)', borderRadius: '8px' }}>
                            <span>Amazon SP-API</span>
                            <span className="badge" style={{ background: 'var(--warning)' }}>PENDING</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-accent)', borderRadius: '8px' }}>
                            <span>Delhivery API</span>
                            <span className="badge" style={{ background: 'var(--warning)' }}>PENDING</span>
                        </div>
                    </div>

                    <p className="text-muted" style={{ marginTop: '16px', fontSize: '0.75rem', textAlign: 'center' }}>
                        API integrations will be configured in Phase 6
                    </p>
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
