import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, MapPin, Mountain, Shield, Building2, Anchor } from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { LandmarkFeature, LandmarkType } from '../types/murim';
import { PROVINCE_METADATA } from '../data/chinaProvinces';

const LANDMARK_TYPES: { id: LandmarkType; label: string; hanzi: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'pass', label: 'Strategic Pass', hanzi: '关隘', icon: Shield },
  { id: 'sacred_peak', label: 'Sacred Peak', hanzi: '名山', icon: Mountain },
  { id: 'sect_site', label: 'Sect Sanctuary', hanzi: '宗门古刹', icon: Building2 },
  { id: 'fortress', label: 'Frontier Fortress', hanzi: '要塞', icon: Shield },
  { id: 'ancient_city', label: 'Historic City', hanzi: '府城', icon: Building2 },
  { id: 'water_gate', label: 'Water Gate / Ferry', hanzi: '水门津口', icon: Anchor }
];

export const LandmarkModal: React.FC = () => {
  const { 
    isLandmarkModalOpen, 
    closeLandmarkModal, 
    editingLandmark, 
    landmarkModalCoords,
    saveLandmark, 
    deleteLandmark 
  } = useMurim();

  const [name, setName] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [type, setType] = useState<LandmarkType>('pass');
  const [lon, setLon] = useState('110.0');
  const [lat, setLat] = useState('34.5');
  const [elevation, setElevation] = useState('Pass');
  const [province, setProvince] = useState('Henan');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingLandmark) {
      setName(editingLandmark.name);
      setHanzi(editingLandmark.hanzi || '');
      setType(editingLandmark.type || 'pass');
      setLon(editingLandmark.coordinates[0]?.toString() || '110.0');
      setLat(editingLandmark.coordinates[1]?.toString() || '34.5');
      setElevation(editingLandmark.elevation || 'Pass');
      setProvince(editingLandmark.province || '');
      setDescription(editingLandmark.description || '');
    } else {
      setName('');
      setHanzi('');
      setType('pass');
      if (landmarkModalCoords) {
        setLon(landmarkModalCoords[0].toFixed(2));
        setLat(landmarkModalCoords[1].toFixed(2));
      } else {
        setLon('113.0');
        setLat('34.5');
      }
      setElevation('Pass');
      setProvince('Henan');
      setDescription('');
    }
  }, [editingLandmark, landmarkModalCoords, isLandmarkModalOpen]);

  if (!isLandmarkModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedLon = parseFloat(lon) || 110.0;
    const parsedLat = parseFloat(lat) || 34.5;

    const landmarkData: Omit<LandmarkFeature, 'id'> & { id?: string } = {
      ...(editingLandmark ? { id: editingLandmark.id } : {}),
      name: name.trim(),
      hanzi: hanzi.trim() || undefined,
      type,
      coordinates: [parsedLon, parsedLat],
      elevation: elevation.trim() || undefined,
      province: province.trim() || undefined,
      description: description.trim() || undefined
    };

    saveLandmark(landmarkData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-700 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden text-stone-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif font-bold text-sm tracking-wide text-stone-100">
              {editingLandmark ? 'Edit Landmark / Pass' : 'Add Landmark / Strategic Pass'}
            </h3>
          </div>
          <button 
            onClick={closeLandmarkModal}
            className="p-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Primary Name & Hanzi */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
                Landmark Name *
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Shanhaiguan or Mount Hua"
                required
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
                Chinese (Hanzi)
              </label>
              <input 
                type="text" 
                value={hanzi}
                onChange={e => setHanzi(e.target.value)}
                placeholder="山海关"
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600 font-serif"
              />
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
              Landmark Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANDMARK_TYPES.map(t => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`px-2.5 py-2 rounded text-xs flex flex-col items-center justify-center space-y-1 border transition-colors ${
                      isSelected 
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200' 
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-medium">{t.label}</span>
                    <span className="text-[10px] opacity-70 font-serif">{t.hanzi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinates & Elevation */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
                Longitude (°E)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={lon}
                onChange={e => setLon(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-600 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
                Latitude (°N)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={lat}
                onChange={e => setLat(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-600 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
                Elevation / Note
              </label>
              <input 
                type="text" 
                value={elevation}
                onChange={e => setElevation(e.target.value)}
                placeholder="e.g. 2,155 m or Pass"
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Province */}
          <div className="space-y-1">
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
              Associated Province
            </label>
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-600"
            >
              <option value="">None / Frontier</option>
              {Object.entries(PROVINCE_METADATA).map(([key, meta]) => (
                <option key={key} value={meta.name}>
                  {meta.name} ({key}) · {meta.historicalName}
                </option>
              ))}
            </select>
          </div>

          {/* Description & Lore */}
          <div className="space-y-1">
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-400">
              Martial Lore & Strategic Significance
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Strategic chokepoint between Central Plains and northern frontiers..."
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            {editingLandmark ? (
              <button
                type="button"
                onClick={() => deleteLandmark(editingLandmark.id)}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 rounded text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Landmark</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={closeLandmarkModal}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-700 hover:bg-amber-600 text-stone-100 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingLandmark ? 'Save Changes' : 'Create Landmark'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
