import React, { useRef, useState } from 'react';
import { 
  Swords, 
  Shield, 
  PenTool, 
  Layers, 
  Settings2, 
  Plus, 
  Trash2, 
  Edit3, 
  Paintbrush, 
  Download, 
  Upload, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  MapPin,
  Mountain,
  Crosshair,
  LucideIcon
} from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { 
  PROVINCE_METADATA, 
  PROVINCE_TO_GEOJSON_KEY, 
  CHINA_PROVINCE_DATA, 
  SUBPROVINCE_METADATA 
} from '../data/chinaProvinces';
import { projectCoordinates, MAP_WIDTH, MAP_HEIGHT } from '../utils/mapGeometry';

interface TabItem {
  id: 'factions' | 'alliances' | 'subprovinces' | 'landmarks' | 'borders' | 'layers' | 'project';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    factions,
    alliances,
    provinces,
    landmarks,
    layerSettings,
    setLayerSettings,
    subdividedRegions,
    toggleSubdividedRegion,
    setSubdividedRegions,
    paintProvince,
    selectedFactionId,
    openFactionModal,
    openAllianceModal,
    openLandmarkModal,
    deleteLandmark,
    openExportModal,
    openProvinceDrawer,
    deleteFaction,
    deleteAlliance,
    setSelectedFactionId,
    setSelectedAllianceId,
    activeTool,
    setActiveTool,
    setBrushTarget,
    setAllianceBorderOverProvince,
    setProvinceBorderOverride,
    clearAllOwnership,
    resetToCleanSlate,
    loadExampleTemplate,
    exportProjectJson,
    importProjectJson,
    setPan,
    zoom,
    setZoom
  } = useMurim();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState('');
  const [landmarkFilter, setLandmarkFilter] = useState('');
  const [landmarkTypeFilter, setLandmarkTypeFilter] = useState<string>('all');

  const tabs: TabItem[] = [
    { id: 'factions', label: 'Sects', icon: Swords, badge: factions.length },
    { id: 'alliances', label: 'Alliances', icon: Shield, badge: alliances.length },
    { id: 'subprovinces', label: 'Sub-regions', icon: Layers, badge: subdividedRegions.length },
    { id: 'landmarks', label: 'Landmarks', icon: MapPin, badge: (landmarks || []).length },
    { id: 'borders', label: 'Borders', icon: PenTool },
    { id: 'layers', label: 'Layers', icon: Settings2 },
    { id: 'project', label: 'Project', icon: Download }
  ];

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importProjectJson(content);
        if (success) {
          setUploadStatus('Project loaded successfully!');
          setTimeout(() => setUploadStatus(null), 3500);
        } else {
          setUploadStatus('Failed to parse project JSON file.');
          setTimeout(() => setUploadStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <aside className="w-84 bg-stone-950 border-r border-stone-800 text-stone-200 flex flex-col h-full select-none shadow-lg z-20 shrink-0">
      {/* Tab Navigation: Clean 2-Tier Segmented Layout */}
      <div className="border-b border-stone-800 bg-stone-900/90 p-1.5 space-y-1 shrink-0">
        {/* Row 1: Core Martial Entities */}
        <div className="grid grid-cols-4 gap-1">
          {tabs.slice(0, 4).map(tab => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id as any)}
                className={`py-1.5 px-1 rounded text-[11px] font-medium flex items-center justify-center space-x-1 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`text-[9px] px-1 rounded-full ${
                    isActive ? 'bg-amber-800 text-amber-200' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 2: Styling & Project Controls */}
        <div className="grid grid-cols-3 gap-1">
          {tabs.slice(4).map(tab => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id as any)}
                className={`py-1 px-1 rounded text-[11px] font-medium flex items-center justify-center space-x-1 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* ========================================================
            TAB 1: FACTIONS & SECTS (0 pre-added sects per prompt!)
            ======================================================== */}
        {activeSidebarTab === 'factions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-200">
                  Martial Arts Sects & Clans
                </h3>
                <p className="text-[11px] text-stone-400">
                  Add and paint your custom martial factions
                </p>
              </div>
              <button
                onClick={() => openFactionModal()}
                className="px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center space-x-1 shadow transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sect</span>
              </button>
            </div>

            {/* Empty State */}
            {factions.length === 0 ? (
              <div className="p-4 bg-stone-900/60 rounded-xl border border-dashed border-stone-800 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center mx-auto text-amber-500">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-stone-300">No Sects Created Yet</h4>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                    The Jianghu awaits your design. Click below to add your first custom sect, pick its colors, and claim territory!
                  </p>
                </div>
                <button
                  onClick={() => openFactionModal()}
                  className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-xs rounded-lg border border-amber-600/50 inline-flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Sect</span>
                </button>

                {/* Optional Template Helper (Only loaded if user explicitly clicks) */}
                <div className="pt-2 border-t border-stone-800/80">
                  <button
                    onClick={loadExampleTemplate}
                    className="text-[10px] text-stone-400 hover:text-amber-300 flex items-center justify-center space-x-1 mx-auto"
                    title="Loads classic Mount Hua, Shaolin, Wudang, Demonic Cult"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Need inspiration? Load Example Sects Template</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {factions.map(faction => {
                  const claimedCount = Object.values(provinces).filter(p => p.factionId === faction.id).length;
                  return (
                    <div
                      key={faction.id}
                      className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 hover:border-amber-800/60 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-stone-400 shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: faction.color }}
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-xs text-stone-100">
                                {faction.name}
                              </span>
                              {faction.hanzi && (
                                <span className="font-serif text-amber-400 text-xs font-semibold">
                                  ({faction.hanzi})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5 text-[10px] text-stone-400">
                              <span>{faction.alignment}</span>
                              {faction.hqProvinceId && <span>· HQ: {faction.hqProvinceId}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Faction Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedFactionId(faction.id);
                              setBrushTarget('faction');
                              setActiveTool('brush');
                            }}
                            className="p-1 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded transition-colors"
                            title="Paint Provinces with this Sect"
                          >
                            <Paintbrush className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openFactionModal(faction)}
                            className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
                            title="Edit Sect"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteFaction(faction.id)}
                            className="p-1 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded transition-colors"
                            title="Delete Sect"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Ledger stats & fast paint trigger */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[10px]">
                        <span className="text-stone-400">
                          Controlled Provinces: <strong className="text-amber-300">{claimedCount}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedFactionId(faction.id);
                            setBrushTarget('faction');
                            setActiveTool('brush');
                          }}
                          className="text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Select as Active Brush
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: ALLIANCES & TREATY BORDERS
            (Specifically for borders over Shaanxi, Murim Alliance, etc.)
            ======================================================== */}
        {activeSidebarTab === 'alliances' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-200">
                  Alliances & Borders
                </h3>
                <p className="text-[11px] text-stone-400">
                  Create alliance perimeter borders (e.g. over Shaanxi)
                </p>
              </div>
              <button
                onClick={() => openAllianceModal()}
                className="px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center space-x-1 shadow transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Alliance</span>
              </button>
            </div>

            {alliances.length === 0 ? (
              <div className="p-4 bg-stone-900/60 rounded-xl border border-dashed border-stone-800 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center mx-auto text-amber-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-stone-300">No Alliances Created Yet</h4>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                    Define alliances like the <strong className="text-amber-300">Murim Alliance</strong> and encircle provinces like Shaanxi or Henan with prominent alliance borders!
                  </p>
                </div>
                <button
                  onClick={() => openAllianceModal()}
                  className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-xs rounded-lg border border-amber-600/50 inline-flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Alliance & Border</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {alliances.map(alliance => {
                  const hasShaanxi = alliance.memberProvinces.includes('陕西');
                  return (
                    <div
                      key={alliance.id}
                      className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 hover:border-amber-800/60 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-stone-400 shadow-sm"
                            style={{ backgroundColor: alliance.color }}
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-xs text-stone-100">
                                {alliance.name}
                              </span>
                              {alliance.hanzi && (
                                <span className="font-serif text-amber-400 text-xs">
                                  ({alliance.hanzi})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-amber-400/80">
                              {alliance.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedAllianceId(alliance.id);
                              setBrushTarget('alliance');
                              setActiveTool('alliance_pen');
                            }}
                            className="p-1 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded"
                            title="Paint Alliance Borders"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openAllianceModal(alliance)}
                            className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded"
                            title="Edit Alliance"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAlliance(alliance.id)}
                            className="p-1 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded"
                            title="Delete Alliance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Border Style Indicator */}
                      <div className="p-1.5 bg-stone-950/80 rounded border border-stone-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-stone-400">Border Outline:</span>
                        <span className="font-mono text-amber-300 font-medium">
                          {alliance.strokeWidth}px · {alliance.strokeStyle} · {alliance.fillPattern}
                        </span>
                      </div>

                      {/* Encircle Shaanxi Quick Action */}
                      <div className="flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => setAllianceBorderOverProvince('陕西', hasShaanxi ? null : alliance.id)}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            hasShaanxi
                              ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                              : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {hasShaanxi ? '✓ Shaanxi Covered' : '+ Put Border Over Shaanxi'}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAllianceId(alliance.id);
                            setBrushTarget('alliance');
                            setActiveTool('alliance_pen');
                          }}
                          className="text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Paint on Map
                        </button>
                      </div>

                      {/* Member Provinces Chips */}
                      {alliance.memberProvinces.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {alliance.memberProvinces.map(pKey => (
                            <span 
                              key={pKey}
                              className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 border border-stone-700 text-[9px]"
                            >
                              {pKey}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: CUSTOM BORDERS (PROVINCE-LEVEL CUSTOMIZER)
            ======================================================== */}
        {activeSidebarTab === 'borders' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-amber-200">
                Specific Border Overrides
              </h3>
              <p className="text-[11px] text-stone-400">
                Customize individual province border thickness, color & style
              </p>
            </div>

            {/* Quick province selector to edit border */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <label className="block text-xs font-semibold text-stone-300">
                Choose Province to Customize Border:
              </label>
              <select
                onChange={e => {
                  if (e.target.value) openProvinceDrawer(e.target.value);
                }}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Select Province (e.g. Shaanxi) --</option>
                {Object.entries(PROVINCE_METADATA).map(([hanzi, m]) => (
                  <option key={hanzi} value={hanzi}>
                    {m.name} ({hanzi}) - {m.historicalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Border Overrides List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-400">Active Custom Borders:</span>
              {Object.entries(provinces).filter(([_, state]) => state.customBorder?.enabled).length === 0 ? (
                <p className="text-xs text-stone-500 italic p-2 bg-stone-900/40 rounded border border-stone-800/80">
                  No individual border overrides active yet. Select a province above or click any province with the Custom Border tool.
                </p>
              ) : (
                Object.entries(provinces)
                  .filter(([_, state]) => state.customBorder?.enabled)
                  .map(([pKey, state]) => {
                    const border = state.customBorder!;
                    return (
                      <div 
                        key={pKey}
                        className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3.5 h-3.5 rounded border border-stone-500"
                            style={{ backgroundColor: border.strokeColor }}
                          />
                          <div>
                            <span className="font-bold text-xs text-stone-200">{pKey}</span>
                            <div className="text-[10px] text-stone-400 font-mono">
                              {border.strokeWidth}px · {border.strokeStyle}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openProvinceDrawer(pKey)}
                            className="p-1 text-stone-400 hover:text-stone-200"
                            title="Edit Border"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProvinceBorderOverride(pKey, null)}
                            className="p-1 text-stone-400 hover:text-rose-400"
                            title="Remove Border Override"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LAYERS & DISPLAY SETTINGS
            ======================================================== */}
        {activeSidebarTab === 'layers' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <h3 className="font-serif font-bold text-sm text-amber-200">
                Cartographic Layers & Real Geography
              </h3>
              <p className="text-[11px] text-stone-400">
                Toggle accurate rivers, mountain peaks, passes, and calligraphy
              </p>
            </div>

            {/* Geography & Waterways */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-stone-300 block mb-1">Rivers & Waterways</span>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Accurate Rivers (Yangtze, Yellow River, etc.)</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showRivers}
                  onChange={e => setLayerSettings({ showRivers: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>River Calligraphy Labels</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showRiverLabels}
                  onChange={e => setLayerSettings({ showRiverLabels: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
            </div>

            {/* Mountains & Strategic Passes */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2.5">
              <span className="font-bold text-stone-300 block mb-1">Mountains & Strategic Passes</span>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Passes & Peaks Markers</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showMountains}
                  onChange={e => setLayerSettings({ showMountains: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Show Landmark Name Labels</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showMountainLabels}
                  onChange={e => setLayerSettings({ showMountainLabels: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Landmark Label Detail:</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['compact', 'full', 'hidden'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLayerSettings({ landmarkLabelStyle: style })}
                      className={`py-1 text-[11px] font-medium rounded border transition-colors ${
                        (layerSettings.landmarkLabelStyle || 'compact') === style
                          ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {style === 'compact' ? 'Compact' : style === 'full' ? 'Full Title' : 'Icons Only'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Province Labels & Language */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2.5">
              <span className="font-bold text-stone-300 block mb-1">Province & Prefecture Typography</span>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Show Province Names</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showProvinceNames}
                  onChange={e => setLayerSettings({ showProvinceNames: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>

              {/* Label Size / Density */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-stone-400">Map Label Density & Size:</label>
                  <span className="text-[10px] text-amber-400 font-mono capitalize">
                    {layerSettings.labelSize || 'small'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {(['tiny', 'small', 'medium', 'large', 'off'] as const).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setLayerSettings({ labelSize: sz })}
                      className={`py-1 text-[10px] font-semibold rounded border transition-colors ${
                        (layerSettings.labelSize || 'small') === sz
                          ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {sz === 'off' ? 'Hide All' : sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hide Subdivision Labels Toggle to clean cluttered areas */}
              <label className="flex items-center justify-between text-stone-300 cursor-pointer pt-1 border-t border-stone-800/80">
                <div>
                  <span className="block font-medium">Hide Sub-province Labels</span>
                  <span className="text-[10px] text-stone-500 block">Reduces clutter when regions are subdivided</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!layerSettings.hideSubdivisionLabels}
                  onChange={e => setLayerSettings({ hideSubdivisionLabels: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Name Language Format:</label>
                <select
                  value={layerSettings.nameLanguage}
                  onChange={e => setLayerSettings({ nameLanguage: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200"
                >
                  <option value="both">Both (Shaanxi · 陕西)</option>
                  <option value="english">English (Shaanxi)</option>
                  <option value="hanzi">Chinese Hanzi (陕西)</option>
                  <option value="historical">Historical Murim (Guanzhong)</option>
                </select>
              </div>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer pt-1">
                <span>Faction Shield Emblems</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showFactionEmblems}
                  onChange={e => setLayerSettings({ showFactionEmblems: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
            </div>

            {/* Alliance & Border Overlays */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-stone-300 block mb-1">Alliance & Frontier Displays</span>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Alliance Boundary Outlines</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showAllianceBorders}
                  onChange={e => setLayerSettings({ showAllianceBorders: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Alliance Hatched Interior</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showAllianceHatch}
                  onChange={e => setLayerSettings({ showAllianceHatch: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Frontier Lines & Barrier Walls</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showFrontierLines}
                  onChange={e => setLayerSettings({ showFrontierLines: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
            </div>

            {/* Cartographic Decorations */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-stone-300 block mb-1">Cartographic Motifs</span>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Imperial Vermilion Seals</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showImperialSeal}
                  onChange={e => setLayerSettings({ showImperialSeal: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Antique Compass Rose</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showCompass}
                  onChange={e => setLayerSettings({ showCompass: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-stone-300 cursor-pointer">
                <span>Latitude & Longitude Graticule</span>
                <input
                  type="checkbox"
                  checked={layerSettings.showGraticule}
                  onChange={e => setLayerSettings({ showGraticule: e.target.checked })}
                  className="accent-amber-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: REGION SUBDIVISIONS (PREFECTURES & COMMANDERIES)
            ======================================================== */}
        {activeSidebarTab === 'subprovinces' && (
          <div className="space-y-3.5">
            <div>
              <h3 className="font-serif font-bold text-sm text-amber-200">
                Region Subdivisions
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Subdivide large provinces into prefecture-level commanderies and cities to place multiple sects in the same region.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="text-[11px] font-semibold text-stone-300 block">
                Quick Subdivision Presets:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const core = ['河南', '陕西', '四川', '湖北', '山东', '山西', '河北', '江苏', '浙江', '安徽'];
                    setSubdividedRegions(core);
                  }}
                  className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded border border-amber-600/40 text-xs text-left font-medium flex items-center justify-between"
                >
                  <span>Central Plains Core (10 Regions)</span>
                  <span className="text-[10px] text-amber-400/70 font-mono">Henan, Shaanxi, etc.</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const allKeys = Object.keys(PROVINCE_TO_GEOJSON_KEY);
                    setSubdividedRegions(allKeys);
                  }}
                  className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-xs text-left font-medium flex items-center justify-between"
                >
                  <span>Subdivide All Supported Regions</span>
                  <span className="text-[10px] text-stone-400 font-mono">Full Granularity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubdividedRegions([])}
                  className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded border border-stone-800 text-xs text-left"
                >
                  Reset to Whole Provinces Only
                </button>
              </div>
            </div>

            {/* Status & Search */}
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>
                Active Subdivisions: <strong className="text-amber-300">{subdividedRegions.length}</strong> regions
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value)}
                placeholder="Filter provinces (e.g. Henan, Shaanxi, Sichuan)..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-600/60"
              />
            </div>

            {/* Province List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {Object.keys(PROVINCE_TO_GEOJSON_KEY)
                .filter(pKey => {
                  const meta = PROVINCE_METADATA[pKey];
                  const q = regionFilter.toLowerCase();
                  if (!q) return true;
                  return (
                    pKey.includes(q) ||
                    (meta?.name && meta.name.toLowerCase().includes(q)) ||
                    (meta?.historicalName && meta.historicalName.toLowerCase().includes(q))
                  );
                })
                .map(pKey => {
                  const isSubdivided = subdividedRegions.includes(pKey);
                  const meta = PROVINCE_METADATA[pKey];
                  const geoKey = PROVINCE_TO_GEOJSON_KEY[pKey];
                  const geo = CHINA_PROVINCE_DATA[geoKey];
                  const subCount = geo?.features?.length || 0;
                  const isExpanded = expandedRegion === pKey;

                  return (
                    <div
                      key={pKey}
                      className={`rounded-lg border transition-colors ${
                        isSubdivided
                          ? 'bg-stone-900/90 border-amber-800/60'
                          : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
                      }`}
                    >
                      <div className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setExpandedRegion(isExpanded ? null : pKey)}
                            className="p-0.5 text-stone-400 hover:text-stone-200"
                            title={isExpanded ? 'Collapse' : 'View prefectures'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-serif font-bold text-xs text-stone-200">
                                {pKey}
                              </span>
                              <span className="text-[11px] text-stone-400">
                                {meta?.name || pKey}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500">
                              {subCount} prefectures / commanderies
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSubdividedRegion(pKey)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                            isSubdivided
                              ? 'bg-amber-600 text-stone-950 shadow-sm'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {isSubdivided ? 'Subdivided' : 'Subdivide'}
                        </button>
                      </div>

                      {/* Expanded Sub-provinces / Prefectures list */}
                      {isExpanded && (
                        <div className="p-2.5 pt-0 border-t border-stone-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1.5">
                            <span>Prefectures in {meta?.name || pKey}:</span>
                            {selectedFactionId && (
                              <span className="text-amber-400 font-mono">
                                Active Brush Ready
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
                            {geo?.features?.map((f: any, idx: number) => {
                              const subName = f.properties?.name || `Area ${idx + 1}`;
                              const subMeta = SUBPROVINCE_METADATA[subName];
                              const subState = provinces[subName] || {};
                              const subFaction = factions.find(fc => fc.id === subState.factionId);

                              return (
                                <div
                                  key={idx}
                                  className="px-2 py-1 bg-stone-950/70 rounded border border-stone-800/80 flex items-center justify-between text-xs hover:border-amber-700/50"
                                >
                                  <div className="flex items-center space-x-1.5 truncate mr-2">
                                    <span className="font-serif text-stone-300">
                                      {subName}
                                    </span>
                                    {subMeta && (
                                      <span className="text-[10px] text-stone-500 truncate">
                                        ({subMeta.name})
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center space-x-1 shrink-0">
                                    {subFaction ? (
                                      <span
                                        className="text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center space-x-1"
                                        style={{ 
                                          backgroundColor: `${subFaction.color}22`,
                                          color: subFaction.color,
                                          border: `1px solid ${subFaction.color}55`
                                        }}
                                      >
                                        <span 
                                          className="w-1.5 h-1.5 rounded-full inline-block"
                                          style={{ backgroundColor: subFaction.color }}
                                        />
                                        <span>{subFaction.name}</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-stone-500 italic">
                                        Neutral
                                      </span>
                                    )}

                                    {selectedFactionId && isSubdivided && (
                                      <button
                                        type="button"
                                        onClick={() => paintProvince(subName, selectedFactionId)}
                                        className="p-1 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded"
                                        title={`Assign to active sect`}
                                      >
                                        <Paintbrush className="w-3 h-3" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => openProvinceDrawer(subName)}
                                      className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded"
                                      title="Inspect & edit prefecture"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: STRATEGIC PASSES & LANDMARKS
            ======================================================== */}
        {activeSidebarTab === 'landmarks' && (
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-200">
                  Strategic Passes & Landmarks
                </h3>
                <p className="text-[11px] text-stone-400">
                  Rename, reposition, add or delete iconic passes & peaks
                </p>
              </div>
              <button
                type="button"
                onClick={() => openLandmarkModal()}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg flex items-center space-x-1 shadow transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Action Banner */}
            <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center justify-between">
              <span className="text-stone-300 text-[11px]">
                Want to place a pass directly?
              </span>
              <button
                type="button"
                onClick={() => setActiveTool('landmark_placer')}
                className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all border ${
                  activeTool === 'landmark_placer'
                    ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold'
                    : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                <Crosshair className="w-3 h-3 text-amber-400" />
                <span>{activeTool === 'landmark_placer' ? 'Click Map to Place' : 'Place on Map'}</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'pass', label: 'Passes' },
                { id: 'sacred_peak', label: 'Peaks' },
                { id: 'sect_site', label: 'Sects' },
                { id: 'fortress', label: 'Forts' },
                { id: 'ancient_city', label: 'Cities' },
                { id: 'water_gate', label: 'Water' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setLandmarkTypeFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                    landmarkTypeFilter === cat.id
                      ? 'bg-amber-700/40 text-amber-200 border-amber-600/70 font-semibold'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={landmarkFilter}
                onChange={e => setLandmarkFilter(e.target.value)}
                placeholder="Search landmarks (e.g. Shanhaiguan, Song, Hua)..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-600/60"
              />
            </div>

            {/* Landmarks List */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {(landmarks || [])
                .filter(lm => {
                  if (landmarkTypeFilter !== 'all' && lm.type !== landmarkTypeFilter) return false;
                  if (!landmarkFilter.trim()) return true;
                  const q = landmarkFilter.toLowerCase();
                  return (
                    lm.name.toLowerCase().includes(q) ||
                    (lm.hanzi && lm.hanzi.toLowerCase().includes(q)) ||
                    (lm.province && lm.province.toLowerCase().includes(q)) ||
                    (lm.elevation && lm.elevation.toLowerCase().includes(q))
                  );
                })
                .map(lm => {
                  return (
                    <div
                      key={lm.id}
                      className="p-2.5 bg-stone-900/60 hover:bg-stone-900 border border-stone-800/80 hover:border-stone-700 rounded-lg flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                        <div className="mt-0.5 p-1 rounded bg-stone-950 border border-stone-800 text-amber-400 shrink-0">
                          {lm.type === 'sacred_peak' ? (
                            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-serif font-bold text-stone-100 text-xs truncate">
                              {lm.name}
                            </span>
                            {lm.hanzi && (
                              <span className="font-serif text-[11px] text-amber-300/80 shrink-0">
                                {lm.hanzi}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-stone-400 mt-0.5">
                            {lm.province && (
                              <span className="text-stone-300">{lm.province}</span>
                            )}
                            {lm.elevation && (
                              <span className="text-stone-500 font-mono">({lm.elevation})</span>
                            )}
                            <span className="text-stone-500 font-mono text-[9px]">
                              {lm.coordinates[0].toFixed(1)}°E, {lm.coordinates[1].toFixed(1)}°N
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {/* Focus on map */}
                        <button
                          type="button"
                          onClick={() => {
                            const projected = projectCoordinates(lm.coordinates);
                            if (projected) {
                              const [x, y] = projected;
                              const targetZoom = Math.max(zoom, 1.8);
                              setZoom(targetZoom);
                              setPan({
                                x: (MAP_WIDTH / 2) - (x * targetZoom),
                                y: (MAP_HEIGHT / 2) - (y * targetZoom)
                              });
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded transition-colors"
                          title="Focus landmark on map"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit / Rename */}
                        <button
                          type="button"
                          onClick={() => openLandmarkModal(lm)}
                          className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
                          title="Rename / Edit landmark"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete landmark "${lm.name}"?`)) {
                              deleteLandmark(lm.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-stone-800 rounded transition-colors"
                          title="Delete landmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {(landmarks || []).length === 0 && (
                <div className="text-center py-6 border border-dashed border-stone-800 rounded-lg text-stone-500">
                  <p>No landmarks placed yet.</p>
                  <button
                    type="button"
                    onClick={() => openLandmarkModal()}
                    className="mt-2 text-xs text-amber-400 hover:underline"
                  >
                    + Add your first strategic pass
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: PROJECT & EXPORT (SAVE NATION-LIKE IMAGES)
            ======================================================== */}
        {activeSidebarTab === 'project' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <h3 className="font-serif font-bold text-sm text-amber-200">
                Project & Image Studio
              </h3>
              <p className="text-[11px] text-stone-400">
                Export nation-like maps, save project files, and backup
              </p>
            </div>

            {/* Export Image */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-stone-300 block">Export Image (PNG / JPG)</span>
              <p className="text-[11px] text-stone-400">
                Export crisp nation-like maps showing painted territories and alliance borders at up to 4K resolution.
              </p>
              <button
                type="button"
                onClick={openExportModal}
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-lg shadow flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Open Image Exporter</span>
              </button>
            </div>

            {/* Save & Load JSON */}
            <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-stone-300 block">Project Backup (.murim.json)</span>
              <p className="text-[11px] text-stone-400">
                Save your factions, alliances, painted borders, and lore to reload anytime.
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const json = exportProjectJson();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.download = `murim_map_save.murim.json`;
                    a.href = url;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 flex items-center justify-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Load Save</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.murim.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadStatus && (
                <div className="p-2 rounded bg-amber-950/70 border border-amber-600/50 text-amber-200 text-center font-medium animate-in fade-in">
                  {uploadStatus}
                </div>
              )}
            </div>

            {/* Clear / Reset */}
            <div className="p-3 bg-stone-900/60 rounded-lg border border-stone-800 space-y-2">
              <span className="font-bold text-rose-300 block">Clear & Reset Options</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear all painted provinces and alliance borders?')) {
                      clearAllOwnership();
                    }
                  }}
                  className="flex-1 py-1.5 bg-stone-900 hover:bg-rose-950/60 text-stone-300 hover:text-rose-200 rounded-lg border border-stone-800 text-[11px]"
                >
                  Clear Painted Map
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset to completely empty clean slate? All custom sects and alliances will be deleted.')) {
                      resetToCleanSlate();
                    }
                  }}
                  className="flex-1 py-1.5 bg-rose-950/40 hover:bg-rose-950 text-rose-300 rounded-lg border border-rose-900/60 text-[11px]"
                >
                  Reset All to Empty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
