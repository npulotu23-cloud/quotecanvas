import { useEffect, useRef } from 'react';
import { FORMATS } from '../../app/constants/formats.js';
import { renderDesign } from '../../canvas/renderDesign.js';
import { pickAccentForStyle } from '../../photo/pickAccentForStyle.js';

export function StyleSwitcherCard({ style, image, words, author, isActive, onClick, photoAnalysis, fontsReady, height = 100 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !image || !fontsReady) return;
    const fmt = FORMATS['4:5']; // always render thumbs in 4:5 for consistency
    const styled = photoAnalysis ? {
      ...style,
      colors: { ...style.colors, emphasis: pickAccentForStyle(style, photoAnalysis) }
    } : style;
    const scale = 0.18;
    renderDesign(canvasRef.current, {
      width: fmt.w * scale,
      height: fmt.h * scale,
      image,
      style: styled,
      overrides: {},
      words,
      author,
      photo: photoAnalysis
    }, true);
  }, [style, image, words, author, fontsReady, photoAnalysis]);

  const aspectW = height * 4 / 5;
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
        isActive ? 'ring-2 ring-[#FFB547] ring-offset-2 ring-offset-[#0D0D0D]' : 'opacity-80 hover:opacity-100'
      }`}
      style={{ width: aspectW, height: height }}
      title={style.name}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </button>
  );
}
