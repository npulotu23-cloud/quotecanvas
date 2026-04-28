import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Upload, Download, Sparkles, Shuffle, RotateCcw, Undo2, Redo2, X, Check, Type, Palette, Layout as LayoutIcon, Sliders, Image as ImageIcon, Layers, Wand2, ChevronLeft, ArrowRight, Plus, Minus, AlignLeft, AlignCenter, AlignRight, Save, Trash2, Maximize2, Camera } from 'lucide-react';

/* ================================================================
   FONTS
================================================================ */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Anton&family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Serif+Display:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=Caveat:wght@400;700&family=Space+Grotesk:wght@300;400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,400&display=swap';

function useFonts() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.querySelector('link[data-qc-fonts]')) {
      document.fonts.ready.then(() => setReady(true));
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    link.setAttribute('data-qc-fonts', 'true');
    document.head.appendChild(link);
    document.fonts.ready.then(() => setReady(true));
  }, []);
  return ready;
}

/* ================================================================
   STYLE PRESETS (10 configs — diverse library)
================================================================ */
const STYLES = [
  // === EDITORIAL-SPLIT family (replaces broken Black Statement) ===
  {
    id: 'split-layout',
    name: 'Split Layout',
    family: 'editorial-split',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 0.95 },
    colors: { emphasis: '#0A0A0A', connector: '#0A0A0A', author: '#0A0A0A', accent: '#0A0A0A', useEmphasisSystem: false },
    layout: { anchor: 'center-left', textWidth: 0.55, paddingX: 0.05, paddingY: 0.08, alignment: 'left', authorPosition: 'above', authorCasing: 'upper', rotation: 0, splitSide: 'left', splitRatio: 0.62 },
    overlay: { type: 'split-vertical', darkness: 1, color: '#F2F0EC', splitSide: 'left', splitRatio: 0.62 },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: true, quoteMarksSize: 'medium', quoteMarksColor: '#0A0A0A', quoteMarksPosition: 'inline', constellation: false, frame: false, divider: false }
  },
  {
    id: 'caption-band',
    name: 'Caption Band',
    family: 'editorial-split',
    intensity: 'balanced',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.02, lineHeight: 0.98 },
    colors: { emphasis: '#0A0A0A', connector: '#0A0A0A', author: '#0A0A0A', accent: '#0A0A0A', useEmphasisSystem: false },
    layout: { anchor: 'bottom-center', textWidth: 0.88, paddingX: 0.06, paddingY: 0.04, alignment: 'left', authorPosition: 'above', authorCasing: 'upper', rotation: 0, bandPosition: 'bottom', bandHeight: 0.32, autoBand: true },
    overlay: { type: 'caption-band', darkness: 1, color: '#F2F0EC', bandPosition: 'bottom', bandHeight: 0.32 },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'tinted-photo',
    name: 'Tinted Photo',
    family: 'editorial-split',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 0.95 },
    colors: { emphasis: '#0A0A0A', connector: '#0A0A0A', author: '#0A0A0A', accent: '#0A0A0A', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'left', authorPosition: 'above', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'tinted-light', darkness: 0.55, color: '#F2F0EC' },
    effects: { textShadow: true, shadowBlur: 6, shadowColor: 'rgba(255,255,255,0.4)', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === BOLD-PUNCHY family ===
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    family: 'bold-punchy',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Archivo Black', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 900, weightAuthor: 600, italicPrimary: false, casing: 'mixed', letterSpacing: -0.01, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'radial-dark', darkness: 0.45, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 22, shadowColor: 'rgba(0,0,0,0.7)', shadowOffsetX: 0, shadowOffsetY: 6, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'condensed-power',
    name: 'Condensed Power',
    family: 'bold-punchy',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.02, lineHeight: 0.98 },
    colors: { emphasis: '#FF3B3B', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FF3B3B', useEmphasisSystem: true },
    layout: { anchor: 'bottom-left', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.65, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#FF3B3B' }
  },
  {
    id: 'stacked-block',
    name: 'Stacked Block',
    family: 'bold-punchy',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Archivo Black', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 900, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: -0.01, lineHeight: 0.92 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FF2D8A', useEmphasisSystem: false },
    layout: { anchor: 'bottom-left', textWidth: 0.78, paddingX: 0.06, paddingY: 0.06, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.7, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === COLORFUL-EMPHASIS family ===
  {
    id: 'pink-pop',
    name: 'Pink Pop',
    family: 'colorful-emphasis',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Caveat', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 700, weightAuthor: 700, italicPrimary: false, italicSecondary: true, casing: 'mixed', letterSpacing: 0, lineHeight: 1.08 },
    colors: { emphasis: '#FF2D8A', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFD700', useEmphasisSystem: true },
    layout: { anchor: 'center-left', textWidth: 0.82, paddingX: 0.07, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'radial-dark', darkness: 0.45, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 18, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 4, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: true, constellationColor: '#FFD70055', constellationDensity: 'medium', frame: false, divider: false }
  },
  {
    id: 'gold-accent',
    name: 'Gold Accent',
    family: 'colorful-emphasis',
    intensity: 'balanced',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, italicSecondary: true, casing: 'mixed', letterSpacing: 0, lineHeight: 1.12 },
    colors: { emphasis: '#FFB547', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.8, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'vignette', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#FFB547' }
  },
  {
    id: 'sticker-stamp',
    name: 'Sticker Stamp',
    family: 'colorful-emphasis',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Archivo Black', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 900, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.01, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FF2D8A', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: -2, stickerBg: '#FF2D8A' },
    overlay: { type: 'vignette', darkness: 0.4, color: '#000000' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, stickerStamp: true }
  },

  // === ELEGANT-SERIF family ===
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    family: 'elegant-serif',
    intensity: 'subtle',
    typography: { fontPrimary: 'Playfair Display', fontSecondary: 'Playfair Display', fontAuthor: 'Playfair Display', weightPrimary: 400, weightSecondary: 400, weightAuthor: 400, italicPrimary: true, italicSecondary: true, italicAuthor: false, casing: 'sentence', letterSpacing: 0, lineHeight: 1.3 },
    colors: { emphasis: '#F5F1E8', connector: '#F5F1E8', author: '#D4AF37', accent: '#D4AF37', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.8, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'vignette', darkness: 0.6, color: '#0A0A0A' },
    effects: { textShadow: true, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.4)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#D4AF37' }
  },
  {
    id: 'editorial-display',
    name: 'Editorial',
    family: 'elegant-serif',
    intensity: 'balanced',
    typography: { fontPrimary: 'DM Serif Display', fontSecondary: 'DM Serif Display', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 500, italicPrimary: false, italicSecondary: true, casing: 'title', letterSpacing: 0, lineHeight: 1.15 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.82, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: true, quoteMarksSize: 'huge', quoteMarksColor: '#FFFFFF', quoteMarksPosition: 'above', constellation: false, frame: false, divider: false }
  },
  {
    id: 'magazine-editorial',
    name: 'Magazine',
    family: 'elegant-serif',
    intensity: 'balanced',
    typography: { fontPrimary: 'Fraunces', fontSecondary: 'Fraunces', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, italicSecondary: true, casing: 'title', letterSpacing: 0, lineHeight: 1.18 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#D4AF37', accent: '#D4AF37', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.78, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'vignette', darkness: 0.55, color: '#0A0A0A' },
    effects: { textShadow: true, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#D4AF37' }
  },
  {
    id: 'minimal-script',
    name: 'Minimal Script',
    family: 'elegant-serif',
    intensity: 'subtle',
    typography: { fontPrimary: 'Caveat', fontSecondary: 'Caveat', fontAuthor: 'Cormorant Garamond', weightPrimary: 700, weightSecondary: 400, weightAuthor: 400, italicPrimary: false, italicSecondary: false, italicAuthor: true, casing: 'sentence', letterSpacing: 0, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#F5F1E8', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.78, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'asis', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === CINEMATIC-DARK family ===
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    family: 'cinematic-dark',
    intensity: 'bold',
    typography: { fontPrimary: 'Oswald', fontSecondary: 'Oswald', fontAuthor: 'Oswald', weightPrimary: 700, weightSecondary: 400, weightAuthor: 500, italicPrimary: false, casing: 'mixed', letterSpacing: 0.01, lineHeight: 1.1 },
    colors: { emphasis: '#FF2D8A', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FF2D8A', useEmphasisSystem: true },
    layout: { anchor: 'center-right', textWidth: 0.78, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'gradient-diagonal', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: true, glowColor: '#FF2D8A', glowBlur: 24, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: true, frameStyle: 'hexagon', frameColor: '#FFFFFF22', divider: false }
  },
  {
    id: 'dramatic-bottom',
    name: 'Dramatic',
    family: 'cinematic-dark',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, casing: 'upper', letterSpacing: 0.03, lineHeight: 0.98 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'bottom-center', textWidth: 0.88, paddingX: 0.06, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.7, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 18, shadowColor: 'rgba(0,0,0,0.7)', shadowOffsetX: 0, shadowOffsetY: 4, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'cutout-hero',
    name: 'Spotlight Hero',
    family: 'cinematic-dark',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 0.95 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'center-left', textWidth: 0.6, paddingX: 0.06, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0, subjectAware: true },
    overlay: { type: 'subject-spotlight', darkness: 0.7, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.7)', shadowOffsetX: 0, shadowOffsetY: 4, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'grunge-poster',
    name: 'Grunge',
    family: 'cinematic-dark',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: -0.01, lineHeight: 0.92 },
    colors: { emphasis: '#FFB547', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.55, color: '#1a0a0a' },
    effects: { textShadow: true, shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.85)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: true, strokeColor: '#0A0A0A', strokeWidth: 2 },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === MINIMAL-CLEAN family ===
  {
    id: 'negative-space',
    name: 'Negative Space',
    family: 'minimal-clean',
    intensity: 'subtle',
    typography: { fontPrimary: 'Inter', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 300, weightSecondary: 300, weightAuthor: 500, italicPrimary: false, casing: 'asis', letterSpacing: -0.01, lineHeight: 1.3 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'bottom-left', textWidth: 0.5, paddingX: 0.06, paddingY: 0.08, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.45, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#FFB547' }
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    family: 'minimal-clean',
    intensity: 'subtle',
    typography: { fontPrimary: 'Space Grotesk', fontSecondary: 'Space Grotesk', fontAuthor: 'Space Grotesk', weightPrimary: 500, weightSecondary: 400, weightAuthor: 500, italicPrimary: false, casing: 'lower', letterSpacing: 0, lineHeight: 1.4 },
    colors: { emphasis: '#F5F1E8', connector: '#F5F1E8', author: '#F5F1E8', accent: '#F5F1E8', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.1, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'lower', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.4)', shadowOffsetX: 0, shadowOffsetY: 1, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === SHADOW-POP family (new — shadow IS the design) ===
  {
    id: 'retro-shadow',
    name: 'Retro Shadow',
    family: 'shadow-pop',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 0.95 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FF3B3B', accent: '#FF3B3B', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 0, shadowColor: '#FF3B3B', shadowOffsetX: 8, shadowOffsetY: 8, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    family: 'shadow-pop',
    intensity: 'balanced',
    typography: { fontPrimary: 'Playfair Display', fontSecondary: 'Playfair Display', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 500, italicPrimary: true, italicSecondary: true, casing: 'sentence', letterSpacing: 0, lineHeight: 1.2 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFD700', accent: '#FFD700', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.78, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'vignette', darkness: 0.6, color: '#0A0A0A' },
    effects: { textShadow: true, shadowBlur: 30, shadowColor: 'rgba(255,215,0,0.7)', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#FFD700' }
  },
  {
    id: 'neon-sign',
    name: 'Neon Sign',
    family: 'shadow-pop',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, casing: 'upper', letterSpacing: 0.02, lineHeight: 1.0 },
    colors: { emphasis: '#FF2D8A', connector: '#FFFFFF', author: '#FF2D8A', accent: '#FF2D8A', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.65, color: '#0a0a14' },
    effects: { textShadow: true, shadowBlur: 28, shadowColor: '#FF2D8A', shadowOffsetX: 0, shadowOffsetY: 0, glow: true, glowColor: '#FF2D8A', glowBlur: 20, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'long-shadow',
    name: 'Long Shadow',
    family: 'shadow-pop',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Archivo Black', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 900, weightAuthor: 600, italicPrimary: false, casing: 'mixed', letterSpacing: -0.01, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.8, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'gradient-diagonal', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.85)', shadowOffsetX: 12, shadowOffsetY: 14, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'outline-pop',
    name: 'Outline Pop',
    family: 'shadow-pop',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 0.95 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'radial-dark', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 0, shadowColor: '#FFB547', shadowOffsetX: 6, shadowOffsetY: 6, glow: false, stroke: true, strokeColor: '#0A0A0A', strokeWidth: 3 },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'floating-card',
    name: 'Floating Card',
    family: 'shadow-pop',
    intensity: 'balanced',
    typography: { fontPrimary: 'Inter', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 500, weightAuthor: 600, italicPrimary: false, casing: 'asis', letterSpacing: -0.01, lineHeight: 1.3 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.72, paddingX: 0.1, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0, stickerBg: 'rgba(0,0,0,0.55)' },
    overlay: { type: 'vignette', darkness: 0.4, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, stickerStamp: true }
  },

  // === BOLD-LAYOUT family (rule-breaking compositions) ===
  {
    id: 'block-emphasis',
    name: 'Block Emphasis',
    family: 'bold-layout',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 1.05 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FF2D8A', useEmphasisSystem: true },
    layout: { anchor: 'center-left', textWidth: 0.85, paddingX: 0.06, paddingY: 0.08, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'radial-dark', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, wordBg: 'block', wordBgColor: '#FF2D8A' }
  },
  {
    id: 'highlighter-pop',
    name: 'Highlighter',
    family: 'bold-layout',
    intensity: 'balanced',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 500, weightAuthor: 700, italicPrimary: false, casing: 'mixed', letterSpacing: 0, lineHeight: 1.15 },
    colors: { emphasis: '#0A0A0A', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFD700', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.82, paddingX: 0.08, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.65, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.55)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, wordBg: 'highlighter', wordBgColor: '#FFD700' }
  },
  {
    id: 'corner-block',
    name: 'Corner Block',
    family: 'bold-layout',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.02, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FF2D8A', useEmphasisSystem: false },
    layout: { anchor: 'top-left', textWidth: 0.42, paddingX: 0.06, paddingY: 0.06, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.45, color: '#000000' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, asymShape: 'corner-block', asymShapeColor: '#FF2D8A', asymShapePosition: 'top-left' }
  },
  {
    id: 'arc-accent',
    name: 'Arc Accent',
    family: 'bold-layout',
    intensity: 'balanced',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 500, weightAuthor: 700, italicPrimary: false, casing: 'mixed', letterSpacing: -0.01, lineHeight: 1.05 },
    colors: { emphasis: '#FFD700', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFD700', useEmphasisSystem: true },
    layout: { anchor: 'bottom-left', textWidth: 0.78, paddingX: 0.07, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, asymShape: 'quarter-circle', asymShapeColor: 'rgba(255,215,0,0.18)', asymShapePosition: 'top-right' }
  },
  {
    id: 'mismatched-scale',
    name: 'Mismatched Scale',
    family: 'bold-layout',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, italicSecondary: true, casing: 'upper', letterSpacing: 0, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.82, paddingX: 0.07, paddingY: 0.1, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0, mismatchedScale: true },
    overlay: { type: 'radial-dark', darkness: 0.6, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.6)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },
  {
    id: 'stacked-title',
    name: 'Stacked Title',
    family: 'bold-layout',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: -0.01, lineHeight: 0.92 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FF2D8A', useEmphasisSystem: false },
    layout: { anchor: 'center-left', textWidth: 0.95, paddingX: 0.05, paddingY: 0.06, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0, stackedTitle: true },
    overlay: { type: 'gradient-diagonal', darkness: 0.6, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.6)', shadowOffsetX: 0, shadowOffsetY: 4, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false }
  },

  // === SUBJECT-FOREGROUND family (speaker appears in front of text) ===
  {
    id: 'cutout-hero',
    name: 'Cutout Hero',
    family: 'subject-foreground',
    intensity: 'bold',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 1.0 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFB547', accent: '#FFB547', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.92, paddingX: 0.04, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'radial-dark', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 18, shadowColor: 'rgba(0,0,0,0.7)', shadowOffsetX: 0, shadowOffsetY: 4, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, subjectForeground: true }
  },
  {
    id: 'magazine-cover',
    name: 'Magazine Cover',
    family: 'subject-foreground',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Inter', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 500, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: -0.01, lineHeight: 0.95 },
    colors: { emphasis: '#FFD700', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFD700', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.95, paddingX: 0.04, paddingY: 0.08, alignment: 'left', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'gradient-diagonal', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.6)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, subjectForeground: true }
  },

  // === STACKED-LABEL family (text in bordered boxes per line) ===
  {
    id: 'stacked-labels',
    name: 'Stacked Labels',
    family: 'stacked-label',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.04, lineHeight: 1.5 },
    colors: { emphasis: '#0A0A0A', connector: '#0A0A0A', author: '#0A0A0A', accent: '#0A0A0A', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.6, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'tinted-light', darkness: 0.85, color: '#F5F1E8' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, lineBox: true, lineBoxBorderColor: '#0A0A0A', lineBoxBorderRatio: 0.06 }
  },
  {
    id: 'newspaper-strip',
    name: 'Newspaper Strip',
    family: 'stacked-label',
    intensity: 'balanced',
    typography: { fontPrimary: 'Oswald', fontSecondary: 'Oswald', fontAuthor: 'Inter', weightPrimary: 600, weightSecondary: 600, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.02, lineHeight: 1.6 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#0A0A0A', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.08, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.5, color: '#000000' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, lineBox: true, lineBoxBorderColor: '#FFFFFF', lineBoxBorderRatio: 0.04, lineBoxFill: 'rgba(0,0,0,0.6)' }
  },
  {
    id: 'filmstrip',
    name: 'Filmstrip',
    family: 'stacked-label',
    intensity: 'balanced',
    typography: { fontPrimary: 'Anton', fontSecondary: 'Anton', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.05, lineHeight: 1.5 },
    colors: { emphasis: '#F5F1E8', connector: '#F5F1E8', author: '#F5F1E8', accent: '#F5F1E8', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.65, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.7, color: '#0A0A0A' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, lineBox: true, lineBoxBorderColor: '#F5F1E8', lineBoxBorderRatio: 0.05 }
  },

  // === VINTAGE family (worn paper, sun-faded looks with grain) ===
  {
    id: 'worn-poster',
    name: 'Worn Poster',
    family: 'vintage',
    intensity: 'bold',
    typography: { fontPrimary: 'Archivo Black', fontSecondary: 'Archivo Black', fontAuthor: 'Inter', weightPrimary: 900, weightSecondary: 900, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0, lineHeight: 1.0 },
    colors: { emphasis: '#1A1410', connector: '#1A1410', author: '#1A1410', accent: '#8B0000', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.85, paddingX: 0.07, paddingY: 0.08, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'tinted-light', darkness: 0.85, color: '#E8DDC7' },
    effects: { textShadow: true, shadowBlur: 1, shadowColor: 'rgba(40,20,10,0.4)', shadowOffsetX: 1, shadowOffsetY: 1, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, grain: true, grainIntensity: 0.7 }
  },
  {
    id: 'sun-faded',
    name: 'Sun Faded',
    family: 'vintage',
    intensity: 'balanced',
    typography: { fontPrimary: 'Fraunces', fontSecondary: 'Fraunces', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 500, italicPrimary: false, italicSecondary: true, casing: 'sentence', letterSpacing: 0, lineHeight: 1.25 },
    colors: { emphasis: '#7A4A2B', connector: '#5C3F2E', author: '#7A4A2B', accent: '#A0633C', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.78, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'tinted-light', darkness: 0.6, color: '#F5E6D3' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#A0633C', grain: true, grainIntensity: 0.4 }
  },

  // === ORNATE-SCRIPT family (hand-lettered, gallery-style) ===
  {
    id: 'marker-script',
    name: 'Marker Script',
    family: 'ornate-script',
    intensity: 'balanced',
    typography: { fontPrimary: 'Caveat', fontSecondary: 'Caveat', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, casing: 'sentence', letterSpacing: 0, lineHeight: 1.15 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFD700', accent: '#FF2D8A', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.82, paddingX: 0.08, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'sentence', rotation: -1 },
    overlay: { type: 'radial-dark', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.6)', shadowOffsetX: 0, shadowOffsetY: 3, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, wordBg: 'underline', wordBgColor: '#FF2D8A' }
  },
  {
    id: 'gallery-caption',
    name: 'Gallery Caption',
    family: 'ornate-script',
    intensity: 'subtle',
    typography: { fontPrimary: 'Cormorant Garamond', fontSecondary: 'Cormorant Garamond', fontAuthor: 'Inter', weightPrimary: 500, weightSecondary: 400, weightAuthor: 500, italicPrimary: true, italicSecondary: true, casing: 'sentence', letterSpacing: 0.03, lineHeight: 1.35 },
    colors: { emphasis: '#F5F1E8', connector: '#F5F1E8', author: '#D4AF37', accent: '#D4AF37', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.12, paddingY: 0.12, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.65, color: '#1A1410' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: true, quoteMarksPosition: 'above', quoteMarksColor: '#D4AF37', quoteMarksSize: 'medium', constellation: false, frame: false, divider: true, dividerStyle: 'line', dividerColor: '#D4AF37' }
  },

  // === RIBBON-BANNER family (text inside ribbon shapes) ===
  {
    id: 'ribbon-banner',
    name: 'Ribbon Banner',
    family: 'ribbon-banner',
    intensity: 'bold',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.03, lineHeight: 1.5 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#FFFFFF', accent: '#FFFFFF', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.65, paddingX: 0.1, paddingY: 0.1, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'dark-bottom', darkness: 0.5, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 4, shadowColor: 'rgba(0,0,0,0.4)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, lineRibbon: true, lineRibbonColor: '#C8242E' }
  },
  {
    id: 'award-banner',
    name: 'Award Banner',
    family: 'ribbon-banner',
    intensity: 'balanced',
    typography: { fontPrimary: 'Playfair Display', fontSecondary: 'Playfair Display', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, italicSecondary: true, casing: 'asis', letterSpacing: 0, lineHeight: 1.4 },
    colors: { emphasis: '#1A1410', connector: '#1A1410', author: '#FFFFFF', accent: '#1A1410', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.62, paddingX: 0.12, paddingY: 0.12, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.55, color: '#1A1410' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, lineRibbon: true, lineRibbonColor: '#D4AF37' }
  },

  // === FRAMED family (text inside decorative frames) ===
  {
    id: 'boxed-quote',
    name: 'Boxed Quote',
    family: 'framed',
    intensity: 'balanced',
    typography: { fontPrimary: 'Playfair Display', fontSecondary: 'Playfair Display', fontAuthor: 'Inter', weightPrimary: 700, weightSecondary: 400, weightAuthor: 600, italicPrimary: false, italicSecondary: true, casing: 'asis', letterSpacing: 0, lineHeight: 1.3 },
    colors: { emphasis: '#FFFFFF', connector: '#FFFFFF', author: '#D4AF37', accent: '#D4AF37', useEmphasisSystem: false },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.12, paddingY: 0.14, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'full-dark', darkness: 0.55, color: '#000000' },
    effects: { textShadow: true, shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.4)', shadowOffsetX: 0, shadowOffsetY: 2, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, doubleFrame: true, frameColor: '#FFFFFF', frameMargin: 0.05 }
  },
  {
    id: 'stamp-frame',
    name: 'Stamp Frame',
    family: 'framed',
    intensity: 'balanced',
    typography: { fontPrimary: 'Bebas Neue', fontSecondary: 'Bebas Neue', fontAuthor: 'Inter', weightPrimary: 400, weightSecondary: 400, weightAuthor: 700, italicPrimary: false, casing: 'upper', letterSpacing: 0.03, lineHeight: 1.15 },
    colors: { emphasis: '#0A0A0A', connector: '#0A0A0A', author: '#0A0A0A', accent: '#8B0000', useEmphasisSystem: true },
    layout: { anchor: 'center', textWidth: 0.7, paddingX: 0.12, paddingY: 0.14, alignment: 'center', authorPosition: 'below', authorCasing: 'upper', rotation: 0 },
    overlay: { type: 'tinted-light', darkness: 0.85, color: '#F2EBD9' },
    effects: { textShadow: false, shadowBlur: 0, shadowColor: 'transparent', shadowOffsetX: 0, shadowOffsetY: 0, glow: false, stroke: false },
    decorations: { quoteMarks: false, constellation: false, frame: false, divider: false, stampFrame: true, frameColor: '#0A0A0A', frameMargin: 0.06 }
  }
];

/* ================================================================
   QUOTE ANALYZER
================================================================ */
const STOPWORDS = new Set(['the','a','an','of','in','on','to','for','but','and','or','is','are','was','were','we','you','i','me','my','your','our','us','they','them','their','he','she','it','his','her','its','this','that','these','those','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','so','if','as','at','by','with','from','up','down','out','over','under','then','than','when','where','why','how','all','any','each','few','more','most','other','some','such','no','not','only','own','same','too','very','just','also','am']);

function formatQuote(raw) {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    .replace(/'/g, '\u2019')
    .replace(/--/g, '\u2014')
    .replace(/\s+/g, ' ')
    .replace(/^([a-z])/, m => m.toUpperCase())
    .replace(/([^.!?\u201D])$/, '$1.');
}

function analyzeQuote(rawQuote, rawAuthor) {
  const cleaned = formatQuote(rawQuote);
  const author = (rawAuthor || '').trim();
  const len = cleaned.length;
  const lengthCategory = len < 40 ? 'short' : len < 100 ? 'medium' : len < 180 ? 'long' : 'very-long';

  const rawWords = cleaned.split(/(\s+)/).filter(w => w.length > 0);
  const words = [];
  rawWords.forEach((w, i) => {
    if (/^\s+$/.test(w)) return;
    const clean = w.replace(/[^\w\u2019']/g, '').toLowerCase();
    const isConnector = STOPWORDS.has(clean) || clean.length <= 2;
    words.push({ text: w, isConnector, emphasized: false, index: words.length });
  });

  // Tone
  const lower = cleaned.toLowerCase();
  let tone = 'neutral';
  if (/\b(lord|god|jesus|christ|faith|spirit|pray|heaven|holy|bible|scripture|gospel|savior)\b/.test(lower)) tone = 'scripture';
  else if (/\b(dream|hustle|grind|win|fight|rise|succeed|never|always|must|believe|conquer|unstoppable|legacy|champion)\b/.test(lower) || /[!?]/.test(cleaned)) tone = 'motivational';
  else if (/\b(think|remember|reflect|learn|understand|truly|perhaps|sometimes)\b/.test(lower)) tone = 'reflective';

  return { cleaned, author, length: len, lengthCategory, words, tone };
}

function suggestEmphasis(words, lengthCategory) {
  const maxEmph = lengthCategory === 'short' ? 2 : lengthCategory === 'medium' ? 3 : lengthCategory === 'long' ? 3 : 4;
  // score each content word by length
  const candidates = words
    .map((w, i) => ({ w, i, score: w.isConnector ? 0 : w.text.replace(/[^\w]/g,'').length }))
    .filter(c => c.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, maxEmph);
  const emphSet = new Set(candidates.map(c => c.i));
  return words.map((w, i) => ({ ...w, emphasized: emphSet.has(i) }));
}

/* ================================================================
   PHOTO ANALYZER (smarter — k-means, vibrance, harmony, subject-weighted)
================================================================ */

// Color space helpers
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 1/6) [r, g, b] = [c, x, 0];
  else if (h < 2/6) [r, g, b] = [x, c, 0];
  else if (h < 3/6) [r, g, b] = [0, c, x];
  else if (h < 4/6) [r, g, b] = [0, x, c];
  else if (h < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const ri = Math.round((r + m) * 255);
  const gi = Math.round((g + m) * 255);
  const bi = Math.round((b + m) * 255);
  return `#${[ri, gi, bi].map(n => n.toString(16).padStart(2, '0')).join('')}`;
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map(n => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
}
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function relativeLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Simple k-means in RGB space, with vibrance + subject-region weighting
function kmeansColors(samples, k = 5, iterations = 8) {
  if (samples.length === 0) return [];
  // Init: pick k random samples
  let centers = [];
  const step = Math.floor(samples.length / k);
  for (let i = 0; i < k; i++) {
    const s = samples[Math.min(i * step, samples.length - 1)];
    centers.push([s.r, s.g, s.b]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, count: 0, weight: 0 }));
    for (const s of samples) {
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const dr = s.r - centers[i][0], dg = s.g - centers[i][1], db = s.b - centers[i][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      const w = s.weight || 1;
      sums[best].r += s.r * w;
      sums[best].g += s.g * w;
      sums[best].b += s.b * w;
      sums[best].count += 1;
      sums[best].weight += w;
    }
    centers = sums.map((s, i) => s.weight > 0 ? [s.r / s.weight, s.g / s.weight, s.b / s.weight] : centers[i]);
  }

  // Build cluster info
  const clusters = centers.map(c => ({ rgb: c, count: 0, weight: 0 }));
  for (const s of samples) {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const dr = s.r - centers[i][0], dg = s.g - centers[i][1], db = s.b - centers[i][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestDist) { bestDist = d; best = i; }
    }
    clusters[best].count++;
    clusters[best].weight += s.weight || 1;
  }

  return clusters.map(c => {
    const [h, s, l] = rgbToHsl(c.rgb[0], c.rgb[1], c.rgb[2]);
    return {
      hex: rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]),
      r: c.rgb[0], g: c.rgb[1], b: c.rgb[2],
      h, s, l,
      count: c.count,
      weight: c.weight,
      vibrance: s * (1 - Math.abs(l - 0.5) * 1.4) // peaks at l=0.5, drops at extremes
    };
  });
}

async function analyzePhoto(imgElement) {
  const SIZE = 128;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  // === SUBJECT DETECTION via variance grid (refined) ===
  const GRID = 12;
  const CELL = SIZE / GRID;
  const cellLum = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  const cellSat = Array.from({length: GRID}, () => new Array(GRID).fill(0));

  let totalBrightness = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
      const [, sat] = rgbToHsl(data[idx], data[idx+1], data[idx+2]);
      totalBrightness += lum;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      cellLum[gy][gx] += lum;
      cellSat[gy][gx] += sat;
    }
  }
  const cellCount = CELL * CELL;
  for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
    cellLum[gy][gx] /= cellCount;
    cellSat[gy][gx] /= cellCount;
  }

  // Variance in each cell (detail/edge density)
  const variance = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      variance[gy][gx] += Math.pow(lum - cellLum[gy][gx], 2);
    }
  }

  // Subject score combines variance + saturation, with center bias
  let totalScore = 0;
  let weightedX = 0, weightedY = 0;
  const subjectMap = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      const cx = (gx + 0.5) / GRID;
      const cy = (gy + 0.5) / GRID;
      const centerBias = 1 - Math.min(1, Math.hypot(cx - 0.5, cy - 0.5) * 1.2);
      const score = (variance[gy][gx] * 1.5 + cellSat[gy][gx] * 0.6) * (0.5 + centerBias * 0.5);
      subjectMap[gy][gx] = score;
      totalScore += score;
      weightedX += cx * score;
      weightedY += cy * score;
    }
  }
  const subjectCenterX = totalScore > 0 ? weightedX / totalScore : 0.5;
  const subjectCenterY = totalScore > 0 ? weightedY / totalScore : 0.5;
  const subjectSide = subjectCenterX < 0.4 ? 'left' : subjectCenterX > 0.6 ? 'right' : 'center';
  const averageBrightness = totalBrightness / (SIZE * SIZE);

  // === COLOR EXTRACTION ===
  // Sample pixels with weights — vibrant pixels and subject-region pixels weighted higher
  const samples = [];
  const STRIDE = 2;
  for (let y = 0; y < SIZE; y += STRIDE) {
    for (let x = 0; x < SIZE; x += STRIDE) {
      const idx = (y * SIZE + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const [h, sat, l] = rgbToHsl(r, g, b);
      // Skip near-pure-white and near-pure-black (usually background or shadow)
      if (l > 0.95 || l < 0.05) continue;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      const subjectScore = subjectMap[gy][gx] / (totalScore / (GRID * GRID));
      const vibrance = sat * (1 - Math.abs(l - 0.5) * 1.4);
      const weight = 1 + vibrance * 2 + Math.min(2, subjectScore);
      samples.push({ r, g, b, weight });
    }
  }

  // Run k-means
  const clusters = samples.length > 0 ? kmeansColors(samples, 6, 8) : [];
  // Sort by weight (most prominent first)
  const sortedByWeight = [...clusters].sort((a, b) => b.weight - a.weight);
  // Sort by vibrance (most vibrant first) for accent picks
  const sortedByVibrance = [...clusters].sort((a, b) => b.vibrance - a.vibrance);

  const dominantColors = sortedByWeight.slice(0, 3).map(c => c.hex);
  const vibrantColors = sortedByVibrance.filter(c => c.vibrance > 0.15).slice(0, 4).map(c => c.hex);
  const mutedColors = sortedByVibrance.slice().reverse().slice(0, 3).map(c => c.hex);

  // === HARMONY-BASED ACCENT SUGGESTIONS ===
  // Take the most prominent vibrant cluster. Build a palette around it.
  const harmonyAccents = [];
  if (sortedByVibrance.length > 0 && sortedByVibrance[0].vibrance > 0.1) {
    const lead = sortedByVibrance[0];
    const baseH = lead.h;
    // Complementary
    harmonyAccents.push(hslToHex((baseH + 0.5) % 1, Math.max(0.7, lead.s), 0.55));
    // Triadic 1
    harmonyAccents.push(hslToHex((baseH + 1/3) % 1, Math.max(0.7, lead.s), 0.55));
    // Split-complementary
    harmonyAccents.push(hslToHex((baseH + 0.42) % 1, Math.max(0.7, lead.s), 0.55));
    harmonyAccents.push(hslToHex((baseH + 0.58) % 1, Math.max(0.7, lead.s), 0.55));
  }

  // === STYLE-AWARE PALETTES ===
  // Pick palettes that have strong contrast with the photo's average brightness
  // Brand-style hot accents (always include for colorful styles)
  const HOT_ACCENTS = ['#FF2D8A', '#FF3B3B', '#FFB547', '#FFD700', '#00D9FF', '#B537F2', '#FF8C00'];
  // Refined palette for elegant styles
  const REFINED = ['#D4AF37', '#F5F1E8', '#C9A96E', '#A47148', '#704F36'];
  // Cinematic neon
  const NEON = ['#FF2D8A', '#00FFE0', '#FFB547', '#B537F2'];

  // Pick suggested accent: blend harmony + brand
  const suggestedAccentColors = [];
  // 1) Best harmony accent (if vibrant enough)
  if (harmonyAccents.length > 0) suggestedAccentColors.push(harmonyAccents[0]);
  // 2) Top vibrant from photo (if exists)
  if (vibrantColors.length > 0) suggestedAccentColors.push(vibrantColors[0]);
  // 3) Hot brand color that contrasts well with average background
  const HOT_PICKS = HOT_ACCENTS.filter(c => contrastRatio(c, rgbToHex(...sortedByWeight[0]?.rgb || [128,128,128])) > 2.5);
  if (HOT_PICKS.length > 0) suggestedAccentColors.push(HOT_PICKS[0]);
  // Fill rest from hot palette
  for (const c of HOT_ACCENTS) {
    if (!suggestedAccentColors.includes(c)) suggestedAccentColors.push(c);
    if (suggestedAccentColors.length >= 5) break;
  }

  // Smart text color (white or black) based on what would have better readability over likely text region
  const suggestedTextColor = averageBrightness > 0.55 ? '#0A0A0A' : '#FFFFFF';

  return {
    subjectSide,
    subjectX: subjectCenterX,
    subjectY: subjectCenterY,
    subjectMap,
    subjectGrid: GRID,
    dominantColors,
    vibrantColors,
    mutedColors,
    harmonyAccents,
    refinedPalette: REFINED,
    neonPalette: NEON,
    averageBrightness,
    zones: {
      tl: cellLum[1][1] || averageBrightness,
      tr: cellLum[1][GRID-2] || averageBrightness,
      bl: cellLum[GRID-2][1] || averageBrightness,
      br: cellLum[GRID-2][GRID-2] || averageBrightness,
      c: cellLum[Math.floor(GRID/2)][Math.floor(GRID/2)] || averageBrightness
    },
    suggestedAccentColors: suggestedAccentColors.slice(0, 5),
    suggestedTextColor
  };
}

// Pick a style-appropriate accent for a given style based on photo analysis
function pickAccentForStyle(style, photo) {
  if (!photo || !style) return style?.colors?.emphasis || '#FFB547';

  const family = style.family;
  // Colorful-emphasis: prefer hot/vibrant from photo or harmony
  if (family === 'colorful-emphasis') {
    return photo.vibrantColors?.[0] || photo.harmonyAccents?.[0] || photo.suggestedAccentColors?.[0] || style.colors.emphasis;
  }
  // Cinematic-dark: neon accent that contrasts
  if (family === 'cinematic-dark') {
    return photo.harmonyAccents?.[0] || photo.neonPalette?.[0] || style.colors.emphasis;
  }
  // Bold-punchy: high-vibrance from photo
  if (family === 'bold-punchy') {
    return photo.vibrantColors?.[0] || photo.suggestedAccentColors?.[0] || style.colors.emphasis;
  }
  // Shadow-pop: pick a high-contrast vibrant accent — keep style's signature color if it's a defining feature
  if (family === 'shadow-pop') {
    // Soft-glow + neon-sign use shadow color as identity; preserve those
    // Other shadow-pop styles can adopt photo accent
    if (style.id === 'soft-glow' || style.id === 'neon-sign') return style.colors.emphasis;
    return photo.vibrantColors?.[0] || photo.harmonyAccents?.[0] || style.colors.emphasis;
  }
  // Bold-layout: lean into vibrant signature colors. Block-emphasis especially benefits from a strong photo-derived accent
  if (family === 'bold-layout') {
    if (style.id === 'block-emphasis' || style.id === 'corner-block' || style.id === 'highlighter-pop') {
      return photo.vibrantColors?.[0] || style.colors.emphasis;
    }
    return photo.harmonyAccents?.[0] || photo.vibrantColors?.[0] || style.colors.emphasis;
  }
  // Subject-foreground: vibrant accent for the words appearing behind the speaker
  if (family === 'subject-foreground') {
    return photo.vibrantColors?.[0] || photo.harmonyAccents?.[0] || style.colors.emphasis;
  }
  // Stacked-label: keep monochrome black/white identity but allow ribbon variants to pull accent
  if (family === 'stacked-label') {
    return style.colors.emphasis;
  }
  // Vintage: keep warm vintage palette as identity
  if (family === 'vintage') {
    return style.colors.emphasis;
  }
  // Ornate-script: pull soft accent for marker; keep gold for gallery
  if (family === 'ornate-script') {
    if (style.id === 'marker-script') {
      return photo.harmonyAccents?.[0] || photo.vibrantColors?.[0] || style.colors.emphasis;
    }
    return style.colors.emphasis;
  }
  // Ribbon-banner: pull vibrant for ribbon color
  if (family === 'ribbon-banner') {
    if (style.id === 'ribbon-banner') {
      return photo.vibrantColors?.[0] || style.colors.accent;
    }
    return style.colors.emphasis;
  }
  // Framed: keep frame elegant identity
  if (family === 'framed') {
    return style.colors.emphasis;
  }
  // Elegant-serif: refined gold/cream
  if (family === 'elegant-serif') {
    return photo.refinedPalette?.[0] || style.colors.emphasis;
  }
  // Editorial-split / minimal: restrained — use existing
  return style.colors.emphasis;
}

