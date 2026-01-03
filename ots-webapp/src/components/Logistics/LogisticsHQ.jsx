import React, { useState, useEffect } from 'react'
import {
    Zap,
    Map,
    Activity,
    ShieldAlert,
    Truck,
    Globe,
    ArrowUpRight,
    AlertCircle,
    RefreshCcw,
    Package
} from 'lucide-react'
import carrierOptimizer from '../../services/carrierOptimizer'
import internationalShippingService from '../../services/internationalShippingService'

const LogisticsHQ = () => {
    const [carrierHealth, setCarrierHealth] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState('domestic') // domestic | international

    useEffect(() => {
        refreshIntelligence()
    }, [])

    const refreshIntelligence = async () => {
        setIsRefreshing(true)
        // Simulate fetching live carrier metrics
        setTimeout(() => {
            const mockHealth = Object.values(carrierOptimizer.CARRIER_CONFIG).map(c => ({
                ...c,
                latency: Math.floor(Math.random() * 200) + 50,
                successRate: Math.floor(Math.random() * 15) + 85,
                status: Math.random() > 0.1 ? 'Operational' : 'Degraded',
                load: Math.floor(Math.random() * 100)
            }))
            setCarrierHealth(mockHealth)
            setIsRefreshing(false)
        }, 1200)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Operational': return 'var(--success)'
            case 'Degraded': return 'var(--warning)'
            case 'Critical': return '#ef4444'
            default: return 'var(--text-muted)'
        }
    }

    return (
        <div className="logistics-hq animate-fade pb-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="text-primary w-8 h-8" />
                        Logistics Intelligence HQ
                    </h2>
                    <p className="text-muted">Real-time global carrier performance & AI routing monitor</p>
                </div>
                <button
                    onClick={refreshIntelligence}
                    disabled={isRefreshing}
                    className="btn-secondary glass-hover flex items-center gap-2"
                >
                    <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing Hub...' : 'Sync Intelligence'}
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Avg Delivery Time', value: '2.4 Days', icon: Zap, trend: '-12%' },
                    { label: 'Success Rate', value: '98.2%', icon: Activity, trend: '+0.5%' },
                    { label: 'Active Routes', value: '412', icon: Map, trend: '+4' },
                    { label: 'Carrier Alerts', value: '02', icon: ShieldAlert, trend: 'Minor', warning: true },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all">
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.warning ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Carrier Health Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('domestic')}
                                    className={`text-xs font-bold transition-all ${activeTab === 'domestic' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Domestic Carriers
                                </button>
                                <button
                                    onClick={() => setActiveTab('international')}
                                    className={`text-xs font-bold transition-all ${activeTab === 'international' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Global Carriers
                                </button>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Live Metrics</span>
                        </div>

                        <div className="space-y-4">
                            {(activeTab === 'domestic' ? carrierHealth : Object.values(internationalShippingService.CARRIERS)).map((carrier, i) => (
                                <div key={i} className="glass border-white/5 p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-all">
                                            {carrier.logo || carrier.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{carrier.name}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase font-mono">{carrier.status || 'Active'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 items-center">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 mb-1">Latency</p>
                                            <p className="font-bold text-xs">{carrier.latency || '---'}ms</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 mb-1">Load</p>
                                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${carrier.load || 0}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: getStatusColor(carrier.status || 'Operational') }}></div>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{carrier.status || 'Operational'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Zap className="text-yellow-400 w-4 h-4" />
                            AI Routing Insights
                        </h3>
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4 animate-pulse-subtle">
                            <AlertCircle className="text-primary w-5 h-5 mt-1 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold mb-1">XpressBees is exceeding SLA in Tier-2 North zones.</p>
                                <p className="text-xs text-slate-400">AI suggests re-routing non-express shipments to Delhivery to save ~₹12 per order.</p>
                                <button className="mt-3 text-[10px] font-bold text-primary uppercase hover:underline">Apply Re-routing Rule</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Recent */}
                <div className="space-y-6">
                    <div className="glass p-6">
                        <h3 className="font-bold mb-4">Quick Logistics Tools</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Rate Calc', icon: Truck },
                                { label: 'Zone Map', icon: Map },
                                { label: 'Bulk Track', icon: Package },
                                { label: 'E-Way Generator', icon: ArrowUpRight }
                            ].map((tool, i) => (
                                <button key={i} className="glass p-3 flex flex-col items-center gap-2 hover:bg-primary/10 transition-all">
                                    <tool.icon className="w-5 h-5 text-slate-400" />
                                    <span className="text-[10px] font-bold uppercase">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-6">
                        <h3 className="font-bold mb-4">Recent Route Calcs</h3>
                        <div className="space-y-4">
                            {[
                                { order: 'ORD-1284', carrier: 'Delhivery', score: 92, amount: 45.50 },
                                { order: 'ORD-1285', carrier: 'BlueDart', score: 88, amount: 82.00 },
                                { order: 'ORD-1286', carrier: 'Aramex', score: 76, amount: 1240.0 },
                            ].map((calc, i) => (
                                <div key={i} className="flex justify-between items-center text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold">{calc.order}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{calc.carrier}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-primary">Score: {calc.score}</p>
                                        <p className="text-[10px] text-slate-400">₹{calc.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogisticsHQ
