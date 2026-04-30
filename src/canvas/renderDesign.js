import { hexToRgb, relativeLuminance } from '../photo/color.js';
import { drawAsymmetricShape, drawConstellation, drawDoubleFrame, drawGrainOverlay, drawHexFrame, drawLineBox, drawRibbon, drawStampFrame, drawStellarField } from './decorations.js';
import { applyImageFilter, drawImageCover, hasImageFilter } from './image.js';
import { drawOverlay, drawTint } from './overlays.js';
import { applyShadow, getShadow } from './shadows.js';
import { applyCasing, computeBaseFontSize, measureLine, wrapLines } from './textLayout.js';

function createScaledCanvas(width, height, pixelRatio = 1) {
  const scale = Number.isFinite(pixelRatio) && pixelRatio > 0 ? pixelRatio : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(scale, scale);
  return { canvas, ctx };
}

function drawMaskedSubjectLayer(ctx, image, photo, width, height, imgOX, imgOY, imageZoom, pixelRatio = 1) {
  const subX = (photo.subjectX ?? 0.5) * width;
  const subY = (photo.subjectY ?? 0.5) * height;
  // Subject ellipse — vertical-leaning (humans are taller than wide)
  const ellipseW = Math.min(width, height) * 0.36;
  const ellipseH = Math.min(width, height) * 0.55;

  drawImageCover(ctx, image, 0, 0, width, height, imgOX, imgOY, imageZoom);

  const { canvas: maskCanvas, ctx: maskCtx } = createScaledCanvas(width, height, pixelRatio);
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

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0, width, height);
  ctx.restore();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getMaxLineWidth(lines, wordGap) {
  return lines.reduce((max, line) => Math.max(max, measureLine(line, wordGap)), 0);
}

function getHorizontalTextStart(alignment, width, padX, textW, offsetX) {
  const baseX = alignment === 'center'
    ? (width - textW) / 2
    : alignment === 'right'
      ? width - padX - textW
      : padX;
  return baseX + (offsetX || 0) * width;
}

