import { EDITOR_TABS } from './editorTabs.js';
import { TabContent } from './TabContent.jsx';

export function EditorControlsDesktop({ style, overrides, updateOverride, photoAnalysis, activeTab, setActiveTab, image, words, quote, author, onQuoteChange, onAuthorChange, selectedStyleId, onSelectStyle, fontsReady }) {
  return (
    <aside className="hidden md:flex md:w-[360px] flex-col bg-[#0D0D0D] border border-[#1a1a1a] rounded-2xl overflow-hidden h-[75vh] flex-shrink-0">
      <div className="flex gap-1 overflow-x-auto px-3 py-2 border-b border-[#1a1a1a] scrollbar-none">
        {EDITOR_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id ? 'bg-[#FFB547] text-black' : 'text-white/60 hover:text-white hover:bg-[#141414]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <TabContent
          activeTab={activeTab}
          style={style}
          overrides={overrides}
          updateOverride={updateOverride}
          photoAnalysis={photoAnalysis}
          compact={false}
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
    </aside>
  );
}
