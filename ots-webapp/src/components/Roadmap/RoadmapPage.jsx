import React, { useState } from 'react';

const RoadmapPage = () => {
    const [selectedPhase, setSelectedPhase] = useState(null);

    const completedFeatures = [
        { name: 'Data Migration Ready', desc: 'Core logic for mapping 10+ legacy Excel masters (SKU, Sales, Customers) is active', status: 'live', module: 'System' },
        { name: 'MTP Commercial Engine', desc: 'Tiered pricing logic (BAU/Usual/Event) with 18% GST and marketplace commissions', status: 'live', module: 'Commercial' },
        { name: 'Analytics Hub', desc: 'Financial and logistical KPIs modeled after historical Zoho data', status: 'live', module: 'Dashboard' },
        { name: 'Universal Importer v2', desc: 'Multi-source mapping (Amazon/Flipkart) with Alias Resolution support', status: 'live', module: 'Automation' },
        { name: 'Logistics Matrix', desc: 'Zone-based rate calculations for 4 major carriers (Delhivery, BlueDart, etc.)', status: 'live', module: 'Logistics' },
        { name: 'Inventory & WMS', desc: 'Parent-Child SKU tracking with low-stock alerts and profitability mapping', status: 'live', module: 'Warehouse' },
        { name: 'SKU Inheritance', desc: 'Parent->Child attribute inheritance (Dimensions, Weight, Costing) is fully functional', status: 'live', module: 'Warehouse' },
        { name: 'Revenue Fidelity', desc: 'High-precision P&L with inclusive GST, Shipping, and Platform Fees', status: 'live', module: 'Commercial' },
        { name: 'Data Unification', desc: 'Global deduplication engine for Orders and Customers (Phone/Email mapping)', status: 'live', module: 'Core' },
        { name: 'Elite UI Refactor', desc: 'Grouped navigation and invisible sliding scrollbars for premium experience', status: 'live', module: 'UX' },
        { name: 'PWA Ready', desc: 'Installable app with offline caching and service worker for reliability', status: 'live', module: 'Mobile' },
        { name: 'WhatsApp Updates', desc: 'Template-based order notifications via WhatsApp Business API integration', status: 'live', module: 'Notifications' },
        { name: 'Predictive Analytics', desc: 'AI-driven demand forecasting and carrier selection', status: 'live', module: 'Intelligence' },
        { name: 'Auto Carrier Selection', desc: 'Smart routing based on cost, speed and reliability', status: 'live', module: 'Intelligence' },
        { name: 'Demand Forecasting', desc: 'Inventory planning using historical sales trends', status: 'live', module: 'Intelligence' },
        { name: 'Zoho CRM Sync', desc: 'Live bi-directional bridge for Orders and SKU Master via Zoho Catalyst', status: 'live', module: 'Automation' },
        { name: 'Responsive Layout', desc: 'Adaptive UI for phones and tablets with touch‑optimized controls', status: 'live', module: 'UX' },
        { name: 'Push Notifications', desc: 'Real‑time alerts via web push for order status changes', status: 'live', module: 'Notifications' },
        { name: 'Comm. Intelligence Hub', desc: 'MTP lineage & margin visualization', status: 'live', module: 'Finance' },
        { name: 'Pricing Simulator', desc: 'What-if analysis for SKU pricing', status: 'live', module: 'Finance' },
        { name: 'Warehouse Fidelity', desc: 'Real-time stock SSOT linking', status: 'live', module: 'Warehouse' },
        { name: 'Multi-Channel Echo', desc: 'Live Amazon/Flipkart sync stubs', status: 'live', module: 'Logistics' },
        { name: 'Customer Intelligence', desc: 'Deep analytics for LTV and customer spend cohorts', status: 'live', module: 'CRM' },
        { name: 'RBAC Enforcement', desc: 'Role-based access control for administrative and commercial modules', status: 'live', module: 'Security' },
        { name: 'Smart Routing Node', desc: 'Multi-warehouse assignment logic based on destination pincode', status: 'live', module: 'Logistics' },
        { name: 'Production Hub', desc: 'Real-time GRN and vendor batch tracking with FIFO logic', status: 'live', module: 'Supply Chain' },
        { name: 'QA Mobile Gate', desc: '4-point mobile checklist for final quality control before dispatch', status: 'live', module: 'Supply Chain' },
        { name: 'Shortage Analytics', desc: 'Predictive demand-aware material shortage warnings', status: 'live', module: 'Intelligence' }
    ];




    const upcomingFeatures = [
        { name: 'Financial Recon', desc: 'Automatic matching of marketplace remittances against bank statements', phase: 'Phase 7', priority: 'Medium' },
        { name: 'Mobile Bottom Nav', desc: 'Tabbed navigation for quick access to key modules on mobile devices', phase: 'Phase 7', priority: 'High' },
        { name: 'Marketplace SP-API', desc: 'Live bi-directional sync with Amazon Seller Central and Flipkart', phase: 'Phase 10', priority: 'High' }
    ];


    // Future planned enhancements for admin overview
    const futureFeatures = [
        { name: 'Marketplace API', desc: 'Live sync with Amazon SP-API and Flipkart Seller API', phase: 'Phase 9', priority: 'High' },
        { name: 'Advanced Security', desc: '2FA, IP whitelisting and session hardening', phase: 'Phase 8', priority: 'Low' }
    ];

    const developmentPhases = [
        { phase: 'Phase 1-4', title: 'Foundation', status: 'Complete', desc: 'Architecture, design system, core modules' },
        { phase: 'Phase 5', title: 'MVP Complete', status: 'Complete', desc: '26 modules with full functionality' },
        { phase: 'Phase 5.5', title: 'Data Strategy', status: 'Complete', desc: 'Zero-sample initialization, schema mapping' },
        { phase: 'Phase 6', title: 'Revenue Fidelity', status: 'Complete', desc: 'SKU Inheritance, High-Fidelity Commercials' },
        { phase: 'Phase 7', title: 'Integrations', status: 'Complete', desc: 'Zoho Bridge, Data Unification, Deduplication' },
        { phase: 'Phase 8', title: 'Intelligence', status: 'Complete', desc: 'Predictive AI and Automated Carrier Selection' },
        { phase: 'Phase 9: Comm. Intelligence', status: 'Complete', desc: 'Lineage tracking and Margin Fidelity' },
        { phase: 'Phase 10: Real-time APIs', status: 'Complete', desc: 'Amazon SP-API & Flipkart API Integration' },
        { phase: 'Phase 11: Enterprise Control', status: 'Complete', desc: 'Advanced security, RBAC, and Customer LTV' },
        { phase: 'Phase 12: Supply Chain', status: 'Complete', desc: 'FIFO Batches, QA Gate, and Shortage Alerts' },
        { phase: 'Phase 13: Finance AI', status: 'In Progress', desc: 'Dynamic Pricing and Fraud Detection' }
    ];

    const techStack = [
        { name: 'React 19', purpose: 'User Interface', icon: '⚛️' },
        { name: 'Vite', purpose: 'Build Tool', icon: '⚡' },
        { name: 'Recharts', purpose: 'Charts & Graphs', icon: '📊' },
        { name: 'Zoho Catalyst', purpose: 'Cloud Backend', icon: '☁️' },
        { name: 'Zoho CRM', purpose: 'Customer Data', icon: '👥' },
        { name: 'GitHub', purpose: 'Version Control', icon: '🐙' }
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

                <div className="feature-scroll-container glass no-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: '20px', borderRadius: '16px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>

                        {completedFeatures.map((f, idx) => (
                            <div key={idx} className="feature-card glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
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

            </div>

            {/* Upcoming Features */}
            <div style={{ marginTop: '40px' }}>
                <h2>🚀 What's Coming Next</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Features in our development pipeline</p>

                <div className="feature-scroll-container glass no-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: '20px', borderRadius: '16px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>

                        {upcomingFeatures.map((f, idx) => (
                            <div key={idx} className="feature-card glass glass-hover" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
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
