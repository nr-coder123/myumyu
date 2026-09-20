import React from 'react';
import { Shield, Swords, Waves, Mountain, Landmark } from 'lucide-react';
import { ProcessedProvince } from '../utils/mapGeometry';
import { useMurim } from '../context/MurimContext';
import { CHINA_RIVERS } from '../data/chinaGeography';
import { renderFactionIcon } from '../utils/factionIcons';

interface ProvinceTooltipProps {
  province: ProcessedProvince | null;
  position: { x: number; y: number } | null;
}

export const ProvinceTooltip: React.FC<ProvinceTooltipProps> = ({ province, position }) => {
  const { provinces, factions, alliances } = useMurim();

  if (!province || !position) return null;

  const state = provinces[province.key] || {};
  const faction = factions.find(f => f.id === state.factionId);
  const alliance = alliances.find(a => a.id === state.allianceId || a.memberProvinces.includes(province.key));
  const hasCustomBorder = !!state.customBorder?.enabled;

  // Find rivers that pass nearby/through this province
  const associatedRivers = CHINA_RIVERS.filter(r => {
    // Check if any river coordinate is near the province center
    return r.coordinates.some(([lon, lat]) => {
      const dLon = Math.abs(lon - province.geoCenter[0]);
      const dLat = Math.abs(lat - province.geoCenter[1]);
      return dLon < 3.5 && dLat < 2.5;
    });
  }).slice(0, 3);

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-75 ease-out select-none"
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y + 16}px`,
        maxWidth: '320px'
      }}
    >
      <div className="bg-stone-950/95 border border-amber-700/60 rounded-lg p-3 text-stone-200 shadow-2xl backdrop-blur-md">
        {/* Header with Chinese Hanzi & English */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-2 mb-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-black text-amber-300 text-lg leading-tight">
                {province.key}
              </span>
              <span className="text-stone-300 text-sm font-semibold">
                {state.customDisplayName || province.meta.name}
              </span>
            </div>
            <p className="text-[10px] text-amber-500/90 font-serif italic">
              {province.meta.historicalName}
            </p>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-400">
            {province.meta.region}
          </span>
        </div>

        {/* Sovereign Sect / Faction Claim */}
        <div className="mb-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[10px] text-stone-400 flex items-center space-x-1">
              <Swords className="w-3 h-3 text-rose-400" />
              <span>Sovereign:</span>
            </span>
            {faction ? (
              <span className="font-bold flex items-center space-x-1.5" style={{ color: faction.color }}>
                {renderFactionIcon(faction.icon, 'w-3.5 h-3.5')}
                <span>{faction.name} {faction.hanzi ? `(${faction.hanzi})` : ''}</span>
              </span>
            ) : (
              <span className="text-stone-400 italic">Unclaimed / Neutral Wilds</span>
            )}
          </div>
          {faction && (
            <div className="mt-0.5 flex items-center space-x-2 text-[10px] text-stone-400 pl-4">
              <span className="px-1 py-0.2 rounded bg-stone-900 border border-stone-800">
                {faction.alignment}
              </span>
              {faction.leader && <span>Leader: {faction.leader}</span>}
            </div>
          )}
        </div>

        {/* Alliance Status & Border */}
        <div className="mb-2 flex items-center space-x-2 text-xs">
          <span className="text-[10px] text-stone-400 flex items-center space-x-1">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Alliance:</span>
          </span>
          {alliance ? (
            <span className="font-bold text-amber-300 flex items-center space-x-1">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: alliance.color }}
              />
              <span>{alliance.name}</span>
              <span className="text-[9px] font-normal text-amber-400/80">({alliance.status})</span>
            </span>
          ) : (
            <span className="text-stone-400">Independent Realm</span>
          )}
        </div>

        {/* Specific Custom Border Indicator */}
        {hasCustomBorder && (
          <div className="mb-2 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-600/40 text-[10px] text-amber-300 flex items-center justify-between">
            <span className="font-semibold tracking-wide">Custom Border Active</span>
            <span className="font-mono text-[9px]">{state.customBorder?.strokeStyle} · {state.customBorder?.strokeWidth}px</span>
          </div>
        )}

        {/* Landmarks & Sacred Peaks */}
        {province.meta.landmarks.length > 0 && (
          <div className="mb-1.5 text-[10px]">
            <div className="flex items-center space-x-1 text-stone-400 mb-0.5">
              <Mountain className="w-3 h-3 text-emerald-400" />
              <span>Martial Landmarks:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {province.meta.landmarks.slice(0, 3).map((l, i) => (
                <span key={i} className="px-1 py-0.2 bg-stone-900 rounded text-stone-300 border border-stone-800 text-[9px]">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Major Waterways */}
        {associatedRivers.length > 0 && (
          <div className="text-[10px] flex items-center space-x-1 text-sky-400">
            <Waves className="w-3 h-3" />
            <span className="text-stone-400">Rivers:</span>
            <span>{associatedRivers.map(r => r.name).join(', ')}</span>
          </div>
        )}

        {/* Action Hint */}
        <div className="mt-2 pt-1 border-t border-stone-900 text-[9px] text-stone-400 text-center flex items-center justify-center space-x-1">
          <Landmark className="w-2.5 h-2.5 text-amber-500" />
          <span>Click to paint or inspect details</span>
        </div>
      </div>
    </div>
  );
};
