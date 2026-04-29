import { EDITOR_TABS } from './editorTabs.js';
import { TabContent } from './TabContent.jsx';

export function EditorControlsMobile({ style, overrides, updateOverride, photoAnalysis, activeTab, setActiveTab, image, words, quote, author, onQuoteChange, onAuthorChange, selectedStyleId, onSelectStyle, fontsReady }) {
  return (
    <div className="md:hidden flex-shrink-0 bg-[#0D0D0D] border-t border-[#1a1a1a] flex flex-col max-h-[48dvh]">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto px-2 py-2 border-b border-[#1a1a1a] scrollbar-none flex-shrink-0">
        {EDITOR_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === t.id ? 'bg-[#FFB547] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      {/* Compact tab content scrolls independently of the canvas. */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <TabContent
          activeTab={activeTab}
          style={style}
          overrides={overrides}
          updateOverride={updateOverride}
          photoAnalysis={photoAnalysis}
          compact={true}
          image={image}
          words={words}
          quote={quote}
          author={author}
          onQuoteChange={onQuoteChange}
          onAuthorChange={onAuthorChange}
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
          fontsReady={fontsReady}
        />
      </div>
    </div>
  );
}
