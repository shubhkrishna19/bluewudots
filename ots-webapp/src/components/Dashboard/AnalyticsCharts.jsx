import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { analyticsService } from '../../src/services/analyticsService';

/**
 * AnalyticsCharts Component
 * Displays analytics data with charts and KPI metrics
 */
const AnalyticsCharts = ({ dateRange = 7 }) => {
  const [metrics, setMetrics] = useState(null);
  const [trend, setTrend] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const kpis = analyticsService.calculateKPIs?.();
        const trendData = analyticsService.analyzeTrend?.();
        const forecastData = analyticsService.forecast?.('orders', dateRange);
        
        setMetrics(kpis);
        setTrend(trendData);
        setForecast(forecastData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [dateRange]);

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-800/20 rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics && [
          { label: 'Total Orders', value: metrics.totalOrders, icon: '📦' },
          { label: 'Avg Rating', value: metrics.averageRating?.toFixed(2), icon: '⭐' },
          { label: 'Success Rate', value: `${metrics.successRate?.toFixed(1)}%`, icon: '✅' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-4">
            <p className="text-slate-400 text-sm">{kpi.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      {trend && (
        <div className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Order Trend
          </h3>
          <div className="h-32 bg-slate-900/50 rounded flex items-end justify-around gap-1 p-4">
            {trend.dataPoints?.slice(0, 7).map((point, idx) => (
              <div
                key={idx}
                style={{ height: `${(point / Math.max(...(trend.dataPoints || []))) * 100}%` }}
                className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded opacity-80"
              />
            ))}
          </div>
        </div>
      )}

      {/* Forecast */}
      {forecast && (
        <div className="bg-slate-800/40 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4" /> {dateRange}-Day Forecast
          </h3>
          <p className="text-2xl font-bold text-blue-400">{forecast.predicted?.toFixed(0)}</p>
          <p className="text-xs text-slate-400 mt-1">Confidence: {forecast.confidence?.toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCharts;
