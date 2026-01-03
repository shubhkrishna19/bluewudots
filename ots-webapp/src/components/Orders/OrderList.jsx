import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import OrderJourney from './OrderJourney'
import labelPrintService from '../../services/labelPrintService'
import { getOptimalCarrier } from '../../services/carrierOptimizer'
import { getWhatsAppService } from '../../services/whatsappService'
import shipmentService from '../../services/shipmentService'
import rtoService from '../../services/rtoService'
import reverseLogisticsService from '../../services/reverseLogisticsService'
import {
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  LayoutList,
  RefreshCcw,
} from 'lucide-react'
import ReturnsDashboard from '../Commercial/ReturnsDashboard'

const OrderList = () => {
  const { orders, updateOrderStatus } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [activeTab, setActiveTab] = useState('orders') // orders | returns

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sku?.toLowerCase().includes(searchTerm.toLowerCase())

    // Special logic for High Risk filter
    let matchesStatus = true
    if (statusFilter === 'HIGH_RISK') {
      const risk = rtoService.predictRisk(order)
      matchesStatus = risk.level === 'HIGH' || risk.level === 'CRITICAL'
    } else {
      matchesStatus = statusFilter === 'all' || order.status === statusFilter
    }

    const matchesSource = sourceFilter === 'all' || order.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  const uniqueSources = [...new Set(orders.map((o) => o.source).filter(Boolean))]
  const uniqueStatuses = [...new Set(orders.map((o) => o.status).filter(Boolean))]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Imported':
        return 'var(--text-muted)'
      case 'MTP-Applied':
        return 'var(--accent)'
      case 'Carrier-Assigned':
        return 'var(--primary)'
      case 'In-Transit':
        return 'var(--info)'
      case 'Delivered':
        return 'var(--success)'
      default:
        return 'var(--glass-border)'
    }
  }

  const toggleOrderSelection = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    )
  }

  const handleWhatsAppNotify = async () => {
    if (selectedOrders.length === 0) return
    const whatsapp = getWhatsAppService()
    let notifiedCount = 0
    let simulatedCount = 0

    for (const orderId of selectedOrders) {
      const order = orders.find((o) => o.id === orderId)
      if (!order) continue

      // Send generic update template
      const result = await whatsapp.sendWhatsAppMessage(
        order.id,
        'order_update_v1',
        order.phone || '919999999999',
        { orderId: order.id, status: order.status }
      )

      if (result.success) {
        notifiedCount++
        if (result.mode === 'simulation') simulatedCount++
      }
    }

    if (simulatedCount > 0) {
      alert(
        `✅ ${notifiedCount} Notifications Processed (SIMULATION MODE)\nCheck console for payload details.`
      )
    } else {
      alert(`✅ ${notifiedCount} WhatsApp Messages Sent successfully!`)
    }
    setSelectedOrders([])
  }

  const handleBatchManifest = async () => {
    const ordersToProcess = filteredOrders.filter(
      (o) => o.status === 'Ready-to-Ship' || selectedOrders.includes(o.id)
    )

    if (ordersToProcess.length === 0) {
      alert('No orders ready for manifest.')
      return
    }

    const confirm = window.confirm(
      `Generate Manifest for ${ordersToProcess.length} orders? Unbooked orders will be booked automatically.`
    )
    if (!confirm) return

    let bookedCount = 0
    const processedOrders = []

    for (const order of ordersToProcess) {
      let updatedOrder = { ...order }

      // Auto-book if not yet booked (missing AWB)
      if (!order.awb || order.status !== 'Ready-to-Ship') {
        try {
          const booking = await shipmentService.createForwardShipment(order)
          if (booking.success) {
            updatedOrder = {
              ...order,
              awb: booking.awb,
              status: 'Ready-to-Ship',
              shippingLabel: booking.labelUrl,
            }
            // Update globally
            updateOrder(order.id, {
              awb: booking.awb,
              status: 'Ready-to-Ship',
              shippingLabel: booking.labelUrl,
            })
            bookedCount++
          }
        } catch (err) {
          console.error('Booking failed for', order.id, err)
        }
      }
      processedOrders.push(updatedOrder)
    }

    if (bookedCount > 0) {
      alert(`✅ ${bookedCount} Orders Booked Successfully!`)
    }

    // Generate Manifest
    labelPrintService.printManifest(processedOrders, 'Batch Manifest')
  }

  const handleSmartAssign = async () => {
    setIsOptimizing(true)
    try {
      for (const orderId of selectedOrders) {
        const order = orders.find((o) => o.id === orderId)
        // In a real app, we'd fetch zone/weight details. Using defaults for demo.
        const recommendation = await getOptimalCarrier({
          pincode: order.pincode || '400001',
          weight: order.weight || 0.5,
          amount: order.amount || 0,
          zone: order.state === 'Maharashtra' ? 'metro' : 'tier2',
          cod_required: order.paymentMethod === 'cod',
        })

        if (recommendation) {
          updateOrder(orderId, {
            carrier: recommendation.carrier.name,
            shippingCost: recommendation.cost,
          })
          updateOrderStatus(orderId, 'Carrier-Assigned')
        }
      }
      alert(`Successfully optimized ${selectedOrders.length} orders!`)
      setSelectedOrders([])
    } catch (error) {
      console.error('Optimization failed:', error)
      alert('Carrier optimization failed. See logs.')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="order-list-view animate-fade">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h2>Order Management</h2>
          <p className="text-muted">Track, Search & Manage All Orders</p>
        </div>

        {/* Tab Switcher */}
        <div className="glass p-1 rounded-lg flex gap-1 mx-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            aria-label="View Orders"
            aria-pressed={activeTab === 'orders'}
          >
            <LayoutList className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'returns' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            aria-label="View Returns"
            aria-pressed={activeTab === 'returns'}
          >
            <RefreshCcw className="w-4 h-4" /> Returns
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge" style={{ background: 'var(--primary)' }}>
            {orders.length} Total
          </span>
          <span className="badge" style={{ background: 'var(--success)' }}>
            {orders.filter((o) => o.status === 'Delivered').length} Delivered
          </span>
          {activeTab === 'orders' && (
            <>
              <button
                className="btn-secondary glass-hover"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onClick={handleBatchManifest}
                aria-label="Generate Batch Manifest"
              >
                📋 Batch Manifest
              </button>
              <button
                className="btn-secondary glass-hover"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--success)',
                  color: '#fff',
                  border: 'none',
                }}
                disabled={selectedOrders.length === 0}
                onClick={handleWhatsAppNotify}
                aria-label={`Notify ${selectedOrders.length} customers via WhatsApp`}
              >
                <MessageSquare className="w-3 h-3" /> Notify
              </button>
              <button
                className="btn-primary glass-hover"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                disabled={selectedOrders.length === 0 || isOptimizing}
                onClick={handleSmartAssign}
                aria-label="Process Smart Carrier Assignment"
              >
                {isOptimizing ? '🤖 Optimizing...' : `🧠 Smart Assign (${selectedOrders.length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'returns' ? (
        <div className="mt-6">
          <ReturnsDashboard />
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div
            className="filters-bar glass"
            style={{
              padding: '16px 20px',
              marginTop: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 2, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="🔍 Search by Order ID, Customer, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                minWidth: '150px',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="HIGH_RISK">⚠️ High Risk</option>
              {uniqueStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                minWidth: '150px',
              }}
            >
              <option value="all">All Channels</option>
              {uniqueSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="btn-secondary glass-hover"
              style={{ padding: '12px 20px' }}
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setSourceFilter('all')
              }}
            >
              Clear
            </button>
          </div>

          {/* Orders Table */}
          <div
            className="orders-table glass"
            style={{ marginTop: '24px', overflow: 'hidden', borderRadius: '12px' }}
          >
            <div
              className="table-header"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1.5fr 2fr 1fr 1fr 1fr 0.8fr 1fr',
                padding: '16px 20px',
                background: 'var(--bg-accent)',
                fontWeight: '700',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o.id) : [])
                }
                checked={
                  selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length
                }
              />
              <span className="hidden md:block">Order ID</span>
              <span className="hidden md:block">Customer</span>
              <span className="hidden md:block">SKU</span>
              <span className="hidden md:block">Source</span>
              <span className="hidden md:block">Status</span>
              <span className="hidden md:block">Risk</span>
              <span className="hidden md:block">Actions</span>
            </div>

            <div className="table-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <p className="text-muted">No orders found matching your criteria</p>
                </div>
              ) : (
                filteredOrders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="table-row glass-hover"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1.5fr 2fr 1fr 1fr 1fr 0.8fr 1fr',
                      padding: '16px 20px',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleOrderSelection(order.id)}
                    />
                    <span
                      data-label="Order ID"
                      style={{ fontWeight: '700', color: 'var(--primary)' }}
                    >
                      {order.id}
                    </span>
                    <span data-label="Customer">{order.customer || 'N/A'}</span>
                    <span data-label="SKU" style={{ fontSize: '0.85rem' }}>
                      {order.sku || 'N/A'}
                    </span>
                    <span
                      data-label="Source"
                      className="badge"
                      style={{
                        background: 'var(--glass-border)',
                        fontSize: '0.65rem',
                        justifySelf: 'start',
                      }}
                    >
                      {order.source || 'Manual'}
                    </span>
                    <span
                      data-label="Status"
                      className="badge"
                      style={{
                        background: getStatusColor(order.status),
                        fontSize: '0.65rem',
                        justifySelf: 'start',
                      }}
                    >
                      {order.status}
                    </span>
                    <span
                      className="risk-indicator"
                      style={{ justifySelf: 'start' }}
                      data-label="Risk"
                    >
                      {order.status === 'Pending' &&
                      order.paymentMethod?.toLowerCase() === 'cod' ? (
                        (() => {
                          const risk = rtoService.predictRisk(order)
                          return (
                            <span
                              className={`badge ${risk.riskLevel.toLowerCase()}`}
                              style={{
                                background:
                                  risk.riskLevel === 'CRITICAL'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : risk.riskLevel === 'HIGH'
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : 'rgba(16, 185, 129, 0.1)',
                                color:
                                  risk.riskLevel === 'CRITICAL'
                                    ? '#ef4444'
                                    : risk.riskLevel === 'HIGH'
                                      ? '#f59e0b'
                                      : '#10b981',
                                fontSize: '0.6rem',
                                border: '1px solid currentColor',
                              }}
                              title={risk.reasons.join(', ')}
                            >
                              {risk.level}
                            </span>
                          )
                        })()
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.6rem' }}>
                          --
                        </span>
                      )}
                    </span>
                    <button
                      className="btn-secondary glass-hover mobile-full-width"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrder(order)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-content glass animate-fade"
            style={{
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              borderRadius: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
              }}
            >
              <div>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  ORDER DETAILS
                </span>
                <h2>{selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div
              className="detail-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  CUSTOMER
                </span>
                <p style={{ fontWeight: '700' }}>{selectedOrder.customer || 'N/A'}</p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  LOCATION
                </span>
                <p>
                  {selectedOrder.city}, {selectedOrder.state}
                </p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  SKU
                </span>
                <p style={{ fontWeight: '700' }}>{selectedOrder.sku || 'N/A'}</p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  WEIGHT
                </span>
                <p>{selectedOrder.weight || '2.0'} kg</p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  SOURCE
                </span>
                <p>{selectedOrder.source || 'Manual'}</p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  WAREHOUSE
                </span>
                <p style={{ fontWeight: '700', color: 'var(--accent)' }}>
                  {selectedOrder.warehouse || 'CENTRAL-WH'}
                </p>
              </div>
              <div className="detail-item glass" style={{ padding: '16px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  STATUS
                </span>
                <span
                  className="badge"
                  style={{ background: getStatusColor(selectedOrder.status) }}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <OrderJourney orderId={selectedOrder.id} />

            {/* RTO Risk Insights */}
            {selectedOrder.status === 'Pending' &&
              selectedOrder.paymentMethod?.toLowerCase() === 'cod' && (
                <div className="glass p-4 mt-6 border-l-4 border-yellow-500 bg-yellow-500/5">
                  <div className="flex items-center gap-2 mb-2 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      RTO Risk Prediction
                    </span>
                  </div>
                  {(() => {
                    const risk = rtoService.predictRisk(selectedOrder)
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">
                            Risk Score: <b className="text-white">{risk.score}%</b>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${risk.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}
                          >
                            {risk.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Reasons: {risk.reasons.join(', ')}
                        </p>
                        {risk.score > 60 && (
                          <button
                            className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded transition-colors border border-white/5"
                            onClick={() =>
                              alert(
                                `Initiating manual verification call for ${selectedOrder.id}...`
                              )
                            }
                          >
                            📞 Call Customer for Verification
                          </button>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

            {/* Reverse Logistics / RMA */}
            {selectedOrder.status === 'Delivered' && (
              <div className="glass p-4 mt-6 border-l-4 border-blue-500 bg-blue-500/5">
                <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Reverse Logistics
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    onClick={async () => {
                      const rma = await reverseLogisticsService.createReturnRequest(
                        selectedOrder,
                        [],
                        'Customer Request'
                      )
                      if (rma.returnId) alert(`Return Created: ${rma.returnId}\nPickup scheduled.`)
                    }}
                  >
                    <RotateCcw className="w-3 h-3" /> Initiate Return (RMA)
                  </button>
                  <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded border border-white/5 transition-all">
                    Support Check
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary glass-hover" style={{ flex: 1 }}>
                Process Order
              </button>
              <button
                className="btn-secondary glass-hover"
                style={{ flex: 1 }}
                onClick={() => labelPrintService.printLabel(selectedOrder)}
              >
                🏷️ Print Label
              </button>
              <button
                className="btn-secondary glass-hover"
                style={{ flex: 1 }}
                onClick={() => {
                  const html = labelPrintService.generatePackingSlipHTML(selectedOrder)
                  const printWindow = window.open('', '_blank')
                  printWindow.document.write(html)
                  printWindow.document.close()
                  printWindow.onload = () => printWindow.print()
                }}
              >
                📄 Packing Slip
              </button>
              <button
                className="btn-secondary glass-hover"
                style={{ flex: 1 }}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList
