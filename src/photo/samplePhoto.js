export function generateSamplePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  // Warm gradient background
  const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, '#8B4513');
  bg.addColorStop(0.5, '#D4A574');
  bg.addColorStop(1, '#2B1810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);
  // Silhouette
  ctx.fillStyle = 'rgba(20,20,20,0.75)';
  // Head
  ctx.beginPath();
  ctx.arc(700, 500, 120, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(580, 620);
  ctx.quadraticCurveTo(700, 700, 820, 620);
  ctx.lineTo(880, 1100);
  ctx.lineTo(520, 1100);
  ctx.closePath();
  ctx.fill();
  // Stage backdrop hint
  ctx.fillStyle = 'rgba(255,200,100,0.08)';
  ctx.fillRect(0, 800, 1080, 550);
  return canvas.toDataURL('image/jpeg', 0.9);
}
