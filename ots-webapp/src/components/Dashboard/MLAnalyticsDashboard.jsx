import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ComposedChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Zap, AlertOctagon, Info, BarChart3, Binary, ShieldCheck } from 'lucide-react';
import mlForecastService from '../../services/mlForecastService';
import { useData } from '../../context/DataContext';

const MLAnalyticsDashboard = () => {
    const { orders, skuMaster, inventoryLevels } = useData();
    const [selectedSKU, setSelectedSKU] = useState(skuMaster[0]?.sku || '');
    const [viewMode, setViewMode] = useState('forecast'); // forecast | decomposition

    const analysis = useMemo(() => {
        if (!selectedSKU) return null;
        return mlForecastService.predictDemand(orders, selectedSKU);
    }, [orders, selectedSKU]);

    const stockOut = useMemo(() => {
        if (!selectedSKU || !inventoryLevels[selectedSKU]) return null;
        return mlForecastService.predictStockOutDate(orders, selectedSKU, inventoryLevels[selectedSKU].inStock);
    }, [orders, selectedSKU, inventoryLevels]);

    if (!analysis || analysis.error) {
        return (
            <div className="glass p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-warning/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-warning/20">
                    <AlertOctagon className="text-warning w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-warning mb-2">Insufficient ML Connectivity</h3>
                <p className="text-muted max-w-md mx-auto mb-8">
                    Predictive decomposition requires at least 5 unique daily data points to establish a valid trend-seasonal baseline.
                </p>
                <div className="max-w-xs mx-auto">
                    <select
                        className="glass-input w-full"
                        value={selectedSKU}
                        onChange={e => setSelectedSKU(e.target.value)}
                    >
                        {skuMaster.map(s => <option key={s.sku} value={s.sku}>{s.name} ({s.sku})</option>)}
                    </select>
                </div>
            </div>
        );
    }

    const chartData = [
        ...analysis.history.map(h => ({ ...h, type: 'actual', isHistorical: true })),
        ...analysis.forecast.map(f => ({ ...f, type: 'forecast', isHistorical: false }))
    ];

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'CRITICAL': return '#EF4444'; // Red
            case 'HIGH': return '#F59E0B'; // Amber
            case 'SAFE': return '#10B981'; // Emerald
            default: return 'var(--primary)';
        }
    };

    return (
        <div className="ml-dashboard animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Binary className="text-primary w-5 h-5" />
                        <h2 className="text-3xl font-black tracking-tighter text-gradient m-0">Neural Forecast Engine</h2>
                    </div>
                    <p className="text-sm text-muted opacity-80 flex items-center gap-1.5 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        High-precision decomposition for {selectedSKU}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex glass p-1 rounded-xl">
                        <button
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'forecast' ? 'bg-primary text-white shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                            onClick={() => setViewMode('forecast')}
                        >
                            Total Forecast
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'decomposition' ? 'bg-primary text-white shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                            onClick={() => setViewMode('decomposition')}
                        >
                            Decomposition
                        </button>
                    </div>
                    <select
                        className="glass-input font-bold"
                        value={selectedSKU}
                        onChange={e => setSelectedSKU(e.target.value)}
                    >
                        {skuMaster.map(s => <option key={s.sku} value={s.sku}>{s.name}</option>)}
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass p-5 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                            <TrendingUp className="text-indigo-400 w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">30D Velocity</span>
                    </div>
                    <p className="text-3xl font-black m-0">+{analysis.metrics.growthRate}</p>
                    <p className="text-xs text-muted mt-1 font-medium italic opacity-70">Projected growth vs history</p>
                    <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                        <LineChart width={100} height={40} data={analysis.history.slice(-5)}>
                            <Line type="monotone" dataKey="quantity" stroke="#818CF8" strokeWidth={3} dot={false} />
                        </LineChart>
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-500/20 p-2.5 rounded-xl">
                            <Zap className="text-emerald-400 w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Recommended Reorder</span>
                    </div>
                    <p className="text-3xl font-black m-0 text-emerald-400">
                        {mlForecastService.calculateRRQ(analysis)}
                    </p>
                    <p className="text-xs text-muted mt-1 font-medium opacity-70">Includes 95% safety buffer</p>
                </div>

                <div className="glass p-5 rounded-2xl lg:col-span-2 border-l-4 overflow-hidden relative" style={{ borderLeftColor: stockOut ? getUrgencyColor(stockOut.urgency) : 'var(--primary)' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/5 p-2.5 rounded-xl">
                            <Calendar className="w-5 h-5" style={{ color: stockOut ? getUrgencyColor(stockOut.urgency) : '#fff' }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded" style={{ color: stockOut ? getUrgencyColor(stockOut.urgency) : '#fff' }}>Stock-out Risk</span>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-3xl font-black m-0">{stockOut?.date || 'N/A'}</p>
                        <p className="text-sm font-bold opacity-60 mb-1">
                            {stockOut?.days > 0 ? `(${stockOut.days} days remaining)` : 'Critical Depletion'}
                        </p>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: stockOut ? `${Math.min(100, (stockOut.days / 30) * 100)}%` : '0%',
                                background: stockOut ? getUrgencyColor(stockOut.urgency) : 'var(--primary)'
                            }}
                        />
                    </div>
                    {stockOut?.urgency === 'CRITICAL' && (
                        <div className="absolute right-4 top-14 animate-pulse">
                            <ShieldCheck className="w-12 h-12 text-red-500/20" />
                        </div>
                    )}
                </div>
            </div>

            <div className="glass p-8 rounded-3xl h-[450px] relative">
                <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
                    <BarChart3 className="text-primary w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Neural Pathway Visualization</span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'forecast' ? (
                        <AreaChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                            <Area type="monotone" dataKey="quantity" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" name="Historical Demand" isAnimationActive={true} />
                            <Area type="monotone" dataKey="quantity" stroke="#10B981" strokeWidth={4} strokeDasharray="8 5" fillOpacity={1} fill="url(#colorForecast)" name="Prophet Forecast" />
                            <Area type="monotone" dataKey="high95" stroke="transparent" fill="#10B981" fillOpacity={0.05} name="95% Confidence" />
                            <Area type="monotone" dataKey="low95" stroke="transparent" fill="#10B981" fillOpacity={0.05} />
                        </AreaChart>
                    ) : (
                        <ComposedChart data={chartData.filter(d => !d.isHistorical)} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} minTickGap={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.5 }} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                            <Bar dataKey="seasonal" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Seasonal Bias" />
                            <Line type="monotone" dataKey="trend" stroke="#818CF8" strokeWidth={4} dot={false} name="Underlying Trend" />
                        </ComposedChart>
                    )}
                </ResponsiveContainer>

                <div className="absolute bottom-6 right-8">
                    <button className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <Info className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Model Specs: Additive Decomposition v2.4</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MLAnalyticsDashboard;