/* ================================================================
   STYLE RANKER
================================================================ */
function rankStyles(photo, quote, allStyles, excluded = [], shuffleSeed = 0) {
  const available = allStyles.filter(s => !excluded.includes(s.id));
  const scored = available.map(style => {
    let score = 50;
    // Tone matching
    if (quote.tone === 'scripture' && style.family === 'elegant-serif') score += 30;
    if (quote.tone === 'scripture' && style.family === 'minimal-clean') score += 18;
    if (quote.tone === 'motivational' && style.family === 'bold-punchy') score += 25;
    if (quote.tone === 'motivational' && style.family === 'colorful-emphasis') score += 22;
    if (quote.tone === 'motivational' && style.family === 'cinematic-dark') score += 18;
    if (quote.tone === 'motivational' && style.family === 'editorial-split') score += 16;
    if (quote.tone === 'motivational' && style.family === 'shadow-pop') score += 20;
    if (quote.tone === 'motivational' && style.family === 'bold-layout') score += 24;
    if (quote.tone === 'motivational' && style.family === 'subject-foreground') score += 26;
    if (quote.tone === 'motivational' && style.family === 'stacked-label') score += 18;
    if (quote.tone === 'motivational' && style.family === 'ribbon-banner') score += 14;
    if (quote.tone === 'reflective' && style.family === 'minimal-clean') score += 20;
    if (quote.tone === 'reflective' && style.family === 'elegant-serif') score += 18;
    if (quote.tone === 'reflective' && style.family === 'editorial-split') score += 14;
    if (quote.tone === 'reflective' && style.family === 'shadow-pop') score += 10;
    if (quote.tone === 'reflective' && style.family === 'bold-layout') score += 8;
    if (quote.tone === 'reflective' && style.family === 'ornate-script') score += 22;
    if (quote.tone === 'reflective' && style.family === 'vintage') score += 18;
    if (quote.tone === 'reflective' && style.family === 'framed') score += 16;
    if (quote.tone === 'neutral' && style.family === 'editorial-split') score += 12;
    if (quote.tone === 'neutral' && style.family === 'shadow-pop') score += 10;
    if (quote.tone === 'neutral' && style.family === 'bold-layout') score += 14;
    if (quote.tone === 'neutral' && style.family === 'stacked-label') score += 12;
    if (quote.tone === 'neutral' && style.family === 'framed') score += 10;
    if (quote.tone === 'scripture' && style.family === 'ornate-script') score += 16;
    if (quote.tone === 'scripture' && style.family === 'framed') score += 14;
    // Length
    if (quote.lengthCategory === 'short' && style.intensity === 'bold') score += 15;
    if (quote.lengthCategory === 'short' && style.id === 'mismatched-scale') score += 18;
    if (quote.lengthCategory === 'short' && style.id === 'stacked-title') score += 16;
    if (quote.lengthCategory === 'very-long' && style.family === 'elegant-serif') score += 20;
    if (quote.lengthCategory === 'very-long' && style.intensity === 'bold') score -= 15;
    if (quote.lengthCategory === 'very-long' && style.family === 'minimal-clean') score += 10;
    if (quote.lengthCategory === 'very-long' && style.family === 'bold-layout') score -= 12;
    if (quote.lengthCategory === 'long' && style.family === 'editorial-split') score += 8;
    // Photo
    if (photo) {
      if (photo.subjectSide === 'right' && style.layout.anchor && style.layout.anchor.includes('left')) score += 12;
      if (photo.subjectSide === 'left' && style.layout.anchor && style.layout.anchor.includes('right')) score += 12;
      if (photo.averageBrightness > 0.7 && style.overlay.type !== 'none') score += 8;
      if (photo.averageBrightness < 0.3 && style.overlay.type === 'tinted-light') score -= 10; // light tint on dark photo = no contrast
      // Subject-aware styles get a boost when there IS a clear subject
      if (style.layout.subjectAware && photo.subjectSide !== 'center') score += 12;
      // Editorial-split with a clear subject side
      if (style.family === 'editorial-split' && photo.subjectSide !== 'center') score += 8;
    }
    // Jitter for shuffle
    score += (((style.id.charCodeAt(0) + style.id.charCodeAt(1) + shuffleSeed) * 13) % 100) / 20;
    return { style, score };
  });
  scored.sort((a,b) => b.score - a.score);

  // Ensure family diversity in top 6 — at least 4 different families
  const result = [];
  const familiesUsed = new Map();
  for (const { style } of scored) {
    if (result.length >= 6) break;
    const usedCount = familiesUsed.get(style.family) || 0;
    // Cap at 2 per family in top 6
    if (usedCount >= 2 && familiesUsed.size < 4) continue;
    result.push(style);
    familiesUsed.set(style.family, usedCount + 1);
  }
  // fill remainder if we somehow don't have 6
  for (const { style } of scored) {
    if (result.length >= 6) break;
    if (!result.includes(style)) result.push(style);
  }
  return result;
}

/* ================================================================
   PHOTO FILTERS
================================================================ */
const FILTERS = {
  original: { name: 'Original', apply: null },
  cinematic: {
    name: 'Cinematic',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        if (brightness < 128) {
          data[i] = Math.max(0, data[i] * 0.9);
          data[i+2] = Math.min(255, data[i+2] * 1.15);
        } else {
          data[i] = Math.min(255, data[i] * 1.1);
          data[i+2] = Math.max(0, data[i+2] * 0.9);
        }
        for (let c = 0; c < 3; c++) data[i+c] = Math.max(0, Math.min(255, ((data[i+c] - 128) * 1.15) + 128));
      }
    }
  },
  bw: {
    name: 'B&W',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        const c = Math.max(0, Math.min(255, ((gray - 128) * 1.2) + 128));
        data[i] = data[i+1] = data[i+2] = c;
      }
    }
  },
  fade: {
    name: 'Fade',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.85 + 40);
        data[i+1] = Math.min(255, data[i+1] * 0.85 + 40);
        data[i+2] = Math.min(255, data[i+2] * 0.85 + 40);
      }
    }
  },
  warm: {
    name: 'Warm',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.15);
        data[i+1] = Math.min(255, data[i+1] * 1.05);
        data[i+2] = Math.max(0, data[i+2] * 0.9);
      }
    }
  },
  cool: {
    name: 'Cool',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] * 0.9);
        data[i+1] = Math.min(255, data[i+1] * 1.02);
        data[i+2] = Math.min(255, data[i+2] * 1.15);
      }
    }
  },
  vintage: {
    name: 'Vintage',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        data[i]   = Math.min(255, 0.393*r + 0.769*g + 0.189*b);
        data[i+1] = Math.min(255, 0.349*r + 0.686*g + 0.168*b);
        data[i+2] = Math.min(255, 0.272*r + 0.534*g + 0.131*b);
      }
    }
  },
  dramatic: {
    name: 'Dramatic',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) data[i+c] = Math.max(0, Math.min(255, ((data[i+c] - 128) * 1.4) + 115));
      }
    }
  },
  noir: {
    name: 'Noir',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        const c = Math.max(0, Math.min(255, ((gray - 100) * 1.5) + 90));
        data[i] = data[i+1] = data[i+2] = c;
      }
    }
  }
};

/* ================================================================
   CANVAS RENDERER
================================================================ */
function applyCasing(text, casing) {
  switch (casing) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'asis': return text;
    case 'mixed':
    default: return text;
  }
}

function drawImageCover(ctx, img, x, y, w, h, offsetX = 0, offsetY = 0, zoom = 1) {
  if (!img) return;
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let drawW, drawH;
  if (imgRatio > boxRatio) {
    drawH = h * zoom;
    drawW = drawH * imgRatio;
  } else {
    drawW = w * zoom;
    drawH = drawW / imgRatio;
  }
  const dx = x + (w - drawW) / 2 + offsetX * w;
  const dy = y + (h - drawH) / 2 + offsetY * h;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

function applyImageFilter(ctx, x, y, w, h, filterKey) {
  const filter = FILTERS[filterKey];
  if (!filter || !filter.apply) return;
  try {
    const imageData = ctx.getImageData(x, y, w, h);
    filter.apply(imageData.data);
    ctx.putImageData(imageData, x, y);
  } catch (e) {
    // CORS or tainted canvas - skip silently
  }
}

// Resolves shadow settings from style + overrides
function getShadow(S, overrides = {}) {
  const enabled = overrides.shadowEnabled !== undefined ? overrides.shadowEnabled : S.effects.textShadow;
  if (!enabled) return { enabled: false };
  return {
    enabled: true,
    color: overrides.shadowColor ?? S.effects.shadowColor ?? 'rgba(0,0,0,0.6)',
    blur: overrides.shadowBlur !== undefined ? overrides.shadowBlur : (S.effects.shadowBlur ?? 12),
    offsetX: overrides.shadowOffsetX !== undefined ? overrides.shadowOffsetX : (S.effects.shadowOffsetX ?? 0),
    offsetY: overrides.shadowOffsetY !== undefined ? overrides.shadowOffsetY : (S.effects.shadowOffsetY ?? 4),
    opacity: overrides.shadowOpacity !== undefined ? overrides.shadowOpacity : 1
  };
}

// Apply shadow to ctx (call inside ctx.save/restore block)
function applyShadow(ctx, shadow, halfStrength = false) {
  if (!shadow.enabled) return;
  // If color has alpha already, respect it; if it's solid, use opacity
  let color = shadow.color;
  if (shadow.opacity < 1 && color && color.startsWith('#')) {
    // Convert hex to rgba with opacity
    const h = color.replace('#', '');
    const r = parseInt(h.slice(0,2), 16);
    const g = parseInt(h.slice(2,4), 16);
    const b = parseInt(h.slice(4,6), 16);
    color = `rgba(${r},${g},${b},${shadow.opacity})`;
  } else if (shadow.opacity < 1 && color && color.startsWith('rgba')) {
    // Multiply existing alpha by opacity
    const m = color.match(/rgba\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(',').map(s => s.trim());
      const a = (parseFloat(parts[3] || '1')) * shadow.opacity;
      color = `rgba(${parts[0]},${parts[1]},${parts[2]},${a})`;
    }
  }
  ctx.shadowColor = color;
  ctx.shadowBlur = halfStrength ? shadow.blur / 2 : shadow.blur;
  ctx.shadowOffsetX = halfStrength ? shadow.offsetX / 2 : shadow.offsetX;
  ctx.shadowOffsetY = halfStrength ? shadow.offsetY / 2 : shadow.offsetY;
}

function drawOverlay(ctx, w, h, overlay, photo) {
  if (!overlay || overlay.type === 'none') return;
  ctx.save();
  ctx.globalAlpha = overlay.darkness;
  switch (overlay.type) {
    case 'full-dark':
    case 'full-light':
      ctx.fillStyle = overlay.color;
      ctx.fillRect(0, 0, w, h);
      break;
    case 'tinted-light': {
      // Light wash that lets the photo show through
      ctx.fillStyle = overlay.color;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'dark-bottom': {
      const grad = ctx.createLinearGradient(0, h * 0.2, 0, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, overlay.color);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'dark-top': {
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.8);
      grad.addColorStop(0, overlay.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'vignette': {
      const grad = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.25, w/2, h/2, Math.min(w,h)*0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, overlay.color);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'radial-dark': {
      const grad = ctx.createRadialGradient(w*0.3, h*0.5, 0, w*0.3, h*0.5, w*0.9);
      grad.addColorStop(0, overlay.color);
      grad.addColorStop(0.7, `${overlay.color}99`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'gradient-diagonal': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, overlay.color);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'split-vertical': {
      // Solid color on one side. Hard edge.
      const ratio = overlay.splitRatio || 0.6;
      const side = overlay.splitSide || 'left';
      ctx.fillStyle = overlay.color;
      if (side === 'left') {
        ctx.fillRect(0, 0, w * ratio, h);
      } else {
        ctx.fillRect(w * (1 - ratio), 0, w * ratio, h);
      }
      break;
    }
    case 'caption-band': {
      // Solid colored band at top or bottom, photo shows in the rest
      const bandH = (overlay.bandHeight || 0.4) * h;
      const pos = overlay.bandPosition || 'bottom';
      ctx.fillStyle = overlay.color;
      if (pos === 'bottom') {
        ctx.fillRect(0, h - bandH, w, bandH);
      } else {
        ctx.fillRect(0, 0, w, bandH);
      }
      break;
    }
    case 'subject-spotlight': {
      // Dark overlay everywhere EXCEPT around the subject region
      // Creates an effect that the subject "pops" out of the darkness
      const subX = (photo?.subjectX ?? 0.7) * w;
      const subY = (photo?.subjectY ?? 0.5) * h;
      const radius = Math.min(w, h) * 0.5;
      const grad = ctx.createRadialGradient(subX, subY, radius * 0.2, subX, subY, radius);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.6, `${overlay.color}88`);
      grad.addColorStop(1, overlay.color);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    default:
      ctx.fillStyle = overlay.color;
      ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

function drawConstellation(ctx, w, h, color, density) {
  const count = density === 'low' ? 6 : density === 'high' ? 16 : 10;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, w / 800);
  // Seeded pseudo-random positions
  const pts = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 137;
    const x = ((seed * 7) % 100) / 100 * w;
    const y = ((seed * 11) % 100) / 100 * h;
    pts.push({ x, y });
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, w / 180), 0, Math.PI * 2);
    ctx.fill();
  }
  // Connect some nearby pairs
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i+1];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < w * 0.35) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawHexFrame(ctx, w, h, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, w / 400);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + Math.cos(ang) * r;
    const y = cy + Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// Asymmetric color shape — large geometric block in a corner
// Variants: 'corner-block' (rectangle), 'quarter-circle', 'diagonal-band'
function drawAsymmetricShape(ctx, w, h, variant, color, position) {
  ctx.save();
  ctx.fillStyle = color;
  position = position || 'top-left';
  const size = Math.min(w, h);
  if (variant === 'corner-block') {
    const blockW = w * 0.45;
    const blockH = h * 0.35;
    if (position === 'top-left') ctx.fillRect(0, 0, blockW, blockH);
    else if (position === 'top-right') ctx.fillRect(w - blockW, 0, blockW, blockH);
    else if (position === 'bottom-left') ctx.fillRect(0, h - blockH, blockW, blockH);
    else ctx.fillRect(w - blockW, h - blockH, blockW, blockH);
  } else if (variant === 'quarter-circle') {
    const r = size * 0.55;
    ctx.beginPath();
    let cx, cy;
    if (position === 'top-left') { cx = 0; cy = 0; }
    else if (position === 'top-right') { cx = w; cy = 0; }
    else if (position === 'bottom-left') { cx = 0; cy = h; }
    else { cx = w; cy = h; }
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'diagonal-band') {
    // Wide diagonal band sweeping across canvas
    ctx.beginPath();
    if (position === 'top-left' || position === 'bottom-right') {
      ctx.moveTo(0, h * 0.35);
      ctx.lineTo(w, h * 0.55);
      ctx.lineTo(w, h * 0.7);
      ctx.lineTo(0, h * 0.5);
    } else {
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.3);
      ctx.lineTo(w, h * 0.45);
      ctx.lineTo(0, h * 0.65);
    }
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'half-circle-edge') {
    // Half circle attached to one edge
    const r = size * 0.5;
    ctx.beginPath();
    if (position === 'top-left' || position === 'top-right') {
      const cx = position === 'top-left' ? 0 : w;
      ctx.arc(cx, h * 0.3, r, 0, Math.PI * 2);
    } else {
      const cx = position === 'bottom-left' ? 0 : w;
      ctx.arc(cx, h * 0.7, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.restore();
}

// Draw a bordered box around a single line of text (stacked-label style)
function drawLineBox(ctx, x, y, w, h, borderColor, borderWidth, fillColor) {
  ctx.save();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

// Draw a ribbon banner shape with notched ends — for award/ribbon styles
function drawRibbon(ctx, x, y, w, h, color, notchSize) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - notchSize, y + h / 2);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + notchSize, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Double-line frame — outer thick line, inner thin line, for "boxed quote" style
function drawDoubleFrame(ctx, w, h, color, marginRatio) {
  ctx.save();
  ctx.strokeStyle = color;
  const margin = Math.min(w, h) * marginRatio;
  // Outer thicker frame
  ctx.lineWidth = Math.max(3, w / 200);
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
  // Inner thin frame
  ctx.lineWidth = Math.max(1, w / 600);
  const innerMargin = margin + Math.max(8, w / 100);
  ctx.strokeRect(innerMargin, innerMargin, w - innerMargin * 2, h - innerMargin * 2);
  ctx.restore();
}

// Stamp-style frame with rounded corners
function drawStampFrame(ctx, w, h, color, marginRatio) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, w / 180);
  const margin = Math.min(w, h) * marginRatio;
  const x = margin, y = margin;
  const fw = w - margin * 2, fh = h - margin * 2;
  const r = Math.min(fw, fh) * 0.05;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + fw - r, y);
  ctx.quadraticCurveTo(x + fw, y, x + fw, y + r);
  ctx.lineTo(x + fw, y + fh - r);
  ctx.quadraticCurveTo(x + fw, y + fh, x + fw - r, y + fh);
  ctx.lineTo(x + r, y + fh);
  ctx.quadraticCurveTo(x, y + fh, x, y + fh - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// Grain/noise overlay for vintage/distressed styles
// Draws semi-transparent random pixels — stays consistent per render via seed
function drawGrainOverlay(ctx, w, h, intensity) {
  ctx.save();
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const noiseStrength = intensity * 25; // 0–25 noise range
  // Use a simple deterministic pseudo-random so grain is consistent
  let seed = 123456;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < data.length; i += 4) {
    const noise = (rand() - 0.5) * noiseStrength;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
}

function wrapLines(ctx, words, maxWidth, style, baseFontSize, overrides = {}) {
  // words: [{text, emphasized, isConnector, index}]
  // Returns: [[{word, emphasized, w, fontSize, font, spaceAfter}]]
  const lines = [];
  let currentLine = [];
  let currentWidth = 0;

  // Consistent word gap based on baseFontSize, not per-word size
  // This prevents emphasized words from swallowing their trailing space
  const WORD_GAP_RATIO = 0.32;
  const wordGap = baseFontSize * WORD_GAP_RATIO;

  const perWord = (overrides && overrides.perWordOverrides) || {};

  // Special layout flag: mismatchedScale picks one "hero" word and renders it 2.2x while everything else is 0.5x
  const mismatchedScale = style.layout.mismatchedScale;
  let heroIndex = -1;
  if (mismatchedScale) {
    // Find the longest emphasized word, or longest word overall
    let longestLen = 0;
    for (const w of words) {
      if (w.emphasized && w.text.length > longestLen) {
        longestLen = w.text.length;
        heroIndex = w.index;
      }
    }
    if (heroIndex < 0) {
      // Fall back to longest word
      for (const w of words) {
        if (w.text.length > longestLen) {
          longestLen = w.text.length;
          heroIndex = w.index;
        }
      }
    }
  }

  // Special layout flag: stackedTitle puts each word on its own line, all large
  const stackedTitle = style.layout.stackedTitle;

  const getWordFont = (w) => {
    const pw = perWord[w.index] || {};
    // per-word emphasis override
    const emphasized = pw.emphasized !== undefined ? pw.emphasized : w.emphasized;
    const sizeMul = pw.sizeMultiplier || 1;

    let size;
    if (mismatchedScale) {
      // Hero word HUGE, rest tiny
      const isHero = w.index === heroIndex;
      size = (isHero ? baseFontSize * 2.0 : baseFontSize * 0.42) * sizeMul;
    } else if (stackedTitle) {
      // Every word large
      size = baseFontSize * 1.05 * sizeMul;
    } else {
      const useBig = emphasized && style.colors.useEmphasisSystem && (style.family === 'bold-punchy' || style.family === 'colorful-emphasis');
      size = (useBig ? baseFontSize * 1.4 : baseFontSize) * sizeMul;
    }

    // Mismatched scale: hero word uses primary font/weight, rest uses secondary (tiny + light)
    let isPrimary;
    if (mismatchedScale) {
      isPrimary = w.index === heroIndex;
    } else {
      isPrimary = emphasized || !style.colors.useEmphasisSystem;
    }
    const family = isPrimary ? style.typography.fontPrimary : style.typography.fontSecondary;
    const styleWeight = isPrimary ? style.typography.weightPrimary : style.typography.weightSecondary;
    const styleItalic = isPrimary ? style.typography.italicPrimary : style.typography.italicSecondary;
    // Apply per-word italic/weight overrides
    const finalWeight = pw.weight !== undefined ? pw.weight : styleWeight;
    const finalItalic = (pw.italic !== undefined ? pw.italic : styleItalic) ? 'italic ' : '';
    const letterSpacing = overrides.letterSpacing ?? style.typography.letterSpacing ?? 0;
    return { font: `${finalItalic}${finalWeight} ${size}px "${family}"`, size, family, emphasized, letterSpacing, forceLineBreak: stackedTitle };
  };

  for (const word of words) {
    const cased = applyCasing(word.text, style.typography.casing);
    const { font, size, emphasized, letterSpacing, forceLineBreak } = getWordFont(word);
    ctx.font = font;
    let wordWidth = ctx.measureText(cased).width;
    // Add letter spacing contribution
    if (letterSpacing) wordWidth += letterSpacing * size * cased.length;

    const needsGap = currentLine.length > 0;
    const projectedWidth = currentWidth + (needsGap ? wordGap : 0) + wordWidth;

    // Stacked title: each word on its own line
    if (forceLineBreak && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      currentWidth = 0;
    } else if (projectedWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      currentWidth = 0;
    }
    currentLine.push({
      ...word,
      text: cased,
      w: wordWidth,
      fontSize: size,
      font,
      emphasized,
      letterSpacing
    });
    currentWidth += (currentLine.length > 1 ? wordGap : 0) + wordWidth;

    // Stacked title: force break after each word
    if (forceLineBreak) {
      lines.push(currentLine);
      currentLine = [];
      currentWidth = 0;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);
  // Attach gap info to line for consistent measurement/drawing
  lines.wordGap = wordGap;
  return lines;
}

function measureLine(line, wordGap) {
  return line.reduce((sum, w, i) => sum + w.w + (i > 0 ? wordGap : 0), 0);
}

function renderDesign(canvas, design, isPreview = false) {
  const { width, height, image, style, overrides = {}, words } = design;
  const ctx = canvas.getContext('2d');
  const dpr = isPreview ? 1 : (window.devicePixelRatio || 1);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  // Note: display size (canvas.style.width/height) is controlled by parent CSS
  // so it scales to fit the container. Internal resolution stays at width*dpr.
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);

  const S = style;
  const imageZoom = overrides.imageZoom ?? 1;
  const imgOX = overrides.imageOffsetX ?? 0;
  const imgOY = overrides.imageOffsetY ?? 0;
  const filterKey = overrides.filter ?? 'original';

  // Background
  ctx.fillStyle = S.overlay.type === 'full-light' ? (S.overlay.color || '#F2F0EC') : '#000000';
  ctx.fillRect(0, 0, width, height);

  // Image
  if (image) {
    drawImageCover(ctx, image, 0, 0, width, height, imgOX, imgOY, imageZoom);
    // Brightness/contrast/saturation via filter key
    applyImageFilter(ctx, 0, 0, width, height, filterKey);
  }

  // Overlay
  const overlayDarkness = overrides.overlayDarkness ?? S.overlay.darkness;
  const overlayType = overrides.overlayType ?? S.overlay.type;
  const overlayColor = overrides.overlayColor ?? S.overlay.color;

  // Pre-compute layout to know dynamic band height (for caption-band autoBand styles)
  let preComputedLines = null;
  let preComputedTextHeight = 0;
  let dynamicBandHeight = S.overlay.bandHeight;
  if (overlayType === 'caption-band' && S.layout.autoBand) {
    const tempBaseFontSize = computeBaseFontSize(design);
    const tempTextWidth = (overrides.textWidth ?? S.layout.textWidth) * width;
    preComputedLines = wrapLines(ctx, words, tempTextWidth, S, tempBaseFontSize, overrides);
    const tempLineHeight = tempBaseFontSize * (overrides.lineHeight ?? S.typography.lineHeight);
    preComputedTextHeight = preComputedLines.length * tempLineHeight;
    const authorH = design.author ? Math.max(16, tempBaseFontSize * 0.28) * 1.5 : 0;
    const padBuffer = S.layout.paddingY * height * 2;
    // Band must be at least big enough to contain text + author + padding, but never more than 50% of canvas
    const requiredHeight = preComputedTextHeight + authorH + padBuffer;
    dynamicBandHeight = Math.min(0.5, Math.max(0.18, requiredHeight / height));
  }

  drawOverlay(ctx, width, height, {
    type: overlayType,
    darkness: overlayDarkness,
    color: overlayColor,
    splitSide: S.overlay.splitSide,
    splitRatio: S.overlay.splitRatio,
    bandPosition: S.overlay.bandPosition,
    bandHeight: dynamicBandHeight
  }, design.photo);

  // Resolve shadow once for whole render
  const shadow = getShadow(S, overrides);

  // Background decorations
  if (S.decorations.constellation) {
    drawConstellation(ctx, width, height, S.decorations.constellationColor || '#FFD70044', S.decorations.constellationDensity || 'medium');
  }
  if (S.decorations.frame) {
    drawHexFrame(ctx, width, height, S.decorations.frameColor || '#FFFFFF22');
  }
  if (S.decorations.asymShape) {
    drawAsymmetricShape(
      ctx, width, height,
      S.decorations.asymShape,
      S.decorations.asymShapeColor || '#FFB547',
      S.decorations.asymShapePosition || 'top-left'
    );
  }
  if (S.decorations.doubleFrame) {
    drawDoubleFrame(ctx, width, height, S.decorations.frameColor || '#FFFFFF', S.decorations.frameMargin || 0.04);
  }
  if (S.decorations.stampFrame) {
    drawStampFrame(ctx, width, height, S.decorations.frameColor || '#0A0A0A', S.decorations.frameMargin || 0.05);
  }

  // Compute text layout
  const baseFontSize = computeBaseFontSize(design);
  const textWidth = (overrides.textWidth ?? S.layout.textWidth) * width;
  const lines = wrapLines(ctx, words, textWidth, S, baseFontSize, overrides);
  const wordGap = lines.wordGap || baseFontSize * 0.32;
  const lineHeightMul = overrides.lineHeight ?? S.typography.lineHeight;
  const lineHeight = baseFontSize * lineHeightMul;
  const totalTextHeight = lines.length * lineHeight;

  // Anchor
  const anchor = overrides.anchor ?? S.layout.anchor;
  const alignment = overrides.alignment ?? S.layout.alignment;
  const padX = S.layout.paddingX * width;
  const padY = S.layout.paddingY * height;
  const author = design.author;
  const authorFontSize = Math.max(16, baseFontSize * 0.28);
  const authorHeight = author ? authorFontSize * 1.5 : 0;

  let blockY;
  if (anchor.includes('top')) blockY = padY;
  else if (anchor.includes('bottom')) blockY = height - padY - totalTextHeight - authorHeight;
  else blockY = (height - totalTextHeight - authorHeight) / 2;

  blockY += (overrides.offsetY || 0) * height;

  // Author offsets/size (separate from quote)
  const authorOffsetX = overrides.authorOffsetX || 0;
  const authorOffsetY = overrides.authorOffsetY || 0;
  const authorSizeMul = overrides.authorSizeMultiplier || 1;
  const authorFontSizeFinal = authorFontSize * authorSizeMul;

  // Author drawing helper — handles all author overrides consistently
  function drawAuthorAt(ctx, author, baseAx, baseAy, alignment) {
    if (!author) return null;
    // Resolve all author overrides
    const aFont = overrides.authorFont ?? S.typography.fontAuthor;
    const aWeight = overrides.authorWeight ?? S.typography.weightAuthor ?? 600;
    const aItalic = (overrides.authorItalic !== undefined ? overrides.authorItalic : (S.typography.italicAuthor || false)) ? 'italic ' : '';
    const aCasing = overrides.authorCasingOverride ?? S.layout.authorCasing;
    const aLetterSpacing = overrides.authorLetterSpacing ?? 0;
    const aColor = overrides.authorColor ?? S.colors.author;
    const aPillEnabled = overrides.authorPillEnabled || false;
    const aPillColor = overrides.authorPillColor ?? '#FFB547';
    const aPillPadding = overrides.authorPillPadding ?? 0.5;
    const aShadowEnabled = overrides.authorShadowEnabled !== undefined ? overrides.authorShadowEnabled : false;
    const aShadowColor = overrides.authorShadowColor ?? '#000000';
    const aShadowBlur = overrides.authorShadowBlur ?? 8;
    const aShadowOX = overrides.authorShadowOffsetX ?? 0;
    const aShadowOY = overrides.authorShadowOffsetY ?? 2;
    const aShadowOpacity = overrides.authorShadowOpacity ?? 0.6;

    ctx.save();
    ctx.font = `${aItalic}${aWeight} ${authorFontSizeFinal}px "${aFont}"`;
    ctx.textBaseline = 'top';

    const authorText = applyCasing(author, aCasing);
    let aw = ctx.measureText(authorText).width;
    if (aLetterSpacing) aw += aLetterSpacing * authorFontSizeFinal * authorText.length;

    let ax;
    if (alignment === 'center') ax = (width - aw) / 2;
    else if (alignment === 'right') ax = width - padX - aw;
    else ax = padX;
    ax += (overrides.offsetX || 0) * width + authorOffsetX * width;

    // Draw pill background (behind text)
    if (aPillEnabled) {
      const padPx = authorFontSizeFinal * aPillPadding;
      const pillX = ax - padPx;
      const pillY = baseAy - padPx * 0.4;
      const pillW = aw + padPx * 2;
      const pillH = authorFontSizeFinal + padPx * 0.8;
      const radius = pillH / 2;
      ctx.save();
      ctx.fillStyle = aPillColor;
      ctx.beginPath();
      ctx.moveTo(pillX + radius, pillY);
      ctx.lineTo(pillX + pillW - radius, pillY);
      ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + radius);
      ctx.lineTo(pillX + pillW, pillY + pillH - radius);
      ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - radius, pillY + pillH);
      ctx.lineTo(pillX + radius, pillY + pillH);
      ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - radius);
      ctx.lineTo(pillX, pillY + radius);
      ctx.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Apply author-specific shadow if enabled, otherwise inherit quote shadow at half strength
    if (aShadowEnabled) {
      let shColor = aShadowColor;
      if (aShadowOpacity < 1 && shColor.startsWith('#')) {
        const h = shColor.replace('#', '');
        const r = parseInt(h.slice(0,2), 16);
        const g = parseInt(h.slice(2,4), 16);
        const b = parseInt(h.slice(4,6), 16);
        shColor = `rgba(${r},${g},${b},${aShadowOpacity})`;
      }
      ctx.shadowColor = shColor;
      ctx.shadowBlur = aShadowBlur;
      ctx.shadowOffsetX = aShadowOX;
      ctx.shadowOffsetY = aShadowOY;
    } else {
      applyShadow(ctx, shadow, true);
    }

    ctx.fillStyle = aColor;
    // Draw author with letter spacing if specified
    if (aLetterSpacing) {
      let lx = ax;
      for (const ch of authorText) {
        ctx.fillText(ch, lx, baseAy);
        lx += ctx.measureText(ch).width + aLetterSpacing * authorFontSizeFinal;
      }
    } else {
      ctx.fillText(authorText, ax, baseAy);
    }
    ctx.restore();
    return { x: ax / width, y: baseAy / height, w: aw / width, h: authorFontSizeFinal / height };
  }

  // Draw author above if configured
  const authorAbove = S.layout.authorPosition === 'above' && author;
  let authorHitBox = null;
  if (authorAbove) {
    const ay = blockY - authorHeight + 4 + authorOffsetY * height;
    authorHitBox = drawAuthorAt(ctx, author, 0, ay, alignment);
  }

  // Word hit boxes to return (in canvas coords — scaled to displayed canvas later)
  const hitBoxes = [];
  const perWord = overrides.perWordOverrides || {};

  // Sticker stamp pill background — drawn behind the text block
  if (S.decorations.stickerStamp && S.layout.stickerBg) {
    ctx.save();
    // Compute bounding box of all text lines
    let maxLineW = 0;
    lines.forEach(line => {
      const w = measureLine(line, wordGap);
      if (w > maxLineW) maxLineW = w;
    });
    const padXSticker = baseFontSize * 0.5;
    const padYSticker = baseFontSize * 0.3;
    let stickerX;
    if (alignment === 'center') stickerX = (width - maxLineW) / 2;
    else if (alignment === 'right') stickerX = width - padX - maxLineW;
    else stickerX = padX;
    stickerX += (overrides.offsetX || 0) * width;
    const stickerY = blockY - padYSticker;
    const stickerW = maxLineW + padXSticker * 2;
    const stickerH = totalTextHeight + padYSticker * 2;
    // Apply rotation if specified
    const rot = (S.layout.rotation || 0) * Math.PI / 180;
    if (rot !== 0) {
      ctx.translate(stickerX + stickerW / 2, stickerY + stickerH / 2);
      ctx.rotate(rot);
      ctx.translate(-(stickerX + stickerW / 2), -(stickerY + stickerH / 2));
    }
    // Rounded pill
    const radius = Math.min(stickerH / 2, baseFontSize * 0.6);
    ctx.fillStyle = S.layout.stickerBg;
    ctx.beginPath();
    ctx.moveTo(stickerX - padXSticker + radius, stickerY);
    ctx.lineTo(stickerX + stickerW - padXSticker - radius, stickerY);
    ctx.quadraticCurveTo(stickerX + stickerW - padXSticker, stickerY, stickerX + stickerW - padXSticker, stickerY + radius);
    ctx.lineTo(stickerX + stickerW - padXSticker, stickerY + stickerH - radius);
    ctx.quadraticCurveTo(stickerX + stickerW - padXSticker, stickerY + stickerH, stickerX + stickerW - padXSticker - radius, stickerY + stickerH);
    ctx.lineTo(stickerX - padXSticker + radius, stickerY + stickerH);
    ctx.quadraticCurveTo(stickerX - padXSticker, stickerY + stickerH, stickerX - padXSticker, stickerY + stickerH - radius);
    ctx.lineTo(stickerX - padXSticker, stickerY + radius);
    ctx.quadraticCurveTo(stickerX - padXSticker, stickerY, stickerX - padXSticker + radius, stickerY);
    ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = baseFontSize * 0.3;
    ctx.shadowOffsetY = baseFontSize * 0.1;
    ctx.fill();
    ctx.restore();
  }

  // Draw lines
  // SUBJECT COLLISION SAFETY: if the text region would overlap the detected subject,
  // and the existing overlay isn't strong enough to keep text readable, paint a
  // localized gradient scrim behind just the text. This prevents text-over-face accidents.
  const photo = design.photo;
  const overlayProvidesContrast = (
    overlayType === 'full-dark' ||
    overlayType === 'split-vertical' ||
    overlayType === 'caption-band' ||
    overlayType === 'tinted-light' ||
    (overlayType === 'dark-bottom' && anchor.includes('bottom')) ||
    (overlayType === 'dark-top' && anchor.includes('top')) ||
    (overlayDarkness >= 0.6 && overlayType !== 'none')
  );
  if (photo && !overlayProvidesContrast && S.colors.useEmphasisSystem !== false) {
    // Compute text bounding box (with a margin)
    let maxLineW = 0;
    lines.forEach(line => {
      const w = measureLine(line, wordGap);
      if (w > maxLineW) maxLineW = w;
    });
    const textBoxX = (alignment === 'center' ? (width - maxLineW) / 2 :
                      alignment === 'right' ? width - padX - maxLineW : padX) +
                     (overrides.offsetX || 0) * width;
    const textBoxY = blockY;
    const textBoxW = maxLineW;
    const textBoxH = totalTextHeight;
    // Subject region (from photo analysis) — convert from normalized to pixels
    const subX = (photo.subjectX ?? 0.5) * width;
    const subY = (photo.subjectY ?? 0.5) * height;
    const subRadius = Math.min(width, height) * 0.18;
    // Check if text box overlaps subject
    const closestX = Math.max(textBoxX, Math.min(subX, textBoxX + textBoxW));
    const closestY = Math.max(textBoxY, Math.min(subY, textBoxY + textBoxH));
    const dist = Math.hypot(subX - closestX, subY - closestY);
    if (dist < subRadius) {
      // Paint a soft elliptical scrim behind text only
      ctx.save();
      const cx = textBoxX + textBoxW / 2;
      const cy = textBoxY + textBoxH / 2;
      const rx = textBoxW / 2 + width * 0.08;
      const ry = textBoxH / 2 + height * 0.05;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      // Use overlay color if dark, else default to dark
      const scrimColor = overlayColor && overlayColor !== '#F2F0EC' ? overlayColor : '#000000';
      grad.addColorStop(0, scrimColor + 'A0'); // semi-opaque center
      grad.addColorStop(0.7, scrimColor + '60');
      grad.addColorStop(1, scrimColor + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  // Apply text rotation if style specifies it
  // Apply text rotation if style specifies it OR user has rotated via gesture
  const styleRotation = S.layout.rotation || 0;
  const userRotation = overrides.rotationOverride || 0;
  const totalRotation = styleRotation + userRotation;
  const textRotation = totalRotation * Math.PI / 180;
  if (textRotation !== 0) {
    ctx.save();
    // Rotate around text block center
    let maxLineWForRot = 0;
    lines.forEach(line => {
      const w = measureLine(line, wordGap);
      if (w > maxLineWForRot) maxLineWForRot = w;
    });
    let centerX;
    if (alignment === 'center') centerX = width / 2;
    else if (alignment === 'right') centerX = width - padX - maxLineWForRot / 2;
    else centerX = padX + maxLineWForRot / 2;
    centerX += (overrides.offsetX || 0) * width;
    const centerY = blockY + totalTextHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(textRotation);
    ctx.translate(-centerX, -centerY);
  }

  lines.forEach((line, lineIdx) => {
    const lineWidthActual = measureLine(line, wordGap);
    let startX;
    if (alignment === 'center') startX = (width - lineWidthActual) / 2;
    else if (alignment === 'right') startX = width - padX - lineWidthActual;
    else startX = padX;

    startX += (overrides.offsetX || 0) * width;

    const y = blockY + lineIdx * lineHeight;
    let x = startX;

    // Per-line decorations — drawn BEFORE words on this line
    // Each style decides whether boxes/ribbons should hug each line
    const lineMaxFontSize = Math.max(...line.map(w => w.fontSize));
    if (S.decorations.lineBox) {
      const padXBox = lineMaxFontSize * 0.3;
      const padYBox = lineMaxFontSize * 0.15;
      const boxX = startX - padXBox;
      const boxY = y - padYBox;
      const boxW = lineWidthActual + padXBox * 2;
      const boxH = lineMaxFontSize + padYBox * 2;
      const borderColor = S.decorations.lineBoxBorderColor || '#0A0A0A';
      const borderWidth = Math.max(2, lineMaxFontSize * (S.decorations.lineBoxBorderRatio || 0.05));
      const fillColor = S.decorations.lineBoxFill || null;
      drawLineBox(ctx, boxX, boxY, boxW, boxH, borderColor, borderWidth, fillColor);
    }
    if (S.decorations.lineRibbon) {
      const padXRib = lineMaxFontSize * 0.5;
      const padYRib = lineMaxFontSize * 0.2;
      const ribX = startX - padXRib;
      const ribY = y - padYRib;
      const ribW = lineWidthActual + padXRib * 2;
      const ribH = lineMaxFontSize + padYRib * 2;
      const ribColor = S.decorations.lineRibbonColor || '#FFB547';
      const notch = lineMaxFontSize * 0.4;
      drawRibbon(ctx, ribX, ribY, ribW, ribH, ribColor, notch);
    }

    line.forEach((w, wIdx) => {
      ctx.font = w.font;
      ctx.textBaseline = 'top';

      // Per-word background (color block / highlighter) — drawn BEFORE the word
      // Only applies to emphasized words and only if style configures it
      const wordBgType = S.decorations.wordBg; // 'block' | 'highlighter' | null
      if (wordBgType && w.emphasized) {
        ctx.save();
        const bgColor = S.decorations.wordBgColor || S.colors.emphasis;
        if (wordBgType === 'block') {
          // Solid color block tightly hugging the word, slight padding
          const padX = w.fontSize * 0.12;
          const padY = w.fontSize * 0.05;
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - padX, y - padY, w.w + padX * 2, w.fontSize + padY * 2);
        } else if (wordBgType === 'highlighter') {
          // Translucent rectangle behind the lower portion of the word, like a Stabilo marker
          const padX = w.fontSize * 0.08;
          // Highlighter sits in the lower 70% of the cap height
          const stripeY = y + w.fontSize * 0.25;
          const stripeH = w.fontSize * 0.7;
          // Add alpha to color
          let hlColor = bgColor;
          if (hlColor.startsWith('#') && hlColor.length === 7) {
            hlColor = hlColor + '80'; // 50% alpha
          }
          ctx.fillStyle = hlColor;
          // Slightly slanted edges look hand-drawn
          ctx.beginPath();
          ctx.moveTo(x - padX, stripeY);
          ctx.lineTo(x + w.w + padX, stripeY - stripeH * 0.05);
          ctx.lineTo(x + w.w + padX * 1.3, stripeY + stripeH);
          ctx.lineTo(x - padX * 1.2, stripeY + stripeH + stripeH * 0.05);
          ctx.closePath();
          ctx.fill();
        } else if (wordBgType === 'underline') {
          // Thick underline below the word
          const padX = w.fontSize * 0.05;
          const lineY = y + w.fontSize * 0.95;
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - padX, lineY, w.w + padX * 2, w.fontSize * 0.12);
        }
        ctx.restore();
      }

      // Effects
      ctx.save();

      // Color — check for per-word override first
      const pw = perWord[w.index] || {};

      // Apply per-word shadow override if enabled, otherwise use style shadow
      if (pw.shadowEnabled) {
        let pwShColor = pw.shadowColor || '#000000';
        const pwShOpacity = pw.shadowOpacity ?? 0.6;
        if (pwShOpacity < 1 && pwShColor.startsWith('#')) {
          const h = pwShColor.replace('#', '');
          const r = parseInt(h.slice(0,2), 16);
          const g = parseInt(h.slice(2,4), 16);
          const b = parseInt(h.slice(4,6), 16);
          pwShColor = `rgba(${r},${g},${b},${pwShOpacity})`;
        }
        ctx.shadowColor = pwShColor;
        ctx.shadowBlur = pw.shadowBlur ?? 8;
        ctx.shadowOffsetX = pw.shadowOffsetX ?? 0;
        ctx.shadowOffsetY = pw.shadowOffsetY ?? 2;
      } else {
        applyShadow(ctx, shadow, false);
      }
      if (S.effects.glow && w.emphasized) {
        ctx.shadowColor = S.effects.glowColor;
        ctx.shadowBlur = S.effects.glowBlur;
      }

      const baseColor = w.emphasized
        ? (overrides.emphasisColor ?? S.colors.emphasis)
        : (overrides.connectorColor ?? S.colors.connector);
      // If we drew a word background block, the emphasized text needs a contrasting color
      let color = pw.color || baseColor;
      if (wordBgType === 'block' && w.emphasized && !pw.color) {
        // For block backgrounds, force readable contrast: use white on dark blocks, black on light
        const bgRgb = hexToRgb(S.decorations.wordBgColor || S.colors.emphasis);
        const lum = relativeLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
        color = lum > 0.5 ? '#0A0A0A' : '#FFFFFF';
      }

      ctx.fillStyle = color;
      if (S.effects.stroke) {
        ctx.strokeStyle = S.effects.strokeColor;
        // Scale stroke width proportionally to font size (originally tuned for 100px font)
        // Cap at sensible max to prevent overwhelming the text
        const scaledStroke = Math.min((S.effects.strokeWidth || 2) * (w.fontSize / 100), w.fontSize * 0.06);
        ctx.lineWidth = Math.max(1, scaledStroke);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(w.text, x, y);
      }

      // Draw letter-by-letter if letterSpacing applied
      if (w.letterSpacing) {
        let lx = x;
        for (const ch of w.text) {
          ctx.fillText(ch, lx, y);
          lx += ctx.measureText(ch).width + w.letterSpacing * w.fontSize;
        }
      } else {
        ctx.fillText(w.text, x, y);
      }
      ctx.restore();

      // Record hit box (in canvas coords, normalized 0-1)
      hitBoxes.push({
        wordIndex: w.index,
        x: x / width,
        y: y / height,
        w: w.w / width,
        h: w.fontSize / height,
        emphasized: w.emphasized
      });

      x += w.w + wordGap;
    });
  });

  // Close rotation transform if applied
  if (textRotation !== 0) {
    ctx.restore();
  }

  // Attach hit boxes to canvas for gesture hit-testing
  canvas._qcHitBoxes = hitBoxes;

  // Draw author below
  if (author && S.layout.authorPosition !== 'above') {
    const ay = blockY + totalTextHeight + authorFontSizeFinal * 0.5 + authorOffsetY * height;
    // Draw divider line first if configured
    if (S.decorations.divider) {
      ctx.save();
      ctx.strokeStyle = S.decorations.dividerColor || '#FFD700';
      ctx.lineWidth = Math.max(2, width / 400);
      const dividerY = ay - authorFontSizeFinal * 0.2;
      const dividerW = Math.max(40, width * 0.08);
      let dx1, dx2;
      if (alignment === 'center') { dx1 = width/2 - dividerW/2; dx2 = width/2 + dividerW/2; }
      else if (alignment === 'right') { dx1 = width - padX - dividerW; dx2 = width - padX; }
      else { dx1 = padX; dx2 = padX + dividerW; }
      dx1 += (overrides.offsetX || 0) * width + authorOffsetX * width;
      dx2 += (overrides.offsetX || 0) * width + authorOffsetX * width;
      ctx.beginPath();
      ctx.moveTo(dx1, dividerY);
      ctx.lineTo(dx2, dividerY);
      ctx.stroke();
      ctx.restore();
    }
    authorHitBox = drawAuthorAt(ctx, author, 0, ay, alignment);
  }
  canvas._qcAuthorHitBox = authorHitBox;

  // Subject foreground — re-paint the speaker on top of text so they appear in front
  // Used by Cutout Hero style and any style that sets decorations.subjectForeground
  if (S.decorations.subjectForeground && image && design.photo) {
    ctx.save();
    const subX = (design.photo.subjectX ?? 0.5) * width;
    const subY = (design.photo.subjectY ?? 0.5) * height;
    // Subject ellipse — vertical-leaning (humans are taller than wide)
    const ellipseW = Math.min(width, height) * 0.36;
    const ellipseH = Math.min(width, height) * 0.55;

    // Create a soft-edged elliptical clipping path using a radial gradient mask
    // Approach: draw the photo region inside an elliptical clip with a feathered alpha
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    // Re-paint photo at same zoom/offset as base
    const imgZoom = overrides.imageZoom ?? 1;
    const imgOX = overrides.imageOffsetX ?? 0;
    const imgOY = overrides.imageOffsetY ?? 0;
    const fitMode = 'cover';
    const imgRatio = image.width / image.height;
    const canvasRatio = width / height;
    let drawW, drawH, drawX, drawY;
    if (fitMode === 'cover') {
      if (imgRatio > canvasRatio) {
        drawH = height * imgZoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = width * imgZoom;
        drawH = drawW / imgRatio;
      }
      drawX = (width - drawW) / 2 + imgOX * width;
      drawY = (height - drawH) / 2 + imgOY * height;
    }
    offCtx.drawImage(image, drawX, drawY, drawW, drawH);

    // Build the soft elliptical alpha mask in a separate buffer
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d');
    const grad = maskCtx.createRadialGradient(subX, subY, 0, subX, subY, Math.max(ellipseW, ellipseH));
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.95)');
    grad.addColorStop(0.85, 'rgba(0,0,0,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    maskCtx.fillStyle = grad;
    // Stretch the gradient into an ellipse by transforming
    maskCtx.save();
    maskCtx.translate(subX, subY);
    maskCtx.scale(ellipseW / Math.max(ellipseW, ellipseH), ellipseH / Math.max(ellipseW, ellipseH));
    maskCtx.translate(-subX, -subY);
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.restore();

    // Composite: photo masked by alpha
    offCtx.globalCompositeOperation = 'destination-in';
    offCtx.drawImage(maskCanvas, 0, 0);

    // Draw the masked subject layer on top of everything
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
  }

  // Quote marks decoration
  if (S.decorations.quoteMarks) {
    ctx.save();
    const sizeMap = { small: 0.12, medium: 0.18, large: 0.25, huge: 0.35 };
    const qSize = (sizeMap[S.decorations.quoteMarksSize] || 0.2) * width;
    ctx.font = `900 ${qSize}px "Playfair Display"`;
    ctx.fillStyle = S.decorations.quoteMarksColor || '#FFD700';
    ctx.textBaseline = 'top';
    if (S.decorations.quoteMarksPosition === 'above') {
      const qw = ctx.measureText('\u201C').width;
      ctx.fillText('\u201C', (width - qw) / 2, blockY - qSize * 0.9);
    } else if (S.decorations.quoteMarksPosition === 'inline') {
      ctx.fillText('\u201C', padX - qSize * 0.1, blockY - qSize * 0.2);
    } else {
      ctx.fillText('\u201C', padX * 0.5, padY * 0.5);
    }
    ctx.restore();
  }

  // Grain overlay for vintage styles — applied last so it covers everything
  // Skipped during preview/thumbnail rendering for performance
  if (S.decorations.grain && !isPreview) {
    drawGrainOverlay(ctx, width, height, S.decorations.grainIntensity || 0.5);
  }
}

function computeBaseFontSize(design) {
  const { style, words, width, overrides = {} } = design;
  const len = words.reduce((s, w) => s + w.text.length + 1, 0);
  const cat = len < 40 ? 'short' : len < 100 ? 'medium' : len < 180 ? 'long' : 'very-long';
  const sizeMap = {
    bold:     { short: 128, medium: 88, long: 64, 'very-long': 48 },
    balanced: { short: 96,  medium: 68, long: 52, 'very-long': 40 },
    subtle:   { short: 72,  medium: 52, long: 40, 'very-long': 32 }
  };
  const base = sizeMap[style.intensity][cat];
  const scale = width / 1080;
  const multiplier = overrides.fontSizeMultiplier ?? 1;
  return base * scale * multiplier;
}

/* ================================================================
   SAMPLE PHOTO (generated gradient)
================================================================ */
function generateSamplePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  // Warm gradient background
  const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, '#8B4513');
  bg.addColorStop(0.5, '#D4A574');
  bg.addColorStop(1, '#2B1810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);
  // Silhouette
  ctx.fillStyle = 'rgba(20,20,20,0.75)';
  // Head
  ctx.beginPath();
  ctx.arc(700, 500, 120, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(580, 620);
  ctx.quadraticCurveTo(700, 700, 820, 620);
  ctx.lineTo(880, 1100);
  ctx.lineTo(520, 1100);
  ctx.closePath();
  ctx.fill();
  // Stage backdrop hint
  ctx.fillStyle = 'rgba(255,200,100,0.08)';
  ctx.fillRect(0, 800, 1080, 550);
  return canvas.toDataURL('image/jpeg', 0.9);
}

/* ================================================================
   UTILS
================================================================ */
const FORMATS = {
  '4:5': { w: 1080, h: 1350, label: 'Portrait 4:5' },
  '1:1': { w: 1080, h: 1080, label: 'Square 1:1' },
  '9:16': { w: 1080, h: 1920, label: 'Story 9:16' },
  '16:9': { w: 1920, h: 1080, label: 'Landscape 16:9' }
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ================================================================
   CANVAS GESTURES HOOK — pinch, drag, tap-word, drag-author
================================================================ */
function useCanvasGestures({ canvasRef, overrides, setOverrides, commitOverrides, onWordTap, onAuthorTap }) {
  const pointersRef = useRef(new Map());
  const gestureStartRef = useRef(null);
  const movedRef = useRef(false);
  const tapStartTimeRef = useRef(0);

  // Hit-test helper: returns 'author' | 'word:N' | null based on canvas-normalized coords
  const hitTestAt = (canvas, nx, ny) => {
    if (!canvas) return null;
    // Author has higher priority (smaller, sits at edges)
    const ahb = canvas._qcAuthorHitBox;
    if (ahb) {
      const padX = Math.max(0.02, ahb.h * 0.6);
      const padY = ahb.h * 0.6;
      if (nx >= ahb.x - padX && nx <= ahb.x + ahb.w + padX &&
          ny >= ahb.y - padY && ny <= ahb.y + ahb.h + padY) {
        return { type: 'author' };
      }
    }
    const boxes = canvas._qcHitBoxes || [];
    const wordHit = boxes.find(b => {
      const pad = b.h * 0.2;
      return nx >= b.x - pad && nx <= b.x + b.w + pad &&
             ny >= b.y - pad && ny <= b.y + b.h + pad;
    });
    if (wordHit) return { type: 'word', index: wordHit.wordIndex };
    return null;
  };

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = false;
    tapStartTimeRef.current = Date.now();

    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const hit = hitTestAt(canvas, nx, ny);

    if (pointersRef.current.size === 1) {
      // If we're starting on the author, this drag will move the author specifically
      if (hit?.type === 'author') {
        gestureStartRef.current = {
          type: 'drag-author',
          startX: e.clientX,
          startY: e.clientY,
          startOffsetX: overrides.authorOffsetX || 0,
          startOffsetY: overrides.authorOffsetY || 0
        };
      } else {
        // Default: drag the quote block
        gestureStartRef.current = {
          type: 'drag',
          startX: e.clientX,
          startY: e.clientY,
          startOffsetX: overrides.offsetX || 0,
          startOffsetY: overrides.offsetY || 0
        };
      }
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      gestureStartRef.current = {
        type: 'pinch',
        startDistance: dist,
        startAngle: angle,
        startSizeMul: overrides.fontSizeMultiplier || 1,
        startRotation: overrides.rotationOverride || 0
      };
    }
  }, [canvasRef, overrides]);

  const handlePointerMove = useCallback((e) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gesture = gestureStartRef.current;
    if (!gesture) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (gesture.type === 'drag' && pointersRef.current.size === 1) {
      const deltaX = e.clientX - gesture.startX;
      const deltaY = e.clientY - gesture.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) movedRef.current = true;
      const normDX = deltaX / rect.width;
      const normDY = deltaY / rect.height;
      const newOffsetX = Math.max(-0.45, Math.min(0.45, gesture.startOffsetX + normDX));
      const newOffsetY = Math.max(-0.45, Math.min(0.45, gesture.startOffsetY + normDY));
      setOverrides(prev => ({ ...prev, offsetX: newOffsetX, offsetY: newOffsetY }));
    } else if (gesture.type === 'drag-author' && pointersRef.current.size === 1) {
      const deltaX = e.clientX - gesture.startX;
      const deltaY = e.clientY - gesture.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) movedRef.current = true;
      const normDX = deltaX / rect.width;
      const normDY = deltaY / rect.height;
      const newAOX = Math.max(-0.5, Math.min(0.5, gesture.startOffsetX + normDX));
      const newAOY = Math.max(-0.6, Math.min(0.6, gesture.startOffsetY + normDY));
      setOverrides(prev => ({ ...prev, authorOffsetX: newAOX, authorOffsetY: newAOY }));
    } else if (gesture.type === 'pinch' && pointersRef.current.size >= 2) {
      movedRef.current = true;
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      const scale = dist / gesture.startDistance;
      const newSize = Math.max(0.4, Math.min(2.5, gesture.startSizeMul * scale));
      // Rotation delta in degrees
      const rotationDelta = (angle - gesture.startAngle) * 180 / Math.PI;
      const newRotation = gesture.startRotation + rotationDelta;
      // Clamp to -180..180 for sanity
      const clampedRotation = ((newRotation + 540) % 360) - 180;
      setOverrides(prev => ({ ...prev, fontSizeMultiplier: newSize, rotationOverride: clampedRotation }));
    }
  }, [canvasRef, setOverrides]);

  const handlePointerUp = useCallback((e) => {
    const canvas = canvasRef.current;
    try { canvas?.releasePointerCapture(e.pointerId); } catch {}
    const existed = pointersRef.current.has(e.pointerId);
    pointersRef.current.delete(e.pointerId);

    const wasShortTap = Date.now() - tapStartTimeRef.current < 300 && !movedRef.current;
    const wasGestureActive = gestureStartRef.current !== null;

    if (pointersRef.current.size === 0) {
      // End of gesture
      if (wasShortTap && existed && canvas) {
        // Hit-test
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        const hit = hitTestAt(canvas, nx, ny);
        if (hit?.type === 'author' && onAuthorTap) {
          onAuthorTap();
        } else if (hit?.type === 'word' && onWordTap) {
          onWordTap(hit.index);
        }
      } else if (wasGestureActive && movedRef.current && commitOverrides) {
        commitOverrides();
      }
      gestureStartRef.current = null;
      movedRef.current = false;
    } else if (pointersRef.current.size === 1 && gestureStartRef.current?.type === 'pinch') {
      const remaining = [...pointersRef.current.values()][0];
      gestureStartRef.current = {
        type: 'drag',
        startX: remaining.x,
        startY: remaining.y,
        startOffsetX: overrides.offsetX || 0,
        startOffsetY: overrides.offsetY || 0
      };
    }
  }, [canvasRef, onWordTap, onAuthorTap, commitOverrides, overrides]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function App() {
  const fontsReady = useFonts();
  const [screen, setScreen] = useState('upload'); // upload | input | grid | editor
  const [imageUrl, setImageUrl] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [emphasisEnabled, setEmphasisEnabled] = useState(true);
  const [words, setWords] = useState([]);
  const [quoteAnalysis, setQuoteAnalysis] = useState(null);
  const [rankedStyles, setRankedStyles] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [format, setFormat] = useState('4:5');
  const [activeTab, setActiveTab] = useState('type');
  const [showControls, setShowControls] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [fullPreviewUrl, setFullPreviewUrl] = useState(null);
  const [tappedWordIndex, setTappedWordIndex] = useState(null);
  const [authorTapped, setAuthorTapped] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const mainCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Recompute words when quote/emphasis changes
  useEffect(() => {
    if (!quote.trim()) {
      setWords([]);
      setQuoteAnalysis(null);
      return;
    }
    const analysis = analyzeQuote(quote, author);
    setQuoteAnalysis(analysis);
    const nextWords = emphasisEnabled
      ? suggestEmphasis(analysis.words, analysis.lengthCategory)
      : analysis.words.map(w => ({ ...w, emphasized: false }));
    setWords(nextWords);
  }, [quote, author, emphasisEnabled]);

  // Handle file upload
  const handleFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setImageUrl(dataUrl);
      try {
        const img = await loadImage(dataUrl);
        setImageElement(img);
        const analysis = await analyzePhoto(img);
        setPhotoAnalysis(analysis);
        setScreen('input');
      } catch (err) {
        console.error('Image load failed', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSample = async () => {
    const dataUrl = generateSamplePhoto();
    setImageUrl(dataUrl);
    try {
      const img = await loadImage(dataUrl);
      setImageElement(img);
      const analysis = await analyzePhoto(img);
      setPhotoAnalysis(analysis);
      if (!quote) setQuote('What you avoid today will attack you tomorrow.');
      if (!author) setAuthor('Sample Speaker');
      setScreen('input');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWordEmphasis = (index) => {
    setWords(prev => prev.map((w, i) => i === index ? { ...w, emphasized: !w.emphasized } : w));
  };

  const handleGenerate = () => {
    if (!photoAnalysis || !quoteAnalysis) return;
    const ranked = rankStyles(photoAnalysis, quoteAnalysis, STYLES, [], 0);
    setRankedStyles(ranked);
    setExcludedIds([]);
    setScreen('grid');
  };

  const handleShuffle = () => {
    const newExcluded = [...excludedIds, ...rankedStyles.slice(0, 3).map(s => s.id)].slice(-6);
    const ranked = rankStyles(photoAnalysis, quoteAnalysis, STYLES, newExcluded, shuffleSeed + 1);
    if (ranked.length < 3) {
      // Reset exclusion if we're running out
      const fresh = rankStyles(photoAnalysis, quoteAnalysis, STYLES, [], shuffleSeed + 1);
      setRankedStyles(fresh);
      setExcludedIds([]);
    } else {
      setRankedStyles(ranked);
      setExcludedIds(newExcluded);
    }
    setShuffleSeed(s => s + 1);
  };

  const selectStyle = (id) => {
    setSelectedStyleId(id);
    setOverrides({});
    setHistory([{}]);
    setHistoryIndex(0);
    setScreen('editor');
  };

  // Swap style mid-edit — KEEPS overrides intact so the user's edits carry over
  const swapStyle = (id) => {
    if (id === selectedStyleId) return;
    setSelectedStyleId(id);
    // Don't reset overrides — keep them. Push to history so undo works.
    setHistory(h => {
      const trimmed = h.slice(0, historyIndex + 1);
      trimmed.push({ ...overrides, _styleId: id });
      return trimmed.slice(-30);
    });
    setHistoryIndex(i => Math.min(i + 1, 29));
  };

  const updateOverride = (key, value) => {
    setOverrides(prev => {
      const next = { ...prev, [key]: value };
      // Push history
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(next);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return next;
    });
  };

  // Commits current override state to history (used after gesture ends)
  const commitOverrides = useCallback(() => {
    setOverrides(curr => {
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(curr);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return curr;
    });
  }, [historyIndex]);

  // Per-word override updater (from tap-word popover)
  const updateWordOverride = (wordIndex, patch) => {
    setOverrides(prev => {
      const prevPerWord = prev.perWordOverrides || {};
      const prevWord = prevPerWord[wordIndex] || {};
      const nextWord = { ...prevWord, ...patch };
      // Remove null values
      Object.keys(nextWord).forEach(k => {
        if (nextWord[k] === null || nextWord[k] === undefined) delete nextWord[k];
      });
      const nextPerWord = { ...prevPerWord };
      if (Object.keys(nextWord).length === 0) {
        delete nextPerWord[wordIndex];
      } else {
        nextPerWord[wordIndex] = nextWord;
      }
      const next = { ...prev, perWordOverrides: nextPerWord };
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(next);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return next;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setOverrides(history[next] || {});
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setOverrides(history[next] || {});
    }
  };
  const resetOverrides = () => {
    setOverrides({});
    setHistory([{}]);
    setHistoryIndex(0);
  };

  const selectedStyle = STYLES.find(s => s.id === selectedStyleId);
  const fmt = FORMATS[overrides.format || format];

  // Gesture handlers for canvas (pinch/drag/tap)
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useCanvasGestures({
    canvasRef: mainCanvasRef,
    overrides,
    setOverrides,
    commitOverrides,
    onWordTap: (wordIndex) => setTappedWordIndex(wordIndex),
    onAuthorTap: () => setAuthorTapped(true)
  });

  // Apply photo-aware accent to the selected style (only if not user-overridden)
  const styledForRender = useMemo(() => {
    if (!selectedStyle || !photoAnalysis) return selectedStyle;
    if (overrides.emphasisColor) return selectedStyle; // user override wins
    const smartAccent = pickAccentForStyle(selectedStyle, photoAnalysis);
    return {
      ...selectedStyle,
      colors: { ...selectedStyle.colors, emphasis: smartAccent }
    };
  }, [selectedStyle, photoAnalysis, overrides.emphasisColor]);

  // Render main editor canvas
  useEffect(() => {
    if (screen !== 'editor' || !mainCanvasRef.current || !imageElement || !styledForRender || !fontsReady) return;
    renderDesign(mainCanvasRef.current, {
      width: fmt.w,
      height: fmt.h,
      image: imageElement,
      style: styledForRender,
      overrides,
      words,
      author: quoteAnalysis?.author || '',
      photo: photoAnalysis
    });
  }, [screen, imageElement, styledForRender, overrides, words, quoteAnalysis, fmt, fontsReady, photoAnalysis]);

  const handleShowFullPreview = () => {
    if (!mainCanvasRef.current) return;
    try {
      const dataUrl = mainCanvasRef.current.toDataURL('image/png');
      setFullPreviewUrl(dataUrl);
      setShowFullPreview(true);
    } catch (err) {
      console.error('Preview failed', err);
    }
  };

  const handleDownload = async () => {
    if (!mainCanvasRef.current) return;
    mainCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotecanvas-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  // Styles object for convenience
  const surface = 'bg-[#141414]';
  const border = 'border-[#2a2a2a]';
  const accent = '#FFB547';

  /* ============================================================
     UPLOAD SCREEN
  ============================================================ */
  if (screen === 'upload') {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB547]/10 border border-[#FFB547]/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB547]" />
                <span className="text-xs text-[#FFB547] tracking-wide">AI-POWERED DESIGN</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em' }}>
                Turn photos into posters
              </h1>
              <p className="text-white/50 text-base leading-relaxed">
                Upload a speaker photo, type a quote, and let QuoteCanvas design it for you.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-[#2a2a2a] hover:border-[#FFB547]/50 bg-[#141414] hover:bg-[#1a1a1a] transition-all p-10 flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFB547]/10 flex items-center justify-center group-hover:bg-[#FFB547]/20 transition-colors">
                <Upload className="w-6 h-6 text-[#FFB547]" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white">Upload a photo</div>
                <div className="text-sm text-white/40 mt-1">Tap to choose from your device</div>
              </div>
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-xs text-white/30 tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            <button
              onClick={handleSample}
              className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white/80 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Try with sample photo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ============================================================
     INPUT SCREEN
  ============================================================ */
  if (screen === 'input') {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header onBack={() => { setScreen('upload'); setImageUrl(null); setImageElement(null); }} />
        <main className="flex-1 flex flex-col md:flex-row gap-6 px-5 py-6 max-w-6xl mx-auto w-full">
          <div className="md:w-1/2 flex-shrink-0">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a]">
              {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm text-white/50 hover:text-white/80 flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Change photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div className="md:w-1/2 flex flex-col gap-5">
            <div>
              <label className="text-xs text-white/50 tracking-wide uppercase font-medium mb-2 block">Your Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Paste or type the quote here..."
                rows={4}
                className="w-full border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB547]/50 resize-none"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: '#141414',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 tracking-wide uppercase font-medium mb-2 block">Speaker (optional)</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Joya Baker"
                className="w-full border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB547]/50"
                style={{
                  backgroundColor: '#141414',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
            </div>

            {words.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs text-white/50 tracking-wide uppercase font-medium">Emphasis</label>
                  <button
                    onClick={() => setEmphasisEnabled(e => !e)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`relative w-8 h-4 rounded-full transition-colors ${emphasisEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${emphasisEnabled ? 'left-4' : 'left-0.5'}`} />
                    </div>
                    <span className="text-white/70">{emphasisEnabled ? 'On' : 'Off'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {words.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => emphasisEnabled && toggleWordEmphasis(i)}
                      disabled={!emphasisEnabled}
                      className={`px-2.5 py-1 rounded-md text-sm transition-all ${
                        w.emphasized && emphasisEnabled
                          ? 'bg-[#FF2D8A] text-white font-semibold'
                          : 'bg-[#141414] border border-[#2a2a2a] text-white/70 hover:border-[#2a2a2a]/80'
                      } ${!emphasisEnabled ? 'opacity-50' : ''}`}
                    >
                      {w.text}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/35 mt-2">Tap any word to toggle emphasis</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!quote.trim()}
              className="w-full py-4 rounded-xl bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate 6 Styles
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     STYLE GRID SCREEN
  ============================================================ */
  if (screen === 'grid') {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header onBack={() => setScreen('input')} title="Pick a style" />
        <main className="flex-1 px-4 py-5 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {rankedStyles.map((style, i) => (
              <StylePreviewCard
                key={style.id + '-' + shuffleSeed}
                style={style}
                image={imageElement}
                words={words}
                author={quoteAnalysis?.author || ''}
                format={format}
                onClick={() => selectStyle(style.id)}
                fontsReady={fontsReady}
                index={i}
                photo={photoAnalysis}
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 mt-6">
            <button
              onClick={handleShuffle}
              className="py-3 px-6 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white/80 hover:text-white font-medium transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle styles
            </button>
            <p className="text-xs text-white/40">Not vibing? See different styles</p>
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     EDITOR SCREEN
  ============================================================ */
  if (screen === 'editor' && selectedStyle) {
    const displayScale = Math.min(1, 420 / fmt.w);
    const displayW = fmt.w * displayScale;
    const displayH = fmt.h * displayScale;

    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header
          onBack={() => setScreen('grid')}
          title={selectedStyle.name}
          actions={
            <>
              <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-lg hover:bg-[#141414] disabled:opacity-30">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg hover:bg-[#141414] disabled:opacity-30">
                <Redo2 className="w-4 h-4" />
              </button>
              <button onClick={resetOverrides} className="p-2 rounded-lg hover:bg-[#141414]">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleShowFullPreview}
                className="ml-1 py-2 px-3 rounded-lg bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold text-sm flex items-center gap-1.5"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </>
          }
        />
        <main className="flex-1 flex flex-col md:flex-row gap-0 md:gap-4 md:px-4 md:py-4 md:max-w-6xl md:mx-auto w-full overflow-hidden">
          {/* Canvas area — fills available space, always visible */}
          <div className="flex-1 flex items-center justify-center p-3 md:p-4 min-h-0 overflow-hidden">
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl block"
              style={{
                aspectRatio: `${fmt.w} / ${fmt.h}`,
                maxWidth: '100%',
                maxHeight: '100%',
                height: 'auto',
                width: 'auto',
                margin: 'auto'
              }}
            >
              <canvas
                ref={mainCanvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  cursor: 'grab'
                }}
              />
              {/* Floating tip — hides once user has moved anything */}
              {!overrides.offsetX && !overrides.offsetY && !overrides.fontSizeMultiplier && !overrides.perWordOverrides && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-[10px] whitespace-nowrap">
                    Drag · pinch · tap a word
                  </div>
                </div>
              )}
              {/* Full-view button */}
              <button
                onClick={handleShowFullPreview}
                className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur hover:bg-black/90 text-white transition-colors"
                title="View full size"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile inline controls — always visible at bottom */}
          <EditorControlsMobile
            style={selectedStyle}
            overrides={overrides}
            updateOverride={updateOverride}
            photoAnalysis={photoAnalysis}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            image={imageElement}
            words={words}
            author={quoteAnalysis?.author || ''}
            selectedStyleId={selectedStyleId}
            onSelectStyle={swapStyle}
            fontsReady={fontsReady}
          />

          {/* Desktop sidebar — unchanged */}
          <EditorControlsDesktop
            style={selectedStyle}
            overrides={overrides}
            updateOverride={updateOverride}
            photoAnalysis={photoAnalysis}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            image={imageElement}
            words={words}
            author={quoteAnalysis?.author || ''}
            selectedStyleId={selectedStyleId}
            onSelectStyle={swapStyle}
            fontsReady={fontsReady}
          />
        </main>

        {/* WORD POPOVER */}
        {tappedWordIndex !== null && words[tappedWordIndex] && (
          <WordPopover
            word={words[tappedWordIndex]}
            wordIndex={tappedWordIndex}
            perWordOverride={(overrides.perWordOverrides || {})[tappedWordIndex] || {}}
            style={selectedStyle}
            onClose={() => setTappedWordIndex(null)}
            onUpdate={(patch) => updateWordOverride(tappedWordIndex, patch)}
            onToggleEmphasis={() => {
              // Toggle local emphasis via perWordOverride
              const current = (overrides.perWordOverrides || {})[tappedWordIndex] || {};
              const newVal = current.emphasized !== undefined ? !current.emphasized : !words[tappedWordIndex].emphasized;
              updateWordOverride(tappedWordIndex, { emphasized: newVal });
            }}
          />
        )}

        {/* AUTHOR POPOVER */}
        {authorTapped && (
          <AuthorPopover
            author={author}
            overrides={overrides}
            style={selectedStyle}
            onClose={() => setAuthorTapped(false)}
            onUpdate={(patch) => {
              Object.entries(patch).forEach(([k, v]) => updateOverride(k, v));
            }}
            onUpdateText={(text) => setAuthor(text)}
          />
        )}

        {/* FULL-SIZE PREVIEW MODAL */}
        {showFullPreview && fullPreviewUrl && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur border-b border-white/10 flex-shrink-0">
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-sm font-medium text-white">Your poster</div>
              <button
                onClick={handleDownload}
                className="p-2 -mr-2 rounded-lg hover:bg-white/10 text-white"
                title="Download PNG"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable image area */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 gap-4">
              <img
                src={fullPreviewUrl}
                alt="Full poster preview"
                className="max-w-full h-auto rounded-xl shadow-2xl select-none"
                style={{ maxHeight: 'none' }}
              />

              {/* Instructions */}
              <div className="max-w-md w-full bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB547]/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-[#FFB547]" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-white mb-1">Save to your phone</div>
                    <div className="text-white/60 leading-relaxed">
                      Take a screenshot of this screen, or tap and hold the image above and choose <span className="text-white">"Save to Photos"</span>.
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/40 pt-2 border-t border-[#2a2a2a]">
                  On desktop or Android, tap the <Download className="w-3 h-3 inline" /> icon above to download a PNG.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/* ================================================================
   HEADER / FOOTER
================================================================ */
function Header({ onBack, title, actions }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-[#141414]">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#FFB547] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {title || 'QuoteCanvas'}
            </span>
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="text-center py-4 text-xs text-white/25">
      Made for speaker moments
    </footer>
  );
}

/* ================================================================
   PREVIEW CARD (renders a mini canvas)
================================================================ */
function StylePreviewCard({ style, image, words, author, format, onClick, fontsReady, index, photo }) {
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

/* ================================================================
   EDITOR CONTROLS
================================================================ */
/* ================================================================
   WORD POPOVER — appears when you tap a word on the canvas
================================================================ */
function WordPopover({ word, wordIndex, perWordOverride, style, onClose, onUpdate, onToggleEmphasis }) {
  const [section, setSection] = useState('style');

  const isEmphasized = perWordOverride.emphasized !== undefined ? perWordOverride.emphasized : word.emphasized;
  const currentColor = perWordOverride.color || '';
  const currentSize = perWordOverride.sizeMultiplier || 1;
  const currentItalic = perWordOverride.italic || false;
  const currentWeight = perWordOverride.weight || (isEmphasized ? style.typography.weightPrimary : style.typography.weightSecondary) || 600;

  // Shadow values
  const shadowEnabled = perWordOverride.shadowEnabled || false;
  const shadowColor = perWordOverride.shadowColor || '#000000';
  const shadowBlur = perWordOverride.shadowBlur ?? 8;
  const shadowOffsetX = perWordOverride.shadowOffsetX ?? 0;
  const shadowOffsetY = perWordOverride.shadowOffsetY ?? 2;
  const shadowOpacity = perWordOverride.shadowOpacity ?? 0.6;

  const palette = ['#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#00FF88'];

  const sections = [
    { id: 'style', label: 'Style' },
    { id: 'color', label: 'Color' },
    { id: 'size', label: 'Size' },
    { id: 'shadow', label: 'Shadow' },
    { id: 'type', label: 'Type' }
  ];

  const hasOverrides = currentColor || currentSize !== 1 || perWordOverride.emphasized !== undefined ||
    currentItalic || perWordOverride.weight || shadowEnabled;

  return (
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Editing word</div>
            <div className="font-semibold text-white mt-0.5 truncate">{word.text}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#2a2a2a] overflow-x-auto scrollbar-none flex-shrink-0">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${
                section === s.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] text-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* STYLE section */}
          {section === 'style' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Emphasis</div>
                <div className="text-xs text-white/50 mt-0.5">Bigger & colored</div>
              </div>
              <button
                onClick={onToggleEmphasis}
                className={`relative w-11 h-6 rounded-full transition-colors ${isEmphasized ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${isEmphasized ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          {/* COLOR section */}
          {section === 'color' && (
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onUpdate({ color: null })}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all ${
                    !currentColor ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                  }`}
                >
                  Default
                </button>
                {palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdate({ color: c })}
                    className={`w-8 h-8 rounded-lg transition-transform ${currentColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547] ring-offset-2 ring-offset-[#141414] scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                  <input
                    type="color"
                    value={currentColor || '#ffffff'}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SIZE section */}
          {section === 'size' && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-white/60 uppercase tracking-wide">Size</span>
                <span className="text-xs text-white tabular-nums">{Math.round(currentSize * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={currentSize}
                onChange={(e) => onUpdate({ sizeMultiplier: parseFloat(e.target.value) })}
                className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
              />
            </div>
          )}

          {/* SHADOW section */}
          {section === 'shadow' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white font-medium">Word shadow</div>
                  <div className="text-xs text-white/50 mt-0.5">Override shadow on this word only</div>
                </div>
                <button
                  onClick={() => onUpdate({ shadowEnabled: !shadowEnabled })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${shadowEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${shadowEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {shadowEnabled && (
                <>
                  <div>
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
                    <div className="flex flex-wrap gap-2">
                      {['#000000', '#FFFFFF', '#FF3B3B', '#FFD700', '#FF2D8A', '#00D9FF'].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onUpdate({ shadowColor: c })}
                          className={`w-7 h-7 rounded-md ${shadowColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={shadowColor} onChange={(e) => onUpdate({ shadowColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <CompactRow>
                    <CompactSlider label="Opacity" value={shadowOpacity} min={0} max={1} step={0.05} onChange={v => onUpdate({ shadowOpacity: v })} />
                    <CompactSlider label="Blur" value={shadowBlur} min={0} max={40} step={1} onChange={v => onUpdate({ shadowBlur: v })} />
                  </CompactRow>
                  <CompactRow>
                    <CompactSlider label="X" value={shadowOffsetX} min={-20} max={20} step={1} onChange={v => onUpdate({ shadowOffsetX: v })} />
                    <CompactSlider label="Y" value={shadowOffsetY} min={-20} max={20} step={1} onChange={v => onUpdate({ shadowOffsetY: v })} />
                  </CompactRow>
                </>
              )}
            </>
          )}

          {/* TYPE section */}
          {section === 'type' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Italic</span>
                <button
                  onClick={() => onUpdate({ italic: !currentItalic })}
                  className={`relative w-10 h-5 rounded-full ${currentItalic ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentItalic ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Weight</span>
                  <span className="text-xs text-white tabular-nums">{currentWeight}</span>
                </div>
                <input
                  type="range" min={300} max={900} step={100}
                  value={currentWeight}
                  onChange={(e) => onUpdate({ weight: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="text-xs text-white/40 leading-relaxed pt-2 border-t border-[#2a2a2a]">
                Note: weight may not visibly change if the style font has only one weight available.
              </div>
            </>
          )}

          {hasOverrides && (
            <button
              onClick={() => onUpdate({ color: null, sizeMultiplier: null, emphasized: null, italic: null, weight: null, shadowEnabled: null, shadowColor: null, shadowBlur: null, shadowOffsetX: null, shadowOffsetY: null, shadowOpacity: null })}
              className="w-full py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-sm font-medium hover:text-white flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset this word
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   AUTHOR POPOVER
================================================================ */
function AuthorPopover({ author, overrides, style, onClose, onUpdate, onUpdateText }) {
  const palette = ['#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#D4AF37'];
  const fontOptions = ['Inter', 'Space Grotesk', 'Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Fraunces', 'Anton', 'Bebas Neue', 'Archivo Black', 'Oswald', 'Caveat'];
  const [section, setSection] = useState('text');

  const currentColor = overrides.authorColor || style.colors.author;
  const currentSize = overrides.authorSizeMultiplier || 1;
  const currentFont = overrides.authorFont ?? style.typography.fontAuthor;
  const currentCasing = overrides.authorCasingOverride ?? style.layout.authorCasing;
  const currentItalic = overrides.authorItalic !== undefined ? overrides.authorItalic : (style.typography.italicAuthor || false);
  const currentWeight = overrides.authorWeight ?? style.typography.weightAuthor ?? 600;
  const currentTracking = overrides.authorLetterSpacing ?? 0;

  // Shadow values
  const shadowEnabled = overrides.authorShadowEnabled !== undefined ? overrides.authorShadowEnabled : false;
  const shadowColor = overrides.authorShadowColor ?? '#000000';
  const shadowBlur = overrides.authorShadowBlur ?? 8;
  const shadowOffsetX = overrides.authorShadowOffsetX ?? 0;
  const shadowOffsetY = overrides.authorShadowOffsetY ?? 2;
  const shadowOpacity = overrides.authorShadowOpacity ?? 0.6;

  // Pill background
  const pillEnabled = overrides.authorPillEnabled || false;
  const pillColor = overrides.authorPillColor ?? '#FFB547';
  const pillPadding = overrides.authorPillPadding ?? 0.5;

  const sections = [
    { id: 'text', label: 'Text' },
    { id: 'type', label: 'Type' },
    { id: 'color', label: 'Color' },
    { id: 'shadow', label: 'Shadow' },
    { id: 'pill', label: 'Pill' }
  ];

  return (
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Editing speaker</div>
            <div className="font-semibold text-white mt-0.5 truncate">{author || '—'}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#2a2a2a] overflow-x-auto scrollbar-none flex-shrink-0">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${
                section === s.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] text-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* TEXT section */}
          {section === 'text' && (
            <>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Name</div>
                <input
                  value={author}
                  onChange={(e) => onUpdateText(e.target.value)}
                  placeholder="Speaker name"
                  className="w-full border border-[#2a2a2a] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FFB547]/50"
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Size</span>
                  <span className="text-xs text-white tabular-nums">{Math.round(currentSize * 100)}%</span>
                </div>
                <input
                  type="range" min={0.5} max={3} step={0.05}
                  value={currentSize}
                  onChange={(e) => onUpdate({ authorSizeMultiplier: parseFloat(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="text-xs text-white/40 leading-relaxed pt-2 border-t border-[#2a2a2a]">
                Tip: drag the speaker name on the canvas to reposition it independently.
              </div>

              {(overrides.authorOffsetX || overrides.authorOffsetY) ? (
                <button
                  onClick={() => onUpdate({ authorOffsetX: 0, authorOffsetY: 0 })}
                  className="w-full py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Reset position
                </button>
              ) : null}
            </>
          )}

          {/* TYPE section */}
          {section === 'type' && (
            <>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Font</div>
                <div className="flex flex-wrap gap-1.5">
                  {fontOptions.map(f => (
                    <button
                      key={f}
                      onClick={() => onUpdate({ authorFont: f })}
                      className={`px-2.5 py-1.5 rounded-md text-[11px] ${
                        currentFont === f ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                      }`}
                      style={{ fontFamily: `"${f}"` }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Casing</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'upper', label: 'AA' },
                    { id: 'lower', label: 'aa' },
                    { id: 'title', label: 'Aa' },
                    { id: 'asis', label: 'Az' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => onUpdate({ authorCasingOverride: c.id })}
                      className={`py-2 rounded-md text-xs font-bold ${
                        currentCasing === c.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Weight</span>
                  <span className="text-xs text-white tabular-nums">{currentWeight}</span>
                </div>
                <input
                  type="range" min={300} max={900} step={100}
                  value={currentWeight}
                  onChange={(e) => onUpdate({ authorWeight: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Italic</span>
                <button
                  onClick={() => onUpdate({ authorItalic: !currentItalic })}
                  className={`relative w-10 h-5 rounded-full ${currentItalic ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentItalic ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-white/60 uppercase tracking-wide">Letter spacing</span>
                  <span className="text-xs text-white tabular-nums">{currentTracking.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={-0.05} max={0.3} step={0.01}
                  value={currentTracking}
                  onChange={(e) => onUpdate({ authorLetterSpacing: parseFloat(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                />
              </div>
            </>
          )}

          {/* COLOR section */}
          {section === 'color' && (
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onUpdate({ authorColor: null })}
                  className={`h-8 px-3 rounded-lg text-xs font-medium ${
                    !overrides.authorColor ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
                  }`}
                >
                  Default
                </button>
                {palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdate({ authorColor: c })}
                    className={`w-8 h-8 rounded-lg ${(currentColor || '').toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547] ring-offset-2 ring-offset-[#141414] scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                  <input
                    type="color"
                    value={currentColor && currentColor.startsWith('#') ? currentColor : '#ffffff'}
                    onChange={(e) => onUpdate({ authorColor: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SHADOW section */}
          {section === 'shadow' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Shadow</span>
                <button
                  onClick={() => onUpdate({ authorShadowEnabled: !shadowEnabled })}
                  className={`relative w-10 h-5 rounded-full ${shadowEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${shadowEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {shadowEnabled && (
                <>
                  <div>
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Color</div>
                    <div className="flex flex-wrap gap-2">
                      {['#000000', '#FFFFFF', '#FF3B3B', '#FFD700', '#FF2D8A', '#00D9FF'].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onUpdate({ authorShadowColor: c })}
                          className={`w-7 h-7 rounded-md ${shadowColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={shadowColor} onChange={(e) => onUpdate({ authorShadowColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <CompactRow>
                    <CompactSlider label="Opacity" value={shadowOpacity} min={0} max={1} step={0.05} onChange={v => onUpdate({ authorShadowOpacity: v })} />
                    <CompactSlider label="Blur" value={shadowBlur} min={0} max={40} step={1} onChange={v => onUpdate({ authorShadowBlur: v })} />
                  </CompactRow>
                  <CompactRow>
                    <CompactSlider label="X" value={shadowOffsetX} min={-20} max={20} step={1} onChange={v => onUpdate({ authorShadowOffsetX: v })} />
                    <CompactSlider label="Y" value={shadowOffsetY} min={-20} max={20} step={1} onChange={v => onUpdate({ authorShadowOffsetY: v })} />
                  </CompactRow>
                </>
              )}
            </>
          )}

          {/* PILL section */}
          {section === 'pill' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wide">Background pill</span>
                <button
                  onClick={() => onUpdate({ authorPillEnabled: !pillEnabled })}
                  className={`relative w-10 h-5 rounded-full ${pillEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${pillEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {pillEnabled && (
                <>
                  <div>
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Pill color</div>
                    <div className="flex flex-wrap gap-2">
                      {['#FFFFFF', '#0A0A0A', '#FFB547', '#FF2D8A', '#FF3B3B', '#00D9FF', '#D4AF37'].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onUpdate({ authorPillColor: c })}
                          className={`w-7 h-7 rounded-md ${pillColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#FFB547]' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden">
                        <input type="color" value={pillColor} onChange={(e) => onUpdate({ authorPillColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-white/60 uppercase tracking-wide">Padding</span>
                      <span className="text-xs text-white tabular-nums">{pillPadding.toFixed(1)}</span>
                    </div>
                    <input type="range" min={0.2} max={1.5} step={0.1} value={pillPadding}
                      onChange={(e) => onUpdate({ authorPillPadding: parseFloat(e.target.value) })}
                      className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold flex-shrink-0"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// Shared tab definition
const EDITOR_TABS = [
  { id: 'styles', label: 'Styles', icon: Sparkles },
  { id: 'type', label: 'Type', icon: Type },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'layout', label: 'Layout', icon: LayoutIcon },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'filter', label: 'Filter', icon: Wand2 },
  { id: 'shadow', label: 'Shadow', icon: Layers },
  { id: 'overlay', label: 'Overlay', icon: Layers },
  { id: 'format', label: 'Size', icon: Sliders }
];

function TabContent({ activeTab, style, overrides, updateOverride, photoAnalysis, compact = false, image, words, author, selectedStyleId, onSelectStyle, fontsReady }) {
  if (activeTab === 'styles') return <StyleSwitcher image={image} words={words} author={author} selectedStyleId={selectedStyleId} onSelectStyle={onSelectStyle} photoAnalysis={photoAnalysis} fontsReady={fontsReady} compact={compact} />;
  if (activeTab === 'type') return <TypeControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'color') return <ColorControls style={style} overrides={overrides} updateOverride={updateOverride} photoAnalysis={photoAnalysis} compact={compact} />;
  if (activeTab === 'layout') return <LayoutControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'image') return <ImageAdjustControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'filter') return <FilterControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'shadow') return <ShadowControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'overlay') return <OverlayControls style={style} overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  if (activeTab === 'format') return <FormatControls overrides={overrides} updateOverride={updateOverride} compact={compact} />;
  return null;
}

/* ================================================================
   STYLE SWITCHER — horizontal scrollable thumbnails of all 18 styles
================================================================ */
function StyleSwitcher({ image, words, author, selectedStyleId, onSelectStyle, photoAnalysis, fontsReady, compact = false }) {
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

function StyleSwitcherCard({ style, image, words, author, isActive, onClick, photoAnalysis, fontsReady, height = 100 }) {
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

/* ================================================================
   MOBILE EDITOR CONTROLS — Typorama-style compact bottom panel
================================================================ */
function EditorControlsMobile({ style, overrides, updateOverride, photoAnalysis, activeTab, setActiveTab, image, words, author, selectedStyleId, onSelectStyle, fontsReady }) {
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

/* ================================================================
   DESKTOP EDITOR CONTROLS — sidebar (full-size)
================================================================ */
function EditorControlsDesktop({ style, overrides, updateOverride, photoAnalysis, activeTab, setActiveTab, image, words, author, selectedStyleId, onSelectStyle, fontsReady }) {
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
          author={author}
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
          fontsReady={fontsReady}
        />
      </div>
    </aside>
  );
}

/* ================================================================
   CONTROL PANELS
================================================================ */
function Slider({ label, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs text-white/90 tabular-nums">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
      />
    </div>
  );
}

function ColorSwatch({ color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg transition-transform ${active ? 'ring-2 ring-offset-2 ring-offset-[#0D0D0D] ring-[#FFB547] scale-110' : 'hover:scale-105'}`}
      style={{ backgroundColor: color }}
    />
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-2">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ================================================================
   COMPACT CONTROL HELPERS — for mobile inline layout
================================================================ */
// Compact slider — labeled, inline, smaller footprint
function CompactSlider({ label, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div className="flex flex-col gap-1 min-w-[110px] flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-white/50 uppercase tracking-wide">{label}</span>
        <span className="text-[10px] text-white/80 tabular-nums">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
      />
    </div>
  );
}

// Horizontal scrollable row for compact mode
function CompactRow({ children }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}

function TypeControls({ style, overrides, updateOverride, compact = false }) {
  if (compact) {
    return (
      <CompactRow>
        <CompactSlider
          label="Size"
          value={overrides.fontSizeMultiplier ?? 1}
          min={0.5} max={2} step={0.05}
          onChange={(v) => updateOverride('fontSizeMultiplier', v)}
        />
        <CompactSlider
          label="Width"
          value={overrides.textWidth ?? style.layout.textWidth}
          min={0.4} max={0.95} step={0.05}
          onChange={(v) => updateOverride('textWidth', v)}
        />
        <CompactSlider
          label="Line height"
          value={overrides.lineHeight ?? style.typography.lineHeight}
          min={0.8} max={1.8} step={0.05}
          onChange={(v) => updateOverride('lineHeight', v)}
        />
        <CompactSlider
          label="Spacing"
          value={overrides.letterSpacing ?? style.typography.letterSpacing ?? 0}
          min={-0.05} max={0.2} step={0.01}
          onChange={(v) => updateOverride('letterSpacing', v)}
        />
      </CompactRow>
    );
  }
  return (
    <>
      <Section title="Size">
        <Slider
          label="Font size"
          value={overrides.fontSizeMultiplier ?? 1}
          min={0.5}
          max={2}
          step={0.05}
          onChange={(v) => updateOverride('fontSizeMultiplier', v)}
        />
      </Section>
      <Section title="Spacing">
        <Slider
          label="Width"
          value={overrides.textWidth ?? style.layout.textWidth}
          min={0.4}
          max={0.95}
          step={0.05}
          onChange={(v) => updateOverride('textWidth', v)}
        />
        <Slider
          label="Line height"
          value={overrides.lineHeight ?? style.typography.lineHeight}
          min={0.8}
          max={1.8}
          step={0.05}
          onChange={(v) => updateOverride('lineHeight', v)}
        />
        <Slider
          label="Letter spacing"
          value={overrides.letterSpacing ?? style.typography.letterSpacing ?? 0}
          min={-0.05}
          max={0.2}
          step={0.01}
          onChange={(v) => updateOverride('letterSpacing', v)}
        />
      </Section>
      <Section title="Per-word">
        <div className="text-xs text-white/50 leading-relaxed">
          Tap any word on the canvas to change just that word's color, size, or emphasis.
        </div>
        {overrides.perWordOverrides && Object.keys(overrides.perWordOverrides).length > 0 && (
          <button
            onClick={() => updateOverride('perWordOverrides', {})}
            className="w-full py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white/70 text-xs font-medium hover:text-white flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all word customizations
          </button>
        )}
      </Section>
    </>
  );
}

function ColorControls({ style, overrides, updateOverride, photoAnalysis, compact = false }) {
  const defaultPalette = [
    '#FFFFFF', '#0A0A0A', '#FFB547', '#FFD700', '#FF2D8A', '#FF3B3B', '#00D9FF', '#00FF88'
  ];
  const suggested = photoAnalysis?.suggestedAccentColors || [];
  const emphasis = overrides.emphasisColor ?? style.colors.emphasis;
  const connector = overrides.connectorColor ?? style.colors.connector;
  const author = overrides.authorColor ?? style.colors.author;
  const [activeColorTarget, setActiveColorTarget] = useState('emphasis');

  if (compact) {
    const targetMap = { emphasis, connector, author };
    const targetCurrent = targetMap[activeColorTarget];
    const palette = activeColorTarget === 'emphasis' ? [...suggested, ...defaultPalette].slice(0, 9) : defaultPalette;
    const overrideKey = activeColorTarget === 'emphasis' ? 'emphasisColor' : activeColorTarget === 'connector' ? 'connectorColor' : 'authorColor';
    return (
      <div className="flex flex-col gap-2">
        {/* Target selector — small pills */}
        <div className="flex gap-1">
          {[
            { id: 'emphasis', label: 'Emphasis' },
            { id: 'connector', label: 'Connector' },
            { id: 'author', label: 'Author' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveColorTarget(t.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${
                activeColorTarget === t.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Color row */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {palette.map((c, i) => (
            <button
              key={i}
              onClick={() => updateOverride(overrideKey, c)}
              className={`w-7 h-7 rounded-md flex-shrink-0 transition-transform ${
                targetCurrent && targetCurrent.toLowerCase() === c.toLowerCase()
                  ? 'ring-2 ring-[#FFB547] ring-offset-1 ring-offset-[#0D0D0D] scale-110'
                  : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <label className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden flex-shrink-0">
            <input
              type="color"
              value={targetCurrent || '#ffffff'}
              onChange={(e) => updateOverride(overrideKey, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <>
      <Section title="Emphasis Color">
        <div className="flex flex-wrap gap-2">
          {[...suggested, ...defaultPalette].slice(0, 9).map((c, i) => (
            <ColorSwatch key={i} color={c} active={emphasis.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('emphasisColor', c)} />
          ))}
          <input type="color" value={emphasis} onChange={(e) => updateOverride('emphasisColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
      <Section title="Connector Color">
        <div className="flex flex-wrap gap-2">
          {defaultPalette.slice(0, 8).map((c, i) => (
            <ColorSwatch key={i} color={c} active={connector.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('connectorColor', c)} />
          ))}
          <input type="color" value={connector} onChange={(e) => updateOverride('connectorColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
      <Section title="Author Color">
        <div className="flex flex-wrap gap-2">
          {defaultPalette.slice(0, 8).map((c, i) => (
            <ColorSwatch key={i} color={c} active={author.toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('authorColor', c)} />
          ))}
          <input type="color" value={author} onChange={(e) => updateOverride('authorColor', e.target.value)} className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer" />
        </div>
      </Section>
    </>
  );
}

function LayoutControls({ style, overrides, updateOverride, compact = false }) {
  const anchors = [
    ['top-left', 'top', 'top-right'],
    ['center-left', 'center', 'center-right'],
    ['bottom-left', 'bottom-center', 'bottom-right']
  ];
  const currentAnchor = overrides.anchor ?? style.layout.anchor;
  const currentAlign = overrides.alignment ?? style.layout.alignment;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Compact anchor grid */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          {anchors.map((row, ri) => (
            <div key={ri} className="flex gap-0.5">
              {row.map(a => (
                <button
                  key={a}
                  onClick={() => updateOverride('anchor', a)}
                  className={`w-5 h-5 rounded-sm border ${
                    currentAnchor === a
                      ? 'border-[#FFB547] bg-[#FFB547]/20'
                      : 'border-[#2a2a2a]'
                  }`}
                >
                  <div className={`w-1 h-1 rounded-full mx-auto ${currentAnchor === a ? 'bg-[#FFB547]' : 'bg-white/30'}`} />
                </button>
              ))}
            </div>
          ))}
        </div>
        {/* Alignment buttons */}
        <div className="flex gap-1 flex-shrink-0">
          {[
            { id: 'left', icon: AlignLeft },
            { id: 'center', icon: AlignCenter },
            { id: 'right', icon: AlignRight }
          ].map(a => (
            <button
              key={a.id}
              onClick={() => updateOverride('alignment', a.id)}
              className={`p-1.5 rounded-md border ${
                currentAlign === a.id ? 'border-[#FFB547] bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2a2a2a] text-white/60'
              }`}
            >
              <a.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        {/* Offset sliders side by side */}
        <div className="flex gap-2 flex-1 min-w-0">
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

function ImageAdjustControls({ overrides, updateOverride, compact = false }) {
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

function FilterControls({ overrides, updateOverride, compact = false }) {
  const current = overrides.filter ?? 'original';
  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {Object.entries(FILTERS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('filter', key)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${
              current === key
                ? 'bg-[#FFB547] text-black'
                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    );
  }
  return (
    <Section title="Photo Filter">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(FILTERS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('filter', key)}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              current === key
                ? 'bg-[#FFB547] text-black'
                : 'bg-[#141414] border border-[#2a2a2a] text-white/70 hover:border-[#3a3a3a]'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    </Section>
  );
}

function ShadowControls({ style, overrides, updateOverride, compact = false }) {
  const shadowPalette = ['#000000', '#FFFFFF', '#7A7A7A', '#1A2A4A', '#FF3B3B', '#FFD700', '#FF2D8A', '#00D9FF'];
  // Resolve current values (style defaults if no override)
  const enabled = overrides.shadowEnabled !== undefined ? overrides.shadowEnabled : style.effects.textShadow;
  const colorRaw = overrides.shadowColor ?? style.effects.shadowColor ?? 'rgba(0,0,0,0.6)';
  // For palette comparison, normalize rgba to closest hex if possible — simpler: just compare strings
  const blur = overrides.shadowBlur !== undefined ? overrides.shadowBlur : (style.effects.shadowBlur ?? 12);
  const offsetX = overrides.shadowOffsetX !== undefined ? overrides.shadowOffsetX : (style.effects.shadowOffsetX ?? 0);
  const offsetY = overrides.shadowOffsetY !== undefined ? overrides.shadowOffsetY : (style.effects.shadowOffsetY ?? 4);
  const opacity = overrides.shadowOpacity !== undefined ? overrides.shadowOpacity : 1;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {/* Top row: enable toggle + color swatches */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateOverride('shadowEnabled', !enabled)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium flex-shrink-0 ${
              enabled ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/60'
            }`}
          >
            {enabled ? 'On' : 'Off'}
          </button>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            {shadowPalette.map((c, i) => (
              <button
                key={i}
                onClick={() => updateOverride('shadowColor', c)}
                className={`w-6 h-6 rounded-md flex-shrink-0 border ${
                  (colorRaw || '').toLowerCase() === c.toLowerCase() ? 'border-[#FFB547] scale-110' : 'border-[#2a2a2a]'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="w-6 h-6 rounded-md border border-[#2a2a2a] bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 cursor-pointer relative overflow-hidden flex-shrink-0">
              <input
                type="color"
                value={colorRaw && colorRaw.startsWith('#') ? colorRaw : '#000000'}
                onChange={(e) => updateOverride('shadowColor', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
        {/* Sliders row */}
        <CompactRow>
          <CompactSlider label="Opacity" value={opacity} min={0} max={1} step={0.05} onChange={v => updateOverride('shadowOpacity', v)} />
          <CompactSlider label="Blur" value={blur} min={0} max={60} step={1} onChange={v => updateOverride('shadowBlur', v)} />
          <CompactSlider label="X" value={offsetX} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetX', v)} />
          <CompactSlider label="Y" value={offsetY} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetY', v)} />
        </CompactRow>
      </div>
    );
  }

  return (
    <>
      <Section title="Enable">
        <button
          onClick={() => updateOverride('shadowEnabled', !enabled)}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            enabled ? 'bg-[#FFB547] text-black' : 'bg-[#141414] border border-[#2a2a2a] text-white/70'
          }`}
        >
          Shadow {enabled ? 'On' : 'Off'}
        </button>
      </Section>
      <Section title="Shadow Color">
        <div className="flex flex-wrap gap-2">
          {shadowPalette.map((c, i) => (
            <ColorSwatch key={i} color={c} active={(colorRaw || '').toLowerCase() === c.toLowerCase()} onClick={() => updateOverride('shadowColor', c)} />
          ))}
          <input
            type="color"
            value={colorRaw && colorRaw.startsWith('#') ? colorRaw : '#000000'}
            onChange={(e) => updateOverride('shadowColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer"
          />
        </div>
      </Section>
      <Section title="Shadow Properties">
        <Slider label="Opacity" value={opacity} min={0} max={1} step={0.05} onChange={v => updateOverride('shadowOpacity', v)} />
        <Slider label="Blur" value={blur} min={0} max={60} step={1} onChange={v => updateOverride('shadowBlur', v)} />
        <Slider label="X position" value={offsetX} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetX', v)} />
        <Slider label="Y position" value={offsetY} min={-30} max={30} step={1} onChange={v => updateOverride('shadowOffsetY', v)} />
      </Section>
    </>
  );
}

function OverlayControls({ style, overrides, updateOverride, compact = false }) {
  const types = [
    { id: 'none', label: 'None' },
    { id: 'dark-bottom', label: 'Bottom' },
    { id: 'dark-top', label: 'Top' },
    { id: 'vignette', label: 'Vignette' },
    { id: 'radial-dark', label: 'Radial' },
    { id: 'full-dark', label: 'Full Dark' },
    { id: 'gradient-diagonal', label: 'Diagonal' }
  ];
  const currentType = overrides.overlayType ?? style.overlay.type;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {/* Overlay type pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => updateOverride('overlayType', t.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${
                currentType === t.id ? 'bg-[#FFB547] text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Darkness slider */}
        <CompactSlider
          label="Darkness"
          value={overrides.overlayDarkness ?? style.overlay.darkness}
          min={0} max={1} step={0.05}
          onChange={(v) => updateOverride('overlayDarkness', v)}
        />
      </div>
    );
  }

  return (
    <>
      <Section title="Type">
        <div className="grid grid-cols-2 gap-1.5">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => updateOverride('overlayType', t.id)}
              className={`py-2 rounded-md border text-xs font-medium transition-all ${
                currentType === t.id ? 'border-[#FFB547] bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2a2a2a] text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Darkness">
        <Slider
          label="Intensity"
          value={overrides.overlayDarkness ?? style.overlay.darkness}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => updateOverride('overlayDarkness', v)}
        />
      </Section>
    </>
  );
}

function FormatControls({ overrides, updateOverride, compact = false }) {
  const current = overrides.format ?? '4:5';
  if (compact) {
    return (
      <div className="flex gap-1.5">
        {Object.entries(FORMATS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('format', key)}
            className={`flex-1 py-2 rounded-md border text-center transition-all ${
              current === key ? 'border-[#FFB547] bg-[#FFB547]/10' : 'border-[#2a2a2a]'
            }`}
          >
            <div className="text-xs font-semibold text-white">{key}</div>
          </button>
        ))}
      </div>
    );
  }
  return (
    <Section title="Canvas Format">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(FORMATS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => updateOverride('format', key)}
            className={`py-3 px-3 rounded-lg border text-left transition-all ${
              current === key ? 'border-[#FFB547] bg-[#FFB547]/10' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="text-sm font-semibold">{key}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{f.label}</div>
          </button>
        ))}
      </div>
    </Section>
  );
}
