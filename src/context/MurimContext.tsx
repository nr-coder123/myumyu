import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Faction, 
  Alliance, 
  ProvinceState, 
  ProvinceBorderOverride, 
  FrontierLine, 
  CustomPin, 
  MapMode, 
  ToolMode, 
  LayerSettings,
  MurimMapProject,
  LandmarkFeature
} from '../types/murim';
import { SACRED_PEAKS_AND_PASSES } from '../data/chinaGeography';

const STORAGE_KEY = 'murim_world_map_project_v1';

const DEFAULT_LAYER_SETTINGS: LayerSettings = {
  showRivers: true,
  showRiverLabels: true,
  showMountains: true,
  showMountainLabels: true,
  landmarkLabelStyle: 'compact',
  showProvinceNames: true,
  labelSize: 'small',
  nameLanguage: 'both',
  hideSubdivisionLabels: false,
  showAllianceBorders: true,
  showAllianceHatch: true,
  showFrontierLines: true,
  showFactionEmblems: true,
  showCompass: true,
  showImperialSeal: true,
  showGraticule: false,
  showTerrainShading: true,
  provinceBorderWidth: 1.5,
  provinceBorderOpacity: 0.85
};

interface HistorySnapshot {
  provinces: Record<string, ProvinceState>;
  subdividedRegions: string[];
  factions: Faction[];
  alliances: Alliance[];
  frontierLines: FrontierLine[];
  landmarks: LandmarkFeature[];
  customPins: CustomPin[];
}

interface MurimContextType {
  // Data
  factions: Faction[];
  alliances: Alliance[];
  provinces: Record<string, ProvinceState>;
  subdividedRegions: string[];
  frontierLines: FrontierLine[];
  landmarks: LandmarkFeature[];
  customPins: CustomPin[];
  layerSettings: LayerSettings;
  mapMode: MapMode;
  mapTitle: string;
  mapSubtitle: string;
  era: string;

  // Active Tool & Selection
  activeTool: ToolMode;
  brushTarget: 'faction' | 'alliance' | 'unclaim';
  selectedFactionId: string | null;
  selectedAllianceId: string | null;
  selectedProvinceKey: string | null;

  // Viewport Transform
  zoom: number;
  pan: { x: number; y: number };
  setZoom: (z: number | ((prev: number) => number)) => void;
  setPan: (p: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetView: () => void;

  // Modals & Panels
  isFactionModalOpen: boolean;
  editingFaction: Faction | null;
  isAllianceModalOpen: boolean;
  editingAlliance: Alliance | null;
  isLandmarkModalOpen: boolean;
  editingLandmark: LandmarkFeature | null;
  landmarkModalCoords: [number, number] | null;
  isExportModalOpen: boolean;
  isProvinceDrawerOpen: boolean;
  activeSidebarTab: 'factions' | 'alliances' | 'subprovinces' | 'landmarks' | 'borders' | 'layers' | 'project';

  // Actions
  setActiveTool: (tool: ToolMode) => void;
  setBrushTarget: (target: 'faction' | 'alliance' | 'unclaim') => void;
  setSelectedFactionId: (id: string | null) => void;
  setSelectedAllianceId: (id: string | null) => void;
  setSelectedProvinceKey: (key: string | null) => void;
  setMapMode: (mode: MapMode) => void;
  toggleSubdividedRegion: (regionKey: string) => void;
  setSubdividedRegions: (regions: string[]) => void;
  setLayerSettings: (settings: Partial<LayerSettings>) => void;
  setMapTitle: (title: string) => void;
  setMapSubtitle: (sub: string) => void;
  setEra: (era: string) => void;
  setActiveSidebarTab: (tab: 'factions' | 'alliances' | 'subprovinces' | 'landmarks' | 'borders' | 'layers' | 'project') => void;

  // Modal Openers
  openFactionModal: (faction?: Faction | null) => void;
  closeFactionModal: () => void;
  openAllianceModal: (alliance?: Alliance | null) => void;
  closeAllianceModal: () => void;
  openLandmarkModal: (landmark?: LandmarkFeature | null, coords?: [number, number]) => void;
  closeLandmarkModal: () => void;
  saveLandmark: (landmark: Omit<LandmarkFeature, 'id'> & { id?: string }) => void;
  deleteLandmark: (id: string) => void;
  resetLandmarksToDefault: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  openProvinceDrawer: (key?: string) => void;
  closeProvinceDrawer: () => void;

  // Painting & Border Editing
  paintProvince: (provinceKey: string, targetFactionId?: string | null) => void;
  massPaintProvinces: (keys: string[], factionId?: string | null, allianceId?: string | null) => void;
  setAllianceBorderOverProvince: (provinceKey: string, allianceId: string | null) => void;
  setProvinceBorderOverride: (provinceKey: string, override: ProvinceBorderOverride | null) => void;
  updateProvinceState: (provinceKey: string, update: Partial<ProvinceState>) => void;
  clearProvince: (provinceKey: string) => void;
  clearAllOwnership: () => void;

  // CRUD for Factions
  saveFaction: (factionData: Omit<Faction, 'id' | 'createdAt'> & { id?: string }) => void;
  deleteFaction: (id: string) => void;

  // CRUD for Alliances
  saveAlliance: (allianceData: Omit<Alliance, 'id' | 'createdAt'> & { id?: string }) => void;
  deleteAlliance: (id: string) => void;
  toggleProvinceInAlliance: (allianceId: string, provinceKey: string) => void;

  // Frontiers & Pins
  addFrontierLine: (line: FrontierLine) => void;
  deleteFrontierLine: (id: string) => void;
  addPin: (pin: CustomPin) => void;
  deletePin: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Export / Import
  exportProjectJson: () => string;
  importProjectJson: (json: string) => boolean;
  resetToCleanSlate: () => void;
  loadExampleTemplate: () => void;
}

const MurimContext = createContext<MurimContextType | null>(null);

export const MurimProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultLandmarks = useRef<LandmarkFeature[]>(
    SACRED_PEAKS_AND_PASSES.map(p => ({
      id: p.id,
      name: p.name,
      hanzi: p.hanzi,
      type: p.type as any,
      coordinates: p.coordinates,
      elevation: p.elevation,
      province: p.province,
      description: p.description
    }))
  ).current;

  // IMPORTANT: factions start as an EMPTY array! No sects pre-added per instructions.
  const [factions, setFactions] = useState<Faction[]>([]);
  // alliances start empty!
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [provinces, setProvinces] = useState<Record<string, ProvinceState>>({});
  const [subdividedRegions, setSubdividedRegionsState] = useState<string[]>(['河南', '陕西', '四川', '湖北']);
  const [frontierLines, setFrontierLines] = useState<FrontierLine[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkFeature[]>(defaultLandmarks);
  const [customPins, setCustomPins] = useState<CustomPin[]>([]);

  const [layerSettings, setLayerSettingsState] = useState<LayerSettings>(DEFAULT_LAYER_SETTINGS);
  const [mapMode, setMapMode] = useState<MapMode>('parchment');
  const [mapTitle, setMapTitle] = useState<string>('武林乾坤全圖 · Great Murim Realm');
  const [mapSubtitle, setMapSubtitle] = useState<string>('Provinces, Major Rivers & Martial Borders of the Central Plains');
  const [era, setEra] = useState<string>('Jianwen Era · Murim Calendar 428');

  // Tool State
  const [activeTool, setActiveTool] = useState<ToolMode>('brush');
  const [brushTarget, setBrushTarget] = useState<'faction' | 'alliance' | 'unclaim'>('faction');
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(null);
  const [selectedProvinceKey, setSelectedProvinceKey] = useState<string | null>(null);

  // Viewport Transform
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Modals & Panels
  const [isFactionModalOpen, setIsFactionModalOpen] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [isAllianceModalOpen, setIsAllianceModalOpen] = useState(false);
  const [editingAlliance, setEditingAlliance] = useState<Alliance | null>(null);
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<LandmarkFeature | null>(null);
  const [landmarkModalCoords, setLandmarkModalCoords] = useState<[number, number] | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProvinceDrawerOpen, setIsProvinceDrawerOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'factions' | 'alliances' | 'subprovinces' | 'landmarks' | 'borders' | 'layers' | 'project'>('factions');

  // Undo / Redo
  const [historyPast, setHistoryPast] = useState<HistorySnapshot[]>([]);
  const [historyFuture, setHistoryFuture] = useState<HistorySnapshot[]>([]);

  // Prevent snapshot loop during undo/redo
  const isHistoryActionRef = useRef(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as MurimMapProject;
        if (parsed && parsed.version) {
          if (Array.isArray(parsed.factions)) setFactions(parsed.factions);
          if (Array.isArray(parsed.alliances)) setAlliances(parsed.alliances);
          if (parsed.provinces) setProvinces(parsed.provinces);
          if (Array.isArray(parsed.subdividedRegions)) setSubdividedRegionsState(parsed.subdividedRegions);
          if (Array.isArray(parsed.frontierLines)) setFrontierLines(parsed.frontierLines);
          if (Array.isArray(parsed.landmarks)) setLandmarks(parsed.landmarks);
          if (Array.isArray(parsed.customPins)) setCustomPins(parsed.customPins);
          if (parsed.layerSettings) setLayerSettingsState({ ...DEFAULT_LAYER_SETTINGS, ...parsed.layerSettings });
          if (parsed.mapMode) setMapMode('parchment');
          if (parsed.title) setMapTitle(parsed.title);
          if (parsed.subtitle) setMapSubtitle(parsed.subtitle);
          if (parsed.era) setEra(parsed.era);
        }
      }
    } catch (e) {
      console.warn('Could not load saved project from localStorage:', e);
    }
  }, []);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      const projectData: MurimMapProject = {
        version: 1,
        title: mapTitle,
        subtitle: mapSubtitle,
        era,
        subdividedRegions,
        provinces,
        factions,
        alliances,
        frontierLines,
        landmarks,
        customPins,
        layerSettings,
        mapMode: 'parchment',
        updatedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
    } catch (e) {
      console.warn('Auto-save error:', e);
    }
  }, [mapTitle, mapSubtitle, era, subdividedRegions, provinces, factions, alliances, frontierLines, landmarks, customPins, layerSettings]);

  // Record History Snapshot
  const pushSnapshot = useCallback(() => {
    if (isHistoryActionRef.current) return;
    const snap: HistorySnapshot = {
      provinces: JSON.parse(JSON.stringify(provinces)),
      subdividedRegions: [...subdividedRegions],
      factions: JSON.parse(JSON.stringify(factions)),
      alliances: JSON.parse(JSON.stringify(alliances)),
      frontierLines: JSON.parse(JSON.stringify(frontierLines)),
      landmarks: JSON.parse(JSON.stringify(landmarks)),
      customPins: JSON.parse(JSON.stringify(customPins))
    };
    setHistoryPast(prev => [...prev.slice(-25), snap]);
    setHistoryFuture([]);
  }, [provinces, subdividedRegions, factions, alliances, frontierLines, landmarks, customPins]);

  const undo = useCallback(() => {
    if (historyPast.length === 0) return;
    isHistoryActionRef.current = true;
    const prevSnap = historyPast[historyPast.length - 1];
    const currentSnap: HistorySnapshot = {
      provinces: JSON.parse(JSON.stringify(provinces)),
      subdividedRegions: JSON.parse(JSON.stringify(subdividedRegions)),
      factions: JSON.parse(JSON.stringify(factions)),
      alliances: JSON.parse(JSON.stringify(alliances)),
      frontierLines: JSON.parse(JSON.stringify(frontierLines)),
      landmarks: JSON.parse(JSON.stringify(landmarks)),
      customPins: JSON.parse(JSON.stringify(customPins))
    };
    setHistoryFuture(fut => [currentSnap, ...fut]);
    setHistoryPast(prev => prev.slice(0, prev.length - 1));

    setProvinces(prevSnap.provinces);
    if (prevSnap.subdividedRegions) setSubdividedRegionsState(prevSnap.subdividedRegions);
    setFactions(prevSnap.factions);
    setAlliances(prevSnap.alliances);
    setFrontierLines(prevSnap.frontierLines);
    if (prevSnap.landmarks) setLandmarks(prevSnap.landmarks);
    setCustomPins(prevSnap.customPins);

    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 50);
  }, [historyPast, provinces, subdividedRegions, factions, alliances, frontierLines, landmarks, customPins]);

  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;
    isHistoryActionRef.current = true;
    const nextSnap = historyFuture[0];
    const currentSnap: HistorySnapshot = {
      provinces: JSON.parse(JSON.stringify(provinces)),
      subdividedRegions: [...subdividedRegions],
      factions: JSON.parse(JSON.stringify(factions)),
      alliances: JSON.parse(JSON.stringify(alliances)),
      frontierLines: JSON.parse(JSON.stringify(frontierLines)),
      landmarks: JSON.parse(JSON.stringify(landmarks)),
      customPins: JSON.parse(JSON.stringify(customPins))
    };
    setHistoryPast(prev => [...prev, currentSnap]);
    setHistoryFuture(fut => fut.slice(1));

    setProvinces(nextSnap.provinces);
    if (nextSnap.subdividedRegions) setSubdividedRegionsState(nextSnap.subdividedRegions);
    setFactions(nextSnap.factions);
    setAlliances(nextSnap.alliances);
    setFrontierLines(nextSnap.frontierLines);
    if (nextSnap.landmarks) setLandmarks(nextSnap.landmarks);
    setCustomPins(nextSnap.customPins);

    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 50);
  }, [historyFuture, provinces, subdividedRegions, factions, alliances, frontierLines, landmarks, customPins]);

  const toggleSubdividedRegion = useCallback((regionKey: string) => {
    pushSnapshot();
    setSubdividedRegionsState(prev => {
      if (prev.includes(regionKey)) {
        return prev.filter(k => k !== regionKey);
      } else {
        return [...prev, regionKey];
      }
    });
  }, [pushSnapshot]);

  const setSubdividedRegions = useCallback((regions: string[]) => {
    pushSnapshot();
    setSubdividedRegionsState(regions);
  }, [pushSnapshot]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const setLayerSettings = useCallback((settings: Partial<LayerSettings>) => {
    setLayerSettingsState(prev => ({ ...prev, ...settings }));
  }, []);

  // Painting Logic
  const paintProvince = useCallback((provinceKey: string, targetFactionId?: string | null) => {
    pushSnapshot();
    setProvinces(prev => {
      const current = prev[provinceKey] || {};
      if (targetFactionId !== undefined) {
        return {
          ...prev,
          [provinceKey]: {
            ...current,
            factionId: targetFactionId
          }
        };
      }
      if (brushTarget === 'unclaim') {
        return {
          ...prev,
          [provinceKey]: {
            ...current,
            factionId: null,
            allianceId: null
          }
        };
      }
      if (brushTarget === 'faction') {
        return {
          ...prev,
          [provinceKey]: {
            ...current,
            factionId: selectedFactionId
          }
        };
      }
      if (brushTarget === 'alliance') {
        return {
          ...prev,
          [provinceKey]: {
            ...current,
            allianceId: selectedAllianceId
          }
        };
      }
      return prev;
    });

    // Also update alliance member list if painting alliance
    if (targetFactionId === undefined && brushTarget === 'alliance' && selectedAllianceId) {
      setAlliances(prevAlliances => 
        prevAlliances.map(a => {
          if (a.id === selectedAllianceId) {
            if (!a.memberProvinces.includes(provinceKey)) {
              return { ...a, memberProvinces: [...a.memberProvinces, provinceKey] };
            }
          }
          return a;
        })
      );
    }
  }, [brushTarget, selectedFactionId, selectedAllianceId, pushSnapshot]);

  const massPaintProvinces = useCallback((keys: string[], factionId?: string | null, allianceId?: string | null) => {
    pushSnapshot();
    setProvinces(prev => {
      const next = { ...prev };
      keys.forEach(k => {
        const cur = next[k] || {};
        next[k] = {
          ...cur,
          ...(factionId !== undefined ? { factionId } : {}),
          ...(allianceId !== undefined ? { allianceId } : {})
        };
      });
      return next;
    });
  }, [pushSnapshot]);

  // Specifically apply an Alliance Border over a province (e.g. Shaanxi)
  const setAllianceBorderOverProvince = useCallback((provinceKey: string, allianceId: string | null) => {
    pushSnapshot();
    setProvinces(prev => {
      const cur = prev[provinceKey] || {};
      return {
        ...prev,
        [provinceKey]: {
          ...cur,
          allianceId
        }
      };
    });

    if (allianceId) {
      setAlliances(prev => 
        prev.map(a => {
          if (a.id === allianceId) {
            return {
              ...a,
              memberProvinces: Array.from(new Set([...a.memberProvinces, provinceKey]))
            };
          } else {
            // Remove from other alliances if exclusive
            return {
              ...a,
              memberProvinces: a.memberProvinces.filter(p => p !== provinceKey)
            };
          }
        })
      );
    } else {
      // Cleared alliance
      setAlliances(prev => 
        prev.map(a => ({
          ...a,
          memberProvinces: a.memberProvinces.filter(p => p !== provinceKey)
        }))
      );
    }
  }, [pushSnapshot]);

  // Specific custom border override on ANY province (e.g. Shaanxi thick gold border)
  const setProvinceBorderOverride = useCallback((provinceKey: string, override: ProvinceBorderOverride | null) => {
    pushSnapshot();
    setProvinces(prev => {
      const cur = prev[provinceKey] || {};
      return {
        ...prev,
        [provinceKey]: {
          ...cur,
          customBorder: override || undefined
        }
      };
    });
  }, [pushSnapshot]);

  const updateProvinceState = useCallback((provinceKey: string, update: Partial<ProvinceState>) => {
    pushSnapshot();
    setProvinces(prev => ({
      ...prev,
      [provinceKey]: {
        ...(prev[provinceKey] || {}),
        ...update
      }
    }));
  }, [pushSnapshot]);

  const clearProvince = useCallback((provinceKey: string) => {
    pushSnapshot();
    setProvinces(prev => {
      const next = { ...prev };
      delete next[provinceKey];
      return next;
    });
    setAlliances(prev => 
      prev.map(a => ({
        ...a,
        memberProvinces: a.memberProvinces.filter(p => p !== provinceKey)
      }))
    );
  }, [pushSnapshot]);

  const clearAllOwnership = useCallback(() => {
    pushSnapshot();
    setProvinces({});
    setAlliances(prev => prev.map(a => ({ ...a, memberProvinces: [] })));
  }, [pushSnapshot]);

  // Faction Management
  const saveFaction = useCallback((factionData: Omit<Faction, 'id' | 'createdAt'> & { id?: string }) => {
    pushSnapshot();
    if (factionData.id) {
      // Update existing
      setFactions(prev => 
        prev.map(f => f.id === factionData.id ? { ...f, ...factionData } as Faction : f)
      );
    } else {
      // Create new
      const newFaction: Faction = {
        ...factionData,
        id: `faction-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now()
      };
      setFactions(prev => [...prev, newFaction]);
      setSelectedFactionId(newFaction.id);
    }
  }, [pushSnapshot]);

  const deleteFaction = useCallback((id: string) => {
    pushSnapshot();
    setFactions(prev => prev.filter(f => f.id !== id));
    if (selectedFactionId === id) setSelectedFactionId(null);
    // Unassign provinces owned by this faction
    setProvinces(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k]?.factionId === id) {
          next[k] = { ...next[k], factionId: null };
        }
      });
      return next;
    });
  }, [selectedFactionId, pushSnapshot]);

  // Alliance Management
  const saveAlliance = useCallback((allianceData: Omit<Alliance, 'id' | 'createdAt'> & { id?: string }) => {
    pushSnapshot();
    if (allianceData.id) {
      // Update
      setAlliances(prev => 
        prev.map(a => a.id === allianceData.id ? { ...a, ...allianceData } as Alliance : a)
      );
      // Sync provinces with member provinces
      setProvinces(prev => {
        const next = { ...prev };
        allianceData.memberProvinces.forEach(pKey => {
          next[pKey] = { ...(next[pKey] || {}), allianceId: allianceData.id };
        });
        return next;
      });
    } else {
      // Create new
      const newAlliance: Alliance = {
        ...allianceData,
        id: `alliance-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now()
      };
      setAlliances(prev => [...prev, newAlliance]);
      setSelectedAllianceId(newAlliance.id);
      // Sync member provinces
      if (newAlliance.memberProvinces.length > 0) {
        setProvinces(prev => {
          const next = { ...prev };
          newAlliance.memberProvinces.forEach(pKey => {
            next[pKey] = { ...(next[pKey] || {}), allianceId: newAlliance.id };
          });
          return next;
        });
      }
    }
  }, [pushSnapshot]);

  const deleteAlliance = useCallback((id: string) => {
    pushSnapshot();
    setAlliances(prev => prev.filter(a => a.id !== id));
    if (selectedAllianceId === id) setSelectedAllianceId(null);
    setProvinces(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k]?.allianceId === id) {
          next[k] = { ...next[k], allianceId: null };
        }
      });
      return next;
    });
  }, [selectedAllianceId, pushSnapshot]);

  const toggleProvinceInAlliance = useCallback((allianceId: string, provinceKey: string) => {
    pushSnapshot();
    setAlliances(prev => 
      prev.map(a => {
        if (a.id === allianceId) {
          const exists = a.memberProvinces.includes(provinceKey);
          const memberProvinces = exists 
            ? a.memberProvinces.filter(p => p !== provinceKey)
            : [...a.memberProvinces, provinceKey];
          return { ...a, memberProvinces };
        }
        return a;
      })
    );
    setProvinces(prev => {
      const cur = prev[provinceKey] || {};
      const newAllianceId = cur.allianceId === allianceId ? null : allianceId;
      return {
        ...prev,
        [provinceKey]: {
          ...cur,
          allianceId: newAllianceId
        }
      };
    });
  }, [pushSnapshot]);

  // Frontiers & Pins
  const addFrontierLine = useCallback((line: FrontierLine) => {
    pushSnapshot();
    setFrontierLines(prev => [...prev, line]);
  }, [pushSnapshot]);

  const deleteFrontierLine = useCallback((id: string) => {
    pushSnapshot();
    setFrontierLines(prev => prev.filter(l => l.id !== id));
  }, [pushSnapshot]);

  const addPin = useCallback((pin: CustomPin) => {
    pushSnapshot();
    setCustomPins(prev => [...prev, pin]);
  }, [pushSnapshot]);

  const deletePin = useCallback((id: string) => {
    pushSnapshot();
    setCustomPins(prev => prev.filter(p => p.id !== id));
  }, [pushSnapshot]);

  // Modals
  const openFactionModal = useCallback((faction?: Faction | null) => {
    setEditingFaction(faction || null);
    setIsFactionModalOpen(true);
  }, []);

  const closeFactionModal = useCallback(() => {
    setIsFactionModalOpen(false);
    setEditingFaction(null);
  }, []);

  const openAllianceModal = useCallback((alliance?: Alliance | null) => {
    setEditingAlliance(alliance || null);
    setIsAllianceModalOpen(true);
  }, []);

  const closeAllianceModal = useCallback(() => {
    setIsAllianceModalOpen(false);
    setEditingAlliance(null);
  }, []);

  const openLandmarkModal = useCallback((landmark?: LandmarkFeature | null, coords?: [number, number]) => {
    setEditingLandmark(landmark || null);
    setLandmarkModalCoords(coords || null);
    setIsLandmarkModalOpen(true);
  }, []);

  const closeLandmarkModal = useCallback(() => {
    setIsLandmarkModalOpen(false);
    setEditingLandmark(null);
    setLandmarkModalCoords(null);
  }, []);

  const saveLandmark = useCallback((landmarkData: Omit<LandmarkFeature, 'id'> & { id?: string }) => {
    pushSnapshot();
    setLandmarks(prev => {
      if (landmarkData.id) {
        return prev.map(l => l.id === landmarkData.id ? { ...landmarkData, id: landmarkData.id } as LandmarkFeature : l);
      } else {
        const newLandmark: LandmarkFeature = {
          ...landmarkData,
          id: `landmark-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        };
        return [...prev, newLandmark];
      }
    });
    closeLandmarkModal();
  }, [pushSnapshot, closeLandmarkModal]);

  const deleteLandmark = useCallback((id: string) => {
    pushSnapshot();
    setLandmarks(prev => prev.filter(l => l.id !== id));
    closeLandmarkModal();
  }, [pushSnapshot, closeLandmarkModal]);

  const resetLandmarksToDefault = useCallback(() => {
    pushSnapshot();
    setLandmarks(defaultLandmarks);
  }, [pushSnapshot, defaultLandmarks]);

  const openExportModal = useCallback(() => setIsExportModalOpen(true), []);
  const closeExportModal = useCallback(() => setIsExportModalOpen(false), []);

  const openProvinceDrawer = useCallback((key?: string) => {
    if (key) setSelectedProvinceKey(key);
    setIsProvinceDrawerOpen(true);
  }, []);

  const closeProvinceDrawer = useCallback(() => {
    setIsProvinceDrawerOpen(false);
  }, []);

  // Export / Import
  const exportProjectJson = useCallback(() => {
    const projectData: MurimMapProject = {
      version: 1,
      title: mapTitle,
      subtitle: mapSubtitle,
      era,
      subdividedRegions,
      provinces,
      factions,
      alliances,
      frontierLines,
      landmarks,
      customPins,
      layerSettings,
      mapMode,
      updatedAt: Date.now()
    };
    return JSON.stringify(projectData, null, 2);
  }, [mapTitle, mapSubtitle, era, subdividedRegions, provinces, factions, alliances, frontierLines, landmarks, customPins, layerSettings, mapMode]);

  const importProjectJson = useCallback((jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr) as MurimMapProject;
      if (!data || !data.version) return false;
      pushSnapshot();
      if (Array.isArray(data.factions)) setFactions(data.factions);
      if (Array.isArray(data.alliances)) setAlliances(data.alliances);
      if (data.provinces) setProvinces(data.provinces);
      if (Array.isArray(data.subdividedRegions)) setSubdividedRegionsState(data.subdividedRegions);
      if (Array.isArray(data.frontierLines)) setFrontierLines(data.frontierLines);
      if (Array.isArray(data.landmarks)) setLandmarks(data.landmarks);
      if (Array.isArray(data.customPins)) setCustomPins(data.customPins);
      if (data.layerSettings) setLayerSettingsState({ ...DEFAULT_LAYER_SETTINGS, ...data.layerSettings });
      if (data.mapMode) setMapMode(data.mapMode);
      if (data.title) setMapTitle(data.title);
      if (data.subtitle) setMapSubtitle(data.subtitle);
      if (data.era) setEra(data.era);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }, [pushSnapshot]);

  const resetToCleanSlate = useCallback(() => {
    pushSnapshot();
    setFactions([]);
    setAlliances([]);
    setProvinces({});
    setFrontierLines([]);
    setLandmarks([]);
    setCustomPins([]);
    setSelectedFactionId(null);
    setSelectedAllianceId(null);
    setSelectedProvinceKey(null);
  }, [pushSnapshot]);

  // Optional template loader (only used if user clicks "Import Example Template")
  const loadExampleTemplate = useCallback(() => {
    pushSnapshot();
    const exampleFactions: Faction[] = [
      {
        id: 'f-huashan',
        name: 'Mount Hua Sect',
        hanzi: '華山派',
        color: '#e11d48',
        alignment: 'Righteous',
        leader: 'Sect Master Bai',
        hqProvinceId: '陕西',
        icon: 'swords',
        description: 'Famous for the Plum Blossom Sword Technique and Violet Mist Divine Art.',
        createdAt: Date.now()
      },
      {
        id: 'f-shaolin',
        name: 'Shaolin Monastery',
        hanzi: '少林寺',
        color: '#d97706',
        alignment: 'Righteous',
        leader: 'Abbot Xuan Ci',
        hqProvinceId: '河南',
        icon: 'circle-dot',
        description: 'Foremost pillar of orthodox martial arts, masters of 72 Ultimate Techniques.',
        createdAt: Date.now()
      },
      {
        id: 'f-wudang',
        name: 'Wudang Sect',
        hanzi: '武當派',
        color: '#0284c7',
        alignment: 'Righteous',
        leader: 'Grandmaster Zhang',
        hqProvinceId: '湖北',
        icon: 'compass',
        description: 'Daoist sanctuary of Taiji, internal soft palm, and supreme balance.',
        createdAt: Date.now()
      },
      {
        id: 'f-cult',
        name: 'Heavenly Demon Cult',
        hanzi: '天魔神教',
        color: '#581c87',
        alignment: 'Demonic',
        leader: 'Heavenly Demon Lord',
        hqProvinceId: '新疆',
        icon: 'flame',
        description: 'Supreme demonic authority from the Western Mount Hundred.',
        createdAt: Date.now()
      }
    ];

    const exampleAlliances: Alliance[] = [
      {
        id: 'a-murim',
        name: 'Righteous Murim Alliance',
        hanzi: '正道武林盟',
        color: '#f59e0b',
        strokeWidth: 6,
        strokeStyle: 'double',
        fillPattern: 'hatched',
        status: 'Supreme Hegemony',
        memberProvinces: ['陕西', '河南', '湖北', '山西'],
        notes: 'Alliance maintaining peace across the Central Plains and Guanzhong.',
        createdAt: Date.now()
      }
    ];

    const exampleProvinces: Record<string, ProvinceState> = {
      '陕西': { factionId: 'f-huashan', allianceId: 'a-murim' },
      '河南': { factionId: 'f-shaolin', allianceId: 'a-murim' },
      '湖北': { factionId: 'f-wudang', allianceId: 'a-murim' },
      '山西': { allianceId: 'a-murim' },
      '新疆': { factionId: 'f-cult' }
    };

    setFactions(exampleFactions);
    setAlliances(exampleAlliances);
    setProvinces(exampleProvinces);
    setSelectedFactionId('f-huashan');
    setSelectedAllianceId('a-murim');
  }, [pushSnapshot]);

  return (
    <MurimContext.Provider
      value={{
        factions,
        alliances,
        provinces,
        subdividedRegions,
        frontierLines,
        landmarks,
        customPins,
        layerSettings,
        mapMode,
        mapTitle,
        mapSubtitle,
        era,
        activeTool,
        brushTarget,
        selectedFactionId,
        selectedAllianceId,
        selectedProvinceKey,
        zoom,
        pan,
        setZoom,
        setPan,
        resetView,
        isFactionModalOpen,
        editingFaction,
        isAllianceModalOpen,
        editingAlliance,
        isLandmarkModalOpen,
        editingLandmark,
        landmarkModalCoords,
        isExportModalOpen,
        isProvinceDrawerOpen,
        activeSidebarTab,
        setActiveTool,
        setBrushTarget,
        setSelectedFactionId,
        setSelectedAllianceId,
        setSelectedProvinceKey,
        setMapMode,
        toggleSubdividedRegion,
        setSubdividedRegions,
        setLayerSettings,
        setMapTitle,
        setMapSubtitle,
        setEra,
        setActiveSidebarTab,
        openFactionModal,
        closeFactionModal,
        openAllianceModal,
        closeAllianceModal,
        openLandmarkModal,
        closeLandmarkModal,
        saveLandmark,
        deleteLandmark,
        resetLandmarksToDefault,
        openExportModal,
        closeExportModal,
        openProvinceDrawer,
        closeProvinceDrawer,
        paintProvince,
        massPaintProvinces,
        setAllianceBorderOverProvince,
        setProvinceBorderOverride,
        updateProvinceState,
        clearProvince,
        clearAllOwnership,
        saveFaction,
        deleteFaction,
        saveAlliance,
        deleteAlliance,
        toggleProvinceInAlliance,
        addFrontierLine,
        deleteFrontierLine,
        addPin,
        deletePin,
        undo,
        redo,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        exportProjectJson,
        importProjectJson,
        resetToCleanSlate,
        loadExampleTemplate
      }}
    >
      {children}
    </MurimContext.Provider>
  );
};

export const useMurim = () => {
  const context = useContext(MurimContext);
  if (!context) {
    throw new Error('useMurim must be used within a MurimProvider');
  }
  return context;
};
