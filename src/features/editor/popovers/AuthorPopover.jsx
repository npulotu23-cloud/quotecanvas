import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';

export function AuthorPopover({ author, overrides, style, onClose, onUpdate, onUpdateText }) {
  const palette = ['#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#D4AF37'];
  const fontOptions = ['Inter', 'Space Grotesk', 'Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Fraunces', 'Anton', 'Bebas Neue', 'Archivo Black', 'Oswald', 'Caveat'];
  const [section, setSection] = useState('text');

  const currentColor = overrides.authorColor || style.colors.author;
  const currentSize = overrides.authorSizeMultiplier || 1;
  const currentFont = overrides.authorFont ?? style.typography.fontAuthor;
  const currentCasing = overrides.authorCasingOverride ?? style.layout.authorCasing;
  const currentItalic = overrides.authorItalic !== undefined ? overrides.authorItalic : (style.typography.italicAuthor || false);
  const currentWeight = overrides.authorWeight ?? style.typography.weightAuthor ?? 600;
  const currentTracking = overrides.authorLetterSpacing ?? 0;

  // Shadow values
  const shadowEnabled = overrides.authorShadowEnabled !== undefined ? overrides.authorShadowEnabled : false;
  const shadowColor = overrides.authorShadowColor ?? '#000000';
  const shadowBlur = overrides.authorShadowBlur ?? 8;
  const shadowOffsetX = overrides.authorShadowOffsetX ?? 0;
  const shadowOffsetY = overrides.authorShadowOffsetY ?? 2;
  const shadowOpacity = overrides.authorShadowOpacity ?? 0.6;

  // Pill background
  const pillEnabled = overrides.authorPillEnabled || false;
  const pillColor = overrides.authorPillColor ?? '#FFB547';
  const pillPadding = overrides.authorPillPadding ?? 0.5;

  const sections = [
    { id: 'text', label: 'Text' },
    { id: 'type', label: 'Type' },
    { id: 'color', label: 'Color' },
    { id: 'shadow', label: 'Shadow' },
    { id: 'pill', label: 'Pill' }
  ];

  return (
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Editing speaker</div>
            <div className="font-semibold text-white mt-0.5 truncate">{author || '—'}</div>
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
          {/* TEXT section */}
          {section === 'text' && (
            <>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Name</div>
                <input
                  value={author}
                  onChange={(e) => onUpdateText(e.target.value)}
                  placeholder="Speaker name"
                  className="w-full border border-[#2a2a2a] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FFB547]/50"
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Size</span>
                  <span className="text-xs text-white tabular-nums">{Math.round(currentSize * 100)}%</span>
                </div>
                <input
                  type="range" min={0.5} max={3} step={0.05}
                  value={currentSize}
                  onChange={(e) => onUpdate({ authorSizeMultiplier: parseFloat(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="text-xs text-white/40 leading-relaxed pt-2 border-t border-[#2a2a2a]">
                Tip: drag the speaker name on the canvas to reposition it independently.
              </div>

              {(overrides.authorOffsetX || overrides.authorOffsetY) ? (
                <button
                  onClick={() => onUpdate({ authorOffsetX: 0, authorOffsetY: 0 })}
                  className="w-full py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Reset position
                </button>
              ) : null}
            </>
          )}

          {/* TYPE section */}
          {section === 'type' && (
            <>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Font</div>
                <div className="flex flex-wrap gap-1.5">
                  {fontOptions.map(f => (
                    <button
                      key={f}
                      onClick={() => onUpdate({ authorFont: f })}
                      className={`px-2.5 py-1.5 rounded-md text-[11px] ${
                        currentFont === f ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                      }`}
                      style={{ fontFamily: `"${f}"` }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Casing</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'upper', label: 'AA' },
                    { id: 'lower', label: 'aa' },
                    { id: 'title', label: 'Aa' },
                    { id: 'asis', label: 'Az' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => onUpdate({ authorCasingOverride: c.id })}
                      className={`py-2 rounded-md text-xs font-bold ${
                        currentCasing === c.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Weight</span>
                  <span className="text-xs text-white tabular-nums">{currentWeight}</span>
                </div>
                <input
                  type="range" min={300} max={900} step={100}
                  value={currentWeight}
                  onChange={(e) => onUpdate({ authorWeight: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Italic</span>
                <button
                  onClick={() => onUpdate({ authorItalic: !currentItalic })}
                  className={`relative w-10 h-5 rounded-full ${currentItalic ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentItalic ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Letter spacing</span>
                  <span className="text-xs text-white tabular-nums">{currentTracking.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={-0.05} max={0.3} step={0.01}
                  value={currentTracking}
                  onChange={(e) => onUpdate({ authorLetterSpacing: parseFloat(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>
            </>
          )}

          {/* COLOR section */}
          {section === 'color' && (
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onUpdate({ authorColor: null })}
                  className={`h-8 px-3 rounded-lg text-xs font-medium ${
                    !overrides.authorColor ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                  }`}
                >
                  Default
                </button>
                {palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdate({ authorColor: c })}
                    className={`w-8 h-8 rounded-lg ${(currentColor || '').toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547] ring-offset-2 ring-offset-[#141414] scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                  <input
                    type="color"
                    value={currentColor && currentColor.startsWith('#') ? currentColor : '#ffffff'}
                    onChange={(e) => onUpdate({ authorColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SHADOW section */}
          {section === 'shadow' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Shadow</span>
                <button
                  onClick={() => onUpdate({ authorShadowEnabled: !shadowEnabled })}
                  className={`relative w-10 h-5 rounded-full ${shadowEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${shadowEnabled ? 'left-5' : 'left-0.5'}`} />
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
                          onClick={() => onUpdate({ authorShadowColor: c })}
                          className={`w-7 h-7 rounded-md ${shadowColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={shadowColor} onChange={(e) => onUpdate({ authorShadowColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <CompactRow>
                    <CompactSlider label="Opacity" value={shadowOpacity} min={0} max={1} step={0.05} onChange={v => onUpdate({ authorShadowOpacity: v })} />
                    <CompactSlider label="Blur" value={shadowBlur} min={0} max={40} step={1} onChange={v => onUpdate({ authorShadowBlur: v })} />
                  </CompactRow>
                  <CompactRow>
                    <CompactSlider label="X" value={shadowOffsetX} min={-20} max={20} step={1} onChange={v => onUpdate({ authorShadowOffsetX: v })} />
                    <CompactSlider label="Y" value={shadowOffsetY} min={-20} max={20} step={1} onChange={v => onUpdate({ authorShadowOffsetY: v })} />
                  </CompactRow>
                </>
              )}
            </>
          )}

          {/* PILL section */}
          {section === 'pill' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Background pill</span>
                <button
                  onClick={() => onUpdate({ authorPillEnabled: !pillEnabled })}
                  className={`relative w-10 h-5 rounded-full ${pillEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${pillEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {pillEnabled && (
                <>
                  <div>
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Pill color</div>
                    <div className="flex flex-wrap gap-2">
                      {['#FFFFFF', '#0A0A0A', '#FFB547', '#FF2D8A', '#FF3B3B', '#00D9FF', '#D4AF37'].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onUpdate({ authorPillColor: c })}
                          className={`w-7 h-7 rounded-md ${pillColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={pillColor} onChange={(e) => onUpdate({ authorPillColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-white/60 uppercase tracking-wide">Padding</span>
                      <span className="text-xs text-white tabular-nums">{pillPadding.toFixed(1)}</span>
                    </div>
                    <input type="range" min={0.2} max={1.5} step={0.1} value={pillPadding}
                      onChange={(e) => onUpdate({ authorPillPadding: parseFloat(e.target.value) })}
                      className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold flex-shrink-0"
        >
          Done
        </button>
      </div>
    </div>
  );
}
