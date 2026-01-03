import React, { useState } from 'react'
import { useSecurity } from '../../context/SecurityContext'
import { Shield, Download, Filter, Search, AlertTriangle } from 'lucide-react'

const ActivityLog = () => {
  const { activityLog, securityAlerts } = useSecurity()
  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const filteredLogs = activityLog.filter((log) => {
    const matchesText =
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.resource.toLowerCase().includes(filter.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || log.role === roleFilter
    return matchesText && matchesRole
  })

  return (
    <div className="activity-log-container animate-fade">
      <div className="section-header">
        <div>
          <h2>Forensic Activity Ledger</h2>
          <p className="text-muted">Immutable record of system actions</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Security Alerts Banner */}
      {securityAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500 w-5 h-5" />
                <div>
                  <h4 className="text-red-400 font-bold text-sm">
                    SECURITY ALERT: {alert.severity}
                  </h4>
                  <p className="text-slate-300 text-sm">{alert.message}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="glass p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="search-bar glass glass-hover w-72 flex items-center px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search logs..."
            className="bg-transparent border-none text-white focus:outline-none w-full text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-xs text-slate-400 uppercase">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User Identity</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource Target</th>
              <th className="p-4">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-mono text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${log.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{log.user}</p>
                        <p className="text-xs text-slate-400">{log.role.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        log.action === 'LOGIN'
                          ? 'success'
                          : log.action === 'DELETE'
                            ? 'danger'
                            : log.action === 'EXPORT'
                              ? 'warning'
                              : 'info'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{log.resource}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{log.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                  No activity logs found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ActivityLog
