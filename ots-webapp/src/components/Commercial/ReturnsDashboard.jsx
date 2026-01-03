import React, { useState, useEffect } from 'react'
import returnService from '../../services/returnService'

const ReturnsDashboard = () => {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReturn, setSelectedReturn] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await returnService.fetchPendingReturns()
      setReturns(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAction = async (id, action) => {
    try {
      await returnService.processAction(id, action)
      await loadData() // Refresh
      setSelectedReturn(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const runAutoPilot = () => {
    let count = 0
    const newReturns = returns.map((ret) => {
      if (ret.status === 'Pending' && returnService.runAutoApproval(ret)) {
        count++
        return { ...ret, status: 'In Transit', autoApproved: true }
      }
      return ret
    })
    setReturns(newReturns)
    if (count > 0) alert(`Auto-Approved ${count} eligible returns!`)
    else alert('No eligible returns for auto-approval.')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'In Transit':
        return 'bg-blue-500/20 text-blue-300'
      case 'QC Pending':
        return 'bg-purple-500/20 text-purple-300'
      case 'Refund Pending':
        return 'bg-green-500/20 text-green-300'
      case 'Refunded':
        return 'bg-gray-500 text-gray-300'
      default:
        return 'bg-white/10 text-white'
    }
  }

  const columns = {
    'New Requests': returns.filter((r) => r.status === 'Pending'),
    'In Transit': returns.filter((r) => r.status === 'In Transit'),
    'Warehouse QC': returns.filter((r) => r.status === 'QC Pending'),
    'Finance Pending': returns.filter((r) => ['Refund Pending', 'Dispute'].includes(r.status)),
  }

  return (
    <div className="returns-dashboard animate-fade p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2>🔄 Omni-Channel Returns</h2>
          <p className="text-muted">Shopify • Amazon • Flipkart • Internal</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary" onClick={loadData}>
            ↻ Refresh
          </button>
          <button className="btn-primary bg-indigo-600" onClick={runAutoPilot}>
            ⚡ Run Auto-Pilot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)] overflow-hidden">
        {Object.entries(columns).map(([title, items]) => (
          <div key={title} className="glass flex flex-col h-full">
            <div className="p-4 border-b border-white/10 flex justify-between">
              <h3 className="text-sm font-bold uppercase text-muted md:text-xs tracking-wider">
                {title}
              </h3>
              <span className="badge bg-white/10">{items.length}</span>
            </div>
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {items.map((ret) => (
                <div
                  key={ret.id}
                  className="glass p-4 hover:bg-white/5 transition cursor-pointer border-l-2 border-transparent hover:border-primary relative"
                  onClick={() => setSelectedReturn(ret)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-primary">{ret.id}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted">
                      {ret.channel}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{ret.customer}</p>
                  <p className="text-xs text-muted mb-2">{ret.reason}</p>

                  <div className="flex justify-between items-end">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ret.status)}`}>
                      {ret.status}
                    </span>
                    <span className="font-mono text-xs">₹{ret.value}</span>
                  </div>
                  {ret.autoApproved && (
                    <div className="absolute top-2 right-2 text-xs text-green-400">⚡</div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-8 text-muted text-xs opacity-50">Empty</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[400px] glass h-full p-8 slide-in-right border-l border-white/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold">{selectedReturn.id}</h2>
                <span className={`text-sm badge mt-2 ${getStatusColor(selectedReturn.status)}`}>
                  {selectedReturn.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-2xl text-muted hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              <div className="glass p-4 rounded-lg">
                <h4 className="text-xs uppercase text-muted mb-2">Order Details</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span>Channel</span>
                  <span className="font-bold">{selectedReturn.channel}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Order ID</span>
                  <span className="font-mono">{selectedReturn.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Refund Value</span>
                  <span className="font-bold text-green-400">₹{selectedReturn.value}</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <h4 className="text-xs uppercase text-muted mb-2">Return Items</h4>
                {selectedReturn.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0"
                  >
                    <span>{item.sku}</span>
                    <span className="text-muted">x{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <h4 className="text-xs uppercase text-muted">Actions</h4>

                {selectedReturn.status === 'Pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAction(selectedReturn.id, 'APPROVE')}
                      className="btn-success w-full"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(selectedReturn.id, 'REJECT')}
                      className="btn-danger w-full"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {selectedReturn.status === 'In Transit' && (
                  <button
                    onClick={() => handleAction(selectedReturn.id, 'RECEIVE')}
                    className="btn-primary w-full"
                  >
                    Receive Package
                  </button>
                )}

                {selectedReturn.status === 'QC Pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAction(selectedReturn.id, 'QC_PASS')}
                      className="btn-success w-full"
                    >
                      QC Pass
                    </button>
                    <button
                      onClick={() => handleAction(selectedReturn.id, 'QC_FAIL')}
                      className="btn-danger w-full"
                    >
                      QC Fail
                    </button>
                  </div>
                )}

                {selectedReturn.status === 'Refund Pending' && (
                  <button
                    onClick={() => handleAction(selectedReturn.id, 'REFUND')}
                    className="btn-primary w-full bg-green-600 hover:bg-green-500"
                  >
                    💸 Process Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnsDashboard
