import { useEffect, useState } from 'react';
import { analyticsService } from '../../src/services/analyticsService';

/**
 * useAnalytics Hook
 * Provides analytics data and KPI calculations
 */
export const useAnalytics = (dateRange = 7) => {
  const [metrics, setMetrics] = useState(null);
  const [trend, setTrend] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const kpis = analyticsService.calculateKPIs?.();
        const trendData = analyticsService.analyzeTrend?.();
        const forecastData = analyticsService.forecast?.('orders', dateRange);
        
        setMetrics(kpis);
        setTrend(trendData);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [dateRange]);

  return { metrics, trend, forecast, loading, error };
};

export default useAnalytics;
