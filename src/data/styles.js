export const STYLES = [
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
