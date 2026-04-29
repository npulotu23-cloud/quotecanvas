import { AlignCenter, AlignLeft, AlignRight, RotateCcw } from 'lucide-react';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';

export function LayoutControls({ style, overrides, updateOverride, compact = false }) {
  const anchors = [
    ['top-left', 'top', 'top-right'],
    ['center-left', 'center', 'center-right'],
    ['bottom-left', 'bottom-center', 'bottom-right']
  ];
  const currentAnchor = overrides.anchor ?? style.layout.anchor;
  const currentAlign = overrides.alignment ?? style.layout.alignment;

  if (compact) {
    return (
      <div className="flex flex-col gap-4">
        {/* Compact anchor grid */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {anchors.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-1.5 max-w-[132px]">
              {row.map(a => (
                <button
                  key={a}
                  onClick={() => updateOverride('anchor', a)}
                  className={`w-10 h-10 rounded-md border flex items-center justify-center ${
                    currentAnchor === a
                      ? 'border-[#FFB547] bg-[#FFB547]/20'
                      : 'border-[#2a2a2a]'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${currentAnchor === a ? 'bg-[#FFB547]' : 'bg-white/30'}`} />
                </button>
              ))}
            </div>
          ))}
        </div>
        {/* Alignment buttons */}
        <div className="grid grid-cols-3 gap-2 flex-shrink-0">
          {[
            { id: 'left', icon: AlignLeft },
            { id: 'center', icon: AlignCenter },
            { id: 'right', icon: AlignRight }
          ].map(a => (
            <button
              key={a.id}
              onClick={() => updateOverride('alignment', a.id)}
              className={`min-h-11 rounded-md border flex items-center justify-center ${
                currentAlign === a.id ? 'border-[#FFB547] bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2a2a2a] text-white/60'
              }`}
            >
              <a.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        {/* Offset sliders side by side */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <CompactSlider
            label="X"
            value={overrides.offsetX ?? 0}
            min={-0.3} max={0.3} step={0.01}
            onChange={(v) => updateOverride('offsetX', v)}
          />
          <CompactSlider
            label="Y"
            value={overrides.offsetY ?? 0}
            min={-0.3} max={0.3} step={0.01}
            onChange={(v) => updateOverride('offsetY', v)}
          />
          <CompactSlider
            label="Rotate°"
            value={overrides.rotationOverride ?? 0}
            min={-180} max={180} step={1}
            onChange={(v) => updateOverride('rotationOverride', v)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Section title="Anchor">
        <div className="grid grid-cols-3 gap-1.5 max-w-[160px]">
          {anchors.flat().map((a) => (
            <button
              key={a}
              onClick={() => updateOverride('anchor', a)}
              className={`aspect-square rounded-md border transition-all ${
                currentAnchor === a
                  ? 'border-[#FFB547] bg-[#FFB547]/10'
                  : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mx-auto ${currentAnchor === a ? 'bg-[#FFB547]' : 'bg-white/40'}`} />
            </button>
          ))}
        </div>
      </Section>
      <Section title="Alignment">
        <div className="flex gap-1.5">
          {[
            { id: 'left', icon: AlignLeft },
            { id: 'center', icon: AlignCenter },
            { id: 'right', icon: AlignRight }
          ].map(a => (
            <button
              key={a.id}
              onClick={() => updateOverride('alignment', a.id)}
              className={`flex-1 py-2 rounded-md border transition-all flex items-center justify-center ${
                currentAlign === a.id ? 'border-[#FFB547] bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2a2a2a] text-white/60'
              }`}
            >
              <a.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </Section>
      <Section title="Offset">
        <Slider
          label="Horizontal"
          value={overrides.offsetX ?? 0}
          min={-0.3}
          max={0.3}
          step={0.01}
          onChange={(v) => updateOverride('offsetX', v)}
        />
        <Slider
          label="Vertical"
          value={overrides.offsetY ?? 0}
          min={-0.3}
          max={0.3}
          step={0.01}
          onChange={(v) => updateOverride('offsetY', v)}
        />
      </Section>
      <Section title="Rotation">
        <Slider
          label="Angle (degrees)"
          value={overrides.rotationOverride ?? 0}
          min={-180}
          max={180}
          step={1}
          onChange={(v) => updateOverride('rotationOverride', v)}
        />
        {(overrides.rotationOverride ?? 0) !== 0 && (
          <button
            onClick={() => updateOverride('rotationOverride', 0)}
            className="w-full mt-2 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-xs font-medium hover:text-white flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Reset rotation
          </button>
        )}
        <div className="text-xs text-white/40 leading-relaxed mt-2">
          Tip: pinch with two fingers and rotate to angle the quote on the canvas.
        </div>
      </Section>
    </>
  );
}
