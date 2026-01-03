import React from 'react'
import { useData } from '../../context/DataContext'

const INDIA_ZONES = {
  North: {
    states: [
      'Delhi',
      'Haryana',
      'Punjab',
      'Uttar Pradesh',
      'Uttarakhand',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Ladakh',
      'Chandigarh',
    ],
    color: '#3B82F6',
  },
  South: {
    states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry'],
    color: '#10B981',
  },
  East: {
    states: [
      'West Bengal',
      'Odisha',
      'Bihar',
      'Jharkhand',
      'Sikkim',
      'Assam',
      'Arunachal Pradesh',
      'Nagaland',
      'Manipur',
      'Mizoram',
      'Tripura',
      'Meghalaya',
    ],
    color: '#F59E0B',
  },
  West: {
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan', 'Madhya Pradesh', 'Chhattisgarh'],
    color: '#EF4444',
  },
}

const INTERNATIONAL_ZONES = {
  'Middle East': { countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'], color: '#8B5CF6' },
  Americas: { countries: ['USA', 'Canada', 'Mexico'], color: '#EC4899' },
  Europe: { countries: ['UK', 'Germany', 'France', 'Italy'], color: '#06B6D4' },
  'Asia Pacific': { countries: ['Singapore', 'Malaysia', 'Australia'], color: '#14B8A6' },
}

const ZoneMap = () => {
  const { orders } = useData()

  const getZoneForState = (state) => {
    for (const [zone, data] of Object.entries(INDIA_ZONES)) {
      if (data.states.includes(state)) return zone
    }
    return 'Unknown'
  }

  const zoneStats = Object.keys(INDIA_ZONES).reduce((acc, zone) => {
    acc[zone] = {
      total: orders.filter((o) => getZoneForState(o.state) === zone).length,
      delivered: orders.filter((o) => getZoneForState(o.state) === zone && o.status === 'Delivered')
        .length,
      inTransit: orders.filter(
        (o) => getZoneForState(o.state) === zone && o.status === 'In-Transit'
      ).length,
    }
    return acc
  }, {})

  const topStates = orders.reduce((acc, order) => {
    acc[order.state] = (acc[order.state] || 0) + 1
    return acc
  }, {})

  const sortedStates = Object.entries(topStates)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="zone-map animate-fade">
      <div className="section-header">
        <h2>India Zone Distribution</h2>
        <p className="text-muted">Order distribution across Pan-India zones</p>
      </div>

      {/* Zone Cards */}
      <div
        className="zone-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '32px',
        }}
      >
        {Object.entries(INDIA_ZONES).map(([zone, data]) => (
          <div
            key={zone}
            className="zone-card glass glass-hover"
            style={{ padding: '24px', borderTop: `4px solid ${data.color}` }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <h3>{zone}</h3>
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: data.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                }}
              >
                {zoneStats[zone]?.total || 0}
              </span>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
              >
                <span className="text-muted">Delivered</span>
                <span style={{ color: 'var(--success)', fontWeight: '700' }}>
                  {zoneStats[zone]?.delivered || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">In Transit</span>
                <span style={{ color: 'var(--info)', fontWeight: '700' }}>
                  {zoneStats[zone]?.inTransit || 0}
                </span>
              </div>
            </div>
            <p className="text-muted" style={{ marginTop: '16px', fontSize: '0.7rem' }}>
              {data.states.length} states covered
            </p>
          </div>
        ))}
      </div>

      {/* Top States */}
      <div className="top-states glass" style={{ marginTop: '32px', padding: '24px' }}>
        <h3>Top Destination States</h3>
        <div style={{ marginTop: '20px' }}>
          {sortedStates.map(([state, count], idx) => (
            <div
              key={state}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: idx === 0 ? 'var(--primary)' : 'var(--bg-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                }}
              >
                {idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600' }}>{state}</p>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--glass-border)',
                    borderRadius: '3px',
                    marginTop: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(count / orders.length) * 100}%`,
                      height: '100%',
                      background: 'var(--primary)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Legend */}
      <div
        className="zone-legend glass"
        style={{
          marginTop: '24px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
        }}
      >
        {Object.entries(INDIA_ZONES).map(([zone, data]) => (
          <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{ width: '16px', height: '16px', borderRadius: '4px', background: data.color }}
            ></div>
            <span>{zone} Zone</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ZoneMap
