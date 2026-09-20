import React, { useState } from 'react';
import { useMurim } from '../context/MurimContext';
import { 
  RotateCcw, 
  Trash2, 
  Layers, 
  Paintbrush, 
  AlertTriangle, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const ResetModal: React.FC = () => {
  const {
    isResetModalOpen,
    closeResetModal,
    resetToFactoryDefaults,
    clearAllOwnership,
    resetLayerSettingsToDefault
  } = useMurim();

  const [confirmMode, setConfirmMode] = useState<'factory' | 'ownership' | 'layers' | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isResetModalOpen) return null;

  const handleFactoryReset = () => {
    resetToFactoryDefaults();
    setConfirmMode(null);
    setSuccessMsg('Complete factory reset applied! Browser storage cleared and defaults restored.');
    setTimeout(() => {
      setSuccessMsg(null);
      closeResetModal();
    }, 1400);
  };

  const handleClearOwnership = () => {
    clearAllOwnership();
    setConfirmMode(null);
    setSuccessMsg('All painted provincial claims cleared.');
    setTimeout(() => {
      setSuccessMsg(null);
      closeResetModal();
    }, 1200);
  };

  const handleResetLayers = () => {
    resetLayerSettingsToDefault();
    setConfirmMode(null);
    setSuccessMsg('Layer display settings reset to defaults.');
    setTimeout(() => {
      setSuccessMsg(null);
      closeResetModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-stone-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-200">Reset & Restore Defaults</h2>
              <p className="text-xs text-stone-400">Wipe browser save cache or restore original default settings</p>
            </div>
          </div>
          <button
            onClick={closeResetModal}
            className="text-stone-400 hover:text-stone-200 hover:bg-stone-800 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {successMsg ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-stone-950/60 rounded-xl border border-emerald-900/60 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 animate-bounce">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-emerald-200">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Card 1: Full Factory Reset */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-950 border border-rose-700/60 rounded-lg text-rose-400 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-rose-200 text-sm">Full Factory Reset</h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-900/80 text-rose-300 border border-rose-700/60">
                          Complete Wipe
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        Completely purges the browser&apos;s localStorage save instance. Restores default Central Plains subdivisions (Henan, Shaanxi, Sichuan, Hubei), default Sacred Peaks & Passes, default parchment theme, and clears all sects and alliances.
                      </p>
                    </div>
                  </div>
                </div>

                {confirmMode === 'factory' ? (
                  <div className="p-3 bg-rose-950/90 rounded-lg border border-rose-600/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Are you sure? This will delete all custom sects and browser saves.</span>
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={handleFactoryReset}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium text-xs shadow"
                      >
                        Yes, Wipe & Reset Everything
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmMode(null)}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmMode('factory')}
                    className="w-full py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-100 rounded-lg border border-rose-700/60 flex items-center justify-center space-x-2 text-xs font-semibold shadow-sm transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Perform Full Factory Reset</span>
                  </button>
                )}
              </div>

              {/* Card 2: Clear Painted Map */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-stone-900 border border-stone-700 rounded-lg text-amber-400 mt-0.5">
                    <Paintbrush className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-200 text-sm">Clear Painted Map Claims</h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Resets all territorial colors and painted borders on the map back to neutral unassigned land, while keeping all your Sects, Alliances, and Pins intact.
                    </p>
                  </div>
                </div>

                {confirmMode === 'ownership' ? (
                  <div className="p-3 bg-stone-900 rounded-lg border border-amber-600/80 space-y-2 animate-in fade-in">
                    <p className="text-xs font-semibold text-amber-200">Clear all painted provincial & alliance claims?</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleClearOwnership}
                        className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium text-xs"
                      >
                        Yes, Clear Painted Map
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmMode(null)}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmMode('ownership')}
                    className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 rounded-lg border border-stone-700/80 flex items-center justify-center space-x-2 text-xs font-medium transition-colors"
                  >
                    <span>Clear Painted Territories Only</span>
                  </button>
                )}
              </div>

              {/* Card 3: Reset Layer Settings */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-stone-900 border border-stone-700 rounded-lg text-sky-400 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-200 text-sm">Reset Layer & Display Settings</h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Restores default visibility toggles for rivers, mountains, labels, province borders, and alliance hatching without modifying map data.
                    </p>
                  </div>
                </div>

                {confirmMode === 'layers' ? (
                  <div className="p-3 bg-stone-900 rounded-lg border border-sky-600/80 space-y-2 animate-in fade-in">
                    <p className="text-xs font-semibold text-sky-200">Reset layer toggles and border styles to default?</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleResetLayers}
                        className="flex-1 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded font-medium text-xs"
                      >
                        Yes, Reset Layer Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmMode(null)}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmMode('layers')}
                    className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-sky-200 rounded-lg border border-stone-700/80 flex items-center justify-center space-x-2 text-xs font-medium transition-colors"
                  >
                    <span>Reset Layer & Display Settings</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-500">
          <span>Murim Realm Map Studio</span>
          <button
            type="button"
            onClick={closeResetModal}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
