import React from 'react';
import { 
  X, 
  Shield, 
  Swords, 
  PenTool, 
  Waves, 
  Landmark, 
  Trash2
} from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { PROVINCE_METADATA, getSubprovinceMeta } from '../data/chinaProvinces';
import { CHINA_RIVERS } from '../data/chinaGeography';
import { BorderStrokeStyle } from '../types/murim';

const BORDER_COLOR_PRESETS = [
  '#f59e0b', '#dc2626', '#3b82f6', '#10b981', '#9333ea', 
  '#e11d48', '#0284c7', '#ffffff', '#000000', '#d97706'
];

export const ProvinceDrawer: React.FC = () => {
  const {
    isProvinceDrawerOpen,
    closeProvinceDrawer,
    selectedProvinceKey,
    provinces,
    factions,
    alliances,
    updateProvinceState,
    setAllianceBorderOverProvince,
    setProvinceBorderOverride,
    clearProvince
  } = useMurim();

  if (!isProvinceDrawerOpen || !selectedProvinceKey) return null;

  const meta = PROVINCE_METADATA[selectedProvinceKey] || getSubprovinceMeta(selectedProvinceKey) || {
    id: selectedProvinceKey,
    name: selectedProvinceKey,
    hanzi: selectedProvinceKey,
    historicalName: selectedProvinceKey,
    region: 'Central Plains' as const,
    capital: 'Capital',
    landmarks: [],
    description: 'Realm Province'
  };

  const state = provinces[selectedProvinceKey] || {};
  const currentFaction = factions.find(f => f.id === state.factionId);
  const currentAlliance = alliances.find(a => a.id === state.allianceId || a.memberProvinces.includes(selectedProvinceKey));
  const customBorder = state.customBorder || {
    enabled: false,
    strokeColor: '#f59e0b',
    strokeWidth: 5,
    strokeStyle: 'double' as BorderStrokeStyle,
    label: ''
  };

  // Associated rivers
  const rivers = CHINA_RIVERS.filter(r => {
    if (selectedProvinceKey === '陕西') {
      return ['Yellow River', 'Wei River', 'Han River', 'Jialing River'].includes(r.name);
    }
    return r.coordinates.some(([lon, lat]) => {
      const dLon = Math.abs(lon - (meta.id ? 104 : 104));
      const dLat = Math.abs(lat - 35);
      return dLon < 3 && dLat < 3;
    });
  });

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 bg-stone-950/95 border-l border-amber-800/50 shadow-2xl backdrop-blur-md text-stone-200 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-stone-900 to-amber-950/40 border-b border-amber-900/40 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-2xl text-amber-300">
              {state.customDisplayName || meta.name}
            </span>
            <span className="text-stone-400 font-serif text-base">
              ({meta.hanzi || selectedProvinceKey})
            </span>
          </div>
          <p className="text-xs text-amber-500/90 font-serif italic">
            {meta.historicalName} · {meta.region}
          </p>
        </div>

        <button
          onClick={closeProvinceDrawer}
          className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sovereign Sect Selection */}
        <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800">
          <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center space-x-1.5">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>Sovereign Controlling Sect</span>
          </label>
          <select
            value={state.factionId || ''}
            onChange={e => updateProvinceState(selectedProvinceKey, { factionId: e.target.value || null })}
            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">-- Unclaimed / Neutral Wilds --</option>
            {factions.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} {f.hanzi ? `(${f.hanzi})` : ''} - {f.alignment}
              </option>
            ))}
          </select>

          {currentFaction && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-stone-300">
              <div 
                className="w-3 h-3 rounded-full border border-stone-500"
                style={{ backgroundColor: currentFaction.color }} 
              />
              <span className="font-medium">{currentFaction.name}</span>
              <span className="text-[10px] text-stone-400">({currentFaction.alignment})</span>
            </div>
          )}
        </div>

        {/* Alliance Border Assignment (e.g. Murim Alliance over Shaanxi!) */}
        <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800">
          <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Alliance Protectorate & Border</span>
          </label>
          <select
            value={state.allianceId || ''}
            onChange={e => setAllianceBorderOverProvince(selectedProvinceKey, e.target.value || null)}
            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">-- No Alliance Border (Independent) --</option>
            {alliances.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.memberProvinces.length} provinces)
              </option>
            ))}
          </select>

          {currentAlliance && (
            <div className="mt-2 p-2 bg-stone-950/70 rounded border border-amber-900/40 text-xs">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded border border-stone-500"
                  style={{ backgroundColor: currentAlliance.color }} 
                />
                <span className="font-bold text-amber-300">{currentAlliance.name}</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Alliance border line active: {currentAlliance.strokeWidth}px {currentAlliance.strokeStyle}
              </p>
            </div>
          )}
        </div>

        {/* Specific Custom Border Override (High Customizability!) */}
        <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
              <PenTool className="w-3.5 h-3.5 text-amber-500" />
              <span>Specific Province Border Override</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setProvinceBorderOverride(selectedProvinceKey, {
                  ...customBorder,
                  enabled: !customBorder.enabled
                });
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                customBorder.enabled 
                  ? 'bg-amber-600 text-stone-950' 
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {customBorder.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {customBorder.enabled && (
            <div className="space-y-2.5 pt-1 border-t border-stone-800">
              {/* Color */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>Border Line Color:</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="color"
                      value={customBorder.strokeColor}
                      onChange={e => {
                        setProvinceBorderOverride(selectedProvinceKey, {
                          ...customBorder,
                          strokeColor: e.target.value
                        });
                      }}
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border border-stone-700"
                    />
                    <span className="font-mono text-[10px]">{customBorder.strokeColor}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {BORDER_COLOR_PRESETS.map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setProvinceBorderOverride(selectedProvinceKey, {
                          ...customBorder,
                          strokeColor: c
                        });
                      }}
                      className={`w-4 h-4 rounded border ${
                        customBorder.strokeColor.toLowerCase() === c.toLowerCase()
                          ? 'border-white ring-1 ring-amber-500'
                          : 'border-stone-700'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>Border Thickness:</span>
                  <span className="font-mono text-amber-400 font-bold">{customBorder.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={customBorder.strokeWidth}
                  onChange={e => {
                    setProvinceBorderOverride(selectedProvinceKey, {
                      ...customBorder,
                      strokeWidth: Number(e.target.value)
                    });
                  }}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Stroke Style */}
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  Border Line Style:
                </label>
                <select
                  value={customBorder.strokeStyle}
                  onChange={e => {
                    setProvinceBorderOverride(selectedProvinceKey, {
                      ...customBorder,
                      strokeStyle: e.target.value as BorderStrokeStyle
                    });
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200"
                >
                  <option value="double">Double-Line Imperial Crest</option>
                  <option value="solid">Solid Fortified Border</option>
                  <option value="dashed">Dashed Demarcation Line</option>
                  <option value="glowing">Mystic Glowing Boundary</option>
                  <option value="dotted">Dotted Perimeter</option>
                </select>
              </div>

              {/* Border Label */}
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  Custom Border Label:
                </label>
                <input
                  type="text"
                  value={customBorder.label || ''}
                  onChange={e => {
                    setProvinceBorderOverride(selectedProvinceKey, {
                      ...customBorder,
                      label: e.target.value
                    });
                  }}
                  placeholder="e.g. Murim Alliance Shaanxi Perimeter"
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Custom Display Name & Category */}
        <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2.5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Custom Province Display Name
            </label>
            <input
              type="text"
              value={state.customDisplayName || ''}
              onChange={e => updateProvinceState(selectedProvinceKey, { customDisplayName: e.target.value })}
              placeholder={meta.historicalName}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Strategic Martial Status
            </label>
            <select
              value={state.customCategory || 'Sacred Sanctuary'}
              onChange={e => updateProvinceState(selectedProvinceKey, { customCategory: e.target.value as any })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Sect Headquarters">Sect Headquarters (Supreme Sanctuary)</option>
              <option value="Fortified Pass">Fortified Strategic Pass</option>
              <option value="Sacred Sanctuary">Sacred Cultivation Sanctuary</option>
              <option value="Contested Frontline">Contested Martial Frontline</option>
              <option value="Vassal Realm">Vassal Clan Territory</option>
              <option value="Commercial Hub">Mercantile & Merchant Hub</option>
              <option value="Ancient Ruins">Ancient Mystic Realm / Ruins</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Custom Martial Notes & Lore
            </label>
            <textarea
              rows={3}
              value={state.notes || ''}
              onChange={e => updateProvinceState(selectedProvinceKey, { notes: e.target.value })}
              placeholder="Record secret sects, demonic skirmishes, or alliance treaties in this territory..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Real-Life Landmarks & Geography Details */}
        <div className="p-3 bg-stone-900/60 rounded-lg border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold font-serif">
            <Landmark className="w-3.5 h-3.5" />
            <span>Geographic Profile & Lore</span>
          </div>

          <div className="text-stone-300 text-[11px] leading-relaxed">
            {meta.description}
          </div>

          {meta.landmarks.length > 0 && (
            <div>
              <span className="text-[10px] text-stone-400 block mb-1">Landmarks:</span>
              <div className="flex flex-wrap gap-1">
                {meta.landmarks.map((l, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-[10px] text-stone-300">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {rivers.length > 0 && (
            <div className="flex items-center space-x-1.5 text-sky-400 text-[11px]">
              <Waves className="w-3.5 h-3.5" />
              <span className="text-stone-400">Rivers:</span>
              <span>{rivers.map(r => r.name).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Clear Province Ownership Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => clearProvince(selectedProvinceKey)}
            className="w-full py-2 bg-stone-900 hover:bg-rose-950/50 text-stone-400 hover:text-rose-300 rounded-lg border border-stone-800 hover:border-rose-800 text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Claims & Borders from {selectedProvinceKey}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
