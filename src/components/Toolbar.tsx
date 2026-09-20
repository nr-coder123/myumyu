import React from 'react';
import { 
  Paintbrush, 
  ShieldAlert, 
  PenTool, 
  Crosshair, 
  Eraser, 
  Search, 
  Plus,
  Layers,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { ToolMode } from '../types/murim';

export const Toolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    brushTarget,
    setBrushTarget,
    factions,
    alliances,
    selectedFactionId,
    setSelectedFactionId,
    selectedAllianceId,
    setSelectedAllianceId,
    openFactionModal,
    openAllianceModal,
    setActiveSidebarTab
  } = useMurim();

  const selectedFaction = factions.find(f => f.id === selectedFactionId);
  const selectedAlliance = alliances.find(a => a.id === selectedAllianceId);

  const tools: { id: ToolMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'brush', label: 'Paint Sect', icon: Paintbrush, desc: 'Click/drag provinces to claim for active Sect' },
    { id: 'alliance_pen', label: 'Alliance Border', icon: ShieldAlert, desc: 'Encircle provinces with Alliance Border (e.g. Shaanxi)' },
    { id: 'border_pen', label: 'Custom Border', icon: PenTool, desc: 'Customize individual province borders (color, width, style)' },
    { id: 'line_drawer', label: 'Draw Frontier', icon: Crosshair, desc: 'Draw custom truce lines, great walls & frontlines' },
    { id: 'landmark_placer', label: 'Add Landmark', icon: MapPin, desc: 'Click anywhere on map to place or edit a strategic pass or landmark' },
    { id: 'inspect', label: 'Inspect', icon: Search, desc: 'Inspect & edit province lore, landmarks and status' },
    { id: 'eraser', label: 'Eraser', icon: Eraser, desc: 'Clear sovereign claims or borders from province' }
  ];

  return (
    <aside className="absolute top-16 left-4 z-20 flex flex-col space-y-2 select-none pointer-events-auto">
      {/* Primary Tool Buttons Bar */}
      <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-1.5 shadow-2xl backdrop-blur-md flex flex-col space-y-1">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                if (tool.id === 'brush') setBrushTarget('faction');
                if (tool.id === 'alliance_pen') setBrushTarget('alliance');
                if (tool.id === 'eraser') setBrushTarget('unclaim');
              }}
              className={`group relative p-2.5 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-stone-950 font-bold shadow-lg scale-105 border border-amber-400/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip on Hover */}
              <div className="absolute left-full ml-2.5 px-2.5 py-1.5 bg-stone-900 text-stone-200 text-xs rounded-md shadow-xl border border-stone-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex flex-col">
                <span className="font-bold text-amber-300">{tool.label}</span>
                <span className="text-[10px] text-stone-400 font-normal">{tool.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Faction / Alliance Selection Widget */}
      <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-2.5 shadow-2xl backdrop-blur-md w-56 text-xs flex flex-col space-y-2">
        {/* Toggle between Faction / Alliance Mode */}
        <div className="flex rounded-lg bg-stone-900 p-0.5 border border-stone-800">
          <button
            onClick={() => {
              setBrushTarget('faction');
              if (activeTool !== 'brush') setActiveTool('brush');
            }}
            className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
              brushTarget === 'faction' && activeTool === 'brush'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sect Claim
          </button>
          <button
            onClick={() => {
              setBrushTarget('alliance');
              setActiveTool('alliance_pen');
            }}
            className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
              brushTarget === 'alliance' || activeTool === 'alliance_pen'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Alliance Border
          </button>
        </div>

        {/* Faction Selector */}
        {brushTarget === 'faction' && (
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Active Sect:</span>
              <button
                onClick={() => openFactionModal()}
                className="text-amber-400 hover:text-amber-300 flex items-center space-x-0.5"
                title="Create a new Sect"
              >
                <Plus className="w-3 h-3" />
                <span>New Sect</span>
              </button>
            </div>

            {factions.length === 0 ? (
              <div className="p-2 bg-stone-900/80 rounded border border-dashed border-stone-700 text-center">
                <p className="text-[10px] text-stone-400">No sects added yet.</p>
                <button
                  onClick={() => openFactionModal()}
                  className="mt-1 px-2 py-0.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-[10px] rounded border border-amber-600/40"
                >
                  + Add Your First Sect
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedFactionId || ''}
                  onChange={e => setSelectedFactionId(e.target.value || null)}
                  className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 appearance-none pr-6 cursor-pointer"
                >
                  <option value="">-- Choose Sect to Paint --</option>
                  {factions.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.hanzi ? `(${f.hanzi})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            )}

            {selectedFaction && (
              <div className="flex items-center space-x-2 p-1.5 bg-stone-900/90 rounded border border-stone-800">
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-stone-500 shadow-sm"
                  style={{ backgroundColor: selectedFaction.color }}
                />
                <span className="text-[11px] font-medium text-stone-200 truncate flex-1">
                  {selectedFaction.name}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-stone-800 text-stone-400">
                  {selectedFaction.alignment}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Alliance Selector */}
        {(brushTarget === 'alliance' || activeTool === 'alliance_pen') && (
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Active Alliance:</span>
              <button
                onClick={() => openAllianceModal()}
                className="text-amber-400 hover:text-amber-300 flex items-center space-x-0.5"
                title="Create a new Alliance"
              >
                <Plus className="w-3 h-3" />
                <span>New Alliance</span>
              </button>
            </div>

            {alliances.length === 0 ? (
              <div className="p-2 bg-stone-900/80 rounded border border-dashed border-stone-700 text-center">
                <p className="text-[10px] text-stone-400">No alliances added yet.</p>
                <button
                  onClick={() => openAllianceModal()}
                  className="mt-1 px-2 py-0.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-[10px] rounded border border-amber-600/40"
                >
                  + Add Your First Alliance
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedAllianceId || ''}
                  onChange={e => setSelectedAllianceId(e.target.value || null)}
                  className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 appearance-none pr-6 cursor-pointer"
                >
                  <option value="">-- Choose Alliance Border --</option>
                  {alliances.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.memberProvinces.length} provinces)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            )}

            {selectedAlliance && (
              <div className="flex flex-col space-y-1 p-1.5 bg-stone-900/90 rounded border border-stone-800">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3.5 h-3.5 rounded border border-stone-500 shadow-sm"
                    style={{ backgroundColor: selectedAlliance.color }}
                  />
                  <span className="text-[11px] font-medium text-stone-200 truncate flex-1">
                    {selectedAlliance.name}
                  </span>
                </div>
                <div className="text-[9px] text-amber-400/90 flex justify-between">
                  <span>Border: {selectedAlliance.strokeWidth}px {selectedAlliance.strokeStyle}</span>
                  <span>{selectedAlliance.memberProvinces.length} provinces</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick action button to open drawer or list */}
        <button
          onClick={() => setActiveSidebarTab(brushTarget === 'faction' ? 'factions' : 'alliances')}
          className="w-full py-1 text-[10px] text-stone-400 hover:text-stone-200 bg-stone-900/60 hover:bg-stone-900 rounded border border-stone-800 flex items-center justify-center space-x-1"
        >
          <Layers className="w-3 h-3 text-stone-500" />
          <span>Open Full Manager Panel</span>
        </button>
      </div>
    </aside>
  );
};
