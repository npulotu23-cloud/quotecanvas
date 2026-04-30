import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';
import { Image as ImageIcon } from 'lucide-react';

export function ImageAdjustControls({ overrides, updateOverride, compact = false, onReplacePhoto }) {
  if (compact) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={onReplacePhoto}
          className="min-h-10 w-full rounded-md bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Replace photo
        </button>
        <CompactRow>
          <CompactSlider label="Zoom" value={overrides.imageZoom ?? 1} min={1} max={2} step={0.05} onChange={v => updateOverride('imageZoom', v)} />
          <CompactSlider label="Horizontal" value={overrides.imageOffsetX ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetX', v)} />
          <CompactSlider label="Vertical" value={overrides.imageOffsetY ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetY', v)} />
        </CompactRow>
      </div>
    );
  }
  return (
    <>
      <Section title="Photo">
        <button
          type="button"
          onClick={onReplacePhoto}
          className="w-full py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Replace photo
        </button>
      </Section>
      <Section title="Zoom & Position">
        <Slider label="Zoom" value={overrides.imageZoom ?? 1} min={1} max={2} step={0.05} onChange={v => updateOverride('imageZoom', v)} />
        <Slider label="Horizontal" value={overrides.imageOffsetX ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetX', v)} />
        <Slider label="Vertical" value={overrides.imageOffsetY ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetY', v)} />
      </Section>
    </>
  );
}
