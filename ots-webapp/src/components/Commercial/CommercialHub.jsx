import React, { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import PricingHeatmap from './PricingHeatmap'

const PricingSimulator = ({ sku, getSKUProfitability }) => {
  const [simPrice, setSimPrice] = useState(sku?.bauSP || 0)
  const prof = getSKUProfitability(sku?.sku, simPrice)

  if (!sku) return null

  return (
    <div
      className="pricing-simulator glass"
      style={{ padding: '20px', borderRadius: '12px', marginTop: '20px' }}
    >
      <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🧮 Pricing Simulator: <span style={{ color: 'var(--primary)' }}>{sku.sku}</span>
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="sim-inputs">
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Simulated Selling Price (Inc GST)
          </label>
          <input
            type="range"
            min={sku.eventPrice || 0}
            max={Math.round((sku.bauSP || 0) * 1.5)}
            value={simPrice}
            onChange={(e) => setSimPrice(parseInt(e.target.value))}
            style={{ width: '100%', marginTop: '12px', accentColor: 'var(--primary)' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '0.9rem',
            }}
          >
            <span>₹{sku.eventPrice}</span>
            <span style={{ fontWeight: 'bold' }}>₹{simPrice}</span>
            <span>₹{Math.round(sku.bauSP * 1.5)}</span>
          </div>
        </div>
        <div
          className="sim-results glass"
          style={{ padding: '12px', background: 'rgba(255,255,255,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-muted">Net Realization:</span>
            <span style={{ fontWeight: 'bold' }}>₹{prof?.netRealization}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-muted">Est. Profit:</span>
            <span
              style={{
                fontWeight: 'bold',
                color: prof?.profit > 0 ? 'var(--success)' : 'var(--danger)',
              }}
            >
              ₹{prof?.profit}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Margin:</span>
            <span
              style={{
                fontWeight: 'bold',
                color: prof?.marginPercent > 15 ? 'var(--success)' : 'var(--warning)',
              }}
            >
              {prof?.marginPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const CommercialHub = () => {
  const { skuMaster, getSKUProfitability } = useData()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSkuForSim, setSelectedSkuForSim] = useState(null)

  const parents = useMemo(() => skuMaster.filter((s) => s.isParent), [skuMaster])
  const children = useMemo(() => skuMaster.filter((s) => !s.isParent), [skuMaster])

  const categories = useMemo(() => ['All', ...new Set(parents.map((p) => p.category))], [parents])

  const filteredParents =
    selectedCategory === 'All' ? parents : parents.filter((p) => p.category === selectedCategory)

  return (
    <div className="commercial-hub animate-fade">
      <div className="section-header">
        <h2>Commercial Intelligence Hub</h2>
        <p className="text-muted">Relational SKU Lineage & Margin Fidelity</p>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-accent)',
              color: '#fff',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedSkuForSim && (
        <PricingSimulator sku={selectedSkuForSim} getSKUProfitability={getSKUProfitability} />
      )}

      <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '32px' }}>
        {/* SKU Lineage Tree */}
        <div className="chart-card glass" style={{ padding: '24px' }}>
          <h3>MTP Lineage & Costing</h3>
          <div className="lineage-list" style={{ marginTop: '20px' }}>
            {filteredParents.map((parent) => (
              <div key={parent.sku} className="parent-node" style={{ marginBottom: '24px' }}>
                <div
                  className="parent-header glass"
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ color: 'var(--primary)' }}>{parent.sku}</h4>
                    <span
                      className="badge"
                      style={{ background: 'var(--bg-accent)', fontSize: '0.65rem' }}
                    >
                      PARENT MTP
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{parent.name}</p>
                  <div
                    style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem' }}
                    className="text-muted"
                  >
                    <span>📏 {parent.dimensions}</span>
                    <span>⚖️ {parent.weight}kg</span>
                    <span>🏭 Cost (Lnd): ₹{parent.landingCost}</span>
                  </div>
                </div>
                <div className="child-variants" style={{ paddingLeft: '24px', marginTop: '12px' }}>
                  {children
                    .filter((c) => c.parentSku === parent.sku)
                    .map((child) => {
                      const prof = getSKUProfitability(child.sku)
                      return (
                        <div
                          key={child.sku}
                          className={`child-node glass-hover ${selectedSkuForSim?.sku === child.sku ? 'selected' : ''}`}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            background:
                              selectedSkuForSim?.sku === child.sku
                                ? 'rgba(99, 102, 241, 0.1)'
                                : 'transparent',
                          }}
                          onClick={() => setSelectedSkuForSim(child)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                                {child.sku}
                              </span>
                              <span
                                className="text-muted"
                                style={{ fontSize: '0.75rem', marginLeft: '8px' }}
                              >
                                ({child.colorFinish})
                              </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span
                                style={{
                                  color:
                                    prof?.marginPercent > 15 ? 'var(--success)' : 'var(--warning)',
                                  fontWeight: '700',
                                }}
                              >
                                {prof?.marginPercent}% Margin
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              marginTop: '8px',
                              fontSize: '0.7rem',
                            }}
                            className="text-muted"
                          >
                            <span>BAU: ₹{child.bauSP}</span>
                            <span>Usual: ₹{child.usualPrice}</span>
                            <span>Event: ₹{child.eventPrice}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profitability Benchmarks */}
        <div className="chart-card glass" style={{ padding: '24px' }}>
          <h3>Pricing Parity Benchmarks</h3>
          <div style={{ marginTop: '20px' }}>
            <PricingHeatmap />
          </div>
          <div className="benchmarks" style={{ marginTop: '32px' }}>
            <h4 className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
              CATEGORY HEALTH BENCHMARKS
            </h4>
            {filteredParents.slice(0, 5).map((p) => (
              <div key={p.sku} style={{ marginBottom: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>{p.category}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Target: {p.categoryAvgMargin}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--bg-accent)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${p.categoryAvgMargin * 3}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="commercial-insights glass"
            style={{ marginTop: '32px', padding: '16px', borderRadius: '8px' }}
          >
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>💡 Relational Insights</h4>
            <ul style={{ fontSize: '0.8rem', paddingLeft: '16px', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '8px' }}>
                High-weight SKUs are sensitive to <strong>Logistics</strong> rates.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Shoe Racks maintain <strong>higher margins</strong> due to low BOM vs SP ratio.
              </li>
              <li>
                Event pricing targets a <strong>minimum 8-10% profit</strong> floor.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommercialHub
