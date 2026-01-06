import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import reportingService from '../../services/reportingService';

const ReportBuilder = () => {
    const { orders, skuMaster, inventoryLevels } = useData();
    const [selectedDataType, setSelectedDataType] = useState('orders');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [exportFormat, setExportFormat] = useState('csv');
    const [statusFilter, setStatusFilter] = useState('all');
    const [schedules, setSchedules] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleFreq, setScheduleFreq] = useState('daily');

    const handleSchedule = () => {
        const newSchedule = {
            id: `sch_${Date.now()}`,
            dataType: selectedDataType,
            format: exportFormat,
            frequency: scheduleFreq,
            nextRun: new Date(Date.now() + 86400000).toLocaleString(),
            status: 'Active'
        };
        setSchedules([...schedules, newSchedule]);
        setShowScheduleModal(false);
        alert(`Report scheduled: ${scheduleFreq} ${selectedDataType} report will be sent to your email.`);
    };

    return (
        <div className="report-builder animate-fade">
            <div className="section-header">
                <h2>Custom Report Builder</h2>
                <p className="text-muted">Generate and export tailored operational data</p>
            </div>

            <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                <div className="setup-panel glass" style={{ padding: '24px' }}>
                    <h3>1. Data Selection</h3>
                    <div className="field-group" style={{ marginTop: '20px' }}>
                        <label>Report Type</label>
                        <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)} className="glass-input">
                            <option value="orders">Orders & Logistics</option>
                            <option value="inventory">Inventory & Stock</option>
                            <option value="returns">Returns Analytics</option>
                        </select>
                    </div>

                    {selectedDataType === 'orders' && (
                        <div className="field-group" style={{ marginTop: '20px' }}>
                            <label>Order Status</label>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input">
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="On-Hold">On-Hold (Risk)</option>
                            </select>
                        </div>
                    )}

                    <div className="date-group" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <div className="field-group" style={{ flex: 1 }}>
                            <label>Start Date</label>
                            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="glass-input" />
                        </div>
                        <div className="field-group" style={{ flex: 1 }}>
                            <label>End Date</label>
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="glass-input" />
                        </div>
                    </div>
                </div>

                <div className="export-panel glass" style={{ padding: '24px' }}>
                    <h3>2. Export Settings</h3>
                    <div className="format-selection" style={{ marginTop: '20px' }}>
                        <label>Output Format</label>
                        <div className="format-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button className={`format-btn glass ${exportFormat === 'csv' ? 'selected' : ''}`} onClick={() => setExportFormat('csv')}>CSV</button>
                            <button className={`format-btn glass ${exportFormat === 'xlsx' ? 'selected' : ''}`} onClick={() => setExportFormat('xlsx')}>Excel</button>
                            <button className={`format-btn glass ${exportFormat === 'pdf' ? 'selected' : ''}`} onClick={() => setExportFormat('pdf')}>PDF</button>
                        </div>
                    </div>

                    <div className="preview-summary glass" style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)' }}>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Preview Summary:</p>
                        <h4 style={{ margin: '10px 0' }}>{getData().length} Records Identified</h4>
                        <p style={{ fontSize: '12px' }}>Filters: {statusFilter !== 'all' ? statusFilter : 'None'} • {dateRange.start || 'Start'} to {dateRange.end || 'End'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button
                            className="btn-primary"
                            style={{ flex: 2, padding: '15px', fontSize: '16px' }}
                            onClick={handleExport}
                            disabled={isGenerating || getData().length === 0}
                        >
                            {isGenerating ? 'Generating...' : `Generate ${exportFormat.toUpperCase()} Report`}
                        </button>
                        <button
                            className="glass"
                            style={{ flex: 1, padding: '15px', fontSize: '16px' }}
                            onClick={() => setShowScheduleModal(true)}
                        >
                            📅 Schedule
                        </button>
                    </div>
                </div>
            </div>

            {schedules.length > 0 && (
                <div className="schedules-list glass" style={{ marginTop: '30px', padding: '24px' }}>
                    <h3>Active Automated Reports</h3>
                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th>Frequency</th>
                                <th>Format</th>
                                <th>Next Run</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px 10px' }}>{s.dataType.toUpperCase()}</td>
                                    <td>{s.frequency.toUpperCase()}</td>
                                    <td>{s.format.toUpperCase()}</td>
                                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>{s.nextRun}</td>
                                    <td><span className="badge success" style={{ background: '#065f46', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>{s.status}</span></td>
                                    <td><button className="text-red-400" onClick={() => setSchedules(schedules.filter(x => x.id !== s.id))}>Cancel</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showScheduleModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyCenter: 'center', zIndex: 1000 }}>
                    <div className="modal-content glass" style={{ width: '400px', padding: '30px', margin: 'auto' }}>
                        <h3>Schedule Automated Report</h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px' }}>Receive periodic reports directly in your email inbox.</p>

                        <div className="field-group" style={{ marginTop: '20px' }}>
                            <label>Frequency</label>
                            <select value={scheduleFreq} onChange={(e) => setScheduleFreq(e.target.value)} className="glass-input">
                                <option value="daily">Daily (3:00 AM)</option>
                                <option value="weekly">Weekly (Monday morning)</option>
                                <option value="monthly">Monthly (1st of month)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={handleSchedule}>Confirm Schedule</button>
                            <button className="glass" style={{ flex: 1 }} onClick={() => setShowScheduleModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .glass-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    margin-top: 5px;
                }
                label {
                    font-size: 12px;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .format-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .format-btn.selected {
                    background: var(--primary);
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default ReportBuilder;
