import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Image, 
  FileCode, 
  FileJson, 
  Check, 
  Loader2
} from 'lucide-react';
import { useMurim } from '../context/MurimContext';
import { MAP_WIDTH, MAP_HEIGHT } from '../utils/mapGeometry';

interface ExportModalProps {
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ svgRef }) => {
  const {
    isExportModalOpen,
    closeExportModal,
    mapTitle,
    era,
    exportProjectJson
  } = useMurim();

  const [scale, setScale] = useState<number>(2); // 1x, 2x, 4x
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [includeBanner, setIncludeBanner] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExportImage = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const svgElement = svgRef?.current || document.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG map element not found');
      }

      // Clone SVG element to prepare clean standalone XML
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute('width', `${MAP_WIDTH}`);
      clonedSvg.setAttribute('height', `${MAP_HEIGHT}`);
      clonedSvg.removeAttribute('style');

      // If banner option is checked, add title bar into SVG export
      if (includeBanner) {
        const titleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        titleGroup.setAttribute('transform', 'translate(60, 50)');

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '-10');
        rect.setAttribute('y', '-25');
        rect.setAttribute('width', '450');
        rect.setAttribute('height', '52');
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', '#181512');
        rect.setAttribute('fill-opacity', '0.85');
        rect.setAttribute('stroke', '#d97706');
        rect.setAttribute('stroke-width', '1.2');
        titleGroup.appendChild(rect);

        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        titleText.setAttribute('x', '10');
        titleText.setAttribute('y', '0');
        titleText.setAttribute('font-family', 'serif');
        titleText.setAttribute('font-weight', 'bold');
        titleText.setAttribute('font-size', '18');
        titleText.setAttribute('fill', '#fde68a');
        titleText.textContent = mapTitle;
        titleGroup.appendChild(titleText);

        const eraText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        eraText.setAttribute('x', '10');
        eraText.setAttribute('y', '18');
        eraText.setAttribute('font-family', 'monospace');
        eraText.setAttribute('font-size', '10');
        eraText.setAttribute('fill', '#fbbf24');
        eraText.textContent = `Murim Realm Record · ${era}`;
        titleGroup.appendChild(eraText);

        clonedSvg.appendChild(titleGroup);
      }

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL_API = window.URL || window.webkitURL || window;
      const blobURL = URL_API.createObjectURL(svgBlob);

      const image = new window.Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = MAP_WIDTH * scale;
        canvas.height = MAP_HEIGHT * scale;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL_API.revokeObjectURL(blobURL);
          setIsExporting(false);
          return;
        }

        // Draw background
        ctx.fillStyle = '#141820';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render scaled SVG
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL_API.revokeObjectURL(blobURL);

        // Convert to data URL and download
        const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mime, 0.95);

        const downloadLink = document.createElement('a');
        const filename = `${mapTitle.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_')}_${scale}x.${format}`;
        downloadLink.download = filename;
        downloadLink.href = dataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setIsExporting(false);
        setExportSuccess(true);
      };

      image.onerror = () => {
        URL_API.revokeObjectURL(blobURL);
        setIsExporting(false);
        alert('Failed to render map image.');
      };

      image.src = blobURL;
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    const svgElement = svgRef?.current || document.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${mapTitle.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_')}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = exportProjectJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${mapTitle.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_')}.murim.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-stone-950 border border-amber-700/60 rounded-xl w-full max-w-md shadow-2xl text-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 px-5 py-3.5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded border border-amber-500/50 bg-stone-900 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-amber-200">
                Export Murim World Map
              </h2>
              <p className="text-[11px] text-stone-400">
                Export nation-like images showing sect & alliance borders
              </p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className="p-1 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Resolution Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
              <span>Image Resolution</span>
              <span className="text-[11px] font-mono text-amber-400">
                {MAP_WIDTH * scale} x {MAP_HEIGHT * scale} px
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { s: 1, label: '1x Standard', res: '1400x920' },
                { s: 2, label: '2x High Res', res: '2800x1840' },
                { s: 4, label: '4x Ultra 4K', res: '5600x3680' }
              ].map(opt => (
                <button
                  key={opt.s}
                  type="button"
                  onClick={() => setScale(opt.s)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    scale === opt.s
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold shadow'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">{opt.res}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Image Format
              </label>
              <div className="flex rounded-lg bg-stone-900 p-0.5 border border-stone-800">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`flex-1 py-1 rounded text-xs font-semibold transition-all ${
                    format === 'png'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  PNG (Crisp)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('jpeg')}
                  className={`flex-1 py-1 rounded text-xs font-semibold transition-all ${
                    format === 'jpeg'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  JPEG
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Watermark Banner
              </label>
              <button
                type="button"
                onClick={() => setIncludeBanner(!includeBanner)}
                className={`w-full py-1 px-2 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                  includeBanner
                    ? 'bg-stone-900 border-amber-700/60 text-amber-300'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                <span>Title Banner</span>
                <span>{includeBanner ? 'Included' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* Primary PNG/JPEG Export Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportImage}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering High-Res Image...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Image Saved! Export Again</span>
              </>
            ) : (
              <>
                <Image className="w-4 h-4" />
                <span>Download {format.toUpperCase()} Image ({scale}x)</span>
              </>
            )}
          </button>

          {/* Secondary Vector & Project Export Options */}
          <div className="pt-2 border-t border-stone-800/80 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 hover:border-amber-700/50 text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>SVG Vector</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 hover:border-amber-700/50 text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Project (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
