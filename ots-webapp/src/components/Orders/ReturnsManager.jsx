import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import reverseLogisticsService, { ReturnStatus } from '../../services/reverseLogisticsService'
import { RotateCcw, CheckCircle, Truck, PackageX, AlertCircle } from 'lucide-react'

const ReturnsManager = () => {
  // In a real app, returns would be a separate collection.
  // Here we'll mock it by filtering orders with a 'returnStatus' property or just mocking data for the UI.
  const { orders } = useData()
  const [selectedReturn, setSelectedReturn] = useState(null)

  // Use live returns from DataContext
  const { returns, updateReturnStatus } = useData()

  const getStatusColor = (status) => {
    switch (status) {
      case ReturnStatus.REQUESTED:
        return 'var(--warning)'
      case ReturnStatus.PICKUP_SCHEDULED:
        return 'var(--info)'
      case ReturnStatus.RECEIVED:
        return 'var(--primary)'
      case ReturnStatus.QC_PASSED:
        return 'var(--success)'
      case ReturnStatus.QC_FAILED:
        return 'var(--danger)'
      default:
        return 'var(--glass-border)'
    }
  }

  const StatusIcon = ({ status }) => {
    if (status === ReturnStatus.PICKUP_SCHEDULED) return <Truck size={16} />
    if (status === ReturnStatus.QC_PASSED) return <CheckCircle size={16} />
    if (status === ReturnStatus.QC_FAILED) return <AlertCircle size={16} />
    return <RotateCcw size={16} />
  }

  return (
    <div className="returns-manager animate-fade">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h2>Returns Management (RMA)</h2>
          <p className="text-muted">Process Customer Returns & Quality Checks</p>
        </div>
        <div className="flex gap-2">
          <span className="badge" style={{ background: 'var(--info)' }}>
            {returns.length} Active
          </span>
        </div>
      </div>

      <div className="returns-grid" style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
        {returns.map((rma) => (
          <div
            key={rma.id}
            className="glass glass-hover p-6 rounded-xl cursor-pointer border-l-4"
            style={{ borderLeftColor: getStatusColor(rma.status) }}
            onClick={() => setSelectedReturn(rma)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{rma.id}</h3>
                  <span
                    className="badge flex items-center gap-1"
                    style={{ background: getStatusColor(rma.status), fontSize: '0.7rem' }}
                  >
                    <StatusIcon status={rma.status} /> {rma.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Order: {rma.orderId} • {rma.customer}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {rma.items && rma.items.length > 0
                    ? rma.items[0].name || rma.items[0].sku
                    : 'Unknown Item'}
                </p>
                <p className="text-xs text-slate-500">{rma.reason}</p>
              </div>
            </div>

            {/* Actions Expansion */}
            {selectedReturn?.id === rma.id && (
              <div className="mt-6 pt-4 border-t border-white/10 animate-fade">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Next Actions
                </h4>
                <div className="flex gap-3">
                  {rma.status === 'REQUESTED' && (
                    <button
                      className="btn-primary text-xs py-2 px-4 rounded"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateReturnStatus(rma.id, 'APPROVED', 'Approved by Admin')
                      }}
                    >
                      Approve Return
                    </button>
                  )}
                  <button className="btn-secondary text-xs py-2 px-4 rounded flex items-center gap-2">
                    <Truck size={14} /> Track Shipment
                  </button>
                  <button
                    className="btn-secondary text-xs py-2 px-4 rounded flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateReturnStatus(rma.id, 'REFUNDED', 'Refund Initiated')
                      alert(`Refund Initiated for ${rma.id}`)
                    }}
                  >
                    💰 Refund
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {returns.length === 0 && (
          <div className="glass p-12 text-center">
            <PackageX className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <p className="text-muted">No active return requests.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReturnsManager
