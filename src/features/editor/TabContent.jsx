import { ColorControls } from './panels/ColorControls.jsx';
import { FilterControls } from './panels/FilterControls.jsx';
import { FormatControls } from './panels/FormatControls.jsx';
import { ImageAdjustControls } from './panels/ImageAdjustControls.jsx';
import { LayoutControls } from './panels/LayoutControls.jsx';
import { OverlayControls } from './panels/OverlayControls.jsx';
import { ShadowControls } from './panels/ShadowControls.jsx';
import { TypeControls } from './panels/TypeControls.jsx';
import { StyleSwitcher } from './StyleSwitcher.jsx';

export function TabContent({ activeTab, style, overrides, updateOverride, photoAnalysis, compact = false, image, words, quote, author, onQuoteChange, onAuthorChange, selectedStyleId, onSelectStyle, fontsReady }) {
  if (activeTab === 'styles') return <StyleSwitcher image={image} words={words} author={author} selectedStyleId={selectedStyleId} onSelectStyle={onSelectStyle} photoAnalysis={photoAnalysis} fontsReady={fontsReady} compact={compact} />;
  if (activeTab === 'type') return <TypeControls style={style} overrides={overrides} updateOverride={updateOverride} quote={quote} author={author} onQuoteChange={onQuoteChange} onAuthorChange={onAuthorChange} compact={compact} />;
  if (activeTab === 'color') return <ColorControls style={style} overrides={overrides} updateOverride={updateOverride} photoAnalysis={photoAnalysis} compact={compact} />;
  if (activeTab === 'layout') return <LayoutControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'image') return <ImageAdjustControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'filter') return <FilterControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'shadow') return <ShadowControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'overlay') return <OverlayControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'format') return <FormatControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  return null;
}
