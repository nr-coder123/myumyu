import { 
  MurimMapProject, 
  ProvinceState, 
  Faction, 
  Alliance, 
  LayerSettings,
  LandmarkFeature,
  FrontierLine,
  CustomPin
} from '../types/murim';
import { PROVINCE_METADATA } from '../data/chinaProvinces';
import { SACRED_PEAKS_AND_PASSES } from '../data/chinaGeography';

export const DEFAULT_SUBDIVIDED_REGIONS = ['河南', '陕西', '四川', '湖北'];

export const DEFAULT_MIGRATION_LAYER_SETTINGS: LayerSettings = {
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
  provinceBorderOpacity: 0.85,
  allianceHoleFilterThreshold: 0.05,
  allianceSliverFilterThreshold: 0.005
};

/**
 * Normalizes any province key string (English, historical, or Chinese Hanzi)
 * into the canonical Chinese Hanzi key used across the map engine (e.g. "Henan" -> "河南").
 */
export function normalizeProvinceKey(key: string): string {
  if (!key || typeof key !== 'string') return key;
  const trimmed = key.trim();

  // If already matches a Hanzi key in PROVINCE_METADATA
  if (PROVINCE_METADATA[trimmed]) {
    return trimmed;
  }

  // Check English name or historical name
  const lower = trimmed.toLowerCase();
  for (const [hanzi, meta] of Object.entries(PROVINCE_METADATA)) {
    if (
      meta.name.toLowerCase() === lower ||
      meta.historicalName?.toLowerCase().includes(lower) ||
      meta.id === trimmed
    ) {
      return hanzi;
    }
  }

  return trimmed;
}

/**
 * Migrates any raw project data (from older saves or current versions)
 * into a fully updated, modern MurimMapProject.
 */
