import React, { useState } from 'react';
import { 
  Download, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Edit3, 
  Check, 
  Paintbrush, 
  ShieldAlert, 
  PenTool, 
  Crosshair, 
  MapPin, 
  Search, 
  Eraser
} from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { ToolMode, MapMode } from '../types/murim';

export const MapHeader: React.FC = () => {
  const {
    mapTitle,
    mapSubtitle,
    era,
    setMapTitle,
    setMapSubtitle,
    setEra,
    activeTool,
    setActiveTool,
    setBrushTarget,
    mapMode,
    setMapMode,
    undo,
    redo,
    canUndo,
    canRedo,
    resetView,
    openExportModal
  } = useMurim();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(mapTitle);
  const [tempSubtitle, setTempSubtitle] = useState(mapSubtitle);
  const [tempEra, setTempEra] = useState(era);

  const handleSaveTitle = () => {
    setMapTitle(tempTitle || '武林乾坤全圖 · Great Murim Realm');
    setMapSubtitle(tempSubtitle);
    setEra(tempEra);
    setIsEditingTitle(false);
  };

  const tools: { id: ToolMode; label: string; icon: React.ComponentType<{ className?: string }>; target?: 'faction' | 'alliance' | 'unclaim' }[] = [
    { id: 'brush', label: 'Paint Sect', icon: Paintbrush, target: 'faction' },
    { id: 'alliance_pen', label: 'Alliance', icon: ShieldAlert, target: 'alliance' },
    { id: 'border_pen', label: 'Border', icon: PenTool },
    { id: 'line_drawer', label: 'Frontier Wall', icon: Crosshair },
    { id: 'landmark_placer', label: 'Add Landmark', icon: MapPin },
    { id: 'inspect', label: 'Inspect', icon: Search },
    { id: 'eraser', label: 'Eraser', icon: Eraser, target: 'unclaim' }
  ];

  const mapModes: { id: MapMode; label: string }[] = [
    { id: 'parchment', label: 'Parchment' },
    { id: 'political', label: 'Political' },
    { id: 'diplomatic', label: 'Diplomatic' },
    { id: 'terrain', label: 'Terrain' }
  ];

  return (
    <header className="bg-stone-950 border-b border-stone-800 text-stone-200 px-4 h-14 flex items-center justify-between select-none relative z-30 shrink-0">
      {/* Left: Emblem & Editable Title */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-8 h-8 rounded-md bg-amber-900/40 border border-amber-700/60 flex items-center justify-center text-amber-300 font-serif font-bold text-base shadow-sm">
          武
        </div>

        {isEditingTitle ? (
          <div className="flex items-center space-x-1.5 bg-stone-900 p-1 rounded border border-stone-700">
            <input
              type="text"
              value={tempTitle}
              onChange={e => setTempTitle(e.target.value)}
              className="bg-stone-950 border border-stone-700 px-2 py-0.5 text-xs text-amber-200 rounded font-serif w-36 focus:outline-none focus:border-amber-500"
              placeholder="Map Title"
              autoFocus
            />
            <input
              type="text"
              value={tempSubtitle}
              onChange={e => setTempSubtitle(e.target.value)}
              className="bg-stone-950 border border-stone-700 px-2 py-0.5 text-xs text-stone-300 rounded font-serif w-36 focus:outline-none focus:border-amber-500"
              placeholder="Subtitle"
            />
            <input
              type="text"
              value={tempEra}
              onChange={e => setTempEra(e.target.value)}
              className="bg-stone-950 border border-stone-700 px-2 py-0.5 text-[11px] text-amber-300 rounded w-24 focus:outline-none focus:border-amber-500"
              placeholder="Era / Year"
            />
            <button
              onClick={handleSaveTitle}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-xs font-semibold flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        ) : (
          <div 
            className="group cursor-pointer flex items-baseline space-x-2"
            onClick={() => setIsEditingTitle(true)}
            title="Click to rename map or change era"
          >
            <h1 className="font-serif font-semibold text-stone-100 text-sm tracking-wide flex items-center space-x-1.5 hover:text-amber-300 transition-colors">
              <span>{mapTitle}</span>
              <Edit3 className="w-3 h-3 text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-400 font-mono">
              {era}
            </span>
          </div>
        )}
      </div>

      {/* Center: Integrated Studio Toolbar (Segmented Button Group) */}
      <div className="flex items-center bg-stone-900/90 p-0.5 rounded-lg border border-stone-800 shadow-sm">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                if (tool.target) setBrushTarget(tool.target);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
              title={tool.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Map Style Selector, Undo/Redo, Export */}
      <div className="flex items-center space-x-2.5 shrink-0">
        {/* Map Mode Selector */}
        <div className="hidden xl:flex items-center bg-stone-900 p-0.5 rounded-lg border border-stone-800">
          {mapModes.map(m => (
            <button
              key={m.id}
              onClick={() => setMapMode(m.id)}
              className={`px-2 py-1 text-[11px] rounded font-serif transition-colors ${
                mapMode === m.id
                  ? 'bg-stone-800 text-amber-300 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-l border-stone-800 pl-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo 
                ? 'text-stone-300 hover:text-amber-300 hover:bg-stone-900' 
                : 'text-stone-700 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo 
                ? 'text-stone-300 hover:text-amber-300 hover:bg-stone-900' 
                : 'text-stone-700 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={resetView}
          className="p-1.5 rounded text-stone-400 hover:text-amber-300 hover:bg-stone-900 transition-colors"
          title="Reset View & Center on Realm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={openExportModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-600/70 text-stone-200 hover:text-amber-300 text-xs font-medium shadow-sm transition-all"
          title="Export high-resolution map image or project JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
