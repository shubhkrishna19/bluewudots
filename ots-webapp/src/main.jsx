import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataContext'
import { subscribeUser } from './services/pushNotificationService'
import { AuthProvider } from './context/AuthContext'
import { FinancialProvider } from './context/FinancialContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import { SecurityProvider } from './context/SecurityContext'
import { LocalizationProvider } from './context/LocalizationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <LocalizationProvider>
          <DataProvider>
            <FinancialProvider>
              <NotificationProvider>
                <SecurityProvider>
                  <App />
                </SecurityProvider>
              </NotificationProvider>
            </FinancialProvider>
          </DataProvider>
        </LocalizationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
