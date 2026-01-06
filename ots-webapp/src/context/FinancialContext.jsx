import React, { createContext, useContext, useState, useEffect } from 'react'
import { useData } from '@/context/DataContext'
import { calculateProfitability, getEnhancedSKU } from '../utils/commercialUtils'
import marketplaceService from '../services/marketplaceService'

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
        totalGateway: 0,
        totalReturnProvision: 0
      }

      orders.forEach((order) => {
        const skuData = getEnhancedSKU(order.sku, skuMaster)
        if (skuData) {
          const analysis = calculateProfitability({
            sellingPrice: order.amount,
            bomCost: skuData.bomCost * (order.quantity || 1),
            commissionPercent: skuData.commissionPercent,
            tmsLevel: skuData.tmsLevel,
            shippingCost: order.shippingCost
          })

          stats.totalRevenue += order.amount
          stats.totalGst += analysis.breakdown.tax
          stats.totalCommissions += analysis.breakdown.commission
          stats.totalOverhead += analysis.breakdown.overhead
          stats.totalShipping += analysis.breakdown.shipping
          stats.totalGateway += analysis.breakdown.gateway || 0
          stats.totalReturnProvision += analysis.breakdown.returnProvision || 0
          stats.totalBom += analysis.bomCost
          stats.netRevenue += analysis.netRevenue
          stats.netProfit += analysis.netProfit
        }
      })

      stats.marginPercent =
        stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(2) : 0

      setFinStats(stats)

      // Fetch Real Settlement Data
      const fetchSettlements = async () => {
        try {
          // Attempt to get data from Marketplace Service instead of raw fetch for consistency
          const platforms = ['amazon', 'flipkart']
          let allSettlements = []

          for (const p of platforms) {
            const report = await marketplaceService.fetchSettlementReport(p)
            allSettlements = [
              ...allSettlements,
              ...report.map(s => ({
                ...s,
                type: 'Marketplace Remittance',
                timestamp: new Date().toISOString()
              }))
            ]
          }

          // Merge with order-based pending settlements
          const pendingSettlements = orders
            .filter(o => !allSettlements.find(s => s.orderId === o.id))
            .map(o => ({
              orderId: o.id,
              amount: o.status === 'Delivered' ? o.amount * 0.82 : 0,
              status: o.status === 'Delivered' ? 'Matched' : 'Pending',
              type: 'Marketplace Remittance',
              timestamp: new Date().toISOString()
            }))

          setSettlements([...allSettlements, ...pendingSettlements])
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
