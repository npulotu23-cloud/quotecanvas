import { EDITOR_TABS } from './editorTabs.js';
import { TabContent } from './TabContent.jsx';

export function EditorControlsMobile({ style, overrides, updateOverride, photoAnalysis, activeTab, setActiveTab, image, words, author, selectedStyleId, onSelectStyle, fontsReady }) {
  return (
    <div className="md:hidden flex-shrink-0 bg-[#0D0D0D] border-t border-[#1a1a1a]">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto px-2 py-2 border-b border-[#1a1a1a] scrollbar-none">
        {EDITOR_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === t.id ? 'bg-[#FFB547] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>
      {/* Compact tab content — fixed height, horizontal scroll if needed */}
      <div className="px-3 py-2.5">
        <TabContent
          activeTab={activeTab}
          style={style}
          overrides={overrides}
          updateOverride={updateOverride}
          photoAnalysis={photoAnalysis}
          compact={true}
          image={image}
          words={words}
          author={author}
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
          fontsReady={fontsReady}
        />
      </div>
    </div>
  );
}
