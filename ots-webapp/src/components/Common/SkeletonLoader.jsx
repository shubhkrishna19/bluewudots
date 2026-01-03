import React from 'react'

/**
 * Reusable Skeleton Loader
 * @param {string} type - 'text' | 'card' | 'table-row' | 'circular'
 * @param {number} count - Number of items to render
 * @param {string} className - Additional CSS classes
 */
const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
  const items = Array.from({ length: count })

  const renderSkeleton = (idx) => {
    switch (type) {
      case 'card':
        return (
          <div key={idx} className={`glass animate-pulse p-6 rounded-xl space-y-4 ${className}`}>
            <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
            <div className="h-8 bg-white/20 rounded-lg w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded-full w-full"></div>
              <div className="h-3 bg-white/5 rounded-full w-5/6"></div>
            </div>
          </div>
        )
      case 'table-row':
        return (
          <tr key={idx} className="animate-pulse border-b border-white/5">
            <td className="p-4">
              <div className="h-4 bg-white/10 rounded w-24"></div>
            </td>
            <td className="p-4">
              <div className="h-4 bg-white/15 rounded w-32"></div>
            </td>
            <td className="p-4">
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </td>
            <td className="p-4">
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </td>
            <td className="p-4 text-right">
              <div className="h-8 bg-white/10 rounded w-8 ml-auto"></div>
            </td>
          </tr>
        )
      case 'circular':
        return (
          <div
            key={idx}
            className={`h-12 w-12 rounded-full bg-white/10 animate-pulse ${className}`}
          ></div>
        )
      case 'text':
      default:
        return (
          <div
            key={idx}
            className={`h-4 bg-white/10 rounded-full animate-pulse mb-3 ${className}`}
          ></div>
        )
    }
  }

  return (
    <>
      {type === 'table-row' ? (
        items.map((_, i) => renderSkeleton(i))
      ) : (
        <div
          className={
            type === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-2'
          }
        >
          {items.map((_, i) => renderSkeleton(i))}
        </div>
      )}
    </>
  )
}

export default SkeletonLoader
