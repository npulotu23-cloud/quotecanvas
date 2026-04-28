export function getShadow(S, overrides = {}) {
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

export function applyShadow(ctx, shadow, halfStrength = false) {
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
