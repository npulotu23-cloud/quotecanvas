export function pickAccentForStyle(style, photo) {
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