export function migrateProjectData(rawData: any): MurimMapProject {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Project save data is empty or invalid JSON');
  }

  // 1. Versioning: upgrade to current version
  const currentVersion = 2;

  // 2. Subdivided Regions:
  // Older saves before subdivided layers existed had no `subdividedRegions` property
  // or may have an empty array. We ensure the default subdivided regions are active
  // so the latest prefecture layers work on older saves!
  let subdividedRegions: string[] = [];
  if (Array.isArray(rawData.subdividedRegions) && rawData.subdividedRegions.length > 0) {
    subdividedRegions = rawData.subdividedRegions.map((k: string) => normalizeProvinceKey(k));
  } else {
    // Default to the standard subdivided regions
    subdividedRegions = [...DEFAULT_SUBDIVIDED_REGIONS];
  }

  // 3. Provinces State:
  // Normalize keys and ensure state inheritance and custom display names are preserved
  const rawProvinces = rawData.provinces && typeof rawData.provinces === 'object' ? rawData.provinces : {};
  const migratedProvinces: Record<string, ProvinceState> = {};

  for (const [rawKey, state] of Object.entries(rawProvinces)) {
    if (!state || typeof state !== 'object') continue;
    const pState = state as any;

    const normalizedKey = normalizeProvinceKey(rawKey);
    const cleanState: ProvinceState = {
      factionId: pState.factionId !== undefined ? pState.factionId : null,
      allianceId: pState.allianceId !== undefined ? pState.allianceId : null,
      customDisplayName: typeof pState.customDisplayName === 'string' ? pState.customDisplayName.trim() : undefined,
      customBorder: pState.customBorder && typeof pState.customBorder === 'object' ? {
        enabled: Boolean(pState.customBorder.enabled),
        strokeColor: pState.customBorder.strokeColor || '#fbbf24',
        strokeWidth: typeof pState.customBorder.strokeWidth === 'number' ? pState.customBorder.strokeWidth : 3.5,
        strokeStyle: pState.customBorder.strokeStyle || 'solid',
        label: pState.customBorder.label,
        glowColor: pState.customBorder.glowColor
      } : undefined,
      customCategory: pState.customCategory,
      notes: typeof pState.notes === 'string' ? pState.notes : undefined
    };

    // Store by original key
    migratedProvinces[rawKey] = { ...cleanState };
    // And also ensure it exists under normalized Hanzi key
    if (normalizedKey !== rawKey && !migratedProvinces[normalizedKey]) {
      migratedProvinces[normalizedKey] = { ...cleanState };
    }
  }

  // 4. Factions:
  const rawFactions = Array.isArray(rawData.factions) ? rawData.factions : [];
  const factions: Faction[] = rawFactions.map((f: any, idx: number) => ({
    id: f.id || `faction-${Date.now()}-${idx}`,
    name: f.name || 'Martial Sect',
    hanzi: f.hanzi || '',
    color: f.color || '#e11d48',
    secondaryColor: f.secondaryColor,
    alignment: f.alignment || 'Righteous',
    leader: f.leader || '',
    hqProvinceId: f.hqProvinceId ? normalizeProvinceKey(f.hqProvinceId) : '',
    icon: f.icon || 'swords',
    description: f.description || '',
    createdAt: typeof f.createdAt === 'number' ? f.createdAt : Date.now()
  }));

  // 5. Alliances:
  const rawAlliances = Array.isArray(rawData.alliances) ? rawData.alliances : [];
  const alliances: Alliance[] = rawAlliances.map((a: any, idx: number) => {
    const rawMembers = Array.isArray(a.memberProvinces) ? a.memberProvinces : [];
    const memberProvinces = rawMembers.map((m: string) => normalizeProvinceKey(m));

    return {
      id: a.id || `alliance-${Date.now()}-${idx}`,
      name: a.name || 'Martial Alliance',
      hanzi: a.hanzi || '',
      color: a.color || '#3b82f6',
      strokeWidth: typeof a.strokeWidth === 'number' ? a.strokeWidth : 5,
      strokeStyle: a.strokeStyle || 'solid',
      fillPattern: a.fillPattern || 'subtle_glow',
      status: a.status || 'Mutual Defense Pact',
      memberProvinces,
      leaderFactionId: a.leaderFactionId,
      notes: a.notes,
      createdAt: typeof a.createdAt === 'number' ? a.createdAt : Date.now()
    };
  });

  // 6. Frontier Lines:
  const frontierLines: FrontierLine[] = Array.isArray(rawData.frontierLines) 
    ? rawData.frontierLines.filter((l: any) => l && Array.isArray(l.points) && l.points.length >= 2) 
    : [];

  // 7. Landmarks:
  let landmarks: LandmarkFeature[] = [];
  if (Array.isArray(rawData.landmarks) && rawData.landmarks.length > 0) {
    landmarks = rawData.landmarks;
  } else {
    landmarks = SACRED_PEAKS_AND_PASSES.map((p, idx) => ({
      id: `landmark-default-${idx}`,
      name: p.name,
      hanzi: p.hanzi,
      type: (p.type === 'range_node' ? 'sacred_peak' : p.type) as LandmarkFeature['type'],
      coordinates: p.coordinates,
      elevation: p.elevation,
      province: p.province,
      description: p.description
    }));
  }

  // 8. Custom Pins:
  const customPins: CustomPin[] = Array.isArray(rawData.customPins) ? rawData.customPins : [];

  // 9. Layer Settings:
  const rawSettings = rawData.layerSettings && typeof rawData.layerSettings === 'object' ? rawData.layerSettings : {};
  const layerSettings: LayerSettings = {
    ...DEFAULT_MIGRATION_LAYER_SETTINGS,
    ...rawSettings
  };

  return {
    version: currentVersion,
    title: typeof rawData.title === 'string' ? rawData.title : '武林乾坤全圖 · Great Murim Realm',
    subtitle: typeof rawData.subtitle === 'string' ? rawData.subtitle : 'Provinces, Major Rivers & Martial Borders of the Central Plains',
    era: typeof rawData.era === 'string' ? rawData.era : 'Jianwen Era · Murim Calendar 428',
    subdividedRegions,
    provinces: migratedProvinces,
    factions,
    alliances,
    frontierLines,
    landmarks,
    customPins,
    layerSettings,
    mapMode: rawData.mapMode || 'parchment',
    updatedAt: Date.now()
  };
}
