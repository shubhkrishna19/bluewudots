import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Shield, Plus, X, Globe, Lock, AlertTriangle } from 'lucide-react';

const SecurityFortress = () => {
    const { whitelistedIPs, addToWhitelist, securityAlerts, clearAlerts } = useSecurity();
    const [newIP, setNewIP] = useState('');
    const [error, setError] = useState(null);

    const handleAddIP = (e) => {
        e.preventDefault();
        setError(null);
        if (addToWhitelist(newIP)) {
            setNewIP('');
        } else {
            setError('Invalid IPv4 Address format');
        }
    };

    return (
        <div className="space-y-6 animate-fade">
            <div className="glass p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                        <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Security Fortress</h2>
                        <p className="text-slate-400">Manage Network Access & Threat Response</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* IP Whitelist Manager */}
                    <div className="space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            Trusted IP Whitelist
                            <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded">ENV: VITE_IP_WHITELIST_ENABLED</span>
                        </h3>

                        <form onSubmit={handleAddIP} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter IPv4 (e.g., 192.168.1.5)"
                                className="input-field flex-1"
                                value={newIP}
                                onChange={(e) => setNewIP(e.target.value)}
                            />
                            <button type="submit" className="btn-primary flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </form>
                        {error && <p className="text-red-400 text-xs">{error}</p>}

                        <div className="bg-slate-900/50 rounded-lg max-h-48 overflow-y-auto border border-white/5">
                            {whitelistedIPs.map(ip => (
                                <div key={ip} className="flex justify-between items-center p-3 border-b border-white/5 hover:bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="font-mono text-sm">{ip}</span>
                                    </div>
                                    <button className="text-slate-500 hover:text-red-400 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Threat Monitoring */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-slate-400" />
                                Active Threats
                            </h3>
                            {securityAlerts.length > 0 && (
                                <button onClick={clearAlerts} className="text-xs text-red-300 hover:text-red-200 underline">
                                    Clear History
                                </button>
                            )}
                        </div>

                        {securityAlerts.length === 0 ? (
                            <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                                <Shield className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No active threats detected.</p>
                                <p className="text-xs opacity-50">System Secure</p>
                            </div>
                        ) : (
                            <div className="space-y-2 h-48 overflow-y-auto pr-2">
                                {securityAlerts.map(alert => (
                                    <div key={alert.id} className="bg-red-500/10 border border-red-500/20 p-3 rounded text-sm">
                                        <div className="flex justify-between text-red-300 font-bold mb-1">
                                            <span>{alert.severity}</span>
                                            <span className="text-xs font-mono opacity-70">
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-300">{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application State */}
            <div className="glass p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Security Policies
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <p className="text-xs text-slate-400 uppercase mb-1">PII Redaction</p>
                        <p className="text-green-400 font-bold">ACTIVE</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <p className="text-xs text-slate-400 uppercase mb-1">Encryption</p>
                        <p className="text-green-400 font-bold">AES-256</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <p className="text-xs text-slate-400 uppercase mb-1">Session Timeout</p>
                        <p className="text-white font-bold">15 MIN</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <p className="text-xs text-slate-400 uppercase mb-1">Audit Mode</p>
                        <p className="text-purple-400 font-bold">STRICT</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityFortress;
