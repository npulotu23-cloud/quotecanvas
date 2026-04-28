import { contrastRatio, hslToHex, rgbToHex, rgbToHsl } from './color.js';

function kmeansColors(samples, k = 5, iterations = 8) {
  if (samples.length === 0) return [];
  // Init: pick k random samples
  let centers = [];
  const step = Math.floor(samples.length / k);
  for (let i = 0; i < k; i++) {
    const s = samples[Math.min(i * step, samples.length - 1)];
    centers.push([s.r, s.g, s.b]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, count: 0, weight: 0 }));
    for (const s of samples) {
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const dr = s.r - centers[i][0], dg = s.g - centers[i][1], db = s.b - centers[i][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      const w = s.weight || 1;
      sums[best].r += s.r * w;
      sums[best].g += s.g * w;
      sums[best].b += s.b * w;
      sums[best].count += 1;
      sums[best].weight += w;
    }
    centers = sums.map((s, i) => s.weight > 0 ? [s.r / s.weight, s.g / s.weight, s.b / s.weight] : centers[i]);
  }

  // Build cluster info
  const clusters = centers.map(c => ({ rgb: c, count: 0, weight: 0 }));
  for (const s of samples) {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const dr = s.r - centers[i][0], dg = s.g - centers[i][1], db = s.b - centers[i][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestDist) { bestDist = d; best = i; }
    }
    clusters[best].count++;
    clusters[best].weight += s.weight || 1;
  }

  return clusters.map(c => {
    const [h, s, l] = rgbToHsl(c.rgb[0], c.rgb[1], c.rgb[2]);
    return {
      hex: rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]),
      r: c.rgb[0], g: c.rgb[1], b: c.rgb[2],
      h, s, l,
      count: c.count,
      weight: c.weight,
      vibrance: s * (1 - Math.abs(l - 0.5) * 1.4) // peaks at l=0.5, drops at extremes
    };
  });
}

