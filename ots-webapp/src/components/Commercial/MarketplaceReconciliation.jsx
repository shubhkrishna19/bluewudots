import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import marketplaceSyncService from '../../services/marketplaceService';
import { DollarSign, AlertCircle, TrendingUp, FileText, RefreshCw, Download } from 'lucide-react';

const MarketplaceReconciliation = () => {
    const { orders, addOrder } = useData();
    const [selectedChannel, setSelectedChannel] = useState('AMAZON');
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [foundOrders, setFoundOrders] = useState([]);

    // Simulate fetching a settlement report
    const [settlementReport, setSettlementReport] = useState([]);

    // Filter Marketplace Orders
    const marketplaceOrders = useMemo(() => {
        return orders.filter(o => o.source?.toUpperCase() === selectedChannel);
    }, [orders, selectedChannel]);

    // Financial Analysis Logic
    const reconciliationData = useMemo(() => {
        return marketplaceOrders.map(order => {
            const amount = parseFloat(order.amount || order.totalAmount || 0);

            // Expected Fees based on our calculator
            const expectedFees = marketplaceSyncService.calculateFees(selectedChannel, amount);

            // Mock Settlement Data (simulate some discrepancies)
            const settlement = settlementReport.find(s => s.orderId === order.id) || {
                netPayout: (expectedFees.netPayout * (Math.random() > 0.9 ? 0.95 : 1)).toFixed(2), // 10% chance of discrepancy
                status: 'Settled'
            };

            const discrepancy = (parseFloat(expectedFees.netPayout) - parseFloat(settlement.netPayout)).toFixed(2);
            const isDiscrepancy = Math.abs(discrepancy) > 5;

            return {
                ...order,
                orderAmount: amount,
                expectedNet: expectedFees.netPayout,
                actualNet: settlement.netPayout,
                discrepancy,
                isDiscrepancy,
                fees: expectedFees.totalFee
            };
        });
    }, [marketplaceOrders, settlementReport, selectedChannel]);

    const totalDiscrepancy = reconciliationData
        .filter(d => d.isDiscrepancy)
        .reduce((sum, d) => sum + parseFloat(d.discrepancy), 0);

    return (
        <div className="reconciliation-view animate-fade">
            <div className="section-header">
                <div>
                    <h2>Marketplace Reconciliation</h2>
                    <p className="text-muted">Fee Auditing & Net Margin Analysis</p>
                </div>
                <div className="channel-toggle glass p-1 rounded-lg flex gap-1">
                    {['AMAZON', 'FLIPKART'].map(ch => (
                        <button
                            key={ch}
                            className={`px-4 py-1 rounded text-xs font-bold transition-all ${selectedChannel === ch ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setSelectedChannel(ch)}
                        >
                            {ch}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sync Control Panel */}
            <div className="glass p-4 mt-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {selectedChannel === 'AMAZON' ? 'Amazon SP-API' : 'Flipkart API'} Sync
                        <span className={`text-xs px-2 py-0.5 rounded ${marketplaceSyncService.isAmazonLive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {marketplaceSyncService.isAmazonLive ? 'LIVE' : 'SIMULATION'}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-400">Last Synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        disabled={isSyncing}
                        onClick={async () => {
                            setIsSyncing(true);
                            const newOrders = await marketplaceSyncService.fetchOrders(selectedChannel.toLowerCase());
                            setFoundOrders(newOrders);
                            setLastSynced(new Date());
                            setIsSyncing(false);
                        }}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Fetching...' : 'Sync Now'}
                    </button>

                    {foundOrders.length > 0 && (
                        <button
                            className="btn-primary flex items-center gap-2 animate-fade"
                            onClick={() => {
                                let imported = 0;
                                foundOrders.forEach(o => {
                                    // Check if exists
                                    if (!orders.find(ex => ex.id === o.id)) {
                                        addOrder(o);
                                        imported++;
                                    }
                                });
                                alert(`Successfully Imported ${imported} orders from ${selectedChannel}!`);
                                setFoundOrders([]);
                            }}
                        >
                            <Download className="w-4 h-4" /> Import {foundOrders.length} Orders
                        </button>
                    )}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="glass p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Total Revenue</p>
                            <h3 className="text-2xl font-bold mt-1">₹{reconciliationData.reduce((a, b) => a + b.orderAmount, 0).toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-full">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="glass p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Platform Fees (Est)</p>
                            <h3 className="text-2xl font-bold mt-1">₹{reconciliationData.reduce((a, b) => a + parseFloat(b.fees), 0).toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-full">
                            <DollarSign className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="glass p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Leakage / Discrepancy</p>
                            <h3 className="text-2xl font-bold mt-1 text-red-400">₹{totalDiscrepancy.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-red-500/20 rounded-full">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit Table */}
            <div className="glass mt-8 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" /> Audit Log
                    </h3>
                    <button className="btn-secondary text-xs">Download Report</button>
                </div>

                <div className="overflow-auto max-h-[500px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/10">
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Sale Amount</th>
                                <th className="p-3">Est. Payout</th>
                                <th className="p-3">Actual Payout</th>
                                <th className="p-3">Variance</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reconciliationData.map((row, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3 font-mono text-xs text-slate-300">{row.id}</td>
                                    <td className="p-3 text-sm">₹{row.orderAmount}</td>
                                    <td className="p-3 text-sm text-slate-400">₹{row.expectedNet}</td>
                                    <td className="p-3 text-sm font-bold">₹{row.actualNet}</td>
                                    <td className="p-3 text-sm">
                                        {parseFloat(row.discrepancy) > 0 ? (
                                            <span className="text-red-400 font-bold">-₹{row.discrepancy}</span>
                                        ) : (
                                            <span className="text-green-400">Match</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className={`badge ${row.isDiscrepancy ? 'high' : 'low'}`}>
                                            {row.isDiscrepancy ? 'Review Needed' : 'Settled'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceReconciliation;
