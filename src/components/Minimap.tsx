import React, { useMemo, useState } from 'react';
import { getProcessedProvinces, MAP_WIDTH, MAP_HEIGHT } from '../utils/mapGeometry';
import { useMurim } from '../context/MurimContext';
import { Maximize2, Minimize2 } from 'lucide-react';

export const Minimap: React.FC = () => {
  const { 
    provinces: provinceStates, 
    factions, 
    alliances, 
    mapMode, 
    zoom, 
    pan, 
    setPan 
  } = useMurim();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const processedProvinces = useMemo(() => getProcessedProvinces(), []);

  const MINI_WIDTH = 200;
  const MINI_HEIGHT = 135;

  // Viewport rectangle calculation
  const vpWidth = (MINI_WIDTH / zoom);
  const vpHeight = (MINI_HEIGHT / zoom);
  const vpX = (MINI_WIDTH / 2) - (pan.x / MAP_WIDTH * MINI_WIDTH) - (vpWidth / 2);
  const vpY = (MINI_HEIGHT / 2) - (pan.y / MAP_HEIGHT * MINI_HEIGHT) - (vpHeight / 2);

  const handleMinimapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Reposition pan so clicked point is in center
    const targetMapX = (clickX / MINI_WIDTH) * MAP_WIDTH;
    const targetMapY = (clickY / MINI_HEIGHT) * MAP_HEIGHT;

    setPan({
      x: (MAP_WIDTH / 2 - targetMapX) * zoom,
      y: (MAP_HEIGHT / 2 - targetMapY) * zoom
    });
  };

  return (
    <div className="absolute bottom-4 right-4 z-20 select-none">
      <div className="bg-stone-950/90 border border-stone-800 rounded-lg p-1.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] text-stone-400 px-1 mb-1 font-serif">
          <span>Realm Overview</span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-amber-300 transition-colors p-0.5"
            title={isCollapsed ? "Expand Minimap" : "Collapse Minimap"}
          >
            {isCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="relative border border-stone-800/80 rounded overflow-hidden bg-stone-900 cursor-pointer">
            <svg
              width={MINI_WIDTH}
              height={MINI_HEIGHT}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              onClick={handleMinimapClick}
              className="bg-stone-950"
            >
              {/* Province Polygons */}
              {processedProvinces.map(p => {
                const state = provinceStates[p.key];
                const faction = factions.find(f => f.id === state?.factionId);
                const alliance = alliances.find(a => a.id === state?.allianceId || a.memberProvinces.includes(p.key));

                let fill = '#2e2720';
                if (mapMode === 'diplomatic' && alliance) {
                  fill = alliance.color;
                } else if (faction) {
                  fill = faction.color;
                }

                return (
                  <path
                    key={`mini-${p.key}`}
                    d={p.pathD}
                    fill={fill}
                    stroke="#1c1917"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Viewport Box */}
              <rect
                x={Math.max(0, vpX * (MAP_WIDTH / MINI_WIDTH))}
                y={Math.max(0, vpY * (MAP_HEIGHT / MINI_HEIGHT))}
                width={Math.min(MAP_WIDTH, vpWidth * (MAP_WIDTH / MINI_WIDTH))}
                height={Math.min(MAP_HEIGHT, vpHeight * (MAP_HEIGHT / MINI_HEIGHT))}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="6 4"
                className="pointer-events-none"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
