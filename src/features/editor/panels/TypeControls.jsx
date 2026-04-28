import { RotateCcw } from 'lucide-react';
import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';

export function TypeControls({ style, overrides, updateOverride, compact = false }) {
  if (compact) {
    return (
      <CompactRow>
        <CompactSlider
          label="Size"
          value={overrides.fontSizeMultiplier ?? 1}
          min={0.5} max={2} step={0.05}
          onChange={(v) => updateOverride('fontSizeMultiplier', v)}
        />
        <CompactSlider
          label="Width"
          value={overrides.textWidth ?? style.layout.textWidth}
          min={0.4} max={0.95} step={0.05}
          onChange={(v) => updateOverride('textWidth', v)}
        />
        <CompactSlider
          label="Line height"
          value={overrides.lineHeight ?? style.typography.lineHeight}
          min={0.8} max={1.8} step={0.05}
          onChange={(v) => updateOverride('lineHeight', v)}
        />
        <CompactSlider
          label="Spacing"
          value={overrides.letterSpacing ?? style.typography.letterSpacing ?? 0}
          min={-0.05} max={0.2} step={0.01}
          onChange={(v) => updateOverride('letterSpacing', v)}
        />
      </CompactRow>
    );
  }
  return (
    <>
      <Section title="Size">
        <Slider
          label="Font size"
          value={overrides.fontSizeMultiplier ?? 1}
          min={0.5}
          max={2}
          step={0.05}
          onChange={(v) => updateOverride('fontSizeMultiplier', v)}
        />
      </Section>
      <Section title="Spacing">
        <Slider
          label="Width"
          value={overrides.textWidth ?? style.layout.textWidth}
          min={0.4}
          max={0.95}
          step={0.05}
          onChange={(v) => updateOverride('textWidth', v)}
        />
        <Slider
          label="Line height"
          value={overrides.lineHeight ?? style.typography.lineHeight}
          min={0.8}
          max={1.8}
          step={0.05}
          onChange={(v) => updateOverride('lineHeight', v)}
        />
        <Slider
          label="Letter spacing"
          value={overrides.letterSpacing ?? style.typography.letterSpacing ?? 0}
          min={-0.05}
          max={0.2}
          step={0.01}
          onChange={(v) => updateOverride('letterSpacing', v)}
        />
      </Section>
      <Section title="Per-word">
        <div className="text-xs text-white/50 leading-relaxed">
          Tap any word on the canvas to change just that word's color, size, or emphasis.
        </div>
        {overrides.perWordOverrides && Object.keys(overrides.perWordOverrides).length > 0 && (
          <button
            onClick={() => updateOverride('perWordOverrides', {})}
            className="w-full py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-xs font-medium hover:text-white flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all word customizations
          </button>
        )}
      </Section>
    </>
  );
}
