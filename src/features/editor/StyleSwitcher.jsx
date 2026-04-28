import { STYLES } from '../../data/styles.js';
import { StyleSwitcherCard } from './StyleSwitcherCard.jsx';

export function StyleSwitcher({ image, words, author, selectedStyleId, onSelectStyle, photoAnalysis, fontsReady, compact = false }) {
  const thumbHeight = compact ? 90 : 130;
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-none ${compact ? '-mx-1 px-1' : ''}`} style={{ scrollbarWidth: 'none' }}>
      {STYLES.map((s) => (
        <StyleSwitcherCard
          key={s.id}
          style={s}
          image={image}
          words={words}
          author={author}
          isActive={s.id === selectedStyleId}
          onClick={() => onSelectStyle(s.id)}
          photoAnalysis={photoAnalysis}
          fontsReady={fontsReady}
          height={thumbHeight}
        />
      ))}
    </div>
  );
}
