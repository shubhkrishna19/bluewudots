/**
 * ML Forecast Service
 * Advanced demand forecasting using additive trend-seasonal decomposition.
 */

class MLForecastService {
    /**
     * Predict demand for a specific SKU.
     * @param {Array} orders - Historical orders
     * @param {string} sku - SKU ID
     * @param {number} forecastDays - Days to predict
     * @returns {Object} Forecast results with decomposition
     */
    predictDemand(orders, sku, forecastDays = 30) {
        const skuOrders = orders
            .filter(o => o.sku === sku)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        if (skuOrders.length < 5) {
            return { error: 'Insufficient data for ML forecasting' };
        }

        const dailyData = this._groupByDay(skuOrders);
        const values = dailyData.map(d => d.quantity);

        // 1. Trend Calculation (Moving Average + Linear Fit)
        const trend = this._calculateTrend(values);

        // 2. Seasonality (Additive Decomposition)
        const seasonality = this._calculateWeeklySeasonality(values, trend);

        // 3. Generate Forecast with Confidence Bands
        const forecast = [];
        const lastDate = dailyData[dailyData.length - 1].date;
        const stdDev = this._calculateStdDev(values);

        for (let i = 1; i <= forecastDays; i++) {
            const dayIdx = (new Date(lastDate).getDay() + i) % 7;
            const trendValue = trend.slope * (values.length + i) + trend.intercept;
            const seasonalComponent = seasonality[dayIdx];

            const predictedValue = Math.max(0, trendValue + seasonalComponent);

            // Confidence intervals (z=1.28 for 80%, z=1.96 for 95%)
            forecast.push({
                date: new Date(new Date(lastDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                quantity: Math.round(predictedValue),
                low80: Math.max(0, Math.round(predictedValue - 1.28 * stdDev)),
                high80: Math.round(predictedValue + 1.28 * stdDev),
                low95: Math.max(0, Math.round(predictedValue - 1.96 * stdDev)),
                high95: Math.round(predictedValue + 1.96 * stdDev),
                trend: Number(trendValue.toFixed(2)),
                seasonal: Number(seasonalComponent.toFixed(2))
            });
        }

        return {
            forecast,
            history: dailyData.slice(-30),
            decomposition: {
                trend,
                seasonality
            },
            metrics: {
                growthRate: (trend.slope * 30).toFixed(2),
                volatility: stdDev.toFixed(2),
                avgDemand: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
            }
        };
    }

    /**
     * Predict when an item will go out of stock.
     */
    predictStockOutDate(orders, sku, currentStock) {
        if (currentStock <= 0) return { date: 'OUT_OF_STOCK', days: 0 };

        const analysis = this.predictDemand(orders, sku, 90);
        if (analysis.error) return { error: analysis.error };

        let remainingStock = currentStock;
        for (let i = 0; i < analysis.forecast.length; i++) {
            remainingStock -= analysis.forecast[i].quantity;
            if (remainingStock <= 0) {
                return {
                    date: analysis.forecast[i].date,
                    days: i + 1,
                    urgency: i < 7 ? 'CRITICAL' : i < 14 ? 'HIGH' : 'LOW'
                };
            }
        }

        return { date: '90D+', days: 90, urgency: 'SAFE' };
    }

    _groupByDay(orders) {
        const groups = {};
        orders.forEach(o => {
            const date = o.createdAt.split('T')[0];
            groups[date] = (groups[date] || 0) + (o.quantity || 1);
        });

        const dates = Object.keys(groups).sort();
        const first = new Date(dates[0]);
        const last = new Date(dates[dates.length - 1]);
        const result = [];

        for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                quantity: groups[dateStr] || 0
            });
        }
        return result;
    }

    _calculateTrend(values) {
        const n = values.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumXX += i * i;
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
        const intercept = (sumY - slope * sumX) / n || 0;
        return { slope, intercept };
    }

    _calculateWeeklySeasonality(values, trend) {
        const residuals = values.map((v, i) => v - (trend.slope * i + trend.intercept));
        const seasonal = Array(7).fill(0).map(() => []);

        residuals.forEach((r, i) => {
            seasonal[i % 7].push(r);
        });

        return seasonal.map(dayValues => {
            if (dayValues.length === 0) return 0;
            return dayValues.reduce((a, b) => a + b, 0) / dayValues.length;
        });
    }

    _calculateStdDev(values) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(v => Math.pow(v - avg, 2));
        return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length) || 0;
    }

    calculateRRQ(forecastData, leadTimeDays = 7, safetyStockFactor = 1.96) {
        if (!forecastData || forecastData.error) return 0;

        const leadTimeDemand = forecastData.forecast
            .slice(0, leadTimeDays)
            .reduce((sum, day) => sum + day.quantity, 0);

        const volatility = parseFloat(forecastData.metrics.volatility) || 0;
        const safetyStock = Math.sqrt(leadTimeDays) * volatility * safetyStockFactor;

        return Math.round(leadTimeDemand + safetyStock);
    }

    /**
     * Calculate Reorder Point (ROP)
     * Alias for calculateRRQ (Recommended Reorder Quantity) logic relative to lead time.
     */
    calculateReorderPoint(forecastData, leadTimeDays = 7, safetyStockFactor = 1.96) {
        return this.calculateRRQ(forecastData, leadTimeDays, safetyStockFactor);
    }
}

export default new MLForecastService();