function getRectOverlap(a, b) {
  if (!a || !b) return null;
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  if (x2 <= x1 || y2 <= y1) return null;
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

function getCutoutSubjectBox(cutoutImage, width, height, imgOX, imgOY, imageZoom) {
  if (!cutoutImage) return null;

  const maxSampleSize = 160;
  const scale = Math.min(1, maxSampleSize / Math.max(width, height));
  const sampleW = Math.max(1, Math.round(width * scale));
  const sampleH = Math.max(1, Math.round(height * scale));
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleW;
  sampleCanvas.height = sampleH;
  const sampleCtx = sampleCanvas.getContext('2d');
  drawImageCover(sampleCtx, cutoutImage, 0, 0, sampleW, sampleH, imgOX, imgOY, imageZoom);

  let data;
  try {
    data = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
  } catch {
    return null;
  }

  let minX = sampleW;
  let minY = sampleH;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const alpha = data[(y * sampleW + x) * 4 + 3];
      if (alpha > 24) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const pad = Math.max(2, Math.round(Math.min(sampleW, sampleH) * 0.02));
  const x = clamp((minX - pad) / sampleW * width, 0, width);
  const y = clamp((minY - pad) / sampleH * height, 0, height);
  const right = clamp((maxX + pad) / sampleW * width, 0, width);
  const bottom = clamp((maxY + pad) / sampleH * height, 0, height);
  return { x, y, w: Math.max(0, right - x), h: Math.max(0, bottom - y) };
}

function getApproxSubjectBox(photo, width, height) {
  if (!photo) return null;
  const subX = (photo.subjectX ?? 0.5) * width;
  const subY = (photo.subjectY ?? 0.5) * height;
  const boxW = Math.min(width * 0.52, height * 0.42);
  const boxH = Math.min(height * 0.72, width * 0.88);
  const sideBias = photo.subjectSide === 'left' ? -0.04 : photo.subjectSide === 'right' ? 0.04 : 0;
  const x = clamp(subX - boxW / 2 + sideBias * width, 0, width - boxW);
  const y = clamp(subY - boxH * 0.38, 0, height - boxH);
  return { x, y, w: boxW, h: boxH };
}

function getSubjectBox(cutoutImage, photo, width, height, imgOX, imgOY, imageZoom) {
  return getCutoutSubjectBox(cutoutImage, width, height, imgOX, imgOY, imageZoom)
    || getApproxSubjectBox(photo, width, height);
}

export function renderDesign(canvas, design, isPreview = false) {
  const { width, height, image, cutoutImage, style, overrides = {}, words } = design;
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
  const shouldFilterImage = hasImageFilter(filterKey);
  const tint = {
    enabled: overrides.tintEnabled === true,
    color: overrides.tintColor ?? '#F2F0EC',
    strength: overrides.tintStrength ?? 0.35
  };

  // Background
  ctx.fillStyle = S.overlay.type === 'full-light' ? (S.overlay.color || '#F2F0EC') : '#000000';
  ctx.fillRect(0, 0, width, height);

  // Image
  if (image) {
    drawImageCover(ctx, image, 0, 0, width, height, imgOX, imgOY, imageZoom);
    // Brightness/contrast/saturation via filter key
    applyImageFilter(ctx, 0, 0, width, height, filterKey, dpr);
  }

  drawTint(ctx, width, height, tint);

  // Overlay
  const overlayDarkness = overrides.overlayDarkness ?? S.overlay.darkness;
  const overlayType = overrides.overlayType ?? S.overlay.type;
  const overlayColor = overrides.overlayColor ?? S.overlay.color;

  // Pre-compute layout to know dynamic band height (for caption-band autoBand styles)
  let dynamicBandHeight = S.overlay.bandHeight;
  if (overlayType === 'caption-band' && S.layout.autoBand) {
    const tempBaseFontSize = computeBaseFontSize(design);
    const tempTextWidth = (overrides.textWidth ?? S.layout.textWidth) * width;
    const preComputedLines = wrapLines(ctx, words, tempTextWidth, S, tempBaseFontSize, overrides);
    const tempLineHeight = tempBaseFontSize * (overrides.lineHeight ?? S.typography.lineHeight);
    const preComputedTextHeight = preComputedLines.length * tempLineHeight;
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
  if (S.decorations.stellarField) {
    drawStellarField(ctx, width, height, {
      starColor: S.decorations.stellarStarColor,
      glowColor: S.decorations.stellarGlowColor,
      coolGlowColor: S.decorations.stellarCoolGlowColor,
      starCount: S.decorations.stellarStarCount
    });
  }
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

  // Anchor
  const anchor = overrides.anchor ?? S.layout.anchor;
  const alignment = overrides.alignment ?? S.layout.alignment;
  const padX = S.layout.paddingX * width;
  const padY = S.layout.paddingY * height;
  const author = design.author;
  const authorOffsetX = overrides.authorOffsetX || 0;
  const authorOffsetY = overrides.authorOffsetY || 0;
  const authorSizeMul = overrides.authorSizeMultiplier || 1;

  // Compute text layout. Subject-aware adjustments below update these local values only.
  let baseFontSize = computeBaseFontSize(design);
  let textWidth = (overrides.textWidth ?? S.layout.textWidth) * width;
  let lines;
  let wordGap;
  let lineHeightMul;
  let lineHeight;
  let totalTextHeight;
  let authorFontSize;
  let authorHeight;
  let authorFontSizeFinal;
  let blockY;
  let autoShiftY = 0;

  function recomputeBlockY() {
    if (anchor.includes('top')) blockY = padY;
    else if (anchor.includes('bottom')) blockY = height - padY - totalTextHeight - authorHeight;
    else blockY = (height - totalTextHeight - authorHeight) / 2;

    blockY += (overrides.offsetY || 0) * height + autoShiftY;
  }

  function recomputeTextLayout(nextBaseFontSize = baseFontSize, nextTextWidth = textWidth) {
    baseFontSize = nextBaseFontSize;
    textWidth = nextTextWidth;
    lines = wrapLines(ctx, words, textWidth, S, baseFontSize, overrides);
    wordGap = lines.wordGap || baseFontSize * 0.32;
    lineHeightMul = overrides.lineHeight ?? S.typography.lineHeight;
    lineHeight = baseFontSize * lineHeightMul;
    totalTextHeight = lines.length * lineHeight;
    authorFontSize = Math.max(16, baseFontSize * 0.28);
    authorHeight = author ? authorFontSize * 1.5 : 0;
    authorFontSizeFinal = authorFontSize * authorSizeMul;
    recomputeBlockY();
  }

  function getCurrentTextBox() {
    const maxLineW = getMaxLineWidth(lines, wordGap);
    return {
      x: getHorizontalTextStart(alignment, width, padX, maxLineW, overrides.offsetX),
      y: author && S.layout.authorPosition === 'above' ? blockY - authorHeight : blockY,
      w: maxLineW,
      h: totalTextHeight + authorHeight
    };
  }

  function shiftTextBlock(deltaY) {
    const textBox = getCurrentTextBox();
    const minDelta = padY * 0.25 - textBox.y;
    const maxDelta = height - padY * 0.25 - (textBox.y + textBox.h);
    const clampedDelta = clamp(deltaY, minDelta, maxDelta);
    if (Math.abs(clampedDelta) < 1) return false;
    autoShiftY += clampedDelta;
    recomputeBlockY();
    return true;
  }

  recomputeTextLayout();

  if (S.decorations.subjectForeground) {
    const subjectBox = getSubjectBox(cutoutImage, design.photo, width, height, imgOX, imgOY, imageZoom);
    const hasManualPosition = overrides.offsetX !== undefined || overrides.offsetY !== undefined;
    const hasManualTextWidth = overrides.textWidth !== undefined;
    const hasManualFontSize = overrides.fontSizeMultiplier !== undefined;
    const skipAutoAdjustment = hasManualPosition && hasManualTextWidth && hasManualFontSize;
    const autoStrength = (hasManualPosition || hasManualTextWidth || hasManualFontSize) ? 0.45 : 1;

    if (subjectBox && subjectBox.w > 0 && subjectBox.h > 0 && !skipAutoAdjustment) {
      const headZone = { ...subjectBox, h: subjectBox.h * 0.35 };
      let textBox = getCurrentTextBox();
      let headOverlap = getRectOverlap(textBox, headZone);

      if (headOverlap) {
        if (!hasManualPosition) {
          const shift = -Math.min(height * 0.12, (headOverlap.h + height * 0.035) * autoStrength);
          shiftTextBlock(shift);
        }

        textBox = getCurrentTextBox();
        headOverlap = getRectOverlap(textBox, headZone);
        if (headOverlap && !hasManualTextWidth) {
          recomputeTextLayout(baseFontSize, textWidth * (1 - 0.1 * autoStrength));
        }
      } else if (getRectOverlap(textBox, subjectBox)) {
        if (!hasManualFontSize) {
          recomputeTextLayout(baseFontSize * (1 - 0.06 * autoStrength), textWidth);
        } else if (!hasManualPosition) {
          const textCenterY = textBox.y + textBox.h / 2;
          const subjectCenterY = subjectBox.y + subjectBox.h / 2;
          shiftTextBlock((textCenterY < subjectCenterY ? -1 : 1) * height * 0.045 * autoStrength);
        }
      }
    }
  }

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

    line.forEach((w) => {
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
    if (shouldFilterImage) {
      const { canvas: foregroundCanvas, ctx: foregroundCtx } = createScaledCanvas(width, height, dpr);
      if (cutoutImage) {
        drawImageCover(foregroundCtx, cutoutImage, 0, 0, width, height, imgOX, imgOY, imageZoom);
      } else {
        drawMaskedSubjectLayer(foregroundCtx, image, design.photo, width, height, imgOX, imgOY, imageZoom, dpr);
      }
      applyImageFilter(foregroundCtx, 0, 0, width, height, filterKey, dpr);
      drawTint(foregroundCtx, width, height, { ...tint, clipToContent: true });
      ctx.drawImage(foregroundCanvas, 0, 0, width, height);
    } else if (cutoutImage) {
      if (tint.enabled) {
        const { canvas: foregroundCanvas, ctx: foregroundCtx } = createScaledCanvas(width, height, dpr);
        drawImageCover(foregroundCtx, cutoutImage, 0, 0, width, height, imgOX, imgOY, imageZoom);
        drawTint(foregroundCtx, width, height, { ...tint, clipToContent: true });
        ctx.drawImage(foregroundCanvas, 0, 0, width, height);
      } else {
        drawImageCover(ctx, cutoutImage, 0, 0, width, height, imgOX, imgOY, imageZoom);
      }
    } else {
      const { canvas: offCanvas, ctx: offCtx } = createScaledCanvas(width, height);
      drawMaskedSubjectLayer(offCtx, image, design.photo, width, height, imgOX, imgOY, imageZoom);
      drawTint(offCtx, width, height, { ...tint, clipToContent: true });
      ctx.drawImage(offCanvas, 0, 0);
    }
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
