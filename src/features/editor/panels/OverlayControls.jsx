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
    </>
  );
}
