import React, { useState, useEffect } from 'react';
import { X, Check, Swords, Palette, Hash, Copy, Droplets, Sun, Sparkles, Wand2 } from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { AlignmentType, FactionColorStyle } from '../types/murim';
import { FACTION_ICONS } from '../utils/factionIcons';
import { PROVINCE_METADATA } from '../data/chinaProvinces';

const COLOR_PRESETS = [
  '#dc2626', '#ef4444', '#f97316', '#ea580c', '#d97706', '#eab308', 
  '#16a34a', '#10b981', '#059669', '#0284c7', '#2563eb', '#4f46e5', 
  '#7c3aed', '#9333ea', '#c026d3', '#e11d48', '#881337', '#475569', 
  '#0f766e', '#b45309', '#1e293b', '#e2e8f0'
];

const ALIGNMENTS: AlignmentType[] = [
  'Righteous',
  'Unorthodox',
  'Demonic',
  'Neutral',
  'Imperial Court',
  'Merchant Guild',
  'Rogue Clan'
];

function darkenHex(hex: string, factor = 0.4): string {
  if (!hex || typeof hex !== 'string') return '#111827';
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return '#111827';
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return '#111827';
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 255) * (1 - factor))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 255) * (1 - factor))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 255) * (1 - factor))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const FactionModal: React.FC = () => {
  const { isFactionModalOpen, closeFactionModal, editingFaction, saveFaction, provinces } = useMurim();

  const [name, setName] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [color, setColor] = useState('#e11d48');
  const [colorInput, setColorInput] = useState('#e11d48');
  const [colorStyle, setColorStyle] = useState<FactionColorStyle>('washed');
  const [secondaryColor, setSecondaryColor] = useState('#881337');
  const [secondaryColorInput, setSecondaryColorInput] = useState('#881337');
  const [gradientDirection, setGradientDirection] = useState<'diagonal' | 'horizontal' | 'vertical' | 'radial'>('diagonal');
  const [alignment, setAlignment] = useState<AlignmentType>('Righteous');
  const [leader, setLeader] = useState('');
  const [hqProvinceId, setHqProvinceId] = useState('');
  const [icon, setIcon] = useState('swords');
  const [description, setDescription] = useState('');

  // Helper to test if a string is a valid CSS hex/color
  const isValidHex = (str: string) => {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(str);
  };

  const normalizeHex = (input: string): string => {
    let val = input.trim();
    if (!val) return '#e11d48';
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
      const r = val[1];
      const g = val[2];
      const b = val[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      return val.toLowerCase();
    }
    return val;
  };

  const handleColorChange = (newColor: string) => {
    const norm = normalizeHex(newColor);
    setColor(norm);
    setColorInput(newColor.startsWith('#') ? newColor : '#' + newColor);
    // Automatically update suggested secondary color if currently using default/darkened version
    setSecondaryColor(darkenHex(norm, 0.45));
    setSecondaryColorInput(darkenHex(norm, 0.45));
  };

  const handleColorInputChange = (raw: string) => {
    setColorInput(raw);
    const cleaned = raw.trim();
    const candidate = cleaned.startsWith('#') ? cleaned : '#' + cleaned;
    if (isValidHex(candidate)) {
      const norm = normalizeHex(candidate);
      setColor(norm);
      setSecondaryColor(darkenHex(norm, 0.45));
      setSecondaryColorInput(darkenHex(norm, 0.45));
    }
  };

  const handleColorInputBlur = () => {
    const candidate = colorInput.trim().startsWith('#') ? colorInput.trim() : '#' + colorInput.trim();
    if (isValidHex(candidate)) {
      const norm = normalizeHex(candidate);
      setColor(norm);
      setColorInput(norm);
    } else {
      setColorInput(color);
    }
  };

  const handleSecondaryColorChange = (newColor: string) => {
    const norm = normalizeHex(newColor);
    setSecondaryColor(norm);
    setSecondaryColorInput(newColor.startsWith('#') ? newColor : '#' + newColor);
  };

  const handleSecondaryColorInputChange = (raw: string) => {
    setSecondaryColorInput(raw);
    const cleaned = raw.trim();
    const candidate = cleaned.startsWith('#') ? cleaned : '#' + cleaned;
    if (isValidHex(candidate)) {
      setSecondaryColor(normalizeHex(candidate));
    }
  };

  const handleSecondaryColorInputBlur = () => {
    const candidate = secondaryColorInput.trim().startsWith('#') ? secondaryColorInput.trim() : '#' + secondaryColorInput.trim();
    if (isValidHex(candidate)) {
      const norm = normalizeHex(candidate);
      setSecondaryColor(norm);
      setSecondaryColorInput(norm);
    } else {
      setSecondaryColorInput(secondaryColor);
    }
  };

  useEffect(() => {
    if (editingFaction) {
      setName(editingFaction.name);
      setHanzi(editingFaction.hanzi || '');
      setColor(editingFaction.color);
      setColorInput(editingFaction.color);
      setColorStyle(editingFaction.colorStyle || 'washed');
      const sec = editingFaction.secondaryColor || darkenHex(editingFaction.color, 0.45);
      setSecondaryColor(sec);
      setSecondaryColorInput(sec);
      setGradientDirection(editingFaction.gradientDirection || 'diagonal');
      setAlignment(editingFaction.alignment);
      setLeader(editingFaction.leader || '');
      setHqProvinceId(editingFaction.hqProvinceId || '');
      setIcon(editingFaction.icon || 'swords');
      setDescription(editingFaction.description || '');
    } else {
      setName('');
      setHanzi('');
      setColor('#e11d48');
      setColorInput('#e11d48');
      setColorStyle('washed');
      setSecondaryColor('#881337');
      setSecondaryColorInput('#881337');
      setGradientDirection('diagonal');
      setAlignment('Righteous');
      setLeader('');
      setHqProvinceId('');
      setIcon('swords');
      setDescription('');
    }
  }, [editingFaction, isFactionModalOpen]);

  if (!isFactionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveFaction({
      id: editingFaction?.id,
      name: name.trim(),
      hanzi: hanzi.trim(),
      color,
      secondaryColor: colorStyle === 'gradient' ? secondaryColor : undefined,
      colorStyle,
      gradientDirection: colorStyle === 'gradient' ? gradientDirection : undefined,
      alignment,
      leader: leader.trim() || undefined,
      hqProvinceId: hqProvinceId || undefined,
      icon,
      description: description.trim() || undefined
    });

    closeFactionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-stone-950 border border-amber-700/60 rounded-xl w-full max-w-lg shadow-2xl text-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 px-5 py-3.5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded border border-amber-500/50 bg-stone-900 flex items-center justify-center text-amber-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-amber-200">
                {editingFaction ? 'Edit Sect / Faction' : 'Create New Sect / Faction'}
              </h2>
              <p className="text-[11px] text-stone-400">
                Define the martial arts realm, colors, and sovereign claims
              </p>
            </div>
          </div>
          <button
            onClick={closeFactionModal}
            className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Sect Name & Hanzi */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Sect Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Mount Hua Sect, Tang Clan"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Chinese (Hanzi)
              </label>
              <input
                type="text"
                value={hanzi}
                onChange={e => setHanzi(e.target.value)}
                placeholder="e.g. 華山派"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-serif focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Color Picker, Hex Code Input & Presets */}
          <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Faction Sovereign Color</span>
              </label>

              {/* Hex Code Input & Native Color Picker */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-stone-950 border border-stone-700/80 rounded-lg px-2 py-1 space-x-1.5 focus-within:border-amber-500 transition-colors">
                  <Hash className="w-3 h-3 text-stone-500" />
                  <input
                    type="text"
                    value={colorInput}
                    onChange={e => handleColorInputChange(e.target.value)}
                    onBlur={handleColorInputBlur}
                    placeholder="#ff0000"
                    maxLength={9}
                    title="Enter custom hex color code (e.g. #ff0000 or ff0000)"
                    className="w-20 bg-transparent text-xs font-mono text-amber-300 placeholder-stone-600 focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                    }}
                    title="Copy hex code"
                    className="p-0.5 text-stone-500 hover:text-amber-400 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div 
                  className="w-7 h-7 rounded-lg border-2 border-stone-700 shadow-inner flex items-center justify-center relative overflow-hidden cursor-pointer group"
                  style={{ backgroundColor: color }}
                  title="Click to choose from color spectrum"
                >
                  <input
                    type="color"
                    value={isValidHex(color) ? color : '#e11d48'}
                    onChange={e => handleColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Quick Presets:</span>
              <span className="font-mono text-[10px] text-stone-500">
                Current: <strong className="text-amber-300 uppercase">{color}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-stone-950/60 rounded-lg border border-stone-800/80">
              {COLOR_PRESETS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleColorChange(c)}
                  title={`Preset: ${c}`}
                  className={`w-5 h-5 rounded border transition-transform ${
                    color.toLowerCase() === c.toLowerCase() 
                      ? 'scale-125 border-white ring-2 ring-amber-500 shadow-md' 
                      : 'border-stone-600 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Territory Color Styling & Tone (Washed / Vivid / Gradient) */}
          <div className="p-3.5 bg-stone-900/90 rounded-xl border border-amber-900/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Territory Color Display Mode</span>
              </label>
              <span className="text-[10px] text-stone-400">
                Applied to this sect's claimed provinces
              </span>
            </div>

            {/* 3 Color Mode Options: Washed, Vivid, Gradient */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setColorStyle('washed')}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between space-y-1 ${
                  colorStyle === 'washed'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 text-stone-100 shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-xs font-bold">Washed</span>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full border border-stone-500 opacity-45"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  Light antique parchment wash (Default)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setColorStyle('vivid')}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between space-y-1 ${
                  colorStyle === 'vivid'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 text-stone-100 shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold">Vivid</span>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  True solid actual color at full strength
                </p>
              </button>

              <button
                type="button"
                onClick={() => setColorStyle('gradient')}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between space-y-1 ${
                  colorStyle === 'gradient'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 text-stone-100 shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-xs font-bold">Gradient</span>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full border border-stone-400 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${color}, ${secondaryColor})` }}
                  />
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  Smooth dual-tone gradient fill
                </p>
              </button>
            </div>

            {/* Sub-controls when Gradient is Selected */}
            {colorStyle === 'gradient' && (
              <div className="p-3 bg-stone-950/90 rounded-xl border border-amber-900/30 space-y-3 animate-in fade-in duration-150">
                {/* Secondary Color Control */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-300">
                    Gradient Secondary / Accent Tone:
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg px-2 py-0.5 space-x-1 focus-within:border-amber-500">
                      <Hash className="w-2.5 h-2.5 text-stone-500" />
                      <input
                        type="text"
                        value={secondaryColorInput}
                        onChange={e => handleSecondaryColorInputChange(e.target.value)}
                        onBlur={handleSecondaryColorInputBlur}
                        placeholder="#881337"
                        maxLength={9}
                        className="w-18 bg-transparent text-[11px] font-mono text-amber-300 placeholder-stone-600 focus:outline-none uppercase"
                      />
                    </div>

                    <div 
                      className="w-6 h-6 rounded-lg border border-stone-700 relative overflow-hidden cursor-pointer shrink-0"
                      style={{ backgroundColor: secondaryColor }}
                      title="Choose secondary gradient spectrum"
                    >
                      <input
                        type="color"
                        value={isValidHex(secondaryColor) ? secondaryColor : '#881337'}
                        onChange={e => handleSecondaryColorChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Presets */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">Presets & Auto-generator:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const dark = darkenHex(color, 0.45);
                      setSecondaryColor(dark);
                      setSecondaryColorInput(dark);
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Auto-Match Deep Shade
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 p-1.5 bg-stone-900/80 rounded-lg border border-stone-800">
                  {COLOR_PRESETS.map(c => (
                    <button
                      type="button"
                      key={`sec-${c}`}
                      onClick={() => handleSecondaryColorChange(c)}
                      title={`Secondary: ${c}`}
                      className={`w-4 h-4 rounded border transition-transform ${
                        secondaryColor.toLowerCase() === c.toLowerCase() 
                          ? 'scale-125 border-white ring-1 ring-amber-500' 
                          : 'border-stone-700 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Gradient Direction */}
                <div>
                  <div className="text-[11px] font-semibold text-stone-300 mb-1.5">
                    Gradient Direction & Pattern:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'diagonal', label: 'Diagonal ↘' },
                      { id: 'horizontal', label: 'Horizontal →' },
                      { id: 'vertical', label: 'Vertical ↓' },
                      { id: 'radial', label: 'Radial Glow ◎' }
                    ].map(dir => (
                      <button
                        type="button"
                        key={dir.id}
                        onClick={() => setGradientDirection(dir.id as any)}
                        className={`py-1 text-[10px] font-semibold rounded border transition-colors ${
                          gradientDirection === dir.id
                            ? 'bg-amber-600 border-amber-500 text-stone-950'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {dir.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Gradient Preview Swatch */}
                <div className="pt-1">
                  <div className="text-[10px] text-stone-400 mb-1">Live Gradient Swatch:</div>
                  <div 
                    className="h-7 w-full rounded-lg border border-stone-700/80 shadow-inner flex items-center justify-center font-bold text-[11px] text-white drop-shadow"
                    style={{
                      background: gradientDirection === 'radial'
                        ? `radial-gradient(circle, ${color} 0%, ${secondaryColor} 100%)`
                        : gradientDirection === 'horizontal'
                        ? `linear-gradient(to right, ${color}, ${secondaryColor})`
                        : gradientDirection === 'vertical'
                        ? `linear-gradient(to bottom, ${color}, ${secondaryColor})`
                        : `linear-gradient(135deg, ${color}, ${secondaryColor})`
                    }}
                  >
                    {name || 'Sect Territory Fill'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alignment & Leader */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Alignment / Ideology
              </label>
              <select
                value={alignment}
                onChange={e => setAlignment(e.target.value as AlignmentType)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                {ALIGNMENTS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Grandmaster / Leader
              </label>
              <input
                type="text"
                value={leader}
                onChange={e => setLeader(e.target.value)}
                placeholder="e.g. Sect Master Bai"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Crest Emblem Icon & HQ Province */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Crest Emblem
              </label>
              <div className="grid grid-cols-7 gap-1 p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 max-h-24 overflow-y-auto">
                {FACTION_ICONS.map(ic => {
                  const IconComp = ic.icon;
                  const isSelected = icon === ic.id;
                  return (
                    <button
                      type="button"
                      key={ic.id}
                      onClick={() => setIcon(ic.id)}
                      className={`p-1 rounded flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-amber-600 text-stone-950 font-bold scale-110' 
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      }`}
                      title={ic.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Headquarters Province
              </label>
              <select
                value={hqProvinceId}
                onChange={e => setHqProvinceId(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- No Primary HQ --</option>
                {Object.entries(PROVINCE_METADATA).map(([hanziKey, meta]) => (
                  <option key={hanziKey} value={hanziKey}>
                    {provinces[hanziKey]?.customDisplayName || meta.name} ({hanziKey}) - {meta.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description / Martial Lore */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Martial Lore & Descriptions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Renowned for supreme swordplay and internal cultivation atop misty cliffs..."
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={closeFactionModal}
              className="px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 flex items-center space-x-1.5 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingFaction ? 'Save Changes' : 'Create Sect'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
