import { ColorSwatch } from '../../../components/controls/ColorSwatch.jsx';
import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';

export function OverlayControls({ style, overrides, updateOverride, compact = false }) {
  const types = [
    { id: 'none', label: 'None' },
    { id: 'dark-bottom', label: 'Bottom' },
    { id: 'dark-top', label: 'Top' },
    { id: 'vignette', label: 'Vignette' },
    { id: 'radial-dark', label: 'Radial' },
    { id: 'full-dark', label: 'Full Dark' },
    { id: 'gradient-diagonal', label: 'Diagonal' }
  ];
  const currentType = overrides.overlayType ?? style.overlay.type;
  const tintPalette = ['#F2F0EC', '#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#00D9FF', '#00FF88'];
  const tintEnabled = overrides.tintEnabled === true;
  const tintColor = overrides.tintColor ?? '#F2F0EC';
  const tintStrength = overrides.tintStrength ?? 0.35;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {/* Overlay type pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => updateOverride('overlayType', t.id)}
              className={`min-h-10 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                currentType === t.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Darkness slider */}
        <CompactSlider
          label="Darkness"
          value={overrides.overlayDarkness ?? style.overlay.darkness}
          min={0} max={1} step={0.05}
          onChange={(v) => updateOverride('overlayDarkness', v)}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateOverride('tintEnabled', !tintEnabled)}
            className={`min-h-10 px-3 py-2 rounded-md text-xs font-medium flex-shrink-0 ${
              tintEnabled ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/60'
            }`}
          >
            Tint {tintEnabled ? 'On' : 'Off'}
          </button>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            {tintPalette.map((c) => (
              <button
                key={c}
                onClick={() => updateOverride('tintColor', c)}
                className={`w-10 h-10 rounded-md flex-shrink-0 border transition-transform ${
                  tintColor.toLowerCase() === c.toLowerCase() ? 'border-[#FFB547] scale-110' : 'border-[#2a2a2a]'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="w-10 h-10 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden flex-shrink-0">
              <input
                type="color"
                value={tintColor}
                onChange={(e) => updateOverride('tintColor', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
        <CompactRow>
          <CompactSlider
            label="Tint"
            value={tintStrength}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateOverride('tintStrength', v)}
          />
        </CompactRow>
      </div>
    );
  }

  return (
    <>
      <Section title="Type">
        <div className="grid grid-cols-2 gap-1.5">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => updateOverride('overlayType', t.id)}
              className={`py-2 rounded-md border text-xs font-medium transition-all ${
                currentType === t.id ? 'border-[#FFB547] bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2a2a2a] text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Darkness">
        <Slider
          label="Intensity"
          value={overrides.overlayDarkness ?? style.overlay.darkness}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => updateOverride('overlayDarkness', v)}
        />
      </Section>
      <Section title="Tint">
        <button
          onClick={() => updateOverride('tintEnabled', !tintEnabled)}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            tintEnabled ? 'bg-[#FFB547] text-black' : 'bg-[#141414] border border-[#2a2a2a] text-white/70'
          }`}
        >
          Tint {tintEnabled ? 'On' : 'Off'}
        </button>
        <div className="flex flex-wrap gap-2 mt-3">
          {tintPalette.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              active={tintColor.toLowerCase() === c.toLowerCase()}
              onClick={() => updateOverride('tintColor', c)}
            />
          ))}
          <input
            type="color"
            value={tintColor}
            onChange={(e) => updateOverride('tintColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer"
          />
        </div>
        <div className="mt-4">
          <Slider
            label="Strength"
            value={tintStrength}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateOverride('tintStrength', v)}
          />
        </div>
      </Section>
    </>
  );
}
