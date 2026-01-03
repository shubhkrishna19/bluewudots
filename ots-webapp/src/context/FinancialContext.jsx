import React, { createContext, useContext, useState, useEffect } from 'react'
import { useData } from './DataContext'
import { calculateProfitability, getEnhancedSKU } from '../utils/commercialUtils'

const FinancialContext = createContext()

export const FinancialProvider = ({ children }) => {
  const { orders, skuMaster } = useData()
  const [finStats, setFinStats] = useState({
    totalRevenue: 0,
    netRevenue: 0,
    totalGst: 0,
    totalCommissions: 0,
    totalOverhead: 0,
    totalShipping: 0,
    totalBom: 0,
    netProfit: 0,
    marginPercent: 0,
  })
  const [settlements, setSettlements] = useState([]) // { orderId, amount, status: 'Matched'|'Discrepancy'|'Pending', type: 'Marketplace Remittance' }

  useEffect(() => {
    const calculateTotals = () => {
      let stats = {
        totalRevenue: 0,
        netRevenue: 0,
        totalGst: 0,
        totalCommissions: 0,
        totalOverhead: 0,
        totalShipping: 0,
        totalBom: 0,
        netProfit: 0,
      }

      orders.forEach((order) => {
        const skuData = getEnhancedSKU(order.sku, skuMaster)
        if (skuData) {
          const analysis = calculateProfitability({
            sellingPrice: order.amount,
            bomCost: skuData.bomCost * (order.quantity || 1),
            commissionPercent: skuData.commissionPercent,
            tmsLevel: skuData.tmsLevel,
          })

          stats.totalRevenue += order.amount
          stats.totalGst += analysis.breakdown.tax
          stats.totalCommissions += analysis.breakdown.commission
          stats.totalOverhead += analysis.breakdown.overhead
          stats.totalShipping += analysis.breakdown.shipping
          stats.totalGateway = (stats.totalGateway || 0) + (analysis.breakdown.gateway || 0)
          stats.totalReturnProvision =
            (stats.totalReturnProvision || 0) + (analysis.breakdown.returnProvision || 0)
          stats.totalBom += analysis.bomCost
          stats.netRevenue += analysis.netRevenue
          stats.netProfit += analysis.netProfit
        }
      })

      stats.marginPercent =
        stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(2) : 0

      setFinStats(stats)

      // Fetch Real Settlement Data from Commercial Backend
      const fetchSettlements = async () => {
        try {
          const response = await fetch('/server/finance/settlements')
          if (response.ok) {
            const data = await response.json()
            setSettlements(data)
          } else {
            // Fallback logic for demo/dev
            const mockSettlements = orders.map((order) => ({
              orderId: order.id,
              amount: order.status === 'Delivered' ? order.amount * 0.82 : 0,
              status: order.status === 'Delivered' ? 'Matched' : 'Pending',
              type: 'Marketplace Remittance',
              timestamp: new Date().toISOString(),
            }))
            setSettlements(mockSettlements)
          }
        } catch (error) {
          console.error('Financial Recon Sync Error:', error)
        }
      }
      fetchSettlements()
    }

    calculateTotals()
  }, [orders, skuMaster])

  return (
    <FinancialContext.Provider value={{ finStats, settlements, setSettlements }}>
      {children}
    </FinancialContext.Provider>
  )
}

export const useFinance = () => useContext(FinancialContext)
