function clampAlpha(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function drawTint(ctx, w, h, tint) {
  if (!tint?.enabled) return;
  const strength = clampAlpha(tint.strength ?? 0);
  if (strength <= 0) return;

  ctx.save();
  ctx.globalAlpha = strength;
  if (tint.clipToContent) {
    ctx.globalCompositeOperation = 'source-atop';
  }
  ctx.fillStyle = tint.color || '#F2F0EC';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function drawOverlay(ctx, w, h, overlay, photo) {
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
