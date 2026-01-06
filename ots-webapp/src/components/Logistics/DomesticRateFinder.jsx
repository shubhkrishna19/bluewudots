import React, { useState, useMemo } from 'react'
import { getAllRates } from '../../services/carrierRateEngine'

const DomesticRateFinder = () => {
  const [state, setState] = useState('Maharashtra')
  const [city, setCity] = useState('Mumbai')
  const [weight, setWeight] = useState(1)
  const [rates, setRates] = useState([])
  const [selectedRate, setSelectedRate] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const states = useMemo(() => [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
    'West Bengal', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Haryana',
    'Rajasthan', 'Punjab', 'Madhya Pradesh', 'Bihar', 'Assam'
  ], [])

  const fetchRates = async () => {
    setIsLoading(true)
    try {
      const results = await getAllRates({
        state,
        city,
        weight,
        isCOD: false,
        codAmount: 0
      })
      setRates(results)
      setSelectedRate(null)
      setBookingStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedRate) return

    setBookingStatus({ loading: true })

    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 1500))

    setBookingStatus({
      success: true,
      trackingNumber: `BW-${selectedRate.carrierId.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return (
    <div className="international-shipping animate-fade">
      <div className="section-header">
        <h2>🏢 Pan-India Domestic Rates</h2>
        <p className="text-muted">Real-time shipping rates across 28 states & 8 UTs</p>
      </div>

      <div className="rate-finder glass" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Rate Calculator</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
              DESTINATION STATE
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
              }}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
              CITY (OPTIONAL)
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '100px' }}>
            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
              WEIGHT (KG)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0.5)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
          </div>
          <button
            className="btn-primary glass-hover"
            style={{ padding: '12px 28px' }}
            onClick={fetchRates}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Get Rates'}
          </button>
        </div>
      </div>

      {rates.length > 0 && (
        <div
          className="rates-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '32px',
          }}
        >
          {rates.map((rate, idx) => (
            <div
              key={rate.carrierId}
              className={`rate-card glass glass-hover ${selectedRate?.carrierId === rate.carrierId ? 'selected' : ''}`}
              style={{
                padding: '24px',
                cursor: 'pointer',
                borderLeft: selectedRate?.carrierId === rate.carrierId ? '4px solid var(--primary)' : '4px solid transparent',
                background: selectedRate?.carrierId === rate.carrierId ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              }}
              onClick={() => setSelectedRate(rate)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{rate.carrierLogo}</span>
                  <div>
                    <h4>{rate.carrierName}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Zone: {rate.zone} • {rate.type}
                    </span>
                  </div>
                </div>
                {idx === 0 && (
                  <span className="badge" style={{ background: 'var(--success)', fontSize: '0.65rem' }}>
                    BEST VALUE
                  </span>
                )}
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">Freight (Weight: {rate.billedWeight}kg)</span>
                  <span>₹{rate.breakdown.freight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">Fuel Surcharge</span>
                  <span>₹{rate.breakdown.fuelSurcharge}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">GST (18%)</span>
                  <span>₹{rate.breakdown.gst}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '12px',
                  marginTop: '8px',
                }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{rate.total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>⏱️ Est. Delivery:</span>
                <span style={{ fontWeight: '600' }}>{rate.estimatedDelivery[0]}-{rate.estimatedDelivery[1]} days</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRate && (
        <div className="booking-section glass" style={{ marginTop: '32px', padding: '24px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Book Domestic Shipment</h3>
              <p className="text-muted" style={{ marginTop: '4px' }}>
                {selectedRate.carrierName} to {state} • {weight}kg • ₹{selectedRate.total.toLocaleString()}
              </p>
            </div>
            <button
              className="btn-primary glass-hover"
              style={{ padding: '14px 36px' }}
              onClick={handleBooking}
              disabled={bookingStatus?.loading}
            >
              {bookingStatus?.loading ? '⏳ Processing...' : '🚀 Create Shipment'}
            </button>
          </div>

          {bookingStatus?.success && (
            <div className="booking-success animate-fade" style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--success)',
            }}>
              <p style={{ fontWeight: '700', color: 'var(--success)' }}>✅ Shipment Created Successfully!</p>
              <p style={{ marginTop: '8px' }}><strong>Tracking #:</strong> {bookingStatus.trackingNumber}</p>
              <p><strong>Est. Delivery:</strong> {new Date(bookingStatus.estimatedDelivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          )}
        </div>
      )}

      {rates.length === 0 && !isLoading && (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🚛</p>
          <h3>Check Domestic Shipping Rates</h3>
          <p className="text-muted">Enter weight and destination to compare Delhivery, BlueDart, and more</p>
        </div>
      )}
    </div>
  )
}

export default DomesticRateFinder
