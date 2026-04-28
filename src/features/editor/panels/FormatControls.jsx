import { FORMATS } from '../../../app/constants/formats.js';
import { Section } from '../../../components/controls/Section.jsx';

export function FormatControls({ overrides, updateOverride, compact = false }) {
  const current = overrides.format ?? '4:5';
  if (compact) {
    return (
      <div className="flex gap-1.5">
        {Object.keys(FORMATS).map((key) => (
          <button
            key={key}
            onClick={() => updateOverride('format', key)}
            className={`flex-1 py-2 rounded-md border text-center transition-all ${
              current === key ? 'border-[#FFB547] bg-[#FFB547]/10' : 'border-[#2a2a2a]'
            }`}
          >
            <div className="text-xs font-semibold text-white">{key}</div>
          </button>
        ))}
      </div>
    );
  }
  return (
    <Section title="Canvas Format">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(FORMATS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('format', key)}
            className={`py-3 px-3 rounded-lg border text-left transition-all ${
              current === key ? 'border-[#FFB547] bg-[#FFB547]/10' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="text-sm font-semibold">{key}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{f.label}</div>
          </button>
        ))}
      </div>
    </Section>
  );
}
