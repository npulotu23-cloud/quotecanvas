import { CompactRow } from '../../../components/controls/CompactRow.jsx';
import { CompactSlider } from '../../../components/controls/CompactSlider.jsx';
import { Section } from '../../../components/controls/Section.jsx';
import { Slider } from '../../../components/controls/Slider.jsx';

export function ImageAdjustControls({ overrides, updateOverride, compact = false }) {
  if (compact) {
    return (
      <CompactRow>
        <CompactSlider label="Zoom" value={overrides.imageZoom ?? 1} min={1} max={2} step={0.05} onChange={v => updateOverride('imageZoom', v)} />
        <CompactSlider label="Horizontal" value={overrides.imageOffsetX ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetX', v)} />
        <CompactSlider label="Vertical" value={overrides.imageOffsetY ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetY', v)} />
      </CompactRow>
    );
  }
  return (
    <>
      <Section title="Zoom & Position">
        <Slider label="Zoom" value={overrides.imageZoom ?? 1} min={1} max={2} step={0.05} onChange={v => updateOverride('imageZoom', v)} />
        <Slider label="Horizontal" value={overrides.imageOffsetX ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetX', v)} />
        <Slider label="Vertical" value={overrides.imageOffsetY ?? 0} min={-0.3} max={0.3} step={0.01} onChange={v => updateOverride('imageOffsetY', v)} />
      </Section>
    </>
  );
}
