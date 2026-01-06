import React, { useState } from 'react';
import { useData } from '@/context/DataContext';

const KPIGoalSetter = ({ onClose }) => {
    const { kpiGoals, updateKpiGoals } = useData();
    const [goals, setGoals] = useState({ ...kpiGoals });

    const handleSave = () => {
        updateKpiGoals(goals);
        onClose();
    };

    return (
        <div className="goal-setter-card glass animate-fade">
            <div className="card-header">
                <h3>Set Performance Targets</h3>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="goal-grid">
                <div className="field-group">
                    <label>Monthly Revenue Goal (₹)</label>
                    <input
                        type="number"
                        value={goals.monthlyRevenue}
                        onChange={(e) => setGoals({ ...goals, monthlyRevenue: parseInt(e.target.value) })}
                        className="glass-input"
                    />
                </div>

                <div className="field-group">
                    <label>Daily Order Target</label>
                    <input
                        type="number"
                        value={goals.dailyOrders}
                        onChange={(e) => setGoals({ ...goals, dailyOrders: parseInt(e.target.value) })}
                        className="glass-input"
                    />
                </div>

                <div className="field-group">
                    <label>Delivery Rate Target (%)</label>
                    <input
                        type="number"
                        value={goals.deliveryRate}
                        onChange={(e) => setGoals({ ...goals, deliveryRate: parseInt(e.target.value) })}
                        className="glass-input"
                    />
                </div>

                <div className="field-group">
                    <label>Avg. Ticket Value Target (₹)</label>
                    <input
                        type="number"
                        value={goals.avgTicket}
                        onChange={(e) => setGoals({ ...goals, avgTicket: parseInt(e.target.value) })}
                        className="glass-input"
                    />
                </div>
            </div>

            <div className="card-footer">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Targets</button>
            </div>

            <style jsx>{`
                .goal-setter-card {
                    padding: 20px;
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    width: 100%;
                    max-width: 500px;
                }
                .goal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin: 20px 0;
                }
                .field-group label {
                    display: block;
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .glass-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                    outline: none;
                }
                .glass-input:focus {
                    border-color: #6366f1;
                }
                .card-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default KPIGoalSetter;
