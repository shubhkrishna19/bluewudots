import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataContext'
import { subscribeUser } from './services/pushNotificationService'
import { AuthProvider } from './context/AuthContext'
import { FinancialProvider } from './context/FinancialContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <FinancialProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </FinancialProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

