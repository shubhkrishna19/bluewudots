import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataContext'
import { registerPushSubscription } from './services/pushNotificationService'
import { AuthProvider } from './context/AuthContext'
import { FinancialProvider } from './context/FinancialContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <FinancialProvider>
          <App />
        </FinancialProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
        // Register push subscription for web push notifications
        registerPushSubscription();
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}
