// Analytics Service
// Demand forecasting, trend analysis, KPI tracking, and predictive analytics
// for order patterns, revenue, and logistics performance.

import { cacheData, retrieveCachedData } from './offlineCacheService';

const ANALYTICS_CACHE_NS = 'analytics';
const FORECAST_WINDOW = 90; // days of historical data for forecasting

/**
 * Calculate order volume trend with linear regression
 * @param {Array} orders - List of orders
 * @param {number} days - Days to analyze (default 30)
 * @returns {Object} - {slope, intercept, r2, trend}
 */
export const getOrderTrend = (orders = [], days = 30) => {
  if (!orders || orders.length === 0) {
    return { slope: 0, intercept: 0, r2: 0, trend: 'stable' };
  }

  const dailyCounts = {};
  const now = new Date();

  // Group orders by date
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyCounts[d.toISOString().split('T')[0]] = 0;
  }

  orders.forEach(order => {
    const date = new Date(order.createdAt).toISOString().split('T')[0];
    if (dailyCounts[date] !== undefined) dailyCounts[date]++;
  });

  // Linear regression
  const data = Object.values(dailyCounts);
  const n = data.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const predictions = data.map((_, x) => slope * x + intercept);
  const meanY = sumY / n;
  const ssRes = data.reduce((sum, y, x) => sum + Math.pow(y - predictions[x], 2), 0);
  const ssTot = data.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  const trend = slope > 2 ? 'upward' : slope < -2 ? 'downward' : 'stable';

  return { slope: parseFloat(slope.toFixed(2)), intercept, r2: parseFloat(r2.toFixed(3)), trend };
};

/**
 * Forecast future order volume
 * @param {Array} orders - Historical orders
 * @param {number} daysAhead - Days to forecast
 * @returns {Array} - Forecasted daily volumes
 */
export const forecastOrderVolume = (orders = [], daysAhead = 7) => {
  const trend = getOrderTrend(orders, FORECAST_WINDOW);
  const { slope, intercept } = trend;
  const baselineDay = FORECAST_WINDOW;

  const forecast = [];
  for (let i = 1; i <= daysAhead; i++) {
    const predicted = Math.max(0, Math.round(slope * (baselineDay + i) + intercept));
    forecast.push({
      day: i,
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      predictedVolume: predicted
    });
  }

  return forecast;
};

/**
 * Get key performance indicators
 */
export const getKPIs = (orders = [], startDate, endDate) => {
  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      avgDeliveryTime: 0,
      deliverySuccessRate: 0,
      rtoRate: 0,
      topCarrier: null
    };
  }

  // Filter by date range
  const filtered = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Delivery metrics
  const delivered = filtered.filter(o => o.status === 'DELIVERED').length;
  const rto = filtered.filter(o => o.status === 'RTO_INITIATED').length;
  const deliverySuccessRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(2) : 0;
  const rtoRate = totalOrders > 0 ? ((rto / totalOrders) * 100).toFixed(2) : 0;

  // Average delivery time
  const deliveredOrders = filtered.filter(o => o.status === 'DELIVERED' && o.deliveredAt);
  let avgDeliveryTime = 0;
  if (deliveredOrders.length > 0) {
    const totalTime = deliveredOrders.reduce((sum, o) => {
      const created = new Date(o.createdAt);
      const delivered = new Date(o.deliveredAt);
      return sum + (delivered - created);
    }, 0);
    avgDeliveryTime = Math.round(totalTime / (deliveredOrders.length * 86400000));
  }

  // Top carrier
  const carrierCounts = {};
  filtered.forEach(o => {
    if (o.carrier) {
      carrierCounts[o.carrier] = (carrierCounts[o.carrier] || 0) + 1;
    }
  });
  const topCarrier = Object.entries(carrierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    avgDeliveryTime,
    deliverySuccessRate: parseFloat(deliverySuccessRate),
    rtoRate: parseFloat(rtoRate),
    topCarrier
  };
};

