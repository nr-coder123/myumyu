export type AlignmentType = 
  | 'Righteous' 
  | 'Unorthodox' 
  | 'Demonic' 
  | 'Neutral' 
  | 'Imperial Court' 
  | 'Merchant Guild' 
  | 'Rogue Clan';

export type BorderStrokeStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'glowing';

export interface Faction {
  id: string;
  name: string;
  hanzi: string;
  color: string;
  secondaryColor?: string;
  alignment: AlignmentType;
  leader?: string;
  hqProvinceId?: string;
  icon?: string; // e.g. 'swords', 'shield', 'flame', 'lotus', 'dragon', 'mountain', 'yin-yang', 'dagger', 'skull', 'scroll'
  description?: string;
  createdAt: number;
}

export interface Alliance {
  id: string;
  name: string;
  hanzi: string;
  color: string;
  strokeWidth: number; // e.g. 3, 5, 7, 9
  strokeStyle: BorderStrokeStyle;
  fillPattern: 'none' | 'hatched' | 'dots' | 'subtle_glow';
  status: 'Supreme Hegemony' | 'Mutual Defense Pact' | 'Truce Accord' | 'Total War Alliance' | 'Cold War Coalition';
  memberProvinces: string[]; // List of province keys (e.g. '陕西', '河南')
  leaderFactionId?: string;
  notes?: string;
  createdAt: number;
}

export interface ProvinceBorderOverride {
  enabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: BorderStrokeStyle;
  label?: string;
  glowColor?: string;
}

export interface ProvinceState {
  factionId?: string | null;
  allianceId?: string | null;
  customBorder?: ProvinceBorderOverride;
  customDisplayName?: string;
  customCategory?: 'Sect Headquarters' | 'Fortified Pass' | 'Sacred Sanctuary' | 'Contested Frontline' | 'Vassal Realm' | 'Commercial Hub' | 'Ancient Ruins';
  notes?: string;
}

export interface FrontierLine {
  id: string;
  name: string;
  color: string;
  width: number;
  style: 'dashed' | 'solid' | 'barbed' | 'wall';
  points: [number, number][]; // [longitude, latitude]
  label?: string;
}

export type PinCategory = 
  | 'sect_hq' 
  | 'sacred_peak' 
  | 'fortress' 
  | 'battlefield' 
  | 'secret_realm' 
  | 'ancient_tomb' 
  | 'pass' 
  | 'city';

export interface CustomPin {
  id: string;
  title: string;
  hanzi?: string;
  category: PinCategory;
  coordinates: [number, number]; // [lon, lat]
  factionId?: string;
  notes?: string;
}

export type LandmarkType = 
  | 'pass' 
  | 'sacred_peak' 
  | 'sect_site' 
  | 'fortress' 
  | 'ancient_city' 
  | 'water_gate';

export interface LandmarkFeature {
  id: string;
  name: string;
  hanzi?: string;
  type: LandmarkType;
  coordinates: [number, number]; // [longitude, latitude]
  elevation?: string;
  province?: string;
  description?: string;
}

export type MapMode = 'parchment' | 'political' | 'diplomatic' | 'terrain' | 'borders';

export type ToolMode = 
  | 'brush' 
  | 'alliance_pen' 
  | 'border_pen' 
  | 'line_drawer' 
  | 'landmark_placer'
  | 'inspect' 
  | 'eraser';

export interface LayerSettings {
  showRivers: boolean;
  showRiverLabels: boolean;
  showMountains: boolean;
  showMountainLabels: boolean;
  landmarkLabelStyle?: 'compact' | 'full' | 'hidden';
  showProvinceNames: boolean;
  labelSize?: 'tiny' | 'small' | 'medium' | 'large' | 'off';
  nameLanguage: 'english' | 'hanzi' | 'both' | 'historical';
  hideSubdivisionLabels?: boolean;
  showAllianceBorders: boolean;
  showAllianceHatch: boolean;
  showFrontierLines: boolean;
  showFactionEmblems: boolean;
  showCompass: boolean;
  showImperialSeal: boolean;
  showGraticule: boolean;
  showTerrainShading: boolean;
  provinceBorderWidth: number;
  provinceBorderOpacity: number;
}

export interface MurimMapProject {
  version: number;
  title: string;
  subtitle: string;
  era: string;
  subdividedRegions?: string[];
  provinces: Record<string, ProvinceState>;
  factions: Faction[];
  alliances: Alliance[];
  frontierLines: FrontierLine[];
  landmarks?: LandmarkFeature[];
  customPins?: CustomPin[];
  layerSettings: LayerSettings;
  mapMode: MapMode;
  updatedAt: number;
}
