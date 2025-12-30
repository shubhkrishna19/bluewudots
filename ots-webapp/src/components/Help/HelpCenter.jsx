import React, { useState } from 'react';

const HelpCenter = () => {
    const [activeSection, setActiveSection] = useState('getting-started');

    const sections = [
        { id: 'getting-started', title: '🚀 Getting Started', icon: '🚀' },
        { id: 'shortcuts', title: '⌨️ Keyboard Shortcuts', icon: '⌨️' },
        { id: 'import', title: '📦 Importing Orders', icon: '📦' },
        { id: 'logistics', title: '🚚 Logistics Setup', icon: '🚚' },
        { id: 'dealers', title: '🤝 Dealer Management', icon: '🤝' },
        { id: 'faq', title: '❓ FAQ', icon: '❓' }
    ];

    const shortcuts = [
        { keys: ['Ctrl', 'N'], action: 'Create New Order' },
        { keys: ['Ctrl', 'K'], action: 'Focus Search Bar' },
        { keys: ['Ctrl', '1-9'], action: 'Switch Tabs' },
        { keys: ['Esc'], action: 'Close Modal/Panel' },
        { keys: ['?'], action: 'Open Help Center' }
    ];

    const faqs = [
        { q: 'How do I import orders from Amazon?', a: 'Go to Import → Select Amazon IN → Upload your CSV export from Seller Central.' },
        { q: 'Can I edit orders after import?', a: 'Orders are read-only in this version. Status can be changed via Bulk Actions or Order Journey.' },
        { q: 'How are carrier rates calculated?', a: 'Rates use base rate + weight-based additional charges + fuel surcharge + AWB fee.' },
        { q: 'Where is data stored?', a: 'Currently in browser memory. Zoho Catalyst integration for cloud persistence is planned.' }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'getting-started':
                return (
                    <div>
                        <h3>Welcome to Bluewud OTS</h3>
                        <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                            Bluewud OTS is an industrial-grade Order Tracking System designed for Pan-India logistics operations.
                        </p>
                        <div className="steps" style={{ marginTop: '24px' }}>
                            <div className="step glass" style={{ padding: '16px', marginBottom: '12px' }}>
                                <strong>Step 1:</strong> Import orders from your sales channels (Amazon, Flipkart, Shopify, etc.)
                            </div>
                            <div className="step glass" style={{ padding: '16px', marginBottom: '12px' }}>
                                <strong>Step 2:</strong> System applies MTP (commercial logic) and recommends carriers
                            </div>
                            <div className="step glass" style={{ padding: '16px', marginBottom: '12px' }}>
                                <strong>Step 3:</strong> Use Dispatch scanner to mark orders as shipped
                            </div>
                            <div className="step glass" style={{ padding: '16px' }}>
                                <strong>Step 4:</strong> Track order journey through delivery
                            </div>
                        </div>
                    </div>
                );

            case 'shortcuts':
                return (
                    <div>
                        <h3>Keyboard Shortcuts</h3>
                        <p className="text-muted" style={{ marginTop: '8px' }}>Speed up your workflow with these shortcuts</p>
                        <div className="shortcuts-list" style={{ marginTop: '24px' }}>
                            {shortcuts.map((s, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-accent)', borderRadius: '8px', marginBottom: '10px' }}>
                                    <span>{s.action}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {s.keys.map((key, i) => (
                                            <span key={i} style={{
                                                padding: '6px 12px',
                                                background: 'var(--glass-border)',
                                                borderRadius: '6px',
                                                fontFamily: 'monospace',
                                                fontSize: '0.85rem'
                                            }}>{key}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'import':
                return (
                    <div>
                        <h3>Importing Orders</h3>
                        <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                            Bluewud OTS supports importing orders from 8 sales channels:
                        </p>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '2' }}>
                            <li><strong>Amazon IN</strong> - SP-API integration (OAuth)</li>
                            <li><strong>Flipkart</strong> - Seller Hub CSV export</li>
                            <li><strong>Shopify</strong> - Orders CSV export</li>
                            <li><strong>Urban Ladder</strong> - Manual CSV</li>
                            <li><strong>Pepperfry</strong> - Manual CSV</li>
                            <li><strong>IndiaMART</strong> - Lead CSV</li>
                            <li><strong>Local Shop</strong> - Quick Order form</li>
                            <li><strong>Dealer</strong> - Dealer order form</li>
                        </ul>
                    </div>
                );

            case 'logistics':
                return (
                    <div>
                        <h3>Logistics Configuration</h3>
                        <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                            The system supports 4 primary carriers for Pan-India delivery:
                        </p>
                        <div className="carriers" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="glass" style={{ padding: '20px' }}>
                                <h4>Delhivery</h4>
                                <p className="text-muted">Surface & Express</p>
                            </div>
                            <div className="glass" style={{ padding: '20px' }}>
                                <h4>BlueDart</h4>
                                <p className="text-muted">Premium Air</p>
                            </div>
                            <div className="glass" style={{ padding: '20px' }}>
                                <h4>XpressBees</h4>
                                <p className="text-muted">High Volume</p>
                            </div>
                            <div className="glass" style={{ padding: '20px' }}>
                                <h4>Ecom Express</h4>
                                <p className="text-muted">Standard</p>
                            </div>
                        </div>
                    </div>
                );

            case 'dealers':
                return (
                    <div>
                        <h3>Dealer Management</h3>
                        <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                            Dealers are linked to your Zoho CRM Accounts module. The OTS app provides read-only access to dealer data.
                        </p>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '2' }}>
                            <li><strong>Dealer Codes</strong> - Unique identifiers from CRM</li>
                            <li><strong>Relationship Types</strong> - Distributor, Retailer, Franchise</li>
                            <li><strong>Credit Limits</strong> - Managed in CRM</li>
                            <li><strong>Order History</strong> - View-only in this app</li>
                        </ul>
                    </div>
                );

            case 'faq':
                return (
                    <div>
                        <h3>Frequently Asked Questions</h3>
                        <div className="faq-list" style={{ marginTop: '24px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="faq-item glass" style={{ padding: '20px', marginBottom: '12px' }}>
                                    <p style={{ fontWeight: '700', marginBottom: '8px' }}>Q: {faq.q}</p>
                                    <p className="text-muted">A: {faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="help-center animate-fade">
            <div className="section-header">
                <h2>Help Center</h2>
                <p className="text-muted">Documentation & Support</p>
            </div>

            <div className="help-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', marginTop: '32px' }}>
                {/* Sidebar */}
                <div className="help-nav glass" style={{ padding: '16px' }}>
                    {sections.map(s => (
                        <div
                            key={s.id}
                            className={`help-nav-item glass-hover ${activeSection === s.id ? 'active' : ''}`}
                            style={{
                                padding: '14px 16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: activeSection === s.id ? 'var(--primary)' : 'transparent'
                            }}
                            onClick={() => setActiveSection(s.id)}
                        >
                            <span style={{ marginRight: '10px' }}>{s.icon}</span>
                            {s.title.split(' ').slice(1).join(' ')}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="help-content glass" style={{ padding: '32px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
