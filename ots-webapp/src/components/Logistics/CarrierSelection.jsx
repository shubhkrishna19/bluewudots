import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import {
  getAllRates,
  getRecommendation,
  getZone,
  CARRIER_RATES,
} from '../../services/carrierRateEngine'
import { STATE_CODES } from '../../utils/dataUtils'

const CarrierSelection = () => {
  const { orders, assignCarrier, updateOrderStatus } = useData()

  // State for rate calculator
  const [shipment, setShipment] = useState({
    weight: 5,
    state: 'Maharashtra',
    city: 'Mumbai',
    isCOD: false,
    codAmount: 0,
  })
  const [priority, setPriority] = useState('cost')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Get rates from the rate engine
  const rates = getAllRates(shipment)
  const recommendation = getRecommendation(shipment, priority)
  const zone = getZone(shipment.state, shipment.city)

  // Get orders needing carrier assignment
  const pendingAssignment = orders.filter(
    (o) => ['Pending', 'MTP-Applied'].includes(o.status) && !o.carrier
  )

  const handleAssignCarrier = (order, carrier) => {
    assignCarrier(order.id, carrier.carrierId, carrier.carrierName)
    updateOrderStatus(order.id, 'Carrier-Assigned', { carrier: carrier.carrierName })
    setSelectedOrder(null)
  }

  const updateShipment = (field, value) => {
    setShipment((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="carrier-view animate-fade">
      <div
        className="section-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2>Carrier Rate Engine</h2>
          <p className="text-muted">Zone-based pricing with real-time comparisons</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge" style={{ background: 'var(--warning)', padding: '8px 16px' }}>
            {pendingAssignment.length} Need Assignment
          </span>
        </div>
      </div>

      {/* Rate Calculator */}
      <div className="rate-calculator glass" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>🧮 Rate Calculator</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label
              className="text-muted"
              style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
            >
              WEIGHT (KG)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={shipment.weight}
              onChange={(e) => updateShipment('weight', parseFloat(e.target.value) || 0.5)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                color: '#fff',
              }}
            />
          </div>
          <div>
            <label
              className="text-muted"
              style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
            >
              STATE
            </label>
            <select
              value={shipment.state}
              onChange={(e) => updateShipment('state', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                color: '#fff',
              }}
            >
              {Object.keys(STATE_CODES).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-muted"
              style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
            >
              CITY
            </label>
            <input
              type="text"
              value={shipment.city}
              onChange={(e) => updateShipment('city', e.target.value)}
              placeholder="City name"
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                color: '#fff',
              }}
            />
          </div>
          <div>
            <label
              className="text-muted"
              style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
            >
              PAYMENT
            </label>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '6px' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  checked={!shipment.isCOD}
                  onChange={() => updateShipment('isCOD', false)}
                />
                Prepaid
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  checked={shipment.isCOD}
                  onChange={() => updateShipment('isCOD', true)}
                />
                COD
              </label>
            </div>
          </div>
          {shipment.isCOD && (
            <div>
              <label
                className="text-muted"
                style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
              >
                COD AMOUNT
              </label>
              <input
                type="number"
                value={shipment.codAmount}
                onChange={(e) => updateShipment('codAmount', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              />
            </div>
          )}
          <div>
            <label
              className="text-muted"
              style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}
            >
              OPTIMIZE FOR
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                color: '#fff',
              }}
            >
              <option value="cost">💰 Lowest Cost</option>
              <option value="speed">⚡ Fastest Delivery</option>
              <option value="reliability">🏆 Most Reliable</option>
            </select>
          </div>
        </div>

        {/* Zone Info */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'var(--primary)', padding: '6px 12px' }}>
            Zone: {zone}
          </span>
          <span className="badge" style={{ background: 'var(--info)', padding: '6px 12px' }}>
            Billed Weight: {Math.ceil(shipment.weight * 2) / 2} kg
          </span>
          {shipment.isCOD && (
            <span className="badge" style={{ background: 'var(--warning)', padding: '6px 12px' }}>
              COD: ₹{shipment.codAmount}
            </span>
          )}
        </div>
      </div>

      {/* Rate Comparison Grid */}
      <div
        className="rate-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
      >
        {/* Recommended Carrier */}
        <div
          className="recommendation-hero glass"
          style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'var(--success)',
              padding: '6px 16px',
              fontSize: '0.75rem',
              fontWeight: '700',
            }}
          >
            ✨ RECOMMENDED
          </div>
          <span className="badge" style={{ background: 'var(--primary)' }}>
            {recommendation.recommendation}
          </span>
          <h3 style={{ fontSize: '2rem', margin: '12px 0' }}>
            {recommendation.carrierLogo} {recommendation.carrierName}
          </h3>
          <p className="text-muted">{recommendation.reason}</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '24px',
            }}
          >
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                TOTAL COST
              </span>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>
                ₹{recommendation.total}
              </p>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                DELIVERY
              </span>
              <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {recommendation.estimatedDelivery?.[0]}-{recommendation.estimatedDelivery?.[1]} days
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="glass" style={{ padding: '16px', marginTop: '20px' }}>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>
              COST BREAKDOWN
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.85rem',
              }}
            >
              <span>Freight:</span>
              <span style={{ textAlign: 'right' }}>₹{recommendation.breakdown?.freight}</span>
              <span>Fuel Surcharge:</span>
              <span style={{ textAlign: 'right' }}>₹{recommendation.breakdown?.fuelSurcharge}</span>
              {shipment.isCOD && (
                <>
                  <span>COD Charge:</span>
                  <span style={{ textAlign: 'right' }}>₹{recommendation.breakdown?.codCharge}</span>
                </>
              )}
              <span>GST (18%):</span>
              <span style={{ textAlign: 'right' }}>₹{recommendation.breakdown?.gst}</span>
              <span
                style={{
                  fontWeight: '700',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '8px',
                }}
              >
                Total:
              </span>
              <span
                style={{
                  fontWeight: '700',
                  textAlign: 'right',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '8px',
                  color: 'var(--success)',
                }}
              >
                ₹{recommendation.total}
              </span>
            </div>
          </div>
        </div>

        {/* All Carriers Comparison */}
        <div className="all-carriers glass" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>All Carrier Rates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rates.map((rate, idx) => (
              <div
                key={rate.carrierId}
                className="glass glass-hover"
                style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: idx === 0 ? '4px solid var(--success)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{rate.carrierLogo}</span>
                    <strong>{rate.carrierName}</strong>
                    {idx === 0 && (
                      <span
                        className="badge"
                        style={{
                          background: 'var(--success)',
                          fontSize: '0.6rem',
                          padding: '2px 6px',
                        }}
                      >
                        BEST
                      </span>
                    )}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    {rate.estimatedDelivery[0]}-{rate.estimatedDelivery[1]} days • Zone: {rate.zone}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: idx === 0 ? 'var(--success)' : '#fff',
                    }}
                  >
                    ₹{rate.total}
                  </p>
                  {idx > 0 && (
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      +₹{rate.total - rates[0].total} (
                      {((rate.total / rates[0].total - 1) * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Needing Assignment */}
      {pendingAssignment.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>📦 Orders Pending Carrier Assignment</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {pendingAssignment.slice(0, 6).map((order) => (
              <div key={order.id} className="glass glass-hover" style={{ padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h4 style={{ color: 'var(--primary)' }}>{order.id}</h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {order.customerName}
                    </p>
                  </div>
                  <span
                    className="badge"
                    style={{ background: 'var(--warning)', fontSize: '0.65rem' }}
                  >
                    {order.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem' }}>
                  {order.city}, {order.state} • {order.weight}kg
                </p>
                <button
                  className="btn-primary glass-hover"
                  style={{ width: '100%', marginTop: '12px', padding: '10px' }}
                  onClick={() => {
                    // Calculate rates for this order and assign best
                    const orderRates = getAllRates({
                      state: order.state,
                      city: order.city,
                      weight: order.weight,
                      isCOD: order.isCOD,
                      codAmount: order.codAmount,
                    })
                    if (orderRates.length > 0) {
                      handleAssignCarrier(order, orderRates[0])
                    }
                  }}
                >
                  🚚 Auto-Assign Best Carrier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CarrierSelection
