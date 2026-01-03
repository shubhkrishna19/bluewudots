import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { generatePackingSlip, generateShippingLabel } from '../../utils/labelGenerator'
import shipmentService from '../../services/shipmentService'
import labelPrintService from '../../services/labelPrintService'

const STAGES = [
  { key: 'Imported', label: 'IMPORTED', color: 'var(--text-muted)' },
  { key: 'MTP-Applied', label: 'COMMERCIALS APPLIED', color: 'var(--accent)' },
  { key: 'Carrier-Assigned', label: 'READY FOR DISPATCH', color: 'var(--primary)' },
  { key: 'In-Transit', label: 'IN TRANSIT', color: 'var(--info)' },
  { key: 'Delivered', label: 'DELIVERED', color: 'var(--success)' },
]

const OrderJourney = ({ orderId }) => {
  const { orders, updateOrderStatus } = useData()
  const order = orders.find((o) => o.id === orderId)
  const [showLabelMenu, setShowLabelMenu] = useState(false)
  const [thermalAvailable, setThermalAvailable] = useState(false)

  // Check thermal printer status on mount
  React.useEffect(() => {
    labelPrintService.getThermalStatus().then((status) => {
      setThermalAvailable(status.available)
    })
  }, [])

  if (!order) return null

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.status)

  const handleGenerateLabel = (type) => {
    if (type === 'packing') {
      generatePackingSlip(order)
    } else {
      generateShippingLabel(order)
    }
    setShowLabelMenu(false)
  }

  const handleThermalPrint = async () => {
    try {
      const result = await labelPrintService.printToThermal(order)
      if (result.success) {
        alert('✅ Label sent to thermal printer!')
      } else {
        alert('⚠️ Thermal print failed. Check printer connection.')
      }
    } catch (error) {
      alert('❌ Print error: ' + error.message)
    }
    setShowLabelMenu(false)
  }

  const handleTrack = async () => {
    if (!order.awb) {
      alert('Order not shipped yet (No AWB)')
      return
    }
    try {
      const status = await shipmentService.trackShipment(order.awb, order.carrier)
      const historyStr = status.history
        .map(
          (h) => `📍 ${h.status} - ${h.location} (${new Date(h.timestamp).toLocaleDateString()})`
        )
        .join('\n')

      alert(
        `🚚 Live Tracking (${order.carrier})\nStatus: ${status.currentStatus}\nETA: ${new Date(status.estimatedDelivery).toDateString()}\n\n${historyStr}`
      )
    } catch (err) {
      console.error(err)
      alert('Tracking unavailable')
    }
  }

  return (
    <div
      className="order-journey-card glass animate-fade"
      style={{ padding: '24px', marginTop: '20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            TRACKING ORDER
          </span>
          <h4 style={{ fontSize: '1.2rem' }}>{order.id}</h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            className="badge"
            style={{ background: STAGES[currentStageIndex]?.color || 'var(--glass-border)' }}
          >
            {order.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div
        className="journey-track"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '5%',
            right: '5%',
            height: '2px',
            background: 'var(--glass-border)',
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '5%',
            width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%`,
            height: '2px',
            background: 'var(--primary)',
            boxShadow: '0 0 10px var(--primary-glow)',
            zIndex: 0,
            transition: 'width 0.5s ease',
          }}
        ></div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentStageIndex
          const isCurrent = idx === currentStageIndex

          return (
            <div key={stage.key} style={{ zIndex: 1, textAlign: 'center', width: '20%' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--primary)' : 'var(--bg-accent)',
                  border: isCurrent
                    ? '4px solid var(--primary-glow)'
                    : '2px solid var(--glass-border)',
                  margin: '0 auto',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={() => updateOrderStatus(orderId, stage.key)}
                title={`Transition to ${stage.label}`}
              ></div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6rem',
                  marginTop: '12px',
                  color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: isCompleted ? '700' : '400',
                }}
              >
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="journey-actions"
        style={{ marginTop: '32px', display: 'flex', gap: '12px', position: 'relative' }}
      >
        <button
          className="btn-secondary glass-hover"
          style={{
            flex: 1,
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '5px',
          }}
          onClick={handleTrack}
          disabled={!order.awb}
        >
          🛰️ Track Live
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            className="btn-primary glass-hover"
            style={{ width: '100%', fontSize: '0.8rem' }}
            onClick={() => setShowLabelMenu(!showLabelMenu)}
          >
            Generate Label ▾
          </button>
          {showLabelMenu && (
            <div
              className="label-menu glass"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => handleGenerateLabel('packing')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                📄 Packing Slip (PDF)
              </button>
              <button
                onClick={() => handleGenerateLabel('thermal')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderTop: '1px solid var(--glass-border)',
                }}
              >
                🏷️ Thermal Label (4x6)
              </button>
              {thermalAvailable && (
                <button
                  onClick={handleThermalPrint}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--success)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderTop: '1px solid var(--glass-border)',
                    fontWeight: 'bold',
                  }}
                >
                  🖨️ Print to Zebra (Direct)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderJourney
