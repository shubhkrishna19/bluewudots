import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { convertFromINR, CURRENCY_DATABASE } from '../../services/internationalService';

const GlobalLedger = () => {
    const { orders } = useData();
    const [targetCurrency, setTargetCurrency] = useState('USD');

    // Calculate aggregate financials in INR
    const totals = orders.reduce((acc, order) => {
        acc.revenue += order.amount || 0;
        acc.profit += order.netProfit || 0; // Assuming netProfit is available in order object from marginProtectionService
        return acc;
    }, { revenue: 0, profit: 0 });

    const convertedRevenue = convertFromINR(totals.revenue, targetCurrency);
    const convertedProfit = convertFromINR(totals.profit, targetCurrency);

    return (
        <div className="global-ledger animate-fade">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Global Financial Ledger</h2>
                    <p className="text-muted">Multi-currency revenue & profit analysis</p>
                </div>
                <div className="currency-selector glass" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem', marginRight: '10px' }}>VIEW IN:</span>
                    <select
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
                    >
                        {Object.keys(CURRENCY_DATABASE).map(code => (
                            <option key={code} value={code} style={{ background: 'var(--bg-main)' }}>{code} - {CURRENCY_DATABASE[code].name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="ledger-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                <div className="stat-card glass" style={{ padding: '32px', borderLeft: '4px solid var(--primary)' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>TOTAL GLOBAL REVENUE</span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '10px' }}>{convertedRevenue.formatted}</h1>
                    <p className="text-muted" style={{ marginTop: '8px' }}>Equivalent to ₹{totals.revenue.toLocaleString('en-IN')}</p>
                </div>

                <div className="stat-card glass" style={{ padding: '32px', borderLeft: '4px solid var(--success)' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>NET GLOBAL PROFIT</span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '10px', color: 'var(--success)' }}>{convertedProfit.formatted}</h1>
                    <p className="text-muted" style={{ marginTop: '8px' }}>Equivalent to ₹{totals.profit.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="orders-summary-table glass" style={{ marginTop: '32px', padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Currency Conversion Breakdown</h3>
                <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', padding: '12px', borderBottom: '1px solid var(--glass-border)', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <span>ORDER ID</span>
                    <span>AMOUNT (INR)</span>
                    <span>AMOUNT ({targetCurrency})</span>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {orders.slice(0, 10).map(order => (
                        <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', padding: '12px', borderBottom: '1px dotted var(--glass-border)', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700' }}>{order.id}</span>
                            <span>₹{(order.amount || 0).toLocaleString('en-IN')}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                                {convertFromINR(order.amount || 0, targetCurrency).formatted}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GlobalLedger;
