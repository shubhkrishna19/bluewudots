import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import ErrorBoundary from '../Components/ErrorBoundary';
import OrderNotificationCenter from '../Components/OrderNotificationCenter';
import CarrierSelector from '../Components/CarrierSelector';
import WhatsAppTemplateManager from '../Components/WhatsAppTemplateManager';
import KeyboardShortcutsHud from '../Components/KeyboardShortcutsHud';
import AnalyticsCharts from '../Components/AnalyticsCharts';

// Import Hooks
import useAnalytics from '../Hooks/useAnalytics';
import useErrorHandler from '../Hooks/useErrorHandler';
import useNotifications from '../Hooks/useNotifications';

// Import Layouts
import ContextProviders from '../Layouts/ContextProviders';
import MainLayout from '../Layouts/MainLayout';

/**
 * IntegrationExample Component
 * Demonstrates how to integrate all INTEGRATION_READY components,
 * hooks, and layouts into the Bluewud OTS application.
 *
 * This serves as a reference implementation showing:
 * 1. Error Boundary wrapping the entire app
 * 2. Context Providers for multi-provider support
 * 3. Main Layout with integrated components
 * 4. Component usage patterns
 * 5. Custom hook usage for state management
 */
const IntegrationExample = () => {
  const { metrics, trend, forecast, loading } = useAnalytics(7);
  const { error, handleError, clearError } = useErrorHandler();
  const { notifications, addNotification, markAsRead } = useNotifications();
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const handleCarrierChange = (carrier) => {
    setSelectedCarrier(carrier);
    addNotification({
      type: 'success',
      title: 'Carrier Selected',
      message: `${carrier.name} selected for this order`,
    });
  };

  const handleError_ = (err) => {
    handleError(err, { context: 'Order Processing' });
    addNotification({
      type: 'error',
      title: 'Error Occurred',
      message: err.message,
    });
  };

  return (
    <ErrorBoundary>
      <ContextProviders>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Dashboard Page */}
              <Route
                path="/dashboard"
                element={
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-3xl font-bold text-white mb-6">
                        Analytics Overview
                      </h2>
                      <AnalyticsCharts dateRange={7} />
                    </section>
                  </div>
                }
              />

              {/* Orders Page */}
              <Route
                path="/orders"
                element={
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-3xl font-bold text-white mb-6">
                        Order Management
                      </h2>

                      {/* Carrier Selection */}
                      <div className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Select Carrier
                        </h3>
                        <CarrierSelector
                          orderId="sample-order-123"
                          destination="Mumbai"
                          weight={2.5}
                          callback={handleCarrierChange}
                        />
                        {selectedCarrier && (
                          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded">
                            <p className="text-green-300 text-sm">
                              Selected: {selectedCarrier.name} -
                              {selectedCarrier.cost.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                }
              />

              {/* Messaging Page */}
              <Route
                path="/messages"
                element={
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-3xl font-bold text-white mb-6">
                        WhatsApp Templates
                      </h2>
                      <div className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-6">
                        <WhatsAppTemplateManager />
                      </div>
                    </section>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Router>
      </ContextProviders>
    </ErrorBoundary>
  );
};

export default IntegrationExample;

/*
 ==================== INTEGRATION CHECKLIST ====================

1. COMPONENT USAGE:
   ✓ ErrorBoundary - Wraps entire app for error catching
   ✓ OrderNotificationCenter - Shows notifications (in MainLayout header)
   ✓ CarrierSelector - Allows carrier selection with performance metrics
   ✓ WhatsAppTemplateManager - Manage templates for bulk messaging
   ✓ KeyboardShortcutsHud - Floating help with shortcuts (in MainLayout)
   ✓ AnalyticsCharts - Display KPIs and forecasts

2. CUSTOM HOOKS:
   ✓ useAnalytics - Fetch analytics data (7-day range shown)
   ✓ useErrorHandler - Error state management
   ✓ useNotifications - Notification management with caching

3. LAYOUTS:
   ✓ ContextProviders - Multi-provider wrapper
   ✓ MainLayout - Primary app layout with header/content/footer

4. INTEGRATION POINTS:
   ✓ Notifications triggered by user actions (carrier selection)
   ✓ Errors handled centrally with recovery suggestions
   ✓ Analytics data displayed on dashboard
   ✓ Keyboard shortcuts accessible via HUD

5. STYLING:
   ✓ Dark theme with Tailwind CSS
   ✓ Glassmorphism effects (backdrop-blur-xl)
   ✓ Purple/slate color scheme matching Bluewud theme
   ✓ Responsive layout with lucide-react icons

6. STATE MANAGEMENT:
   ✓ Local component state (selectedCarrier)
   ✓ Custom hook state (notifications, analytics, errors)
   ✓ Context providers for global state

 ================================================================
*/