export async function analyzePhoto(imgElement) {
  const SIZE = 128;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  // === SUBJECT DETECTION via variance grid (refined) ===
  const GRID = 12;
  const CELL = SIZE / GRID;
  const cellLum = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  const cellSat = Array.from({length: GRID}, () => new Array(GRID).fill(0));

  let totalBrightness = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
      const [, sat] = rgbToHsl(data[idx], data[idx+1], data[idx+2]);
      totalBrightness += lum;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      cellLum[gy][gx] += lum;
      cellSat[gy][gx] += sat;
    }
  }
  const cellCount = CELL * CELL;
  for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
    cellLum[gy][gx] /= cellCount;
    cellSat[gy][gx] /= cellCount;
  }

  // Variance in each cell (detail/edge density)
  const variance = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      variance[gy][gx] += Math.pow(lum - cellLum[gy][gx], 2);
    }
  }

  // Subject score combines variance + saturation, with center bias
  let totalScore = 0;
  let weightedX = 0, weightedY = 0;
  const subjectMap = Array.from({length: GRID}, () => new Array(GRID).fill(0));
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      const cx = (gx + 0.5) / GRID;
      const cy = (gy + 0.5) / GRID;
      const centerBias = 1 - Math.min(1, Math.hypot(cx - 0.5, cy - 0.5) * 1.2);
      const score = (variance[gy][gx] * 1.5 + cellSat[gy][gx] * 0.6) * (0.5 + centerBias * 0.5);
      subjectMap[gy][gx] = score;
      totalScore += score;
      weightedX += cx * score;
      weightedY += cy * score;
    }
  }
  const subjectCenterX = totalScore > 0 ? weightedX / totalScore : 0.5;
  const subjectCenterY = totalScore > 0 ? weightedY / totalScore : 0.5;
  const subjectSide = subjectCenterX < 0.4 ? 'left' : subjectCenterX > 0.6 ? 'right' : 'center';
  const averageBrightness = totalBrightness / (SIZE * SIZE);

  // === COLOR EXTRACTION ===
  // Sample pixels with weights — vibrant pixels and subject-region pixels weighted higher
  const samples = [];
  const STRIDE = 2;
  for (let y = 0; y < SIZE; y += STRIDE) {
    for (let x = 0; x < SIZE; x += STRIDE) {
      const idx = (y * SIZE + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const [, sat, l] = rgbToHsl(r, g, b);
      // Skip near-pure-white and near-pure-black (usually background or shadow)
      if (l > 0.95 || l < 0.05) continue;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      const subjectScore = subjectMap[gy][gx] / (totalScore / (GRID * GRID));
      const vibrance = sat * (1 - Math.abs(l - 0.5) * 1.4);
      const weight = 1 + vibrance * 2 + Math.min(2, subjectScore);
      samples.push({ r, g, b, weight });
    }
  }

  // Run k-means
  const clusters = samples.length > 0 ? kmeansColors(samples, 6, 8) : [];
  // Sort by weight (most prominent first)
  const sortedByWeight = [...clusters].sort((a, b) => b.weight - a.weight);
  // Sort by vibrance (most vibrant first) for accent picks
  const sortedByVibrance = [...clusters].sort((a, b) => b.vibrance - a.vibrance);

  const dominantColors = sortedByWeight.slice(0, 3).map(c => c.hex);
  const vibrantColors = sortedByVibrance.filter(c => c.vibrance > 0.15).slice(0, 4).map(c => c.hex);
  const mutedColors = sortedByVibrance.slice().reverse().slice(0, 3).map(c => c.hex);

  // === HARMONY-BASED ACCENT SUGGESTIONS ===
  // Take the most prominent vibrant cluster. Build a palette around it.
  const harmonyAccents = [];
  if (sortedByVibrance.length > 0 && sortedByVibrance[0].vibrance > 0.1) {
    const lead = sortedByVibrance[0];
    const baseH = lead.h;
    // Complementary
    harmonyAccents.push(hslToHex((baseH + 0.5) % 1, Math.max(0.7, lead.s), 0.55));
    // Triadic 1
    harmonyAccents.push(hslToHex((baseH + 1/3) % 1, Math.max(0.7, lead.s), 0.55));
    // Split-complementary
    harmonyAccents.push(hslToHex((baseH + 0.42) % 1, Math.max(0.7, lead.s), 0.55));
    harmonyAccents.push(hslToHex((baseH + 0.58) % 1, Math.max(0.7, lead.s), 0.55));
  }

  // === STYLE-AWARE PALETTES ===
  // Pick palettes that have strong contrast with the photo's average brightness
  // Brand-style hot accents (always include for colorful styles)
  const HOT_ACCENTS = ['#FF2D8A', '#FF3B3B', '#FFB547', '#FFD700', '#00D9FF', '#B537F2', '#FF8C00'];
  // Refined palette for elegant styles
  const REFINED = ['#D4AF37', '#F5F1E8', '#C9A96E', '#A47148', '#704F36'];
  // Cinematic neon
  const NEON = ['#FF2D8A', '#00FFE0', '#FFB547', '#B537F2'];

  // Pick suggested accent: blend harmony + brand
  const suggestedAccentColors = [];
  // 1) Best harmony accent (if vibrant enough)
  if (harmonyAccents.length > 0) suggestedAccentColors.push(harmonyAccents[0]);
  // 2) Top vibrant from photo (if exists)
  if (vibrantColors.length > 0) suggestedAccentColors.push(vibrantColors[0]);
  // 3) Hot brand color that contrasts well with average background
  const HOT_PICKS = HOT_ACCENTS.filter(c => contrastRatio(c, rgbToHex(...sortedByWeight[0]?.rgb || [128,128,128])) > 2.5);
  if (HOT_PICKS.length > 0) suggestedAccentColors.push(HOT_PICKS[0]);
  // Fill rest from hot palette
  for (const c of HOT_ACCENTS) {
    if (!suggestedAccentColors.includes(c)) suggestedAccentColors.push(c);
    if (suggestedAccentColors.length >= 5) break;
  }

  // Smart text color (white or black) based on what would have better readability over likely text region
  const suggestedTextColor = averageBrightness > 0.55 ? '#0A0A0A' : '#FFFFFF';

  return {
    subjectSide,
    subjectX: subjectCenterX,
    subjectY: subjectCenterY,
    subjectMap,
    subjectGrid: GRID,
    dominantColors,
    vibrantColors,
    mutedColors,
    harmonyAccents,
    refinedPalette: REFINED,
    neonPalette: NEON,
    averageBrightness,
    zones: {
      tl: cellLum[1][1] || averageBrightness,
      tr: cellLum[1][GRID-2] || averageBrightness,
      bl: cellLum[GRID-2][1] || averageBrightness,
      br: cellLum[GRID-2][GRID-2] || averageBrightness,
      c: cellLum[Math.floor(GRID/2)][Math.floor(GRID/2)] || averageBrightness
    },
    suggestedAccentColors: suggestedAccentColors.slice(0, 5),
    suggestedTextColor
  };
}
