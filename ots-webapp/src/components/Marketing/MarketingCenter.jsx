import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';

const MarketingCenter = () => {
    const { customerMaster, getCustomerMetrics, exportOrders } = useData();

    const segmentedData = useMemo(() => {
        const segments = {
            VIP: [],
            Regular: [],
            New: [],
            'At Risk': []
        };

        customerMaster.forEach(customer => {
            const metrics = getCustomerMetrics(customer.phone);
            if (segments[metrics.segment]) {
                segments[metrics.segment].push({
                    ...customer,
                    ...metrics
                });
            }
        });

        return segments;
    }, [customerMaster, getCustomerMetrics]);

    const stats = useMemo(() => {
        return Object.keys(segmentedData).map(key => ({
            label: key,
            count: segmentedData[key].length,
            revenue: segmentedData[key].reduce((sum, c) => sum + c.totalSpend, 0)
        }));
    }, [segmentedData]);

    const handleExport = (segment) => {
        const data = segmentedData[segment];
        const csvContent = "Name,Phone,Email,TotalSpend,OrderCount\n" +
            data.map(c => `"${c.name}","${c.phone}","${c.email}",${c.totalSpend},${c.orderCount}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketing_segment_${segment.toLowerCase().replace(' ', '_')}.csv`;
        a.click();
    };

    return (
        <div className="marketing-center animate-fade">
            <div className="section-header">
                <h2>Marketing Intelligence</h2>
                <p className="text-muted">Customer Segmentation & Campaign Export</p>
            </div>

            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                {stats.map(s => (
                    <div key={s.label} className="stat-card glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{s.label.toUpperCase()}</span>
                        <h2 style={{ color: s.label === 'VIP' ? 'var(--warning)' : s.label === 'At Risk' ? 'var(--danger)' : 'var(--primary)', margin: '8px 0' }}>
                            {s.count}
                        </h2>
                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>₹{s.revenue.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="segments-container" style={{ marginTop: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {Object.keys(segmentedData).map(segment => (
                        <div key={segment} className="segment-card glass" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3>{segment} Segment</h3>
                                <button
                                    className="btn-pill"
                                    onClick={() => handleExport(segment)}
                                    style={{ padding: '6px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                    📥 Export CSV
                                </button>
                            </div>
                            <div className="segment-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {segmentedData[segment].length === 0 ? (
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>No customers in this segment.</p>
                                ) : (
                                    segmentedData[segment].slice(0, 5).map(c => (
                                        <div key={c.phone} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{c.name}</p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{c.phone}</p>
                                            </div>
                                            <p style={{ fontWeight: '700' }}>₹{c.totalSpend.toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                                {segmentedData[segment].length > 5 && (
                                    <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '10px', textAlign: 'center' }}>
                                        + {segmentedData[segment].length - 5} more customers
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketingCenter;
