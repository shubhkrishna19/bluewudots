import React, { useMemo } from 'react'
import { Package, Activity, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'
import warehouseOptimizer from '../../services/warehouseOptimizer'

/**
 * Warehouse Selector Component
 * Displays warehouse utilization and allows manual override of warehouse selection.
 */
const WarehouseSelector = ({ selectedWarehouse, onSelect, order = null, currentLoads = {} }) => {
  const utilization = useMemo(
    () => warehouseOptimizer.getUtilizationMetrics(currentLoads),
    [currentLoads]
  )

  const recommendation = useMemo(() => {
    if (order?.pincode || order?.state) {
      return warehouseOptimizer.selectOptimalWarehouse(order, currentLoads)
    }
    return null
  }, [order, currentLoads])

  const getStatusColor = (status) => {
    switch (status) {
      case 'HEALTHY':
        return 'var(--success)'
      case 'MODERATE':
        return 'var(--warning)'
      case 'HIGH':
        return 'var(--danger)'
      default:
        return 'var(--text-muted)'
    }
  }

  return (
    <div className="warehouse-selector space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="text-primary w-5 h-5" />
          <h4 className="text-lg font-bold m-0">Fulfillment Hubs</h4>
        </div>
        {recommendation && (
          <div className="glass flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              AI RECOMMENDED: {recommendation.warehouse.id}
            </span>
          </div>
        )}
      </div>

      {recommendation && (
        <div className="glass p-4 rounded-xl border-l-4 border-primary bg-primary/5 mb-6 animate-in fade-in slide-in-from-left-2 duration-500">
          <div className="flex gap-3">
            <div className="bg-primary/10 p-2 rounded-lg h-fit">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary m-0">Optimization Insight</p>
              <p className="text-xs opacity-80 mt-1 leading-relaxed text-blue-100 italic">
                "{recommendation.reason}"
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {utilization.map((wh) => {
          const isSelected = selectedWarehouse === wh.id
          const isRecommended = recommendation?.warehouse?.id === wh.id

          return (
            <div
              key={wh.id}
              className={`glass glass-hover relative overflow-hidden transition-all duration-300 group ${
                isSelected ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : 'border-white/5'
              }`}
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderRadius: '16px',
                background: isSelected ? 'rgba(var(--primary-rgb), 0.08)' : undefined,
              }}
              onClick={() => onSelect?.(wh.id)}
            >
              {isRecommended && !isSelected && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest text-white shadow-sm">
                    AI Recommended
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div
                    className="p-2.5 rounded-xl bg-black/20"
                    style={{ border: `1px solid ${wh.color}33` }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: wh.color }} />
                  </div>
                  <div>
                    <h5 className="font-bold text-base m-0 leading-none">{wh.id}</h5>
                    <p className="text-[10px] opacity-60 uppercase tracking-tighter mt-1">
                      {wh.name}
                    </p>
                  </div>
                </div>
                <div
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-white/5"
                  style={{
                    color: getStatusColor(wh.status),
                    border: `1px solid ${getStatusColor(wh.status)}22`,
                  }}
                >
                  {wh.status}
                </div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-end mb-1.5 px-0.5">
                  <span className="text-[10px] uppercase font-bold opacity-40">
                    Load Utilization
                  </span>
                  <span
                    className="text-xs font-black tracking-tight"
                    style={{ color: getStatusColor(wh.status) }}
                  >
                    {wh.utilization}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    style={{
                      width: `${wh.utilization}%`,
                      background: `linear-gradient(90deg, ${wh.color}, ${getStatusColor(wh.status)})`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3 px-1">
                  <div className="flex items-center gap-1 opacity-50">
                    <Package className="w-3 h-3" />
                    <span className="text-[9px] font-medium tracking-tight">
                      Available Cap: {wh.available.toLocaleString()}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-primary animate-in zoom-in" />
                  )}
                </div>
              </div>

              {/* Decorative background pulse for selected */}
              {isSelected && (
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
                  <Activity className="w-24 h-24 text-primary" strokeWidth={1} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WarehouseSelector
