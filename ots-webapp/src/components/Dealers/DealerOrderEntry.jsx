import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import dealerService from '../../services/dealerService';

/**
 * DealerOrderEntry Component
 * A specialized form for placing B2B wholesale orders.
 * Handles quantity-based tiered pricing and credit limit validation.
 */
const DealerOrderEntry = ({ dealer, onBack, onComplete }) => {
    const { skuMaster, addOrder } = useData();
    const [selectedSku, setSelectedSku] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pricing, setPricing] = useState({ basePrice: 0, finalPrice: 0, total: 0 });
    const [creditStatus, setCreditStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    // Filter available child SKUs (not parents)
    const availableSkus = skuMaster.filter(s => !s.isParent);

    // Recalculate pricing and check credit when SKU or quantity changes
    useEffect(() => {
        const sku = availableSkus.find(s => s.sku === selectedSku);
        if (sku && quantity > 0) {
            const basePrice = sku.bauSP || sku.price || 1000; // Use bauSP if available

            // Hybrid Pricing Preview
            const qtyFinalPrice = wholesaleService.calculateTieredPrice(basePrice, quantity);
            const tierFinalPrice = dealerService.calculateWholesalePrice(basePrice, dealer.tier);
            const finalPrice = Math.min(qtyFinalPrice, tierFinalPrice);

            const total = finalPrice * quantity;

            setPricing({ basePrice, finalPrice, total });

            // Check credit
            const validation = dealerService.checkCreditLimit(total, dealer.usedCredit, dealer.tier);
            setCreditStatus({ success: validation.allowed, message: validation.reason });
        } else {
            setPricing({ basePrice: 0, finalPrice: 0, total: 0 });
            setCreditStatus(null);
        }
    }, [selectedSku, quantity, dealer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSku || quantity <= 0 || (creditStatus && !creditStatus.success)) return;

        setIsSubmitting(true);
        const orderData = {
            customerName: dealer.name,
            phone: dealer.phone || '9999999999', // Dealer phone
            email: dealer.email,
            address: dealer.address || 'Dealer Address',
            city: dealer.city,
            state: dealer.state,
            pincode: dealer.pincode || '400001',
            sku: selectedSku,
            quantity: parseInt(quantity),
            amount: pricing.total,
            dealerId: dealer.id,
            dealerTier: dealer.tier,
            source: 'B2B_PORTAL',
            metadata: {
                dealerId: dealer.id,
                dealerCode: dealer.code,
                unitPrice: pricing.finalPrice,
                wholesaleDiscount: pricing.basePrice - pricing.finalPrice
            }
        };

        const result = addOrder(orderData);

        if (result.success) {
            setMessage({ type: 'success', text: `Order ${result.order.id} placed successfully!` });
            setTimeout(() => onComplete(), 2000);
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to place order' });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="dealer-order-entry animate-fade">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">New Wholesale Order</h2>
                    <p className="text-slate-400">{dealer.name} • {dealer.code}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase">Available Credit</span>
                    <p className={`text-xl font-bold ${creditStatus?.success === false ? 'text-red-400' : 'text-green-400'}`}>
                        ₹{dealer.creditLimit?.toLocaleString()}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass p-6 space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-300">Select Product</span>
                            <select
                                value={selectedSku}
                                onChange={(e) => setSelectedSku(e.target.value)}
                                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            >
                                <option value="">Choose a product...</option>
                                {availableSkus.map(s => (
                                    <option key={s.sku} value={s.sku}>{s.name} ({s.sku})</option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-300">Quantity</span>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </label>
                    </div>

                    {creditStatus && !creditStatus.success && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg flex gap-3 text-red-300">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{creditStatus.message}</p>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-lg flex gap-3 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !selectedSku || (creditStatus && !creditStatus.success)}
                        className={`w-full p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting || !selectedSku || (creditStatus && !creditStatus.success)
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {isSubmitting ? 'Processing...' : 'Place Wholesale Order'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Pricing Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Base Unit Price</span>
                                <span>₹{pricing.basePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Tiered Unit Price</span>
                                <span className={pricing.finalPrice < pricing.basePrice ? 'text-green-400' : ''}>
                                    ₹{pricing.finalPrice.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-slate-700 pt-3 mt-3">
                                <span className="text-slate-300">Quantity</span>
                                <span>{quantity}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white pt-2">
                                <span>Total Amount</span>
                                <span>₹{pricing.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Discount Tiers</h3>
                        <div className="space-y-2 text-xs">
                            <div className={`flex justify-between p-2 rounded ${quantity >= 100 ? 'bg-purple-500/20 text-purple-200' : 'text-slate-500'}`}>
                                <span>100+ Units</span>
                                <span>20% OFF</span>
                            </div>
                            <div className={`flex justify-between p-2 rounded ${quantity >= 50 && quantity < 100 ? 'bg-purple-500/20 text-purple-200' : 'text-slate-500'}`}>
                                <span>50 - 99 Units</span>
                                <span>15% OFF</span>
                            </div>
                            <div className={`flex justify-between p-2 rounded ${quantity >= 10 && quantity < 50 ? 'bg-purple-500/20 text-purple-200' : 'text-slate-500'}`}>
                                <span>10 - 49 Units</span>
                                <span>10% OFF</span>
                            </div>
                            <div className={`flex justify-between p-2 rounded ${quantity < 10 ? 'bg-slate-700/50 text-slate-300' : 'text-slate-500'}`}>
                                <span>Default</span>
                                <span>Base Price</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DealerOrderEntry;
