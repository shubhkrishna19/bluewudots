import React, { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import rtoService, { RTORiskLevels } from '../../services/rtoService'
import {
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  CheckSquare,
  XSquare,
  Truck,
  PackageX,
  RotateCcw,
  Info,
} from 'lucide-react'

const RTOManager = () => {
  const { orders, updateOrderStatus } = useData()
  const [activeTab, setActiveTab] = useState('RISK_PREVENTION') // RISK_PREVENTION | RTO_HANDLING
  const [selectedOrders, setSelectedOrders] = useState([])
  const [selectedRTO, setSelectedRTO] = useState(null)
  const [filterLevel, setFilterLevel] = useState('ALL')
  const [reattemptOrder, setReattemptOrder] = useState(null) // Order being edited for re-attempt

  // --- Tab 1: Risk Prevention Logic ---
  const riskData = useMemo(() => {
    return orders
      .map((order) => {
        const risk = rtoService.predictRisk(order)
        // If already blocked by bot, use that risk
        if (order.status === 'On-Hold' && order.holdReason?.includes('RTO')) {
          return { ...order, risk: { ...risk, level: 'BLOCKED' } }
        }
        return { ...order, risk }
      })
      .filter((o) => {
        // Include On-Hold (Blocked) and active high-risk orders
        if (o.status === 'On-Hold' && o.holdReason?.includes('RTO')) return true
        return (
          !['Delivered', 'Cancelled', 'Returned', 'On-Hold'].includes(o.status) &&
          !o.status.startsWith('RTO')
        )
      })
  }, [orders])

  const highRiskOrders = useMemo(() => {
    return riskData.filter(
      (o) =>
        (o.risk.level === 'BLOCKED' ||
          o.risk.level === RTORiskLevels.HIGH ||
          o.risk.level === RTORiskLevels.CRITICAL) &&
        (filterLevel === 'ALL' ||
          (filterLevel === 'BLOCKED' ? o.risk.level === 'BLOCKED' : o.risk.level === filterLevel))
    )
  }, [riskData, filterLevel])

  const metrics = useMemo(() => rtoService.getRiskMetrics(orders), [orders])

  const handleBulkAction = (action) => {
    if (!window.confirm(`Are you sure you want to ${action} ${selectedOrders.length} orders?`))
      return
    selectedOrders.forEach((id) => {
      if (action === 'HOLD') updateOrderStatus(id, 'On-Hold', { reason: 'High RTO Risk' })
      if (action === 'CANCEL')
        updateOrderStatus(id, 'Cancelled', { reason: 'High RTO Risk Prevention' })
      if (action === 'APPROVE')
        updateOrderStatus(id, 'Pending', { reason: 'Risk Manually Verified' }) // Move to Pending to Unblock
    })
    setSelectedOrders([])
  }

  // --- Tab 2: RTO Handling Logic ---
  const rtoOrders = useMemo(
    () => orders.filter((o) => o.status && o.status.startsWith('RTO')),
    [orders]
  )
  const totalRTOValue = rtoOrders.reduce(
    (sum, o) => sum + (parseFloat(o.amount || o.totalAmount) || 0),
    0
  )

  const handleRTOAction = (orderId, action) => {
    if (action === 'reattempt') {
      const order = orders.find((o) => o.id === orderId)
      setReattemptOrder(order) // Open "Modal"
    } else if (action === 'refund') {
      updateOrderStatus(orderId, 'Cancelled', { reason: 'Refund Processed' })
    } else if (action === 'writeoff') {
      updateOrderStatus(orderId, 'Cancelled', { reason: 'RTO Write-off' })
    }
    setSelectedRTO(null)
  }

  const submitReattempt = (updatedDetails) => {
    if (!reattemptOrder) return
    // In real app, update address fields
    updateOrderStatus(reattemptOrder.id, 'Pending', {
      reason: 'Customer Re-attempt Requested',
      notes: `Address updated: ${updatedDetails.address || 'No change'}`,
    })
    setReattemptOrder(null)
  }

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Customer Refused':
        return 'var(--warning)'
      case 'Incorrect Address':
        return 'var(--danger)'
      case 'Damaged in Transit':
        return 'var(--info)'
      default:
        return 'var(--glass-border)'
    }
  }

  return (
    <div className="rto-manager animate-fade">
      {/* Header & Tabs */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <ShieldAlert className="text-red-500" /> RTO Command Center
          </h2>
          <p className="text-muted">Predict risk and manage returned shipments.</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'RISK_PREVENTION' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'glass text-muted hover:text-white'}`}
            onClick={() => setActiveTab('RISK_PREVENTION')}
          >
            🛡️ Risk Prevention
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'RTO_HANDLING' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'glass text-muted hover:text-white'}`}
            onClick={() => setActiveTab('RTO_HANDLING')}
          >
            📦 RTO Handling{' '}
            <span className="ml-2 bg-black/20 px-1.5 rounded">{rtoOrders.length}</span>
          </button>
        </div>
      </div>

      {/* Content Switch */}
      {activeTab === 'RISK_PREVENTION' ? (
        <div className="animate-fade">
          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="glass p-4 rounded-xl border-l-4 border-red-500">
              <span className="text-xs text-muted uppercase">Avg Risk Score</span>
              <h3 className="text-2xl font-bold">{metrics.avgRiskScore}/100</h3>
            </div>
            <div className="glass p-4 rounded-xl border-l-4 border-orange-500">
              <span className="text-xs text-muted uppercase">Est. Capital at Risk</span>
              <h3 className="text-2xl font-bold text-orange-400">
                ₹{metrics.capitalAtRisk?.toLocaleString()}
              </h3>
            </div>
            <div className="glass p-4 rounded-xl border-l-4 border-blue-500">
              <span className="text-xs text-muted uppercase">RTO Rate</span>
              <h3 className="text-2xl font-bold">{metrics.rtoRate}</h3>
            </div>
            <div className="glass p-4 rounded-xl border-l-4 border-green-500">
              <span className="text-xs text-muted uppercase">Prevention Rate</span>
              <h3 className="text-2xl font-bold text-green-400">{metrics.preventionRate}</h3>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterLevel === 'ALL' ? 'bg-slate-700 text-white' : 'glass text-muted'}`}
                onClick={() => setFilterLevel('ALL')}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterLevel === 'BLOCKED' ? 'bg-purple-500/20 text-purple-500' : 'glass text-muted'}`}
                onClick={() => setFilterLevel('BLOCKED')}
              >
                ⛔ Blocked
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'glass text-muted'}`}
                onClick={() => setFilterLevel('CRITICAL')}
              >
                Critical
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'glass text-muted'}`}
                onClick={() => setFilterLevel('HIGH')}
              >
                High
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="btn-secondary glass-hover text-xs"
                onClick={() => handleBulkAction('HOLD')}
                disabled={!selectedOrders.length}
              >
                🛑 Hold
              </button>
              <button
                className="btn-primary glass-hover text-xs bg-red-500/80 hover:bg-red-500"
                onClick={() => handleBulkAction('CANCEL')}
                disabled={!selectedOrders.length}
              >
                ✖ Cancel
              </button>
              <button
                className="btn-primary glass-hover text-xs bg-green-500/80 hover:bg-green-500"
                onClick={() => handleBulkAction('APPROVE')}
                disabled={!selectedOrders.length}
              >
                ✅ Allow
              </button>
            </div>
          </div>

          {/* Prevention Table */}
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-xs uppercase text-muted font-bold">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedOrders(e.target.checked ? highRiskOrders.map((o) => o.id) : [])
                      }
                    />
                  </th>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Risk Factors</th>
                  <th className="p-4">Potential Loss</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {highRiskOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-muted">
                      <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No high-risk orders detected.
                    </td>
                  </tr>
                ) : (
                  highRiskOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-white/5 transition-colors ${order.risk.level === 'BLOCKED' ? 'bg-purple-500/5' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() =>
                            setSelectedOrders((p) =>
                              p.includes(order.id)
                                ? p.filter((x) => x !== order.id)
                                : [...p, order.id]
                            )
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-blue-300">{order.id}</div>
                        <div className="text-xs">{order.customer}</div>
                        <div className="text-[10px] bg-slate-800 px-1 rounded inline-block mt-1">
                          {order.paymentMethod || 'COD'}
                        </div>
                      </td>
                      <td className="p-4 city-cell">
                        {order.city}
                        <br />
                        <span className="text-[10px] text-muted">{order.pincode}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border block w-fit mb-1 ${order.risk.level === 'BLOCKED' ? 'bg-purple-500/20 text-purple-400 border-purple-500' : order.risk.level === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}
                        >
                          {order.risk.level} ({order.risk.score})
                        </span>
                        <span className="text-[10px] text-muted">
                          {order.risk.reasons.join(', ')}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-red-300">-₹{order.risk.potentialLoss}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          className="p-1 hover:bg-green-500/20 rounded text-green-500"
                          title="Approve"
                          onClick={() => updateOrderStatus(order.id, 'Pending')}
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-500/20 rounded text-red-500"
                          title="Cancel"
                          onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        >
                          <XSquare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="animate-fade">
          {/* ... RTO Handling content ... */}
          {reattemptOrder && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setReattemptOrder(null)}
            >
              <div
                className="bg-slate-900 border border-white/10 p-6 rounded-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">Smart Re-attempt: {reattemptOrder.id}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted block mb-1">Confirm Phone</label>
                    <input
                      type="text"
                      defaultValue={reattemptOrder.phone}
                      className="w-full bg-black/20 border border-white/10 rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Update Address</label>
                    <textarea
                      defaultValue={reattemptOrder.address}
                      className="w-full bg-black/20 border border-white/10 rounded p-2 h-20"
                    ></textarea>
                  </div>
                  <button
                    className="w-full btn-primary py-2"
                    onClick={() => submitReattempt({ address: 'Updated via Smart Re-attempt' })}
                  >
                    🚀 Launch Re-attempt
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* RTO List */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['Customer Refused', 'Incorrect Address', 'Damaged in Transit'].map((reason, i) => (
              <div key={reason} className="glass p-4 rounded-xl text-center">
                <h3
                  className={`text-2xl font-bold ${i === 0 ? 'text-orange-400' : i === 1 ? 'text-red-400' : 'text-blue-400'}`}
                >
                  {rtoOrders.filter((o) => o.reason === reason).length}
                </h3>
                <span className="text-xs text-muted">{reason}</span>
              </div>
            ))}
            <div className="glass p-4 rounded-xl text-center border-l-4 border-red-500 bg-red-500/5">
              <h3 className="text-2xl font-bold text-white">₹{totalRTOValue.toLocaleString()}</h3>
              <span className="text-xs text-muted">Total Stuck Value</span>
            </div>
          </div>

          <div className="rto-list space-y-4">
            {rtoOrders.length === 0 ? (
              <div className="glass p-12 text-center">
                <PackageX className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted">No active RTOs to process.</p>
              </div>
            ) : (
              rtoOrders.map((rto) => (
                <div
                  key={rto.id}
                  className="glass glass-hover p-6 rounded-xl border-l-4 border-l-orange-500 cursor-pointer transition-all"
                  onClick={() => setSelectedRTO(selectedRTO?.id === rto.id ? null : rto)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <RotateCcw className="text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{rto.id}</h3>
                        <p className="text-sm text-muted">
                          {rto.customer} • {rto.city}
                        </p>
                        <span className="inline-block mt-2 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded">
                          {rto.reason || 'Return Initiated'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">
                        ₹{parseFloat(rto.amount || rto.totalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        Since: {new Date(rto.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedRTO?.id === rto.id && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-4 animate-fade">
                      <div className="flex-1 bg-slate-900/50 p-3 rounded text-sm text-muted">
                        <Info className="w-3 h-3 inline mr-2" />
                        Notes: {rto.carrierNotes || 'No carrier notes available.'}
                      </div>
                      <button
                        className="btn-primary glass-hover flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRTOAction(rto.id, 'reattempt')
                        }}
                      >
                        🔄 Re-attempt
                      </button>
                      <button
                        className="btn-secondary glass-hover flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRTOAction(rto.id, 'refund')
                        }}
                      >
                        💰 Refund
                      </button>
                      <button
                        className="btn-secondary glass-hover w-12 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRTOAction(rto.id, 'writeoff')
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RTOManager
