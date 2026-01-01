/**
 * Predictive Analytics Service
 * Calculates trends and projections from historical data.
 */

/**
 * Calculate order volume trend using linear regression
 * @param {Array} orders - List of orders
 * @param {number} days - Number of days to analyze
 * @returns {Object} { slope, intercept, r2, trendLine }
 */
export const getOrderTrend = (orders, days = 30) => {
    if (!orders || orders.length === 0) return { slope: 0, intercept: 0, trendLine: [] };

    // Group orders by date for the last X days
    const dailyCounts = {};
    const now = new Date();
    for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        dailyCounts[d.toISOString().split('T')[0]] = 0;
    }

    orders.forEach(order => {
        const date = order.createdAt ? order.createdAt.split('T')[0] : null;
        if (date && dailyCounts[date] !== undefined) {
            dailyCounts[date]++;
        }
    });

    const dates = Object.keys(dailyCounts).sort();
    const x = Array.from({ length: dates.length }, (_, i) => i);
    const y = dates.map(d => dailyCounts[d]);

    // Simple Linear Regression: y = mx + b
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
    }

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const trendLine = x.map(xi => ({
        index: xi,
        date: dates[xi],
        value: Math.max(0, Math.round((m * xi + b) * 10) / 10)
    }));

    return { slope: m, intercept: b, trendLine };
};

/**
 * Project revenue based on current orders and trend
 * @param {Array} orders - List of orders
 * @param {number} nextDays - Number of days to project
 * @returns {number} Projected revenue
 */
export const projectRevenue = (orders, nextDays = 30) => {
    if (!orders || orders.length === 0) return 0;

    // Average order value
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
    const aov = totalRevenue / orders.length;

    // Current daily orders avg
    const dailyOrdersAvg = orders.length / 30; // assuming 30 days history

    return Math.round(aov * dailyOrdersAvg * nextDays);
};

/**
 * Calculate profitability for a specific SKU
 * @param {Object} skuData - SKU object with pricing info
 * @param {number} sellPrice - Current selling price (GST Inc)
 * @returns {Object} Profitability metrics
 */
export const calculateSKUProfitability = (skuData, sellPrice) => {
    if (!skuData) return null;

    const netSP = (sellPrice || skuData.bauSP) / 1.18; // Remove 18% GST
    const commission = netSP * (skuData.commissionPercent / 100);
    const landingCost = skuData.landingCost || skuData.bomCost || 0;
    const packingCost = skuData.packingCost || 0;

    // Estimated shipping (Avg)
    const estShipping = 500;

    const netRealization = netSP - commission - estShipping - packingCost;
    const profit = netRealization - landingCost;
    const marginPercent = (profit / netSP) * 100;

    return {
        netSP: Math.round(netSP),
        commission: Math.round(commission),
        landingCost: Math.round(landingCost),
        packingCost: Math.round(packingCost),
        estShipping,
        netRealization: Math.round(netRealization),
        profit: Math.round(profit),
        marginPercent: Math.round(marginPercent * 10) / 10
    };
};

export default {
    getOrderTrend,
    projectRevenue,
    calculateSKUProfitability
};
