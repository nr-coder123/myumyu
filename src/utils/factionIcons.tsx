import React from 'react';
import { 
  Swords, 
  Shield, 
  Flame, 
  Mountain, 
  Skull, 
  Scroll, 
  Coins, 
  Crown, 
  Compass, 
  Feather, 
  Sparkles, 
  Flag,
  Crosshair,
  CircleDot
} from 'lucide-react';

export interface IconOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
}

export const FACTION_ICONS: IconOption[] = [
  { id: 'swords', label: 'Crossed Swords', icon: Swords },
  { id: 'shield', label: 'Shield Bastion', icon: Shield },
  { id: 'flame', label: 'Heavenly Flame', icon: Flame },
  { id: 'mountain', label: 'Sacred Mountain', icon: Mountain },
  { id: 'crown', label: 'Imperial Crown', icon: Crown },
  { id: 'scroll', label: 'Ancient Manual', icon: Scroll },
  { id: 'skull', label: 'Demonic Skull', icon: Skull },
  { id: 'coin', label: 'Merchant Gold', icon: Coins },
  { id: 'sparkles', label: 'Mystic Qi', icon: Sparkles },
  { id: 'flag', label: 'Alliance Banner', icon: Flag },
  { id: 'feather', label: 'Cloud Brush', icon: Feather },
  { id: 'crosshair', label: 'Hidden Weapon', icon: Crosshair },
  { id: 'compass', label: 'Daoist Ba Gua', icon: Compass },
  { id: 'circle-dot', label: 'Yin Yang Core', icon: CircleDot }
];

export function renderFactionIcon(iconId?: string, className = 'w-4 h-4', style?: React.CSSProperties) {
  const match = FACTION_ICONS.find(i => i.id === iconId) || FACTION_ICONS[0];
  const IconComp = match.icon;
  return <IconComp className={className} style={style} />;
}
