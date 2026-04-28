import { useEffect, useRef } from 'react';
import { FORMATS } from '../../app/constants/formats.js';
import { renderDesign } from '../../canvas/renderDesign.js';
import { pickAccentForStyle } from '../../photo/pickAccentForStyle.js';

export function StylePreviewCard({ style, image, words, author, format, onClick, fontsReady, index, photo }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !image || !fontsReady) return;
    const fmt = FORMATS[format];
    // Apply smart accent
    const styled = photo ? {
      ...style,
      colors: { ...style.colors, emphasis: pickAccentForStyle(style, photo) }
    } : style;
    // Render at smaller size for speed
    const scale = 0.35;
    renderDesign(canvasRef.current, {
      width: fmt.w * scale,
      height: fmt.h * scale,
      image,
      style: styled,
      overrides: {},
      words,
      author,
      photo
    }, true);
  }, [style, image, words, author, format, fontsReady, photo]);

  return (
    <button
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#FFB547]/50 transition-all active:scale-[0.98]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="aspect-[4/5] bg-[#141414] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
        <div className="text-xs font-medium text-white">{style.name}</div>
        <div className="text-[10px] text-white/50 uppercase tracking-wide mt-0.5">{style.family.replace('-', ' ')}</div>
      </div>
    </button>
  );
}
