import React from 'react';
import { useMurim } from '../context/MurimContext';
import { Plus, Sparkles, MapPin } from 'lucide-react';

export const ContextBar: React.FC = () => {
  const {
    activeTool,
    factions,
    alliances,
    selectedFactionId,
    setSelectedFactionId,
    selectedAllianceId,
    setSelectedAllianceId,
    openFactionModal,
    openAllianceModal
  } = useMurim();

  const selectedFaction = factions.find(f => f.id === selectedFactionId);
  const selectedAlliance = alliances.find(a => a.id === selectedAllianceId);

  return (
    <div className="bg-stone-900 border-b border-stone-800 px-4 h-10 flex items-center justify-between text-xs text-stone-300 select-none shrink-0 z-20">
      {/* Tool Context Content */}
      <div className="flex items-center space-x-3">
        {activeTool === 'brush' && (
          <div className="flex items-center space-x-2">
            <span className="text-stone-400 font-medium">Sect Paint Target:</span>
            {factions.length === 0 ? (
              <button
                onClick={() => openFactionModal()}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Sect</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5">
                <select
                  value={selectedFactionId || ''}
                  onChange={e => setSelectedFactionId(e.target.value || null)}
                  className="bg-stone-950 border border-stone-700 text-stone-100 rounded px-2 py-0.5 text-xs font-serif focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Sect to Paint --</option>
                  {factions.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.hanzi ? `(${f.hanzi})` : ''}
                    </option>
                  ))}
                </select>

                {selectedFaction && (
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" 
                      style={{ backgroundColor: selectedFaction.color }}
                    />
                    <span className="font-serif font-medium text-stone-200">{selectedFaction.name}</span>
                  </div>
                )}

                <button
                  onClick={() => openFactionModal()}
                  className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300"
                  title="Add New Sect"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <span className="text-stone-500 hidden md:inline text-[11px] pl-2 border-l border-stone-800">
              Click or drag across regions on map to claim territory.
            </span>
          </div>
        )}

        {activeTool === 'alliance_pen' && (
          <div className="flex items-center space-x-2">
            <span className="text-stone-400 font-medium">Alliance Border:</span>
            {alliances.length === 0 ? (
              <button
                onClick={() => openAllianceModal()}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Alliance</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5">
                <select
                  value={selectedAllianceId || ''}
                  onChange={e => setSelectedAllianceId(e.target.value || null)}
                  className="bg-stone-950 border border-stone-700 text-stone-100 rounded px-2 py-0.5 text-xs font-serif focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Alliance --</option>
                  {alliances.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.hanzi ? `(${a.hanzi})` : ''} - {a.status}
                    </option>
                  ))}
                </select>

                {selectedAlliance && (
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" 
                      style={{ backgroundColor: selectedAlliance.color }}
                    />
                    <span className="font-serif font-medium text-stone-200">{selectedAlliance.name}</span>
                  </div>
                )}

                <button
                  onClick={() => openAllianceModal()}
                  className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300"
                  title="Add New Alliance"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <span className="text-stone-500 hidden md:inline text-[11px] pl-2 border-l border-stone-800">
              Click provinces to assign alliance border enclosing member territories.
            </span>
          </div>
        )}

        {activeTool === 'landmark_placer' && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
              <MapPin className="w-3 h-3 mr-1" />
              Landmark Placer Active
            </span>
            <span className="text-stone-300 font-normal">
              Click anywhere on the map (provinces, rivers, mountains) to place or edit a strategic pass, peak, or fortress.
            </span>
          </div>
        )}

        {activeTool === 'line_drawer' && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Frontier Wall Active
            </span>
            <span className="text-stone-300 font-normal">
              Click points along the realm to trace a defensive wall or demarcation line. Double-click the last point to complete.
            </span>
          </div>
        )}

        {activeTool === 'border_pen' && (
          <div className="flex items-center space-x-2">
            <span className="text-stone-300 font-normal">
              Click any province to configure custom border stroke (solid, dashed, glowing, double) and line width.
            </span>
          </div>
        )}

        {activeTool === 'inspect' && (
          <div className="flex items-center space-x-2">
            <span className="text-stone-400">
              Click any territory or landmark icon to inspect historical lore, sects, and strategic significance.
            </span>
          </div>
        )}

        {activeTool === 'eraser' && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20">
              Eraser Active
            </span>
            <span className="text-stone-300 font-normal">
              Click or drag across provinces to remove sect and alliance sovereign claims.
            </span>
          </div>
        )}
      </div>

      {/* Right Quick Shortcuts Hint */}
      <div className="hidden lg:flex items-center space-x-3 text-[11px] text-stone-500">
        <span>Shortcuts: <kbd className="px-1 py-0.2 rounded bg-stone-950 border border-stone-800 text-stone-400 font-mono">B</kbd> Paint · <kbd className="px-1 py-0.2 rounded bg-stone-950 border border-stone-800 text-stone-400 font-mono">A</kbd> Alliance · <kbd className="px-1 py-0.2 rounded bg-stone-950 border border-stone-800 text-stone-400 font-mono">E</kbd> Eraser · <kbd className="px-1 py-0.2 rounded bg-stone-950 border border-stone-800 text-stone-400 font-mono">I</kbd> Inspect</span>
      </div>
    </div>
  );
};
