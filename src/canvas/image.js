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

export function applyImageFilter(ctx, x, y, w, h, filterKey) {
  const filter = FILTERS[filterKey];
  if (!filter || !filter.apply) return;
  try {
    const imageData = ctx.getImageData(x, y, w, h);
    filter.apply(imageData.data);
    ctx.putImageData(imageData, x, y);
  } catch {
    // CORS or tainted canvas - skip silently
  }
}
