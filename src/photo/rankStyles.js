export function rankStyles(photo, quote, allStyles, excluded = [], shuffleSeed = 0) {
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
