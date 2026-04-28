import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';

export function WordPopover({ word, perWordOverride, style, onClose, onUpdate, onToggleEmphasis }) {
  const [section, setSection] = useState('style');

  const isEmphasized = perWordOverride.emphasized !== undefined ? perWordOverride.emphasized : word.emphasized;
  const currentColor = perWordOverride.color || '';
  const currentSize = perWordOverride.sizeMultiplier || 1;
  const currentItalic = perWordOverride.italic || false;
  const currentWeight = perWordOverride.weight || (isEmphasized ? style.typography.weightPrimary : style.typography.weightSecondary) || 600;

  // Shadow values
  const shadowEnabled = perWordOverride.shadowEnabled || false;
  const shadowColor = perWordOverride.shadowColor || '#000000';
  const shadowBlur = perWordOverride.shadowBlur ?? 8;
  const shadowOffsetX = perWordOverride.shadowOffsetX ?? 0;
  const shadowOffsetY = perWordOverride.shadowOffsetY ?? 2;
  const shadowOpacity = perWordOverride.shadowOpacity ?? 0.6;

  const palette = ['#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#00FF88'];

  const sections = [
    { id: 'style', label: 'Style' },
    { id: 'color', label: 'Color' },
    { id: 'size', label: 'Size' },
    { id: 'shadow', label: 'Shadow' },
    { id: 'type', label: 'Type' }
  ];

  const hasOverrides = currentColor || currentSize !== 1 || perWordOverride.emphasized !== undefined ||
    currentItalic || perWordOverride.weight || shadowEnabled;

  return (
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Editing word</div>
            <div className="font-semibold text-white mt-0.5 truncate">{word.text}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#2a2a2a] overflow-x-auto scrollbar-none flex-shrink-0">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${
                section === s.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] text-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* STYLE section */}
          {section === 'style' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Emphasis</div>
                <div className="text-xs text-white/50 mt-0.5">Bigger & colored</div>
              </div>
              <button
                onClick={onToggleEmphasis}
                className={`relative w-11 h-6 rounded-full transition-colors ${isEmphasized ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${isEmphasized ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          {/* COLOR section */}
          {section === 'color' && (
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onUpdate({ color: null })}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all ${
                    !currentColor ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                  }`}
                >
                  Default
                </button>
                {palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdate({ color: c })}
                    className={`w-8 h-8 rounded-lg transition-transform ${currentColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547] ring-offset-2 ring-offset-[#141414] scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                  <input
                    type="color"
                    value={currentColor || '#ffffff'}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SIZE section */}
          {section === 'size' && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-white/60 uppercase tracking-wide">Size</span>
                <span className="text-xs text-white tabular-nums">{Math.round(currentSize * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={currentSize}
                onChange={(e) => onUpdate({ sizeMultiplier: parseFloat(e.target.value) })}
                className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
              />
            </div>
          )}

          {/* SHADOW section */}
          {section === 'shadow' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white font-medium">Word shadow</div>
                  <div className="text-xs text-white/50 mt-0.5">Override shadow on this word only</div>
                </div>
                <button
                  onClick={() => onUpdate({ shadowEnabled: !shadowEnabled })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${shadowEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${shadowEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {shadowEnabled && (
                <>
                  <div>
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
                    <div className="flex flex-wrap gap-2">
                      {['#000000', '#FFFFFF', '#FF3B3B', '#FFD700', '#FF2D8A', '#00D9FF'].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onUpdate({ shadowColor: c })}
                          className={`w-7 h-7 rounded-md ${shadowColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={shadowColor} onChange={(e) => onUpdate({ shadowColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <CompactRow>
                    <CompactSlider label="Opacity" value={shadowOpacity} min={0} max={1} step={0.05} onChange={v => onUpdate({ shadowOpacity: v })} />
                    <CompactSlider label="Blur" value={shadowBlur} min={0} max={40} step={1} onChange={v => onUpdate({ shadowBlur: v })} />
                  </CompactRow>
                  <CompactRow>
                    <CompactSlider label="X" value={shadowOffsetX} min={-20} max={20} step={1} onChange={v => onUpdate({ shadowOffsetX: v })} />
                    <CompactSlider label="Y" value={shadowOffsetY} min={-20} max={20} step={1} onChange={v => onUpdate({ shadowOffsetY: v })} />
                  </CompactRow>
                </>
              )}
            </>
          )}

          {/* TYPE section */}
          {section === 'type' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Italic</span>
                <button
                  onClick={() => onUpdate({ italic: !currentItalic })}
                  className={`relative w-10 h-5 rounded-full ${currentItalic ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentItalic ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Weight</span>
                  <span className="text-xs text-white tabular-nums">{currentWeight}</span>
                </div>
                <input
                  type="range" min={300} max={900} step={100}
                  value={currentWeight}
                  onChange={(e) => onUpdate({ weight: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="text-xs text-white/40 leading-relaxed pt-2 border-t border-[#2a2a2a]">
                Note: weight may not visibly change if the style font has only one weight available.
              </div>
            </>
          )}

          {hasOverrides && (
            <button
              onClick={() => onUpdate({ color: null, sizeMultiplier: null, emphasized: null, italic: null, weight: null, shadowEnabled: null, shadowColor: null, shadowBlur: null, shadowOffsetX: null, shadowOffsetY: null, shadowOpacity: null })}
              className="w-full py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-sm font-medium hover:text-white flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset this word
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
