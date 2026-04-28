export const FILTERS = {
  original: { name: 'Original', apply: null },
  cinematic: {
    name: 'Cinematic',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        if (brightness < 128) {
          data[i] = Math.max(0, data[i] * 0.9);
          data[i+2] = Math.min(255, data[i+2] * 1.15);
        } else {
          data[i] = Math.min(255, data[i] * 1.1);
          data[i+2] = Math.max(0, data[i+2] * 0.9);
        }
        for (let c = 0; c < 3; c++) data[i+c] = Math.max(0, Math.min(255, ((data[i+c] - 128) * 1.15) + 128));
      }
    }
  },
  bw: {
    name: 'B&W',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        const c = Math.max(0, Math.min(255, ((gray - 128) * 1.2) + 128));
        data[i] = data[i+1] = data[i+2] = c;
      }
    }
  },
  fade: {
    name: 'Fade',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.85 + 40);
        data[i+1] = Math.min(255, data[i+1] * 0.85 + 40);
        data[i+2] = Math.min(255, data[i+2] * 0.85 + 40);
      }
    }
  },
  warm: {
    name: 'Warm',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.15);
        data[i+1] = Math.min(255, data[i+1] * 1.05);
        data[i+2] = Math.max(0, data[i+2] * 0.9);
      }
    }
  },
  cool: {
    name: 'Cool',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] * 0.9);
        data[i+1] = Math.min(255, data[i+1] * 1.02);
        data[i+2] = Math.min(255, data[i+2] * 1.15);
      }
    }
  },
  vintage: {
    name: 'Vintage',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        data[i]   = Math.min(255, 0.393*r + 0.769*g + 0.189*b);
        data[i+1] = Math.min(255, 0.349*r + 0.686*g + 0.168*b);
        data[i+2] = Math.min(255, 0.272*r + 0.534*g + 0.131*b);
      }
    }
  },
  dramatic: {
    name: 'Dramatic',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) data[i+c] = Math.max(0, Math.min(255, ((data[i+c] - 128) * 1.4) + 115));
      }
    }
  },
  noir: {
    name: 'Noir',
    apply: (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        const c = Math.max(0, Math.min(255, ((gray - 100) * 1.5) + 90));
        data[i] = data[i+1] = data[i+2] = c;
      }
    }
  }
};
