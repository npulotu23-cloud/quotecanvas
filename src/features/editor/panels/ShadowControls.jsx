import { ColorSwatch } from '../../../components/controls/ColorSwatch.jsx';
import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';

export function ShadowControls({ style, overrides, updateOverride, compact = false }) {
  const shadowPalette = ['#000000', '#FFFFFF', '#7A7A7A', '#1A2A4A', '#FF3B3B', '#FFD700', '#FF2D8A', '#00D9FF'];
  // Resolve current values (style defaults if no override)
  const enabled = overrides.shadowEnabled !== undefined ? overrides.shadowEnabled : style.effects.textShadow;
  const colorRaw = overrides.shadowColor ?? style.effects.shadowColor ?? 'rgba(0,0,0,0.6)';
  // For palette comparison, normalize rgba to closest hex if possible — simpler: just compare strings
  const blur = overrides.shadowBlur !== undefined ? overrides.shadowBlur : (style.effects.shadowBlur ?? 12);
  const offsetX = overrides.shadowOffsetX !== undefined ? overrides.shadowOffsetX : (style.effects.shadowOffsetX ?? 0);
  const offsetY = overrides.shadowOffsetY !== undefined ? overrides.shadowOffsetY : (style.effects.shadowOffsetY ?? 4);
  const opacity = overrides.shadowOpacity !== undefined ? overrides.shadowOpacity : 1;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {/* Top row: enable toggle + color swatches */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateOverride('shadowEnabled', !enabled)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium flex-shrink-0 ${
              enabled ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/60'
            }`}
          >
            {enabled ? 'On' : 'Off'}
          </button>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            {shadowPalette.map((c, i) => (
              <button
                key={i}
                onClick={() => updateOverride('shadowColor', c)}
                className={`w-6 h-6 rounded-md flex-shrink-0 border ${
                  (colorRaw || '').toLowerCase() === c.toLowerCase() ? 'border-[#FFB547] scale-110' : 'border-[#2a2a2a]'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="w-6 h-6 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden flex-shrink-0">
              <input
                type="color"
                value={colorRaw && colorRaw.startsWith('#') ? colorRaw : '#000000'}
                onChange={(e) => updateOverride('shadowColor', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
        {/* Sliders row */}
        <CompactRow>
          <CompactSlider label="Opacity" value={opacity} min={0} max={1} step={0.05} onChange={v => updateOverride('shadowOpacity', v)} />
          <CompactSlider label="Blur" value={blur} min={0} max={60} step={1} onChange={v => updateOverride('shadowBlur', v)} />
          <CompactSlider label="X" value={offsetX} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetX', v)} />
          <CompactSlider label="Y" value={offsetY} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetY', v)} />
        </CompactRow>
      </div>
    );
  }

  return (
    <>
      <Section title="Enable">
        <button
          onClick={() => updateOverride('shadowEnabled', !enabled)}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            enabled ? 'bg-[#FFB547] text-black' : 'bg-[#141414] border border-[#2a2a2a] text-white/70'
          }`}
        >
          Shadow {enabled ? 'On' : 'Off'}
        </button>
      </Section>
      <Section title="Shadow Color">
        <div className="flex flex-wrap gap-2">
          {shadowPalette.map((c, i) => (
            <ColorSwatch key={i} color={c} active={(colorRaw || '').toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('shadowColor', c)} />
          ))}
          <input
            type="color"
            value={colorRaw && colorRaw.startsWith('#') ? colorRaw : '#000000'}
            onChange={(e) => updateOverride('shadowColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer"
          />
        </div>
      </Section>
      <Section title="Shadow Properties">
        <Slider label="Opacity" value={opacity} min={0} max={1} step={0.05} onChange={v => updateOverride('shadowOpacity', v)} />
        <Slider label="Blur" value={blur} min={0} max={60} step={1} onChange={v => updateOverride('shadowBlur', v)} />
        <Slider label="X position" value={offsetX} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetX', v)} />
        <Slider label="Y position" value={offsetY} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetY', v)} />
      </Section>
    </>
  );
}
