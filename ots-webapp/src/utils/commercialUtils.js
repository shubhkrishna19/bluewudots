/**
 * MTP Master Utility (Commercial Engine)
 * Re-engineered from Bluewud_Commercial_Model.ds
 */

export const TAX_RATES = {
    GST_FURNITURE: 18,
    IGST: 18,
    CGST: 9,
    SGST: 9
};

/**
 * Calculates SKU Profitability Node
 */
export const calculateProfitability = (mtpData, shippingCost) => {
    const { bauSp, bomCost, commissionArf } = mtpData;

    const commissionAmt = (bauSp * commissionArf) / 100;
    const gstAmt = (bauSp * 18) / 118; // Reverse GST calculation for Indian Market
    const netRevenue = bauSp - gstAmt - commissionAmt - shippingCost;

    const margin = netRevenue - bomCost;
    const marginPercent = (margin / bauSp) * 100;

    return {
        netRevenue: netRevenue.toFixed(2),
        margin: margin.toFixed(2),
        marginPercent: marginPercent.toFixed(2),
        status: marginPercent > 20 ? 'HEALTHY' : marginPercent > 5 ? 'STABLE' : 'CRITICAL'
    };
};

/**
 * Formats INR Currency correctly for Indian Nodes
 */
export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};