/**
 * Get revenue by carrier
 */
export const getRevenueByCarrier = (orders = []) => {
  const carrierRevenue = {};

  orders.forEach(o => {
    if (o.carrier && o.amount) {
      carrierRevenue[o.carrier] = (carrierRevenue[o.carrier] || 0) + o.amount;
    }
  });

  return Object.entries(carrierRevenue)
    .map(([carrier, revenue]) => ({ carrier, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
};

/**
 * Get order status distribution
 */
export const getStatusDistribution = (orders = []) => {
  const distribution = {};

  orders.forEach(o => {
    const status = o.status || 'UNKNOWN';
    distribution[status] = (distribution[status] || 0) + 1;
  });

  const total = orders.length;
  return Object.entries(distribution)
    .map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(2) : 0
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get zone-wise performance
 */
export const getZonePerformance = (orders = []) => {
  const zoneMetrics = {};

  orders.forEach(o => {
    const zone = o.zone || 'unknown';
    if (!zoneMetrics[zone]) {
      zoneMetrics[zone] = { count: 0, delivered: 0, rto: 0, avgCost: 0, totalCost: 0 };
    }
    zoneMetrics[zone].count++;
    if (o.status === 'DELIVERED') zoneMetrics[zone].delivered++;
    if (o.status === 'RTO_INITIATED') zoneMetrics[zone].rto++;
    zoneMetrics[zone].totalCost += o.shippingCost || 0;
  });

  return Object.entries(zoneMetrics).map(([zone, metrics]) => ({
    zone,
    orders: metrics.count,
    successRate: ((metrics.delivered / metrics.count) * 100).toFixed(2),
    rtoRate: ((metrics.rto / metrics.count) * 100).toFixed(2),
    avgShippingCost: Math.round(metrics.totalCost / metrics.count)
  }));
};

/**
 * Cache analytics results
 */
export const cacheAnalytics = async (key, data, ttl = 3600000) => {
  await cacheData(`${ANALYTICS_CACHE_NS}:${key}`, data, ttl);
};

/**
 * Retrieve cached analytics
 */
export const getCachedAnalytics = async (key) => {
  return await retrieveCachedData(`${ANALYTICS_CACHE_NS}:${key}`);
};



/**
 * Project future revenue based on current trends
 */
export const projectRevenue = (orders = [], days = 30) => {
  const trend = getOrderTrend(orders, 90);
  const avgRevenuePerOrder = orders.length > 0
    ? orders.reduce((sum, o) => sum + (o.amount || 0), 0) / orders.length
    : 0;

  const currentVolume = orders.length / 90; // daily avg
  const projectedVolume = currentVolume + (trend.slope * days / 90);

  return Math.round(projectedVolume * days * avgRevenuePerOrder);
};

/**
 * Calculate profitability per SKU
 */
export const calculateSKUProfitability = (orders = [], skuMaster = []) => {
  const profitability = {};

  orders.forEach(o => {
    if (!o.sku) return;
    if (!profitability[o.sku]) {
      const skuData = (skuMaster || []).find(s => s.sku === o.sku) || {};
      profitability[o.sku] = {
        sku: o.sku,
        revenue: 0,
        cost: skuData.costPrice || 0,
        orders: 0
      };
    }
    profitability[o.sku].revenue += (o.amount || 0);
    profitability[o.sku].orders++;
  });

  return Object.values(profitability).map(p => ({
    ...p,
    profit: p.revenue - (p.cost * p.orders),
    margin: p.revenue > 0 ? ((p.revenue - (p.cost * p.orders)) / p.revenue * 100).toFixed(2) : 0
  })).sort((a, b) => b.profit - a.profit);
};

export default {
  getOrderTrend,
  forecastOrderVolume,
  getKPIs,
  getRevenueByCarrier,
  getStatusDistribution,
  getZonePerformance,
  cacheAnalytics,
  getCachedAnalytics,
  projectRevenue,
  calculateSKUProfitability
};
