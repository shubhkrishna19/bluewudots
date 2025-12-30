import React, { useState } from 'react';

const RoadmapPage = () => {
    const [selectedPhase, setSelectedPhase] = useState(null);

    const completedFeatures = [
        { name: 'Analytics Dashboard', desc: 'Real-time business metrics with interactive charts', status: 'live', module: 'Dashboard' },
        { name: 'Multi-Channel Order Import', desc: 'Import orders from Amazon, Flipkart, Shopify, and 5 more platforms', status: 'live', module: 'Automation' },
        { name: 'Order Management', desc: 'Search, filter, and track all orders in one place', status: 'live', module: 'Orders' },
        { name: 'Bulk Operations', desc: 'Update multiple orders at once - save hours of work', status: 'live', module: 'Orders' },
        { name: 'Carrier Selection', desc: 'Compare shipping rates from 4 major carriers instantly', status: 'live', module: 'Logistics' },
        { name: 'Pan-India Zone Mapping', desc: 'Visualize order distribution across all 28 states', status: 'live', module: 'Logistics' },
        { name: 'Barcode Dispatch Scanner', desc: 'Scan products with your phone camera to mark as shipped', status: 'live', module: 'Dispatch' },
        { name: 'SKU/Product Master', desc: 'Track profitability with GST calculations built-in', status: 'live', module: 'Commercial' },
        { name: 'Dealer Network', desc: 'View all dealers and their order history from CRM', status: 'live', module: 'Dealers' },
        { name: 'Activity Audit Log', desc: 'Complete history of all system activities', status: 'live', module: 'Activity' },
        { name: 'Export Reports', desc: 'Download data as CSV or JSON for analysis', status: 'live', module: 'Reports' },
        { name: 'Quick Order Creation', desc: 'Add orders manually in seconds', status: 'live', module: 'Orders' },
        { name: 'Notification Center', desc: 'Stay updated on important events', status: 'live', module: 'System' },
        { name: 'Settings Panel', desc: 'Configure app preferences and API connections', status: 'live', module: 'System' }
    ];

    const upcomingFeatures = [
        { name: 'Amazon SP-API Integration', desc: 'Automatic order sync directly from Amazon Seller Central', phase: 'Phase 6', priority: 'High' },
        { name: 'Flipkart API Integration', desc: 'Real-time order import from Flipkart Seller Hub', phase: 'Phase 6', priority: 'High' },
        { name: 'Carrier Label Generation', desc: 'Generate shipping labels directly from Delhivery/BlueDart APIs', phase: 'Phase 6', priority: 'High' },
        { name: 'Zoho CRM Live Sync', desc: 'Real-time dealer and account data from your CRM', phase: 'Phase 6', priority: 'Medium' },
        { name: 'Mobile Responsive Design', desc: 'Full functionality on tablets and phones', phase: 'Phase 7', priority: 'Medium' },
        { name: 'WhatsApp Notifications', desc: 'Send order updates via WhatsApp to customers', phase: 'Phase 7', priority: 'Low' },
        { name: 'Customer Portal', desc: 'Let customers track their orders online', phase: 'Phase 8', priority: 'Low' },
        { name: 'Advanced Analytics', desc: 'Predictive insights and trend analysis', phase: 'Phase 8', priority: 'Low' }
    ];

    const developmentPhases = [
        { phase: 'Phase 1-4', title: 'Foundation', status: 'Complete', desc: 'Core architecture, design system, basic modules' },
        { phase: 'Phase 5', title: 'MVP Polish', status: 'Complete', desc: '14+ modules with full functionality' },
        { phase: 'Phase 6', title: 'API Integrations', status: 'In Progress', desc: 'Connect to Amazon, Flipkart, carriers' },
        { phase: 'Phase 7', title: 'Mobile & Scale', status: 'Planned', desc: 'Responsive design and performance optimization' },
        { phase: 'Phase 8', title: 'Intelligence', status: 'Future', desc: 'AI-powered insights and automation' }
    ];

    const techStack = [
        { name: 'React 19', purpose: 'User Interface', icon: '⚛️' },
        { name: 'Vite', purpose: 'Build Tool', icon: '⚡' },
        { name: 'Recharts', purpose: 'Charts & Graphs', icon: '📊' },
        { name: 'Zoho Catalyst', purpose: 'Cloud Backend', icon: '☁️' },
        { name: 'Zoho CRM', purpose: 'Customer Data', icon: '👥' }
    ];

    return (
        <div className="roadmap-page animate-fade">
            {/* Hero Section */}
            <div className="roadmap-hero glass" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.2))' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Bluewud OTS Roadmap</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Building the future of logistics management for Indian e-commerce. Here's what we've accomplished and where we're headed.
                </p>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
                    <div>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--success)' }}>{completedFeatures.length}</p>
                        <span className="text-muted">Features Live</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>{upcomingFeatures.length}</p>
                        <span className="text-muted">In Pipeline</span>
                    </div>
                </div>
            </div>

            {/* Development Timeline */}
            <div style={{ marginTop: '40px' }}>
                <h2>Development Timeline</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Our phased approach to building industrial-grade software</p>

                <div className="phases-timeline" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                    {developmentPhases.map((p, idx) => (
                        <div
                            key={idx}
                            className="phase-card glass glass-hover"
                            style={{
                                minWidth: '200px',
                                padding: '24px',
                                borderTop: `4px solid ${p.status === 'Complete' ? 'var(--success)' : p.status === 'In Progress' ? 'var(--primary)' : 'var(--glass-border)'}`
                            }}
                        >
                            <span className="badge" style={{
                                background: p.status === 'Complete' ? 'var(--success)' :
                                    p.status === 'In Progress' ? 'var(--primary)' : 'var(--glass-border)',
                                fontSize: '0.65rem'
                            }}>{p.status}</span>
                            <h3 style={{ marginTop: '12px' }}>{p.phase}</h3>
                            <p style={{ fontWeight: '700', marginTop: '4px' }}>{p.title}</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completed Features */}
            <div style={{ marginTop: '40px' }}>
                <h2>✅ What's Already Built</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>These features are live and ready to use today</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {completedFeatures.map((f, idx) => (
                        <div key={idx} className="feature-card glass" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4>{f.name}</h4>
                                <span className="badge" style={{ background: 'var(--success)', fontSize: '0.6rem' }}>LIVE</span>
                            </div>
                            <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.9rem' }}>{f.desc}</p>
                            <span style={{
                                marginTop: '12px',
                                display: 'inline-block',
                                padding: '4px 10px',
                                background: 'var(--bg-accent)',
                                borderRadius: '12px',
                                fontSize: '0.7rem'
                            }}>{f.module}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Features */}
            <div style={{ marginTop: '40px' }}>
                <h2>🚀 What's Coming Next</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Features in our development pipeline</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {upcomingFeatures.map((f, idx) => (
                        <div key={idx} className="feature-card glass glass-hover" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4>{f.name}</h4>
                                <span className="badge" style={{
                                    background: f.priority === 'High' ? 'var(--danger)' :
                                        f.priority === 'Medium' ? 'var(--warning)' : 'var(--glass-border)',
                                    fontSize: '0.6rem'
                                }}>{f.priority}</span>
                            </div>
                            <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.9rem' }}>{f.desc}</p>
                            <span style={{
                                marginTop: '12px',
                                display: 'inline-block',
                                padding: '4px 10px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                fontSize: '0.7rem'
                            }}>{f.phase}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div style={{ marginTop: '40px' }}>
                <h2>🛠️ Technology Stack</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Built with modern, proven technologies</p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {techStack.map((t, idx) => (
                        <div key={idx} className="tech-card glass" style={{ padding: '20px', minWidth: '150px', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                            <p style={{ fontWeight: '700', marginTop: '8px' }}>{t.name}</p>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{t.purpose}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="glass" style={{ marginTop: '40px', padding: '24px', textAlign: 'center' }}>
                <p className="text-muted">
                    Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} •
                    Development led by Bluewud Engineering Team
                </p>
            </div>
        </div>
    );
};

export default RoadmapPage;
