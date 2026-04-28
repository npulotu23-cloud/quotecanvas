export function drawConstellation(ctx, w, h, color, density) {
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

export function drawHexFrame(ctx, w, h, color) {
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

export function drawAsymmetricShape(ctx, w, h, variant, color, position) {
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

export function drawLineBox(ctx, x, y, w, h, borderColor, borderWidth, fillColor) {
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

export function drawRibbon(ctx, x, y, w, h, color, notchSize) {
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

export function drawDoubleFrame(ctx, w, h, color, marginRatio) {
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

export function drawStampFrame(ctx, w, h, color, marginRatio) {
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

export function drawGrainOverlay(ctx, w, h, intensity) {
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
