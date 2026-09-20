import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  getProcessedProvinces, 
  getRiverPath, 
  projectCoordinates, 
  invertCoordinates,
  getStrokeDashArray,
  getMergedAlliancePath,
  MAP_WIDTH, 
  MAP_HEIGHT,
  ProcessedProvince
} from '../utils/mapGeometry';
import { CHINA_RIVERS } from '../data/chinaGeography';
import { useMurim } from '../context/MurimContext';
import { LandmarkFeature } from '../types/murim';
import { SvgDefs } from '../utils/svgDefs';
import { ProvinceTooltip } from './ProvinceTooltip';
import { renderFactionIcon } from '../utils/factionIcons';

interface MurimMapCanvasProps {
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const MurimMapCanvas: React.FC<MurimMapCanvasProps> = ({ svgRef: externalSvgRef }) => {
  const {
    provinces: provinceStates,
    subdividedRegions,
    factions,
    alliances,
    frontierLines,
    landmarks,
    layerSettings,
    mapMode,
    activeTool,
    selectedAllianceId,
    zoom,
    pan,
    setZoom,
    setPan,
    paintProvince,
    setAllianceBorderOverProvince,
    openProvinceDrawer,
    openLandmarkModal,
    addFrontierLine
  } = useMurim();

  const internalSvgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeSvgRef = externalSvgRef || internalSvgRef;

  // Processed real-life provinces & subprovinces
  const processedProvinces = useMemo(
    () => getProcessedProvinces(subdividedRegions),
    [subdividedRegions]
  );

  // Hover state for tooltip
  const [hoveredProvince, setHoveredProvince] = useState<ProcessedProvince | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Drag pan state
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isPaintingDrag, setIsPaintingDrag] = useState(false);

