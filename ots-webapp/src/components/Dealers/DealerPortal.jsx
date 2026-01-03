import React, { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import dealerService, { DEALER_TIERS } from '../../services/dealerService'
import wholesaleService from '../../services/wholesaleService'
import DealerOrderEntry from './DealerOrderEntry'
import { LayoutDashboard, ShoppingBag, CreditCard, History } from 'lucide-react'

const DealerPortal = () => {
  const { user } = useAuth()
  const { orders, skuMaster, dealerCredits } = useData()
  const [view, setView] = useState('dashboard') // 'dashboard' | 'order'

  // Filter orders for this dealer
  const dealerOrders = useMemo(() => {
    return orders.filter((o) => o.dealerId === user.id)
  }, [orders, user.id])

  const stats = useMemo(() => {
    const total = dealerOrders
      .filter((o) => {
        const orderDate = new Date(o.createdAt)
        const now = new Date()
        return (
          orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, o) => sum + o.amount, 0)

    const tier = dealerService.determineTier(total)
    const usedCredit = dealerCredits[user.id] || 0

    return { total, tier, usedCredit }
  }, [dealerOrders, dealerCredits, user.id])

  const currentTierConfig = DEALER_TIERS[stats.tier] || DEALER_TIERS.SILVER
  const creditLimit = currentTierConfig.creditLimit

  if (view === 'order') {
    return (
      <DealerOrderEntry
        dealer={{
          ...user,
          tier: stats.tier,
          usedCredit: stats.usedCredit,
          creditLimit: creditLimit,
        }}
        onBack={() => setView('dashboard')}
        onComplete={() => setView('dashboard')}
      />
    )
  }

  return (
    <div className="dealer-portal animate-fade">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">B2B Partner Portal</h2>
          <p className="text-slate-400">
            Welcome back, {user.name} |{' '}
            <span className="text-purple-400 font-semibold">{stats.tier} Partner</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass p-4 text-right min-w-[150px]">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              Volume (MTD)
            </span>
            <span className="text-xl font-bold text-white">₹{stats.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="glass p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setView('order')}
        >
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <ShoppingBag />
          </div>
          <div>
            <h4 className="font-bold">Place Order</h4>
            <p className="text-xs text-slate-500">New wholesale entry</p>
          </div>
        </div>
        <div className="glass p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <CreditCard />
          </div>
          <div>
            <h4 className="font-bold">Available Credit</h4>
            <p className="text-xs text-slate-500">
              ₹{(creditLimit - stats.usedCredit).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="glass p-6 flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
            <LayoutDashboard />
          </div>
          <div>
            <h4 className="font-bold">Partner Tier</h4>
            <p className="text-xs text-slate-500">{stats.tier} Level</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center gap-2">
                <History className="w-5 h-5" /> Recent Orders
              </h3>
              <button className="text-xs text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-4">
              {dealerOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No orders placed yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 text-xs uppercase border-b border-white/5">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Qty</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {dealerOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 font-mono font-bold">{o.id}</td>
                          <td className="py-4">{o.sku}</td>
                          <td className="py-4">{o.quantity || 1}</td>
                          <td className="py-4 font-bold">₹{o.amount.toLocaleString()}</td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-[10px] uppercase font-bold">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6">
            <h3 className="mb-4">Partner Tier Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Current Level</span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full font-bold text-xs">
                  {stats.tier}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all"
                  style={{
                    width:
                      stats.tier === 'PLATINUM' ? '100%' : stats.tier === 'GOLD' ? '66%' : '33%',
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {stats.tier === 'SILVER'
                  ? `Spend ₹${(DEALER_TIERS.GOLD.minMonthlyVolume / 100000).toFixed(0)}L to reach GOLD`
                  : stats.tier === 'GOLD'
                    ? `Spend ₹${(DEALER_TIERS.PLATINUM.minMonthlyVolume / 100000).toFixed(0)}L to reach PLATINUM`
                    : 'You are at the top tier!'}
              </p>
            </div>
          </div>

          <div className="glass p-6 bg-gradient-to-br from-purple-600/10 to-transparent">
            <h3 className="font-bold mb-2 text-white">Need Support?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Dedicated account manager is available for bulk order customizations and special
              logistics requests.
            </p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm transition-colors border border-white/5">
              Contact Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealerPortal
