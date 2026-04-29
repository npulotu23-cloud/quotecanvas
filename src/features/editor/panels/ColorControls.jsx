import { useState } from 'react';
import { ColorSwatch } from '../../../components/controls/ColorSwatch.jsx';
import { Section } from '../../../components/controls/Section.jsx';

export function ColorControls({ style, overrides, updateOverride, photoAnalysis, compact = false }) {
  const defaultPalette = [
    '#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#00FF88'
  ];
  const suggested = photoAnalysis?.suggestedAccentColors || [];
  const emphasis = overrides.emphasisColor ?? style.colors.emphasis;
  const connector = overrides.connectorColor ?? style.colors.connector;
  const author = overrides.authorColor ?? style.colors.author;
  const [activeColorTarget, setActiveColorTarget] = useState('emphasis');

  if (compact) {
    const targetMap = { emphasis, connector, author };
    const targetCurrent = targetMap[activeColorTarget];
    const palette = activeColorTarget === 'emphasis' ? [...suggested, ...defaultPalette].slice(0, 9) : defaultPalette;
    const overrideKey = activeColorTarget === 'emphasis' ? 'emphasisColor' : activeColorTarget === 'connector' ? 'connectorColor' : 'authorColor';
    return (
      <div className="flex flex-col gap-2">
        {/* Target selector — small pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'emphasis', label: 'Emphasis' },
            { id: 'connector', label: 'Connector' },
            { id: 'author', label: 'Author' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveColorTarget(t.id)}
              className={`min-h-10 px-2.5 py-2 rounded-md text-xs font-medium ${
                activeColorTarget === t.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Color row */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {palette.map((c, i) => (
            <button
              key={i}
              onClick={() => updateOverride(overrideKey, c)}
              className={`w-10 h-10 rounded-md flex-shrink-0 transition-transform ${
                targetCurrent && targetCurrent.toLowerCase() === c.toLowerCase()
                  ? 'ring-2 ring-[#FFB547] ring-offset-1 ring-offset-[#0D0D0D] scale-110'
                  : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <label className="w-10 h-10 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden flex-shrink-0">
            <input
              type="color"
              value={targetCurrent || '#ffffff'}
              onChange={(e) => updateOverride(overrideKey, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <>
      <Section title="Emphasis Color">
        <div className="flex flex-wrap gap-2">
          {[...suggested, ...defaultPalette].slice(0, 9).map((c, i) => (
            <ColorSwatch key={i} color={c} active={emphasis.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('emphasisColor', c)} />
          ))}
          <input type="color" value={emphasis} onChange={(e) => updateOverride('emphasisColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
      <Section title="Connector Color">
        <div className="flex flex-wrap gap-2">
          {defaultPalette.slice(0, 8).map((c, i) => (
            <ColorSwatch key={i} color={c} active={connector.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('connectorColor', c)} />
          ))}
          <input type="color" value={connector} onChange={(e) => updateOverride('connectorColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
      <Section title="Author Color">
        <div className="flex flex-wrap gap-2">
          {defaultPalette.slice(0, 8).map((c, i) => (
            <ColorSwatch key={i} color={c} active={author.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('authorColor', c)} />
          ))}
          <input type="color" value={author} onChange={(e) => updateOverride('authorColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
    </>
  );
}
