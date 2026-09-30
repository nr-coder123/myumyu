import React from 'react';
import { Alliance, Faction } from '../types/murim';

interface SvgDefsProps {
  alliances: Alliance[];
  factions?: Faction[];
}

function darkenHexColor(hex: string, factor = 0.35): string {
  if (!hex || typeof hex !== 'string') return '#000000';
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return hex;
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return hex;
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 255) * (1 - factor))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 255) * (1 - factor))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 255) * (1 - factor))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const SvgDefs: React.FC<SvgDefsProps> = ({ alliances, factions = [] }) => {
  return (
    <defs>
      {/* Dynamic Linear & Radial Gradients for Each Custom Sect */}
      {factions.map(faction => {
        const secondary = faction.secondaryColor || darkenHexColor(faction.color, 0.4);
        return (
          <linearGradient
            key={`gradient-sect-${faction.id}`}
            id={`gradient-sect-${faction.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={faction.color} stopOpacity="1" />
            <stop offset="60%" stopColor={faction.color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.95" />
          </linearGradient>
        );
      })}
      {/* Parchment Antique Paper Texture Filter */}
      <filter id="parchment-filter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
        <feDiffuseLighting in="noise" lightingColor="#f7f2e4" surfaceScale="1.2" result="light">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feBlend mode="multiply" in="SourceGraphic" in2="light" />
      </filter>

      {/* Terrain Shadow Filter for Mountain Relief */}
      <filter id="terrain-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#1e1810" floodOpacity="0.45" />
      </filter>

      {/* Alliance Border Glow Filter */}
      <filter id="border-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComponentTransfer in="blur" result="glow">
          <feFuncA type="linear" slope="1.8" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
      </filter>

      {/* Default Hatched Pattern for Disputed / Alliance Zones */}
      <pattern id="pattern-hatched-default" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="12" stroke="#f59e0b" strokeWidth="2.5" opacity="0.45" />
      </pattern>

      {/* Dynamic Hatched Pattern for Each Custom Alliance */}
      {alliances.map(alliance => (
        <pattern
          key={`pattern-${alliance.id}`}
          id={`pattern-alliance-${alliance.id}`}
          width="14"
          height="14"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="14"
            stroke={alliance.color}
            strokeWidth="3"
            opacity="0.4"
          />
        </pattern>
      ))}

      {/* Dotted Alliance Pattern */}
      {alliances.map(alliance => (
        <pattern
          key={`dots-${alliance.id}`}
          id={`pattern-dots-${alliance.id}`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="8" r="2.5" fill={alliance.color} opacity="0.5" />
        </pattern>
      ))}

      {/* Sea Wave Pattern */}
      <pattern id="sea-waves" width="40" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 0 10 Q 10 5, 20 10 T 40 10"
          fill="none"
          stroke="#0284c7"
          strokeWidth="0.8"
          opacity="0.12"
        />
      </pattern>
    </defs>
  );
};
