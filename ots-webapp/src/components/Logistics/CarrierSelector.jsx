import React, { useState, useEffect } from 'react';
import { Truck, Zap, DollarSign, TrendingUp } from 'lucide-react';
import { carrierOptimizer } from '../../src/services/carrierOptimizer';

/**
 * CarrierSelector Component
 * Allows users to select carriers with real-time performance metrics
 * Integrates with carrierOptimizer for intelligent selection
 */
const CarrierSelector = ({ orderId, destination, weight, callback }) => {
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const loadCarriers = async () => {
      try {
        const recommended = await carrierOptimizer.getRecommendedCarriers(
          { destination, weight },
          3 // top 3 carriers
        );
        setCarriers(recommended);
        if (recommended.length > 0) {
          setSelectedCarrier(recommended[0]);
        }
      } catch (error) {
        console.error('Error loading carriers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCarriers();
  }, [destination, weight]);

  const handleSelect = async (carrier) => {
    setSelectedCarrier(carrier);
    if (callback) {
      callback(carrier);
    }
    // Record selection for optimization
    await carrierOptimizer.recordCarrierSelection(carrier.id, { orderId, destination });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Select Carrier</h3>
      <div className="space-y-2">
        {carriers.map(carrier => (
          <div
            key={carrier.id}
            onClick={() => handleSelect(carrier)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCarrier?.id === carrier.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-600/50 hover:border-slate-500 bg-slate-800/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-white">{carrier.name}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${carrier.cost.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {carrier.score.toFixed(1)}/10
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-400 font-semibold">{carrier.eta} days</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarrierSelector;
