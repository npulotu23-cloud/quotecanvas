export function applyCasing(text, casing) {
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

export function wrapLines(ctx, words, maxWidth, style, baseFontSize, overrides = {}) {
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

export function measureLine(line, wordGap) {
  return line.reduce((sum, w, i) => sum + w.w + (i > 0 ? wordGap : 0), 0);
}

export function computeBaseFontSize(design) {
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
