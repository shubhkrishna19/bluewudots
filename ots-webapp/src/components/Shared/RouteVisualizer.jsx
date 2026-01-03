import React from 'react'

/**
 * RouteVisualizer
 * Renders an SVG representation of bin locations and the optimized pick path.
 */
const RouteVisualizer = ({ items = [], strategy = 'SNAKE' }) => {
  // Normalize coordinates for visualization
  // Assumes coordinates are in a range, we'll scale them to fit 400x200 SVG
  const width = 400
  const height = 200
  const padding = 20

  if (items.length === 0) return null

  // Find min/max for normalization
  const xValues = items.map((i) => i.coordinates?.x || 0)
  const yValues = items.map((i) => i.coordinates?.y || 0)

  const minX = Math.min(...xValues, 0)
  const maxX = Math.max(...xValues, 100)
  const minY = Math.min(...yValues, 0)
  const maxY = Math.max(...yValues, 100)

  const scaleX = (val) => padding + ((val - minX) / (maxX - minX || 1)) * (width - 2 * padding)
  const scaleY = (val) => padding + ((val - minY) / (maxY - minY || 1)) * (height - 2 * padding)

  // Generate Path data
  const pathD = items.reduce((acc, item, idx) => {
    const x = scaleX(item.coordinates?.x || 0)
    const y = scaleY(item.coordinates?.y || 0)
    return acc + (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`)
  }, '')

  return (
    <div className="route-visualizer glass p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold uppercase text-slate-400">Route Map: {strategy}</h4>
        <span className="text-[10px] text-slate-500">Pick Station (0,0) → End</span>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-slate-900/50 border border-white/10 h-[200px]">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Optimized Path */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="animate-pulse"
          />

          {/* Stop Points */}
          {items.map((item, idx) => {
            const x = scaleX(item.coordinates?.x || 0)
            const y = scaleY(item.coordinates?.y || 0)
            return (
              <g key={item.sku + idx}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={
                    idx === 0 ? '#10b981' : idx === items.length - 1 ? '#ef4444' : 'var(--primary)'
                  }
                />
                <text
                  x={x + 6}
                  y={y + 4}
                  fontSize="8"
                  fill="white"
                  className="font-mono opacity-50"
                >
                  {idx + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default RouteVisualizer
