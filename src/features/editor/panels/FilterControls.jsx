import { Section } from '../../../components/controls/Section.jsx';
import { FILTERS } from '../../../photo/filters.js';

export function FilterControls({ overrides, updateOverride, compact = false }) {
  const current = overrides.filter ?? 'original';
  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {Object.entries(FILTERS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('filter', key)}
            className={`min-h-10 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 ${
              current === key
                ? 'bg-[#FFB547] text-black'
                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    );
  }
  return (
    <Section title="Photo Filter">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(FILTERS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('filter', key)}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              current === key
                ? 'bg-[#FFB547] text-black'
                : 'bg-[#141414] border border-[#2a2a2a] text-white/70 hover:border-[#3a3a3a]'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    </Section>
  );
}
