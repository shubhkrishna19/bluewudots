import React, { useState, useEffect } from 'react'
import { returnsAggregatorService } from '../../services/returnsAggregatorService'
import { Check, X, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react'

const ReturnsDashboard = () => {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalValue: 0 })

  useEffect(() => {
    loadReturns()
  }, [])

  const loadReturns = async () => {
    setLoading(true)
    const data = await returnsAggregatorService.fetchPendingReturns()
    setReturns(data)

    // Calculate Stats
    const newStats = data.reduce(
      (acc, curr) => {
        if (curr.status === 'Pending') acc.pending++
        if (curr.status === 'Approved') acc.approved++
        if (curr.status === 'Rejected') acc.rejected++
        acc.totalValue += curr.refundAmount
        return acc
      },
      { pending: 0, approved: 0, rejected: 0, totalValue: 0 }
    )
    setStats(newStats)

    setLoading(false)
  }

  const handleAction = async (id, action) => {
    if (action === 'Approve') {
      const ret = returns.find((r) => r.id === id)
      await returnsAggregatorService.processRefund(id, ret.refundAmount)
      alert(`✅ Return Approved & Refund Initiated for ₹${ret.refundAmount}`)
    } else {
      alert('❌ Return Rejected')
    }

    // Optimistic Update
    setReturns((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: action === 'Approve' ? 'Approved' : 'Rejected' } : r
      )
    )
  }

  const autoApproveAll = () => {
    let count = 0
    const updated = returns.map((r) => {
      if (r.status === 'Pending') {
        const check = returnsAggregatorService.checkAutoApproval(r)
        if (check.approved) {
          count++
          return { ...r, status: 'Approved', note: 'Auto-Approved: ' + check.reason }
        }
      }
      return r
    })
    setReturns(updated)
    if (count > 0) alert(`🤖 Auto-Approved ${count} low-risk returns!`)
    else alert('No eligible returns for auto-approval.')
  }

  return (
    <div className="returns-dashboard animate-fade pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Returns & Refunds</h2>
          <p className="text-muted">Omni-Channel Return Management (Shopify, Amazon, Flipkart)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadReturns} className="btn-secondary flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={autoApproveAll}
            className="btn-primary bg-purple-600 hover:bg-purple-700"
          >
            🤖 Auto-Approve Low Risk
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass p-4 border-l-4 border-yellow-500">
          <h3 className="text-2xl font-bold">{stats.pending}</h3>
          <p className="text-xs uppercase text-slate-400">Pending Action</p>
        </div>
        <div className="glass p-4 border-l-4 border-green-500">
          <h3 className="text-2xl font-bold">{stats.approved}</h3>
          <p className="text-xs uppercase text-slate-400">Approved</p>
        </div>
        <div className="glass p-4 border-l-4 border-red-500">
          <h3 className="text-2xl font-bold">{stats.rejected}</h3>
          <p className="text-xs uppercase text-slate-400">Rejected</p>
        </div>
        <div className="glass p-4 border-l-4 border-blue-500">
          <h3 className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</h3>
          <p className="text-xs uppercase text-slate-400">Total Refund Value</p>
        </div>
      </div>

      {/* Returns List */}
      <div className="glass p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-slate-500 uppercase border-b border-white/10">
              <th className="p-3">Source</th>
              <th className="p-3">Return ID / Order</th>
              <th className="p-3">Customer / Reason</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold 
                                        ${
                                          r.source === 'Amazon'
                                            ? 'bg-orange-500/20 text-orange-400'
                                            : r.source === 'Flipkart'
                                              ? 'bg-blue-500/20 text-blue-400'
                                              : 'bg-green-500/20 text-green-400'
                                        }`}
                  >
                    {r.source}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-mono text-xs text-slate-300">{r.id}</div>
                  <div className="text-xs text-slate-500">{r.orderId}</div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-sm">{r.reason}</div>
                  <div className="text-xs text-slate-400">{r.customerName}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                                            ${r.riskScore > 70 ? 'bg-red-500 text-white' : r.riskScore > 30 ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}
                    >
                      {r.riskScore}
                    </div>
                  </div>
                </td>
                <td className="p-3 font-mono">₹{r.refundAmount}</td>
                <td className="p-3">
                  <span
                    className={`badge ${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : 'warning'}`}
                  >
                    {r.status}
                  </span>
                  {r.note && <div className="text-[10px] text-green-400 mt-1">{r.note}</div>}
                </td>
                <td className="p-3 text-right">
                  {r.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(r.id, 'Approve')}
                        className="w-8 h-8 rounded bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white flex items-center justify-center transition-all"
                        title="Approve Refund"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'Reject')}
                        className="w-8 h-8 rounded bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all"
                        title="Reject Return"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {returns.length === 0 && !loading && (
          <div className="text-center p-10 text-slate-500">No returns found.</div>
        )}
      </div>
    </div>
  )
}

export default ReturnsDashboard