  // Frontier line drawing temporary state
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);

  // Wheel zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom(prevZoom => Math.min(Math.max(prevZoom * zoomFactor, 0.6), 5.0));
  }, [setZoom]);

  // Mouse down on canvas
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle click or space+click or click on empty canvas starts panning
    if (e.button === 1 || e.shiftKey || (e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-background') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (activeTool === 'brush' || activeTool === 'alliance_pen' || activeTool === 'eraser') {
      setIsPaintingDrag(true);
    }
  }, [pan, activeTool]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
      return;
    }

    // Update tooltip position
    setTooltipPos({ x: e.clientX, y: e.clientY });

    // Handle frontier line preview
    if (activeTool === 'line_drawer' && drawingPoints.length > 0 && activeSvgRef.current) {
      // Line drawing preview can follow
    }
  }, [isPanning, startPan, setPan, activeTool, drawingPoints, activeSvgRef]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsPaintingDrag(false);
  }, []);

  // Province Click Handler
  const handleProvinceClick = useCallback((province: ProcessedProvince, e: React.MouseEvent) => {
    e.stopPropagation();

    // Landmark Placer: Click anywhere on a province to place a landmark at that exact point
    if (activeTool === 'landmark_placer') {
      const rect = activeSvgRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = (e.clientX - rect.left - pan.x) / zoom;
        const clickY = (e.clientY - rect.top - pan.y) / zoom;
        const geoCoord = invertCoordinates([clickX, clickY]);
        if (geoCoord) {
          openLandmarkModal(null, geoCoord);
          return;
        }
      }
      return;
    }

    // Line Drawer: Click points across provinces to draw frontier wall
    if (activeTool === 'line_drawer') {
      const rect = activeSvgRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = (e.clientX - rect.left - pan.x) / zoom;
        const clickY = (e.clientY - rect.top - pan.y) / zoom;
        const geoCoord = invertCoordinates([clickX, clickY]);
        if (geoCoord) {
          const nextPoints = [...drawingPoints, geoCoord];
          if (nextPoints.length >= 2 && e.detail === 2) {
            addFrontierLine({
              id: `line-${Date.now()}`,
              name: 'Frontier Demarcation',
              color: '#f59e0b',
              width: 3.5,
              style: 'wall',
              points: nextPoints
            });
            setDrawingPoints([]);
          } else {
            setDrawingPoints(nextPoints);
          }
        }
      }
      return;
    }

    if (activeTool === 'inspect') {
      openProvinceDrawer(province.key);
      return;
    }

    if (activeTool === 'border_pen') {
      openProvinceDrawer(province.key);
      return;
    }

    if (activeTool === 'brush') {
      paintProvince(province.key);
      return;
    }

    if (activeTool === 'alliance_pen') {
      if (selectedAllianceId) {
        setAllianceBorderOverProvince(province.key, selectedAllianceId);
      } else {
        openProvinceDrawer(province.key);
      }
      return;
    }

    if (activeTool === 'eraser') {
      paintProvince(province.key);
      return;
    }

    // Default: open inspector
    openProvinceDrawer(province.key);
  }, [
    activeTool, 
    selectedAllianceId, 
    paintProvince, 
    setAllianceBorderOverProvince, 
    openProvinceDrawer,
    openLandmarkModal,
    activeSvgRef,
    pan,
    zoom,
    drawingPoints,
    addFrontierLine
  ]);

  // Province Mouse Over (for drag painting)
  const handleProvinceMouseEnter = useCallback((province: ProcessedProvince) => {
    setHoveredProvince(province);
    if (isPaintingDrag && (activeTool === 'brush' || activeTool === 'alliance_pen' || activeTool === 'eraser')) {
      if (activeTool === 'brush' || activeTool === 'eraser') {
        paintProvince(province.key);
      } else if (activeTool === 'alliance_pen' && selectedAllianceId) {
        setAllianceBorderOverProvince(province.key, selectedAllianceId);
      }
    }
  }, [isPaintingDrag, activeTool, selectedAllianceId, paintProvince, setAllianceBorderOverProvince]);

  const handleProvinceMouseLeave = useCallback(() => {
    setHoveredProvince(null);
  }, []);

  // Canvas Click for Line Drawer or Pin Placer
  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) return;

    const rect = activeSvgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Convert screen coordinates to SVG map coordinate
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    const geoCoord = invertCoordinates([clickX, clickY]);
    if (!geoCoord) return;

    if (activeTool === 'landmark_placer') {
      openLandmarkModal(null, geoCoord);
      return;
    }

    if (activeTool === 'line_drawer') {
      const nextPoints = [...drawingPoints, geoCoord];
      if (nextPoints.length >= 2 && e.detail === 2) { // Double click to finish line
        addFrontierLine({
          id: `line-${Date.now()}`,
          name: 'Frontier Demarcation',
          color: '#f59e0b',
          width: 3.5,
          style: 'wall',
          points: nextPoints
        });
        setDrawingPoints([]);
      } else {
        setDrawingPoints(nextPoints);
      }
    }
  }, [isPanning, pan, zoom, activeSvgRef, activeTool, drawingPoints, addFrontierLine, openLandmarkModal]);

  // Helper to determine province fill color based on MapMode
  const getProvinceFill = useCallback((province: ProcessedProvince): string => {
    const state = provinceStates[province.key];
    const faction = factions.find(f => f.id === state?.factionId);
    const alliance = alliances.find(a => a.id === state?.allianceId || a.memberProvinces.includes(province.key));

    if (mapMode === 'political') {
      if (faction) return faction.color;
      return '#3b332a'; // neutral uncolonized earth tone
    }

    if (mapMode === 'diplomatic') {
      if (alliance) return alliance.color;
      if (faction) return '#443b32';
      return '#26211a';
    }

    if (mapMode === 'parchment') {
      if (faction) {
        // Soft antique tint of faction color
        return faction.color;
      }
      return '#dcd3ba'; // warm vintage paper wash
    }

    if (mapMode === 'terrain') {
      // Natural geographic elevation coloring by region
      switch (province.meta.region) {
        case 'West & Bashu': return '#3a4a35';
        case 'South & Jiangnan': return '#2f4836';
        case 'Central Plains': return '#504b38';
        case 'Northwest': return '#584938';
        case 'Frontier': return '#5c483a';
        case 'North': return '#42423a';
        case 'Northeast': return '#344038';
        default: return '#3a3a35';
      }
    }

    if (mapMode === 'borders') {
      if (state?.customBorder?.enabled) return '#451a03';
      if (alliance) return '#312e81';
      return '#1c1917';
    }

    return faction?.color || '#3b332a';
  }, [provinceStates, factions, alliances, mapMode]);

  // Helper to determine province fill opacity
  const getProvinceOpacity = useCallback((province: ProcessedProvince): number => {
    const state = provinceStates[province.key];
    const isClaimed = !!state?.factionId || !!state?.allianceId;

    if (mapMode === 'parchment') {
      return isClaimed ? 0.45 : 0.85;
    }
    if (mapMode === 'terrain') {
      return 0.75;
    }
    if (mapMode === 'borders') {
      return isClaimed ? 0.7 : 0.4;
    }
    return isClaimed ? 0.9 : 0.6;
  }, [provinceStates, mapMode]);

  // Filter rendered rivers and calculate dynamic label placements along river flow
  const renderedRivers = useMemo(() => {
    return CHINA_RIVERS.map(r => {
      const pathD = getRiverPath(r);
      const pts = r.coordinates.map(c => projectCoordinates(c)).filter((p): p is [number, number] => p !== null);

      let labelPos: { x: number; y: number; angle: number } | null = null;
      if (pts.length >= 2) {
        let totalLen = 0;
        const dists = [0];
        for (let i = 0; i < pts.length - 1; i++) {
          const dx = pts[i + 1][0] - pts[i][0];
          const dy = pts[i + 1][1] - pts[i][1];
          totalLen += Math.hypot(dx, dy);
          dists.push(totalLen);
        }

        // Place label at 50% along the river polyline
        const targetDist = totalLen * 0.5;
        let segIdx = 0;
        for (let i = 0; i < dists.length - 1; i++) {
          if (dists[i + 1] >= targetDist) {
            segIdx = i;
            break;
          }
        }

        const p1 = pts[segIdx];
        const p2 = pts[segIdx + 1];
        const segLen = dists[segIdx + 1] - dists[segIdx];
        const t = segLen > 0 ? (targetDist - dists[segIdx]) / segLen : 0.5;

        const x = p1[0] + (p2[0] - p1[0]) * t;
        const y = p1[1] + (p2[1] - p1[1]) * t;

        let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI);
        if (angle > 90) angle -= 180;
        if (angle < -90) angle += 180;

        labelPos = { x, y, angle };
      }

      return {
        river: r,
        pathD,
        labelPos
      };
    }).filter(r => r.pathD.length > 0);
  }, []);

  // Filter and project dynamic landmarks & passes from context
  const renderedLandmarks = useMemo(() => {
    return (landmarks || []).map(lm => {
      const point = projectCoordinates(lm.coordinates);
      if (!point) return null;
      return { landmark: lm, point };
    }).filter((item): item is { landmark: LandmarkFeature; point: [number, number] } => item !== null);
  }, [landmarks]);

  // Compute merged outer perimeter SVG path for each alliance (dissolving internal province borders)
  const allianceMergedPaths = useMemo(() => {
    const map: Record<string, string> = {};
    const minHoleArea = layerSettings.allianceHoleFilterThreshold ?? 0.05;
    const minPolyArea = layerSettings.allianceSliverFilterThreshold ?? 0.005;

    for (const alliance of alliances) {
      const memberProvs = processedProvinces.filter(p => {
        const state = provinceStates[p.key];
        const isDirect = state?.allianceId === alliance.id || alliance.memberProvinces.includes(p.key);
        const isParentInAlliance = !!(p.parentKey && (provinceStates[p.parentKey]?.allianceId === alliance.id || alliance.memberProvinces.includes(p.parentKey)));
        return isDirect || isParentInAlliance;
      });
      if (memberProvs.length > 0) {
        map[alliance.id] = getMergedAlliancePath(memberProvs, minHoleArea, minPolyArea);
      }
    }
    return map;
  }, [alliances, processedProvinces, provinceStates, layerSettings.allianceHoleFilterThreshold, layerSettings.allianceSliverFilterThreshold]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-stone-950 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Tooltip */}
      <ProvinceTooltip province={hoveredProvince} position={tooltipPos} />

      {/* Main Map SVG */}
      <svg
        id="murim-map-main-svg"
        data-map-canvas="true"
        ref={activeSvgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-full transition-transform duration-75 ease-out"
        onClick={handleCanvasClick}
        style={{
          backgroundColor: mapMode === 'parchment' ? '#e8dfc8' : '#141820'
        }}
      >
        {/* Defs: Patterns, Filters & Gradients */}
        <SvgDefs alliances={alliances} />

        {/* Scaled & Translated World Container */}
        <g 
          id="murim-map-world-group"
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transformOrigin: 'center center' }}
        >
          {/* ========================================================
              LAYER 1: OCEAN / SEAS BACKGROUND
              ======================================================== */}
          <rect
            id="map-background"
            x={-1000}
            y={-1000}
            width={MAP_WIDTH + 2000}
            height={MAP_HEIGHT + 2000}
            fill={mapMode === 'parchment' ? '#ede2cc' : '#131b26'}
          />

          {/* Sea Wave Texture */}
          <rect
            x={-1000}
            y={-1000}
            width={MAP_WIDTH + 2000}
            height={MAP_HEIGHT + 2000}
            fill="url(#sea-waves)"
            opacity={mapMode === 'parchment' ? 0.25 : 0.15}
          />

          {/* Graticule Grid Lines (Latitude / Longitude) */}
          {layerSettings.showGraticule && (
            <g className="graticule-layer" opacity={0.12} stroke={mapMode === 'parchment' ? '#5a4632' : '#60a5fa'} strokeWidth={0.8} strokeDasharray="4 4">
              {[80, 90, 100, 110, 120, 130].map(lon => {
                const pt1 = projectCoordinates([lon, 15]);
                const pt2 = projectCoordinates([lon, 55]);
                if (!pt1 || !pt2) return null;
                return <line key={`lon-${lon}`} x1={pt1[0]} y1={pt1[1]} x2={pt2[0]} y2={pt2[1]} />;
              })}
              {[20, 30, 40, 50].map(lat => {
                const pt1 = projectCoordinates([75, lat]);
                const pt2 = projectCoordinates([135, lat]);
                if (!pt1 || !pt2) return null;
                return <line key={`lat-${lat}`} x1={pt1[0]} y1={pt1[1]} x2={pt2[0]} y2={pt2[1]} />;
              })}
            </g>
          )}

          {/* Sea Names / Cartographic Labels */}
          <g className="sea-labels font-serif italic" fill={mapMode === 'parchment' ? '#8c7a65' : '#38bdf8'} opacity={0.35} fontSize={14} letterSpacing={3}>
            <text x={1190} y={380} textAnchor="middle">
              {layerSettings.nameLanguage === 'hanzi' ? '渤海' : (layerSettings.nameLanguage === 'both' ? 'BOHAI SEA · 渤海' : 'BOHAI SEA')}
            </text>
            <text x={1260} y={510} textAnchor="middle">
              {layerSettings.nameLanguage === 'hanzi' ? '黃海' : (layerSettings.nameLanguage === 'both' ? 'YELLOW SEA · 黃海' : 'YELLOW SEA')}
            </text>
            <text x={1280} y={670} textAnchor="middle">
              {layerSettings.nameLanguage === 'hanzi' ? '東海' : (layerSettings.nameLanguage === 'both' ? 'EAST CHINA SEA · 東海' : 'EAST CHINA SEA')}
            </text>
            <text x={1130} y={850} textAnchor="middle">
              {layerSettings.nameLanguage === 'hanzi' ? '南海' : (layerSettings.nameLanguage === 'both' ? 'SOUTH CHINA SEA · 南海' : 'SOUTH CHINA SEA')}
            </text>
          </g>

          {/* ========================================================
              LAYER 2: PROVINCE POLYGONS (REAL-LIFE BOUNDARIES)
              ======================================================== */}
          <g className="provinces-layer">
            {processedProvinces.map(province => {
              const isHovered = hoveredProvince?.key === province.key;
              const fill = getProvinceFill(province);
              const opacity = getProvinceOpacity(province);

              return (
                <path
                  key={`prov-${province.key}`}
                  d={province.pathD}
                  fill={fill}
                  fillOpacity={opacity}
                  stroke={mapMode === 'parchment' ? '#3e2e1e' : '#1e1b18'}
                  strokeWidth={layerSettings.provinceBorderWidth}
                  strokeOpacity={layerSettings.provinceBorderOpacity}
                  strokeLinejoin="round"
                  className="transition-colors duration-150 cursor-pointer"
                  style={{
                    filter: isHovered ? 'brightness(1.2) drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' : undefined
                  }}
                  onClick={e => handleProvinceClick(province, e)}
                  onMouseEnter={() => handleProvinceMouseEnter(province)}
                  onMouseLeave={handleProvinceMouseLeave}
                />
              );
            })}
          </g>

          {/* ========================================================
              LAYER 3: ALLIANCE TERRITORY HATCH & INTERIOR GLOW
              ======================================================== */}
          {layerSettings.showAllianceHatch && (
            <g className="alliance-hatch-layer pointer-events-none">
              {alliances.map(alliance => {
                if (alliance.fillPattern === 'none') return null;
                const mergedPathD = allianceMergedPaths[alliance.id];
                if (!mergedPathD) return null;

                const patternId = alliance.fillPattern === 'dots' 
                  ? `url(#pattern-dots-${alliance.id})`
                  : `url(#pattern-alliance-${alliance.id})`;

                return (
                  <g key={`alliance-fill-${alliance.id}`}>
                    <path
                      key={`hatch-${alliance.id}`}
                      d={mergedPathD}
                      fill={patternId}
                      fillOpacity={0.65}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 4: ALLIANCE BOUNDARIES (ONE SINGULAR THICK JOINED BORDER)
              (Unions all member provinces so internal borders dissolve seamlessly)
              ======================================================== */}
          {layerSettings.showAllianceBorders && (
            <g className="alliance-borders-layer pointer-events-none">
              {alliances.map(alliance => {
                const mergedPathD = allianceMergedPaths[alliance.id];
                if (!mergedPathD) return null;

                const dashArray = getStrokeDashArray(alliance.strokeStyle, alliance.strokeWidth);
                const isDouble = alliance.strokeStyle === 'double';
                const isGlowing = alliance.strokeStyle === 'glowing';

                return (
                  <g key={`alliance-border-${alliance.id}`}>
                    {/* Outer Glow Halo if glowing style */}
                    {isGlowing && (
                      <path
                        key={`glow-${alliance.id}`}
                        d={mergedPathD}
                        fill="none"
                        stroke={alliance.color}
                        strokeWidth={alliance.strokeWidth * 2.2}
                        strokeOpacity={0.4}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{ filter: 'blur(3px)' }}
                      />
                    )}

                    {/* Secondary base line for Double-Line Style */}
                    {isDouble && (
                      <path
                        key={`double-outer-${alliance.id}`}
                        d={mergedPathD}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={alliance.strokeWidth + 3}
                        strokeOpacity={0.7}
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Primary Alliance Border Line - Singular thick continuous boundary */}
                    <path
                      key={`border-${alliance.id}`}
                      d={mergedPathD}
                      fill="none"
                      stroke={alliance.color}
                      strokeWidth={alliance.strokeWidth}
                      strokeDasharray={dashArray}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeOpacity={0.95}
                      style={{
                        filter: 'drop-shadow(0 0 2.5px rgba(0,0,0,0.85))'
                      }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 5: SPECIFIC PROVINCE CUSTOM BORDER OVERRIDES
              (e.g., Shaanxi custom gold border with custom width/style)
              ======================================================== */}
          <g className="custom-borders-layer pointer-events-none">
            {processedProvinces.map(p => {
              const state = provinceStates[p.key];
              const override = state?.customBorder;
              if (!override || !override.enabled) return null;

              const dash = getStrokeDashArray(override.strokeStyle, override.strokeWidth);

              return (
                <g key={`custom-override-${p.key}`}>
                  {/* Optional Glow */}
                  {override.strokeStyle === 'glowing' && (
                    <path
                      d={p.pathD}
                      fill="none"
                      stroke={override.strokeColor}
                      strokeWidth={override.strokeWidth * 2.2}
                      strokeOpacity={0.5}
                      strokeLinejoin="round"
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}

                  {/* Border Stroke */}
                  <path
                    d={p.pathD}
                    fill="none"
                    stroke={override.strokeColor}
                    strokeWidth={override.strokeWidth}
                    strokeDasharray={dash}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeOpacity={1.0}
                    style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.9))' }}
                  />
                </g>
              );
            })}
          </g>

          {/* ========================================================
              LAYER 6: RIVERS & WATERWAYS (ACCURATE REAL-LIFE RIVERS)
              ======================================================== */}
          {layerSettings.showRivers && (
            <g className="rivers-layer pointer-events-none">
              {renderedRivers.map(({ river, pathD }) => {
                const riverColor = mapMode === 'parchment' ? '#3b5268' : (river.color || '#38bdf8');
                return (
                  <g key={`river-${river.id}`}>
                    {/* River Glow / Depth */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={mapMode === 'parchment' ? '#ede2cc' : '#0c4a6e'}
                      strokeWidth={river.width + 1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.6}
                    />
                    {/* River Flow Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={riverColor}
                      strokeWidth={river.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={mapMode === 'parchment' ? 0.75 : 0.9}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* River Names (Dynamically positioned along real river flow paths) */}
          {layerSettings.showRivers && layerSettings.showRiverLabels && (
            <g className="river-labels font-serif text-[10px] font-bold italic pointer-events-none select-none">
              {renderedRivers.map(({ river, labelPos }) => {
                if (!labelPos) return null;
                const labelText = layerSettings.nameLanguage === 'hanzi'
                  ? river.hanzi
                  : (layerSettings.nameLanguage === 'both' ? `${river.name} · ${river.hanzi}` : river.name);
                const textColor = mapMode === 'parchment' ? '#2c3e50' : '#7dd3fc';
                const glowColor = mapMode === 'parchment' ? '#ede2cc' : '#0a1926';

                return (
                  <g
                    key={`river-label-${river.id}`}
                    transform={`translate(${labelPos.x}, ${labelPos.y}) rotate(${labelPos.angle})`}
                  >
                    {/* Background halo for legibility over terrain and fills */}
                    <text
                      x={0}
                      y={-4}
                      textAnchor="middle"
                      fill={glowColor}
                      stroke={glowColor}
                      strokeWidth={3}
                      strokeLinejoin="round"
                      opacity={0.85}
                    >
                      {labelText}
                    </text>
                    {/* Foreground river title */}
                    <text
                      x={0}
                      y={-4}
                      textAnchor="middle"
                      fill={textColor}
                      opacity={0.9}
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 7: SACRED PEAKS & STRATEGIC MOUNTAIN PASSES
              ======================================================== */}
          {layerSettings.showMountains && (
            <g className="landmarks-layer">
              {renderedLandmarks.map(({ landmark, point }) => {
                const isPass = landmark.type === 'pass';
                const isPeak = landmark.type === 'sacred_peak';
                const isSect = landmark.type === 'sect_site';
                const isFortress = landmark.type === 'fortress';
                const isCity = landmark.type === 'ancient_city';
                const isWaterGate = landmark.type === 'water_gate';

                const labelStyle = layerSettings.landmarkLabelStyle || 'compact';

                // Format display name
                let displayName = landmark.name;
                if (labelStyle === 'compact') {
                  // Strip verbose parentheticals like "(First Pass Under Heaven)"
                  displayName = displayName.replace(/\s*\([^)]*\)/g, '').trim();
                }

                let labelText = displayName;
                if (layerSettings.nameLanguage === 'hanzi' && landmark.hanzi) {
                  labelText = landmark.hanzi;
                } else if (layerSettings.nameLanguage === 'both' && landmark.hanzi) {
                  labelText = `${displayName} · ${landmark.hanzi}`;
                } else if (layerSettings.nameLanguage === 'historical') {
                  labelText = displayName;
                } else {
                  labelText = displayName;
                }

                // Landmark label size
                const lmFontSize = layerSettings.labelSize === 'tiny' ? 7.0 : (layerSettings.labelSize === 'medium' ? 9.5 : 8.0);

                return (
                  <g 
                    key={`landmark-${landmark.id}`} 
                    transform={`translate(${point[0]}, ${point[1]})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLandmarkModal(landmark);
                    }}
                  >
                    <title>{`${landmark.name} ${landmark.hanzi ? `(${landmark.hanzi})` : ''} - Click to edit or remove`}</title>

                    {/* Interactive Marker Glyph */}
                    {isPass && (
                      <g transform="translate(-7, -7)">
                        <rect x={0} y={0} width={14} height={14} rx={2} fill="#78350f" stroke="#fbbf24" strokeWidth={1.2} />
                        {layerSettings.nameLanguage === 'english' ? (
                          <path d="M 3 11 L 3 5 L 7 3 L 11 5 L 11 11 M 5 11 L 5 7 L 9 7 L 9 11" fill="none" stroke="#fbbf24" strokeWidth={1.2} />
                        ) : (
                          <text x={7} y={10} fontSize={8.5} fill="#fbbf24" textAnchor="middle" fontWeight="bold">關</text>
                        )}
                      </g>
                    )}

                    {isPeak && (
                      <g transform="translate(-6, -6)">
                        <path d="M 6 0 L 12 11 L 0 11 Z" fill="#b45309" stroke="#fef3c7" strokeWidth={1} />
                        <circle cx={6} cy={7.5} r={1.2} fill="#fef3c7" />
                      </g>
                    )}

                    {isSect && (
                      <g transform="translate(-7, -7)">
                        <circle cx={7} cy={7} r={6.5} fill="#1e1b4b" stroke="#a5b4fc" strokeWidth={1.2} />
                        <path d="M 7 2 L 10 5 L 4 5 Z M 4.5 5 L 9.5 5 L 9.5 10 L 4.5 10 Z" fill="#a5b4fc" />
                      </g>
                    )}

                    {isFortress && (
                      <g transform="translate(-6, -6)">
                        <rect x={0} y={0} width={12} height={12} rx={1} fill="#3f3f46" stroke="#fbbf24" strokeWidth={1.2} />
                        <circle cx={6} cy={6} r={2} fill="#fbbf24" />
                      </g>
                    )}

                    {isCity && (
                      <g transform="translate(-6, -6)">
                        <circle cx={6} cy={6} r={5.5} fill="#713f12" stroke="#fde047" strokeWidth={1.2} />
                        <circle cx={6} cy={6} r={2} fill="#fde047" />
                      </g>
                    )}

                    {isWaterGate && (
                      <g transform="translate(-6, -6)">
                        <circle cx={6} cy={6} r={5.5} fill="#0c4a6e" stroke="#7dd3fc" strokeWidth={1.2} />
                        <path d="M 6 2 L 6 9 M 3 6 L 9 6" stroke="#7dd3fc" strokeWidth={1.2} strokeLinecap="round" />
                      </g>
                    )}

                    {/* Landmark / Pass Label */}
                    {layerSettings.showMountainLabels && labelStyle !== 'hidden' && (
                      <text
                        x={8}
                        y={3}
                        fontSize={lmFontSize}
                        fontFamily="serif"
                        fontWeight="bold"
                        fill={isPass ? '#fbbf24' : (mapMode === 'parchment' ? '#3e210a' : '#fed7aa')}
                        stroke={mapMode === 'parchment' ? '#fdf6e2' : '#000000'}
                        strokeWidth={1.5}
                        paintOrder="stroke"
                        className="select-none group-hover:fill-amber-400 transition-colors"
                      >
                        {labelText}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 8: CUSTOM FRONTIER LINES & BARRIER WALLS
              ======================================================== */}
          {layerSettings.showFrontierLines && (
            <g className="frontier-lines-layer pointer-events-none">
              {frontierLines.map(line => {
                const points = line.points
                  .map(p => projectCoordinates(p))
                  .filter((pt): pt is [number, number] => pt !== null);

                if (points.length < 2) return null;

                let d = `M ${points[0][0]} ${points[0][1]}`;
                for (let i = 1; i < points.length; i++) {
                  d += ` L ${points[i][0]} ${points[i][1]}`;
                }

                return (
                  <g key={`frontier-${line.id}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={line.width}
                      strokeDasharray={line.style === 'dashed' ? '8 6' : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))' }}
                    />
                  </g>
                );
              })}

              {/* Temporary line being drawn */}
              {drawingPoints.length > 0 && (
                <g className="drawing-preview">
                  {drawingPoints.map((pt, i) => {
                    const p = projectCoordinates(pt);
                    if (!p) return null;
                    return <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />;
                  })}
                </g>
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 9: PROVINCE LABELS & FACTION CRESTS
              ======================================================== */}
          {layerSettings.showProvinceNames && layerSettings.labelSize !== 'off' && (
            <g className="province-labels-layer pointer-events-none">
              {processedProvinces.map(p => {
                // If this is a subdivision (prefecture) and user selected hideSubdivisionLabels, skip
                if (p.isSubdivision && layerSettings.hideSubdivisionLabels) {
                  return null;
                }

                const state = provinceStates[p.key];
                const faction = factions.find(f => f.id === state?.factionId);
                const alliance = alliances.find(a => a.id === state?.allianceId || a.memberProvinces.includes(p.key));

                const labelSize = layerSettings.labelSize || 'small';
                let baseFontSize = 8.5;
                let baseStroke = 1.8;
                if (labelSize === 'tiny') {
                  baseFontSize = 7.0;
                  baseStroke = 1.4;
                } else if (labelSize === 'medium') {
                  baseFontSize = 10.5;
                  baseStroke = 2.2;
                } else if (labelSize === 'large') {
                  baseFontSize = 12.5;
                  baseStroke = 2.8;
                }

                // Sub-provinces get a smaller font so they fit within prefectures
                const currentFontSize = p.isSubdivision ? baseFontSize * 0.8 : baseFontSize;
                const currentStroke = p.isSubdivision ? baseStroke * 0.8 : baseStroke;

                const customName = state?.customDisplayName?.trim();
                const primaryName = customName || p.meta.name;

                let labelText = primaryName;
                if (layerSettings.nameLanguage === 'hanzi') {
                  labelText = customName || p.key;
                } else if (layerSettings.nameLanguage === 'both') {
                  // In compact/small sizes, show either name or dual format
                  labelText = p.isSubdivision ? primaryName : `${primaryName} · ${p.key}`;
                } else if (layerSettings.nameLanguage === 'historical') {
                  labelText = customName || p.meta.historicalName || p.meta.name;
                } else {
                  // 'english' -> Romanized text or custom display name
                  labelText = primaryName;
                }

                const hasEmblem = layerSettings.showFactionEmblems && !!faction;

                return (
                  <g key={`label-${p.key}`} transform={`translate(${p.center[0]}, ${p.center[1]})`}>
                    {/* Faction Shield / Crest Emblem */}
                    {hasEmblem && (
                      <g transform="translate(0, -14)">
                        <circle cx={0} cy={0} r={8} fill={faction.color} stroke="#fbbf24" strokeWidth={1.2} style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }} />
                        <foreignObject x={-5} y={-5} width={10} height={10}>
                          <div className="w-full h-full text-stone-950 flex items-center justify-center font-bold">
                            {renderFactionIcon(faction.icon, 'w-2.5 h-2.5 text-white')}
                          </div>
                        </foreignObject>
                      </g>
                    )}

                    {/* Province Name */}
                    <text
                      x={0}
                      y={hasEmblem ? 4 : 0}
                      textAnchor="middle"
                      fontSize={currentFontSize}
                      fontFamily="serif"
                      fontWeight="bold"
                      fill={mapMode === 'parchment' ? '#221910' : '#f5f5f4'}
                      stroke={mapMode === 'parchment' ? '#ede2cc' : '#000000'}
                      strokeWidth={currentStroke}
                      paintOrder="stroke"
                      className="select-none tracking-tight"
                      opacity={p.isSubdivision ? 0.9 : 1.0}
                    >
                      {labelText}
                    </text>

                    {/* Faction Sovereign Title Under Province */}
                    {faction && !p.isSubdivision && (
                      <text
                        x={0}
                        y={hasEmblem ? 13 : 9}
                        textAnchor="middle"
                        fontSize={currentFontSize * 0.8}
                        fontFamily="serif"
                        fontWeight="semibold"
                        fill={faction.color}
                        stroke="#000000"
                        strokeWidth={1.5}
                        paintOrder="stroke"
                        className="select-none tracking-tight"
                      >
                        {layerSettings.nameLanguage === 'hanzi' && faction.hanzi
                          ? faction.hanzi
                          : (layerSettings.nameLanguage === 'both' && faction.hanzi
                            ? `${faction.name} · ${faction.hanzi}`
                            : faction.name)}
                      </text>
                    )}

                    {/* Alliance Tag if applicable (only shown on primary province to reduce clutter) */}
                    {alliance && !p.isSubdivision && (
                      <g transform={`translate(0, ${hasEmblem ? 22 : 18})`}>
                        <rect 
                          x={-((Math.max(alliance.name.length, 6) * 3.2) + 4)} 
                          y={-6} 
                          width={(Math.max(alliance.name.length, 6) * 6.4) + 8} 
                          height={11} 
                          rx={2} 
                          fill="#181512" 
                          fillOpacity={0.88} 
                          stroke={alliance.color} 
                          strokeWidth={0.8} 
                        />
                        <text
                          x={0}
                          y={2}
                          textAnchor="middle"
                          fontSize={6.5}
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          fill={alliance.color}
                        >
                          {layerSettings.nameLanguage === 'hanzi' && alliance.hanzi
                            ? alliance.hanzi
                            : alliance.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 10: CARTOGRAPHIC MOTIFS (COMPASS & IMPERIAL SEALS)
              ======================================================== */}
          {/* Compass Rose */}
          {layerSettings.showCompass && (
            <g transform="translate(1300, 140)" className="pointer-events-none select-none">
              <circle cx={0} cy={0} r={46} fill="none" stroke={mapMode === 'parchment' ? '#5a4632' : '#d97706'} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.6} />
              <circle cx={0} cy={0} r={38} fill="none" stroke={mapMode === 'parchment' ? '#5a4632' : '#d97706'} strokeWidth={1} opacity={0.8} />
              
              {/* Eight Directions Compass Star */}
              <path d="M 0 -36 L 6 -8 L 0 0 L -6 -8 Z" fill="#dc2626" />
              <path d="M 0 36 L 6 8 L 0 0 L -6 8 Z" fill="#9ca3af" />
              <path d="M 36 0 L 8 6 L 0 0 L 8 -6 Z" fill="#9ca3af" />
              <path d="M -36 0 L -8 6 L 0 0 L -8 -6 Z" fill="#9ca3af" />
              
              <circle cx={0} cy={0} r={4} fill="#f59e0b" stroke="#000000" strokeWidth={1} />
              
              {/* Cardinal Labels */}
              <text x={0} y={-42} textAnchor="middle" fontSize={11} fontWeight="black" fontFamily="serif" fill="#ef4444">
                {layerSettings.nameLanguage === 'hanzi' ? '北' : (layerSettings.nameLanguage === 'both' ? 'N · 北' : 'N')}
              </text>
              <text x={0} y={50} textAnchor="middle" fontSize={10} fontWeight="bold" fontFamily="serif" fill={mapMode === 'parchment' ? '#5a4632' : '#d97706'}>
                {layerSettings.nameLanguage === 'hanzi' ? '南' : (layerSettings.nameLanguage === 'both' ? 'S · 南' : 'S')}
              </text>
              <text x={44} y={4} textAnchor="middle" fontSize={10} fontWeight="bold" fontFamily="serif" fill={mapMode === 'parchment' ? '#5a4632' : '#d97706'}>
                {layerSettings.nameLanguage === 'hanzi' ? '東' : (layerSettings.nameLanguage === 'both' ? 'E · 東' : 'E')}
              </text>
              <text x={-44} y={4} textAnchor="middle" fontSize={10} fontWeight="bold" fontFamily="serif" fill={mapMode === 'parchment' ? '#5a4632' : '#d97706'}>
                {layerSettings.nameLanguage === 'hanzi' ? '西' : (layerSettings.nameLanguage === 'both' ? 'W · 西' : 'W')}
              </text>
            </g>
          )}

          {/* Imperial Vermilion Seals (Chops) */}
          {layerSettings.showImperialSeal && (
            <g transform="translate(100, 780)" className="pointer-events-none select-none opacity-85">
              {/* Primary Seal */}
              <g transform="translate(0, 0)">
                <rect x={0} y={0} width={56} height={56} rx={3} fill="#b91c1c" stroke="#7f1d1d" strokeWidth={2} />
                <rect x={3} y={3} width={50} height={50} fill="none" stroke="#fca5a5" strokeWidth={1} opacity={0.6} />
                <text x={28} y={23} textAnchor="middle" fontSize={14} fontWeight="black" fontFamily="serif" fill="#fef2f2">武林</text>
                <text x={28} y={43} textAnchor="middle" fontSize={14} fontWeight="black" fontFamily="serif" fill="#fef2f2">乾坤</text>
              </g>

              {/* Secondary Seal */}
              <g transform="translate(68, 8)">
                <rect x={0} y={0} width={40} height={40} rx={2} fill="#991b1b" stroke="#7f1d1d" strokeWidth={1.5} />
                <text x={20} y={17} textAnchor="middle" fontSize={11} fontWeight="bold" fontFamily="serif" fill="#fee2e2">萬里</text>
                <text x={20} y={32} textAnchor="middle" fontSize={11} fontWeight="bold" fontFamily="serif" fill="#fee2e2">江山</text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
