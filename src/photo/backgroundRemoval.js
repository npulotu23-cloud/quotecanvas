const backgroundRemovalCache = new Map();

const DEFAULT_CONFIG = {
  model: 'medium',
  debug: true,
  device: 'cpu',
  proxyToWorker: false,
  output: {
    format: 'image/png',
    quality: 0.8
  }
};

export function getBackgroundRemovalErrorDetails(error) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const lowerMessage = message.toLowerCase();

  let category = 'processing';
  if (lowerMessage.includes('removebackground') || lowerMessage.includes('export')) {
    category = 'library-import';
  } else if (
    lowerMessage.includes('publicpath') ||
    lowerMessage.includes('resource') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('cors') ||
    lowerMessage.includes('network')
  ) {
    category = 'asset-loading';
  } else if (
    lowerMessage.includes('wasm') ||
    lowerMessage.includes('webassembly') ||
    lowerMessage.includes('onnx') ||
    lowerMessage.includes('session')
  ) {
    category = 'runtime';
  } else if (
    lowerMessage.includes('decode') ||
    lowerMessage.includes('image') ||
    lowerMessage.includes('blob') ||
    lowerMessage.includes('canvas')
  ) {
    category = 'image-decoding';
  }

  return {
    category,
    name: error instanceof Error ? error.name : typeof error,
    message,
    stack
  };
}

export async function removeImageBackground(imageSource, { cacheKey = imageSource, onProgress } = {}) {
  if (!imageSource) {
    throw new Error('No image source provided for background removal.');
  }

  const key = String(cacheKey);
  if (backgroundRemovalCache.has(key)) {
    return backgroundRemovalCache.get(key);
  }

  const job = (async () => {
    console.info('[background-removal] Starting background removal', {
      cacheKey: key,
      sourceType: imageSource instanceof Blob ? imageSource.type : typeof imageSource
    });

    const backgroundRemovalModule = await import('@imgly/background-removal');
    const removeBackground = backgroundRemovalModule.removeBackground || backgroundRemovalModule.default;

    if (typeof removeBackground !== 'function') {
      throw new Error(
        `@imgly/background-removal did not expose removeBackground. Available exports: ${Object.keys(backgroundRemovalModule).join(', ')}`
      );
    }

    return removeBackground(imageSource, {
      ...DEFAULT_CONFIG,
      progress: onProgress
    });
  })();

  backgroundRemovalCache.set(key, job);

  try {
    const blob = await job;
    console.info('[background-removal] Background removal complete', {
      cacheKey: key,
      type: blob.type,
      size: blob.size
    });
    return blob;
  } catch (error) {
    backgroundRemovalCache.delete(key);
    console.error('[background-removal] Background removal failed', getBackgroundRemovalErrorDetails(error));
    throw error;
  }
}
