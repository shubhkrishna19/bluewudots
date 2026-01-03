import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'

const StockAudit = () => {
  const { skuMaster, inventoryLevels, adjustStock } = useData()
  const [auditSession, setAuditSession] = useState(null) // { id, items: [] }
  const [currentBin, setCurrentBin] = useState('')
  const [scannedSKU, setScannedSKU] = useState('')
  const [countedQty, setCountedQty] = useState('')
  const [discrepancies, setDiscrepancies] = useState([])

  const startSession = () => {
    // Mock: Randomly select 5 SKUs for audit
    const sessionItems = skuMaster
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((sku) => ({
        sku: sku.sku,
        name: sku.name,
        systemQty: inventoryLevels[sku.sku]?.inStock || 0,
        countedQty: null,
        status: 'PENDING',
      }))

    setAuditSession({
      id: `AUDIT-${Date.now()}`,
      startTime: new Date(),
      items: sessionItems,
    })
    setDiscrepancies([])
  }

  const submitCount = () => {
    if (!scannedSKU || countedQty === '') return

    setAuditSession((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.sku === scannedSKU) {
          const variance = parseInt(countedQty) - item.systemQty
          return {
            ...item,
            countedQty: parseInt(countedQty),
            variance,
            status: variance === 0 ? 'MATCH' : 'MISMATCH',
          }
        }
        return item
      })
      return { ...prev, items: updatedItems }
    })

    setScannedSKU('')
    setCountedQty('')
  }

  const finalizeAudit = () => {
    const mismatches = auditSession.items.filter((i) => i.status === 'MISMATCH')
    if (mismatches.length > 0) {
      setDiscrepancies(mismatches)
    }
    // In real app, we would commit adjustments here
    setAuditSession(null)
  }

  return (
    <div className="stock-audit glass p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>🛡️ Cycle Count Auditor</h2>
          <p className="text-muted">Blind count verification mode</p>
        </div>
        {!auditSession && (
          <button className="btn-primary" onClick={startSession}>
            ▶ Start Random Audit
          </button>
        )}
        {auditSession && (
          <button className="btn-danger" onClick={() => setAuditSession(null)}>
            ✕ Cancel
          </button>
        )}
      </div>

      {auditSession && (
        <div className="grid grid-cols-2 gap-8">
          {/* Input Area */}
          <div className="glass p-6">
            <h3 className="mb-4">📝 Entry Terminal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-muted mb-1">Bin Location</label>
                <input
                  type="text"
                  value={currentBin}
                  onChange={(e) => setCurrentBin(e.target.value)}
                  className="w-full glass p-3 rounded"
                  placeholder="Scan Bin Label..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted mb-1">SKU Barcode</label>
                <input
                  type="text"
                  value={scannedSKU}
                  onChange={(e) => setScannedSKU(e.target.value)}
                  className="w-full glass p-3 rounded"
                  placeholder="Scan Item..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted mb-1">Counted Quantity</label>
                <input
                  type="number"
                  value={countedQty}
                  onChange={(e) => setCountedQty(e.target.value)}
                  className="w-full glass p-3 rounded"
                  placeholder="Enter physical count"
                />
              </div>
              <button
                onClick={submitCount}
                disabled={!scannedSKU}
                className="btn-primary w-full py-3 mt-2"
              >
                Submit Count
              </button>
            </div>
          </div>

          {/* Report Card */}
          <div className="glass p-6">
            <div className="flex justify-between mb-4">
              <h3>📊 Session Progress</h3>
              <button className="btn-success text-xs" onClick={finalizeAudit}>
                Sample Complete
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditSession.items.map((item) => (
                <div
                  key={item.sku}
                  className={`p-3 rounded border border-white/10 ${
                    item.status === 'MATCH'
                      ? 'bg-green-500/10'
                      : item.status === 'MISMATCH'
                        ? 'bg-red-500/10'
                        : 'bg-white/5'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{item.sku}</span>
                    <span className="text-xs badge bg-white/10">{item.status}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted">System: ???</span>
                    <span>Count: {item.countedQty !== null ? item.countedQty : '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discrepancy Report */}
      {!auditSession && discrepancies.length > 0 && (
        <div className="mt-8 animate-fade">
          <h3 className="text-danger mb-4">⚠️ Variance Report</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-muted text-xs border-b border-white/10">
                <th className="p-3">SKU</th>
                <th className="p-3">System Qty</th>
                <th className="p-3">Physical Qty</th>
                <th className="p-3">Variance</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((d) => (
                <tr key={d.sku} className="border-b border-white/5">
                  <td className="p-3 font-bold">{d.sku}</td>
                  <td className="p-3">{d.systemQty}</td>
                  <td className="p-3">{d.countedQty}</td>
                  <td className="p-3 text-danger">
                    {d.variance > 0 ? `+${d.variance}` : d.variance}
                  </td>
                  <td className="p-3">
                    <button
                      className="btn-pill bg-danger/20 text-danger hover:bg-danger hover:text-white"
                      onClick={() => adjustStock(d.sku, d.variance)}
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StockAudit
