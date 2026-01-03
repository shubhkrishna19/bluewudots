import React from 'react';
import { getShortcuts, formatShortcut } from '../../services/keyboardShortcuts';

const ShortcutsModal = ({ onClose }) => {
    const shortcuts = getShortcuts();

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
        }} onClick={onClose}>
            <div className="modal-content glass animate-reveal" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '32px',
                borderRadius: '16px',
                textAlign: 'left'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem' }}>⌨️ Keyboard Shortcuts</h2>
                        <p className="text-muted">Power user hotkeys for Bluewud OTS</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div className="shortcuts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shortcuts.map((s, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ fontSize: '0.9rem' }}>{s.description}</span>
                            <kbd style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
                                minWidth: '60px',
                                textAlign: 'center'
                            }}>
                                {formatShortcut(s.shortcut)}
                            </kbd>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        Press <kbd style={{ background: 'var(--bg-accent)', padding: '2px 6px', borderRadius: '4px' }}>Esc</kbd> to close any modal
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShortcutsModal;
