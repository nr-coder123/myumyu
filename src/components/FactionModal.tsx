import React, { useState, useEffect } from 'react';
import { X, Check, Swords, Palette } from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { AlignmentType } from '../types/murim';
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

export const FactionModal: React.FC = () => {
  const { isFactionModalOpen, closeFactionModal, editingFaction, saveFaction } = useMurim();

  const [name, setName] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [color, setColor] = useState('#e11d48');
  const [alignment, setAlignment] = useState<AlignmentType>('Righteous');
  const [leader, setLeader] = useState('');
  const [hqProvinceId, setHqProvinceId] = useState('');
  const [icon, setIcon] = useState('swords');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingFaction) {
      setName(editingFaction.name);
      setHanzi(editingFaction.hanzi || '');
      setColor(editingFaction.color);
      setAlignment(editingFaction.alignment);
      setLeader(editingFaction.leader || '');
      setHqProvinceId(editingFaction.hqProvinceId || '');
      setIcon(editingFaction.icon || 'swords');
      setDescription(editingFaction.description || '');
    } else {
      setName('');
      setHanzi('');
      setColor('#e11d48');
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

          {/* Color Picker & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Faction Sovereign Color</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-6 h-6 rounded border border-stone-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-stone-400">{color}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-stone-900/60 rounded-lg border border-stone-800">
              {COLOR_PRESETS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
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
                    {meta.name} ({hanziKey}) - {meta.region}
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
