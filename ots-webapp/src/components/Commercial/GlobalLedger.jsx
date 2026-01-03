import React, { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { convertFromINR, CURRENCY_DATABASE } from '../../services/internationalService'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Download, TrendingUp, DollarSign, PieChart, ArrowUpRight } from 'lucide-react'
import Papa from 'papaparse'

const GlobalLedger = () => {
  const { orders } = useData()
  const [targetCurrency, setTargetCurrency] = useState('USD')

  // MOCK: Generate trend data based on orders
  const trendData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' })
      return {
        name: dateStr,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        profit: Math.floor(Math.random() * 15000) + 5000,
      }
    })
    return last7Days
  }, [])

  // Aggregates
  const totals = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          acc.revenue += order.amount || 0
          acc.profit += (order.amount || 0) * 0.22 // Simulated 22% margin
          acc.count++
          return acc
        },
        { revenue: 0, profit: 0, count: 0 }
      ),
    [orders]
  )

  const converted = useMemo(
    () => ({
      revenue: convertFromINR(totals.revenue, targetCurrency),
      profit: convertFromINR(totals.profit, targetCurrency),
    }),
    [totals, targetCurrency]
  )

  const handleExport = () => {
    const exportData = orders.map((o) => ({
      OrderID: o.id,
      Date: o.date || new Date().toISOString().split('T')[0],
      Customer: o.customer,
      Source: o.source,
      AmountINR: o.amount,
      AmountConverted: convertFromINR(o.amount || 0, targetCurrency).value,
      Currency: targetCurrency,
      Status: o.status,
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `GlobalLedger_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="global-ledger animate-fade pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="text-primary w-8 h-8" />
            Global Financial Ledger
          </h2>
          <p className="text-muted">Real-time multi-currency treasury & margin audit</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase">View In</span>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
            >
              {Object.keys(CURRENCY_DATABASE).map((code) => (
                <option key={code} value={code} className="bg-slate-900">
                  {code}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Stats Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-primary/10 group-hover:text-primary/20 transition-all">
            <TrendingUp className="w-32 h-32" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Gross Revenue</p>
          <h1 className="text-4xl font-bold tracking-tight">{converted.revenue.formatted}</h1>
          <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.4% vs last week</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            BASE: ₹{totals.revenue.toLocaleString()}
          </div>
        </div>

        <div className="glass p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-success/10 group-hover:text-success/20 transition-all">
            <PieChart className="w-32 h-32" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Net Global Profit</p>
          <h1 className="text-4xl font-bold tracking-tight text-success">
            {converted.profit.formatted}
          </h1>
          <div className="flex items-center gap-2 mt-4 text-success text-sm font-bold">
            <span className="bg-success/20 px-2 py-0.5 rounded">22% Margin</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            BASE: ₹{totals.profit.toLocaleString()}
          </div>
        </div>

        <div className="glass p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Volume Distribution</span>
            <span className="badge info">{totals.count} Orders</span>
          </div>
          <div className="space-y-3">
            {['Shopify', 'Amazon', 'Direct'].map((source) => (
              <div key={source} className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span>{source}</span>
                  <span>{Math.floor(Math.random() * 40) + 20}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass p-6">
          <h3 className="text-lg font-bold mb-6">Revenue Trend (7D)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="text-lg font-bold mb-6">Profit Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="profit" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Currency Breakdown Enhancement */}
      <div className="glass overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold">Treasury Conversion Breakdown</h3>
          <span className="text-xs text-slate-500">Showing top 15 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Base Amount (INR)</th>
                <th className="p-4 text-right">Converted ({targetCurrency})</th>
                <th className="p-4">Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 15).map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="p-4 font-mono text-xs">{o.id}</td>
                  <td className="p-4 text-sm font-semibold">{o.customer}</td>
                  <td className="p-4 text-right font-mono">₹{o.amount?.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono text-primary font-bold">
                    {convertFromINR(o.amount || 0, targetCurrency).formatted}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-[10px] uppercase font-bold">Audited</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GlobalLedger
