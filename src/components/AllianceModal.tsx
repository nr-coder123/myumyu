import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Palette, Layers } from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { BorderStrokeStyle } from '../types/murim';
import { PROVINCE_METADATA } from '../data/chinaProvinces';

const ALLIANCE_COLORS = [
  '#f59e0b', '#d97706', '#ef4444', '#dc2626', '#3b82f6', '#2563eb', 
  '#10b981', '#059669', '#8b5cf6', '#7c3aed', '#ec4899', '#f43f5e', 
  '#06b6d4', '#14b8a6', '#eab308', '#ffffff'
];

export const AllianceModal: React.FC = () => {
  const { isAllianceModalOpen, closeAllianceModal, editingAlliance, saveAlliance } = useMurim();

  const [name, setName] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [color, setColor] = useState('#f59e0b');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [strokeStyle, setStrokeStyle] = useState<BorderStrokeStyle>('double');
  const [fillPattern, setFillPattern] = useState<'none' | 'hatched' | 'dots' | 'subtle_glow'>('hatched');
  const [status, setStatus] = useState<any>('Supreme Hegemony');
  const [memberProvinces, setMemberProvinces] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingAlliance) {
      setName(editingAlliance.name);
      setHanzi(editingAlliance.hanzi || '');
      setColor(editingAlliance.color);
      setStrokeWidth(editingAlliance.strokeWidth || 6);
      setStrokeStyle(editingAlliance.strokeStyle || 'double');
      setFillPattern(editingAlliance.fillPattern || 'hatched');
      setStatus(editingAlliance.status || 'Supreme Hegemony');
      setMemberProvinces(editingAlliance.memberProvinces || []);
      setNotes(editingAlliance.notes || '');
    } else {
      setName('');
      setHanzi('');
      setColor('#f59e0b');
      setStrokeWidth(6);
      setStrokeStyle('double');
      setFillPattern('hatched');
      setStatus('Supreme Hegemony');
      setMemberProvinces([]);
      setNotes('');
    }
  }, [editingAlliance, isAllianceModalOpen]);

  if (!isAllianceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveAlliance({
      id: editingAlliance?.id,
      name: name.trim(),
      hanzi: hanzi.trim(),
      color,
      strokeWidth,
      strokeStyle,
      fillPattern,
      status,
      memberProvinces,
      notes: notes.trim() || undefined
    });

    closeAllianceModal();
  };

  const toggleProvince = (provinceKey: string) => {
    setMemberProvinces(prev => 
      prev.includes(provinceKey)
        ? prev.filter(p => p !== provinceKey)
        : [...prev, provinceKey]
    );
  };

  const quickSelectCentralPlains = () => {
    setMemberProvinces(Array.from(new Set([...memberProvinces, '陕西', '河南', '山西', '湖北'])));
  };

  const quickSelectShaanxi = () => {
    if (!memberProvinces.includes('陕西')) {
      setMemberProvinces([...memberProvinces, '陕西']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-stone-950 border border-amber-700/60 rounded-xl w-full max-w-xl shadow-2xl text-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 px-5 py-3.5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded border border-amber-500/50 bg-stone-900 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-amber-200">
                {editingAlliance ? 'Edit Alliance & Boundary' : 'Create New Alliance & Boundary'}
              </h2>
              <p className="text-[11px] text-stone-400">
                Configure alliance defense borders, perimeter strokes, and covered provinces
              </p>
            </div>
          </div>
          <button
            onClick={closeAllianceModal}
            className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Alliance Name & Hanzi */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Alliance Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Righteous Murim Alliance, Demonic League"
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
                placeholder="e.g. 武林盟"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-serif focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Border Color & Palette */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Alliance Border Stroke Color</span>
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
              {ALLIANCE_COLORS.map(c => (
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

          {/* Border Stroke Width & Style */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-900/60 rounded-lg border border-stone-800">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300 mb-1">
                <span>Border Thickness</span>
                <span className="font-mono text-amber-400">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={strokeWidth}
                onChange={e => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[9px] text-stone-500">
                <span>Subtle (2px)</span>
                <span>Prominent (6px)</span>
                <span>Heavy (12px)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Border Stroke Style
              </label>
              <select
                value={strokeStyle}
                onChange={e => setStrokeStyle(e.target.value as BorderStrokeStyle)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="double">Double-Line Crest Border (EU4 Imperial)</option>
                <option value="solid">Thick Solid Border Line</option>
                <option value="dashed">Dashed Frontline Demarcation</option>
                <option value="glowing">Mystic Glowing Boundary Aura</option>
                <option value="dotted">Dotted Truce Line</option>
              </select>
            </div>
          </div>

          {/* Territory Interior Pattern & Alliance Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Territory Interior Fill
              </label>
              <select
                value={fillPattern}
                onChange={e => setFillPattern(e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="hatched">Hatched Diagonal Stripes</option>
                <option value="dots">Dotted Territory Texture</option>
                <option value="none">No Pattern (Clean Border Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Alliance Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Supreme Hegemony">Supreme Hegemony (Alliance Realm)</option>
                <option value="Mutual Defense Pact">Mutual Defense Pact</option>
                <option value="Truce Accord">Truce Accord / Armistice</option>
                <option value="Total War Alliance">Total War Coalition</option>
                <option value="Cold War Coalition">Cold War Front</option>
              </select>
            </div>
          </div>

          {/* Member Provinces Checklist (Cover Shaanxi, Henan, etc.) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Alliance Protected Provinces ({memberProvinces.length} selected)</span>
              </label>
              <div className="flex space-x-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={quickSelectShaanxi}
                  className="px-1.5 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60"
                  title="Add Shaanxi to this Alliance"
                >
                  + Add Shaanxi (陕西)
                </button>
                <button
                  type="button"
                  onClick={quickSelectCentralPlains}
                  className="px-1.5 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700"
                >
                  Central Plains
                </button>
                <button
                  type="button"
                  onClick={() => setMemberProvinces([])}
                  className="px-1.5 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-700"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-2 bg-stone-900/80 rounded-lg border border-stone-800 max-h-40 overflow-y-auto">
              {Object.entries(PROVINCE_METADATA).map(([hanziKey, meta]) => {
                const isSelected = memberProvinces.includes(hanziKey);
                return (
                  <button
                    type="button"
                    key={hanziKey}
                    onClick={() => toggleProvince(hanziKey)}
                    className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[11px] text-left transition-colors border ${
                      isSelected
                        ? 'bg-amber-600/30 border-amber-500/80 text-amber-200 font-semibold'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    <div 
                      className={`w-2.5 h-2.5 rounded-sm border ${
                        isSelected ? 'bg-amber-500 border-amber-300' : 'border-stone-600'
                      }`} 
                    />
                    <span className="truncate">{meta.name} ({hanziKey})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Treaty Terms & Martial Accord Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Bound by blood oaths at Mount Hua to defend the northern passes against evil incursions..."
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={closeAllianceModal}
              className="px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 flex items-center space-x-1.5 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingAlliance ? 'Save Alliance Border' : 'Create Alliance & Border'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
