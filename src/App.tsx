import React, { useRef, useState, useEffect } from 'react';
import { MurimProvider, useMurim } from './context/MurimContext';
import { MapHeader } from './components/MapHeader';
import { ContextBar } from './components/ContextBar';
import { MurimMapCanvas } from './components/MurimMapCanvas';
import { Minimap } from './components/Minimap';
import { Sidebar } from './components/Sidebar';
import { ProvinceDrawer } from './components/ProvinceDrawer';
import { FactionModal } from './components/FactionModal';
import { AllianceModal } from './components/AllianceModal';
import { LandmarkModal } from './components/LandmarkModal';
import { ExportModal } from './components/ExportModal';
import { ResetModal } from './components/ResetModal';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Map as MapIcon
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    zoom,
    setZoom,
    resetView,
    setActiveTool,
    setBrushTarget,
    undo,
    redo,
    closeFactionModal,
    closeAllianceModal,
    closeProvinceDrawer,
    closeResetModal
  } = useMurim();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === 'b') {
        setActiveTool('brush');
        setBrushTarget('faction');
      } else if (e.key.toLowerCase() === 'a') {
        setActiveTool('alliance_pen');
        setBrushTarget('alliance');
      } else if (e.key.toLowerCase() === 'e') {
        setActiveTool('eraser');
        setBrushTarget('unclaim');
      } else if (e.key.toLowerCase() === 'i') {
        setActiveTool('inspect');
      } else if (e.key === 'Escape') {
        closeFactionModal();
        closeAllianceModal();
        closeProvinceDrawer();
        closeResetModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setActiveTool, setBrushTarget, closeFactionModal, closeAllianceModal, closeProvinceDrawer, closeResetModal]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* Top Header */}
      <MapHeader />

      {/* Context Action Ribbon */}
      <ContextBar />

      {/* Main Workspace: Sidebar + Interactive Canvas */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Studio Sidebar (Collapsible) */}
        {isSidebarOpen && <Sidebar />}

        {/* Sidebar Toggle Handle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-30 p-1 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 rounded-r shadow-md transition-all"
          style={{ left: isSidebarOpen ? '336px' : '0px' }}
          title={isSidebarOpen ? "Collapse Sidebar" : "Open Studio Sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-stone-950">
          {/* Core Interactive Map Canvas */}
          <MurimMapCanvas svgRef={svgRef} />

          {/* Minimap (Bottom Right) */}
          {showMinimap && <Minimap />}

          {/* Clean Floating Bottom Dock: Zoom Controls & Minimap Toggle */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1 bg-stone-950/90 border border-stone-800 rounded-lg p-1 shadow-lg backdrop-blur-md text-xs">
            <button
              onClick={() => setZoom(prev => Math.min(prev * 1.25, 5))}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev * 0.8, 0.6))}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded"
              title="Reset Zoom & Center Realm"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-stone-300 px-1.5 font-medium border-l border-stone-800">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={`p-1.5 rounded transition-colors border-l border-stone-800 ${
                showMinimap ? 'text-amber-300 bg-stone-800' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'
              }`}
              title={showMinimap ? "Hide Minimap" : "Show Minimap"}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* Right Province Detail Inspector Drawer */}
        <ProvinceDrawer />
      </div>

      {/* Modals */}
      <FactionModal />
      <AllianceModal />
      <LandmarkModal />
      <ExportModal svgRef={svgRef} />
      <ResetModal />
    </div>
  );
};

export default function App() {
  return (
    <MurimProvider>
      <MainLayout />
    </MurimProvider>
  );
}
