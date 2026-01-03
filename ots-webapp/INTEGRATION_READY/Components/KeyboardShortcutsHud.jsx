import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { keyboardShortcuts } from '../../src/services/keyboardShortcuts';

/**
 * KeyboardShortcutsHud Component
 * Displays available keyboard shortcuts in a floating HUD
 */
const KeyboardShortcutsHud = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    const getShortcuts = async () => {
      const registeredShortcuts = keyboardShortcuts.getRegisteredShortcuts?.();
      if (registeredShortcuts) {
        setShortcuts(registeredShortcuts);
      }
    };
    getShortcuts();

    // Listen for help shortcut (usually ?)
    const handleKeyPress = (e) => {
      if (e.key === '?' && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  return (
    <>
      {/* Keyboard Icon */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 p-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 rounded-lg transition-colors z-40"
        title="Press ? for help"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* Shortcuts HUD */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 max-w-md bg-slate-900/95 border border-purple-500/30 rounded-xl shadow-2xl p-6 backdrop-blur-xl z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.length === 0 ? (
              <p className="text-slate-400 text-sm">No shortcuts registered</p>
            ) : (
              shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <span className="text-slate-300">{shortcut.description}</span>
                  <code className="bg-slate-800/50 border border-slate-600/30 rounded px-2 py-1 text-purple-300 font-mono text-xs">
                    {shortcut.keys.join(' + ')}
                  </code>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHud;
