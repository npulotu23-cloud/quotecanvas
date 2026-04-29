import { FILTERS } from '../photo/filters.js';

export function drawImageCover(ctx, img, x, y, w, h, offsetX = 0, offsetY = 0, zoom = 1) {
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

export function hasImageFilter(filterKey) {
  const filter = FILTERS[filterKey];
  return Boolean(filter?.apply);
}

export function applyImageFilter(ctx, x, y, w, h, filterKey, pixelRatio = 1) {
  const filter = FILTERS[filterKey];
  if (!filter || !filter.apply) return;

  const scale = Number.isFinite(pixelRatio) && pixelRatio > 0 ? pixelRatio : 1;
  const sx = Math.max(0, Math.round(x * scale));
  const sy = Math.max(0, Math.round(y * scale));
  const ex = Math.min(ctx.canvas.width, Math.round((x + w) * scale));
  const ey = Math.min(ctx.canvas.height, Math.round((y + h) * scale));
  const sw = ex - sx;
  const sh = ey - sy;
  if (sw <= 0 || sh <= 0) return;

  try {
    const imageData = ctx.getImageData(sx, sy, sw, sh);
    filter.apply(imageData.data);
    ctx.putImageData(imageData, sx, sy);
  } catch {
    // CORS or tainted canvas - skip silently
  }
}
