import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Download, Image as ImageIcon, Maximize2, RotateCcw, Shuffle, Sparkles, Undo2, Redo2, Upload, Wand2, X } from 'lucide-react';
import { FORMATS } from './constants/formats.js';
import { useCanvasGestures } from './hooks/useCanvasGestures.js';
import { useFonts } from './hooks/useFonts.js';
import { renderDesign } from '../canvas/renderDesign.js';
import { Footer } from '../components/layout/Footer.jsx';
import { Header } from '../components/layout/Header.jsx';
import { STYLES } from '../data/styles.js';
import { EditorControlsDesktop } from '../features/editor/EditorControlsDesktop.jsx';
import { EditorControlsMobile } from '../features/editor/EditorControlsMobile.jsx';
import { AuthorPopover } from '../features/editor/popovers/AuthorPopover.jsx';
import { WordPopover } from '../features/editor/popovers/WordPopover.jsx';
import { OnboardingTutorial } from '../features/onboarding/OnboardingTutorial.jsx';
import { StylePreviewCard } from '../features/style-grid/StylePreviewCard.jsx';
import { analyzePhoto } from '../photo/analyzePhoto.js';
import { getBackgroundRemovalErrorDetails, removeImageBackground } from '../photo/backgroundRemoval.js';
import { generateSamplePhoto } from '../photo/samplePhoto.js';
import { loadImage } from '../photo/loadImage.js';
import { pickAccentForStyle } from '../photo/pickAccentForStyle.js';
import { rankStyles } from '../photo/rankStyles.js';
import { analyzeQuote } from '../quote/analyzeQuote.js';
import { suggestEmphasis } from '../quote/suggestEmphasis.js';

function withoutPerWordOverrides(value) {
  if (!value?.perWordOverrides) return value;
  const next = { ...value };
  delete next.perWordOverrides;
  return next;
}

const ONBOARDING_STORAGE_KEY = 'quotecanvas:onboarding:v1:completed';
const ONBOARDING_STEP_COUNT = 7;

function hasCompletedOnboarding() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function storeOnboardingComplete() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch {
    // If storage is unavailable, still let the user continue for this session.
  }
}

export default function App() {
  const fontsReady = useFonts();
  const [screen, setScreen] = useState('upload'); // upload | input | grid | editor
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding());
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [cutoutImageUrl, setCutoutImageUrl] = useState(null);
  const [cutoutImageElement, setCutoutImageElement] = useState(null);
  const [backgroundRemovalStatus, setBackgroundRemovalStatus] = useState('idle');
  const [backgroundRemovalProgress, setBackgroundRemovalProgress] = useState(null);
  const [backgroundRemovalError, setBackgroundRemovalError] = useState('');
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [emphasisEnabled, setEmphasisEnabled] = useState(true);
  const [words, setWords] = useState([]);
  const [quoteAnalysis, setQuoteAnalysis] = useState(null);
  const [rankedStyles, setRankedStyles] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [format] = useState('4:5');
  const [activeTab, setActiveTab] = useState('type');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [fullPreviewUrl, setFullPreviewUrl] = useState(null);
  const [tappedWordIndex, setTappedWordIndex] = useState(null);
  const [authorTapped, setAuthorTapped] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const mainCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cutoutUrlRef = useRef(null);
  const backgroundRemovalRequestRef = useRef(0);

  const completeOnboarding = useCallback(() => {
    storeOnboardingComplete();
    setShowOnboarding(false);
  }, []);

  const handleOnboardingNext = useCallback(() => {
    setOnboardingStep(step => Math.min(step + 1, ONBOARDING_STEP_COUNT - 1));
  }, []);

  const handleOnboardingBack = useCallback(() => {
    setOnboardingStep(step => Math.max(step - 1, 0));
  }, []);

  const onboardingOverlay = showOnboarding ? (
    <OnboardingTutorial
      step={onboardingStep}
      onNext={handleOnboardingNext}
      onBack={handleOnboardingBack}
      onSkip={completeOnboarding}
      onFinish={completeOnboarding}
    />
  ) : null;

  const withOnboarding = (content) => (
    <>
      {content}
      {onboardingOverlay}
    </>
  );

  const resetBackgroundRemoval = useCallback(() => {
    backgroundRemovalRequestRef.current += 1;
    if (cutoutUrlRef.current) {
      URL.revokeObjectURL(cutoutUrlRef.current);
      cutoutUrlRef.current = null;
    }
    setCutoutImageUrl(null);
    setCutoutImageElement(null);
    setBackgroundRemovalStatus('idle');
    setBackgroundRemovalProgress(null);
    setBackgroundRemovalError('');
  }, []);

  useEffect(() => () => {
    if (cutoutUrlRef.current) {
      URL.revokeObjectURL(cutoutUrlRef.current);
    }
  }, []);

  // Recompute words when quote/emphasis changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!quote.trim()) {
      setWords([]);
      setQuoteAnalysis(null);
      return;
    }
    const analysis = analyzeQuote(quote, author);
    setQuoteAnalysis(analysis);
    const nextWords = emphasisEnabled
      ? suggestEmphasis(analysis.words, analysis.lengthCategory)
      : analysis.words.map(w => ({ ...w, emphasized: false }));
    setWords(nextWords);
  }, [quote, author, emphasisEnabled]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handle file upload
  const handleFile = async (file) => {
    if (!file) return;
    resetBackgroundRemoval();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setImageUrl(dataUrl);
      try {
        const img = await loadImage(dataUrl);
        setImageElement(img);
        const analysis = await analyzePhoto(img);
        setPhotoAnalysis(analysis);
        setScreen('input');
      } catch (err) {
        console.error('Image load failed', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSample = async () => {
    resetBackgroundRemoval();
    const dataUrl = generateSamplePhoto();
    setImageUrl(dataUrl);
    try {
      const img = await loadImage(dataUrl);
      setImageElement(img);
      const analysis = await analyzePhoto(img);
      setPhotoAnalysis(analysis);
      if (!quote) setQuote('What you avoid today will attack you tomorrow.');
      if (!author) setAuthor('Sample Speaker');
      setScreen('input');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBackground = async () => {
    if (!imageUrl || backgroundRemovalStatus === 'processing') return;

    const requestId = backgroundRemovalRequestRef.current + 1;
    backgroundRemovalRequestRef.current = requestId;
    setBackgroundRemovalStatus('processing');
    setBackgroundRemovalError('');
    setBackgroundRemovalProgress(0);

    try {
      const blob = await removeImageBackground(imageUrl, {
        cacheKey: imageUrl,
        onProgress: (_key, current, total) => {
          if (requestId === backgroundRemovalRequestRef.current && total > 0) {
            setBackgroundRemovalProgress(current / total);
          }
        }
      });

      if (requestId !== backgroundRemovalRequestRef.current) return;

      const url = URL.createObjectURL(blob);
      let cutoutImage;
      try {
        cutoutImage = await loadImage(url);
      } catch (loadError) {
        URL.revokeObjectURL(url);
        throw loadError;
      }

      if (requestId !== backgroundRemovalRequestRef.current) {
        URL.revokeObjectURL(url);
        return;
      }

      if (cutoutUrlRef.current) {
        URL.revokeObjectURL(cutoutUrlRef.current);
      }

      cutoutUrlRef.current = url;
      setCutoutImageUrl(url);
      setCutoutImageElement(cutoutImage);
      setBackgroundRemovalStatus('ready');
      setBackgroundRemovalProgress(1);
    } catch (error) {
      if (requestId !== backgroundRemovalRequestRef.current) return;
      console.error('Background removal failed', getBackgroundRemovalErrorDetails(error));
      setCutoutImageUrl(null);
      setCutoutImageElement(null);
      setBackgroundRemovalStatus('error');
      setBackgroundRemovalProgress(null);
      setBackgroundRemovalError('Background removal failed. Try a different photo or try again.');
    }
  };

  const toggleWordEmphasis = (index) => {
    setWords(prev => prev.map((w, i) => i === index ? { ...w, emphasized: !w.emphasized } : w));
  };

  const handleGenerate = () => {
    if (!photoAnalysis || !quoteAnalysis) return;
    const ranked = rankStyles(photoAnalysis, quoteAnalysis, STYLES, [], 0);
    setRankedStyles(ranked);
    setExcludedIds([]);
    setScreen('grid');
  };

  const handleShuffle = () => {
    const newExcluded = [...excludedIds, ...rankedStyles.slice(0, 3).map(s => s.id)].slice(-6);
    const ranked = rankStyles(photoAnalysis, quoteAnalysis, STYLES, newExcluded, shuffleSeed + 1);
    if (ranked.length < 3) {
      // Reset exclusion if we're running out
      const fresh = rankStyles(photoAnalysis, quoteAnalysis, STYLES, [], shuffleSeed + 1);
      setRankedStyles(fresh);
      setExcludedIds([]);
    } else {
      setRankedStyles(ranked);
      setExcludedIds(newExcluded);
    }
    setShuffleSeed(s => s + 1);
  };

  const selectStyle = (id) => {
    setSelectedStyleId(id);
    setOverrides({});
    setHistory([{}]);
    setHistoryIndex(0);
    setScreen('editor');
  };

  // Swap style mid-edit — KEEPS overrides intact so the user's edits carry over
  const swapStyle = (id) => {
    if (id === selectedStyleId) return;
    setSelectedStyleId(id);
    // Don't reset overrides — keep them. Push to history so undo works.
    setHistory(h => {
      const trimmed = h.slice(0, historyIndex + 1);
      trimmed.push({ ...overrides, _styleId: id });
      return trimmed.slice(-30);
    });
    setHistoryIndex(i => Math.min(i + 1, 29));
  };

  const updateOverride = (key, value) => {
    setOverrides(prev => {
      const next = { ...prev, [key]: value };
      // Push history
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(next);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return next;
    });
  };

  const handleQuoteTextChange = useCallback((nextQuote) => {
    setQuote(nextQuote);
    setTappedWordIndex(null);
    setOverrides(prev => withoutPerWordOverrides(prev));
    setHistory(prev => prev.map(withoutPerWordOverrides));
  }, []);

  const handleAuthorTextChange = useCallback((nextAuthor) => {
    setAuthor(nextAuthor);
  }, []);

  // Commits current override state to history (used after gesture ends)
  const commitOverrides = useCallback(() => {
    setOverrides(curr => {
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(curr);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return curr;
    });
  }, [historyIndex]);

  // Per-word override updater (from tap-word popover)
  const updateWordOverride = (wordIndex, patch) => {
    setOverrides(prev => {
      const prevPerWord = prev.perWordOverrides || {};
      const prevWord = prevPerWord[wordIndex] || {};
      const nextWord = { ...prevWord, ...patch };
      // Remove null values
      Object.keys(nextWord).forEach(k => {
        if (nextWord[k] === null || nextWord[k] === undefined) delete nextWord[k];
      });
      const nextPerWord = { ...prevPerWord };
      if (Object.keys(nextWord).length === 0) {
        delete nextPerWord[wordIndex];
      } else {
        nextPerWord[wordIndex] = nextWord;
      }
      const next = { ...prev, perWordOverrides: nextPerWord };
      setHistory(h => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(next);
        return trimmed.slice(-30);
      });
      setHistoryIndex(i => Math.min(i + 1, 29));
      return next;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setOverrides(history[next] || {});
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setOverrides(history[next] || {});
    }
  };
  const resetOverrides = () => {
    setOverrides({});
    setHistory([{}]);
    setHistoryIndex(0);
  };

  const selectedStyle = STYLES.find(s => s.id === selectedStyleId);
  const fmt = FORMATS[overrides.format || format];

  // Gesture handlers for canvas (pinch/drag/tap)
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useCanvasGestures({
    canvasRef: mainCanvasRef,
    overrides,
    setOverrides,
    commitOverrides,
    onWordTap: (wordIndex) => setTappedWordIndex(wordIndex),
    onAuthorTap: () => setAuthorTapped(true)
  });

  // Apply photo-aware accent to the selected style (only if not user-overridden)
  const styledForRender = useMemo(() => {
    if (!selectedStyle || !photoAnalysis) return selectedStyle;
    if (overrides.emphasisColor) return selectedStyle; // user override wins
    const smartAccent = pickAccentForStyle(selectedStyle, photoAnalysis);
    return {
      ...selectedStyle,
      colors: { ...selectedStyle.colors, emphasis: smartAccent }
    };
  }, [selectedStyle, photoAnalysis, overrides.emphasisColor]);

  // Render main editor canvas
  useEffect(() => {
    if (screen !== 'editor' || !mainCanvasRef.current || !imageElement || !styledForRender || !fontsReady) return;
    renderDesign(mainCanvasRef.current, {
      width: fmt.w,
      height: fmt.h,
      image: imageElement,
      style: styledForRender,
      overrides,
      words,
      author: quoteAnalysis?.author || '',
      photo: photoAnalysis,
      cutoutImage: cutoutImageElement
    });
  }, [screen, imageElement, styledForRender, overrides, words, quoteAnalysis, fmt, fontsReady, photoAnalysis, cutoutImageElement]);

  const handleShowFullPreview = () => {
    if (!mainCanvasRef.current) return;
    try {
      const dataUrl = mainCanvasRef.current.toDataURL('image/png');
      setFullPreviewUrl(dataUrl);
      setShowFullPreview(true);
    } catch (err) {
      console.error('Preview failed', err);
    }
  };

  const handleDownload = async () => {
    if (!mainCanvasRef.current) return;
    mainCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotecanvas-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  /* ============================================================
     UPLOAD SCREEN
  ============================================================ */
  if (screen === 'upload') {
    return withOnboarding(
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB547]/10 border border-[#FFB547]/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB547]" />
                <span className="text-xs text-[#FFB547] tracking-wide">AI-POWERED DESIGN</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em' }}>
                Turn photos into posters
              </h1>
              <p className="text-white/50 text-base leading-relaxed">
                Upload a speaker photo, type a quote, and let QuoteCanvas design it for you.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-[#2a2a2a] hover:border-[#FFB547]/50 bg-[#141414] hover:bg-[#1a1a1a] transition-all p-10 flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFB547]/10 flex items-center justify-center group-hover:bg-[#FFB547]/20 transition-colors">
                <Upload className="w-6 h-6 text-[#FFB547]" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white">Upload a photo</div>
                <div className="text-sm text-white/40 mt-1">Tap to choose from your device</div>
              </div>
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-xs text-white/30 tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            <button
              onClick={handleSample}
              className="w-full py-3.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white/80 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Try with sample photo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ============================================================
     INPUT SCREEN
  ============================================================ */
  if (screen === 'input') {
    const removalProgressPercent = backgroundRemovalProgress === null
      ? null
      : Math.round(backgroundRemovalProgress * 100);

    return withOnboarding(
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header onBack={() => { setScreen('upload'); setImageUrl(null); setImageElement(null); resetBackgroundRemoval(); }} />
        <main className="flex-1 flex flex-col md:flex-row gap-6 px-5 py-6 max-w-6xl mx-auto w-full">
          <div className="md:w-1/2 flex-shrink-0">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414] border border-[#2a2a2a]">
              {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm text-white/50 hover:text-white/80 flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Change photo
            </button>
            <div className="mt-4 rounded-xl bg-[#141414] border border-[#2a2a2a] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">Remove Background</div>
                  <div className="text-xs text-white/45 mt-0.5">
                    {backgroundRemovalStatus === 'ready'
                      ? 'Transparent PNG ready'
                      : backgroundRemovalStatus === 'processing'
                        ? 'Processing locally'
                        : 'Optional cutout for later'}
                  </div>
                </div>
                {cutoutImageUrl && (
                  <div
                    className="w-10 h-10 rounded-lg border border-white/10 bg-[#0D0D0D] overflow-hidden flex-shrink-0"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)',
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0'
                    }}
                  >
                    <img src={cutoutImageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <button
                onClick={handleRemoveBackground}
                disabled={!imageUrl || backgroundRemovalStatus === 'processing'}
                className="mt-3 w-full py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white/80 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" />
                {backgroundRemovalStatus === 'processing' ? 'Removing...' : cutoutImageUrl ? 'Remove Again' : 'Remove Background'}
              </button>

              {backgroundRemovalStatus === 'processing' && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FFB547] transition-all"
                      style={{ width: `${removalProgressPercent ?? 8}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-white/40">
                    {removalProgressPercent !== null ? `${removalProgressPercent}%` : 'Preparing model...'}
                  </div>
                </div>
              )}

              {backgroundRemovalStatus === 'error' && (
                <div className="mt-3 text-xs text-[#FF8A8A] leading-relaxed">
                  {backgroundRemovalError}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div className="md:w-1/2 flex flex-col gap-5">
            <div>
              <label className="text-xs text-white/50 tracking-wide uppercase font-medium mb-2 block">Your Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Paste or type the quote here..."
                rows={4}
                className="w-full border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB547]/50 resize-none"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: '#141414',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 tracking-wide uppercase font-medium mb-2 block">Speaker (optional)</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Joya Baker"
                className="w-full border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB547]/50"
                style={{
                  backgroundColor: '#141414',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
            </div>

            {words.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs text-white/50 tracking-wide uppercase font-medium">Emphasis</label>
                  <button
                    onClick={() => setEmphasisEnabled(e => !e)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`relative w-8 h-4 rounded-full transition-colors ${emphasisEnabled ? 'bg-[#FFB547]' : 'bg-[#2a2a2a]'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${emphasisEnabled ? 'left-4' : 'left-0.5'}`} />
                    </div>
                    <span className="text-white/70">{emphasisEnabled ? 'On' : 'Off'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {words.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => emphasisEnabled && toggleWordEmphasis(i)}
                      disabled={!emphasisEnabled}
                      className={`px-2.5 py-1 rounded-md text-sm transition-all ${
                        w.emphasized && emphasisEnabled
                          ? 'bg-[#FF2D8A] text-white font-semibold'
                          : 'bg-[#141414] border border-[#2a2a2a] text-white/70 hover:border-[#2a2a2a]/80'
                      } ${!emphasisEnabled ? 'opacity-50' : ''}`}
                    >
                      {w.text}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/35 mt-2">Tap any word to toggle emphasis</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!quote.trim()}
              className="w-full py-4 rounded-xl bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate 6 Styles
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     STYLE GRID SCREEN
  ============================================================ */
  if (screen === 'grid') {
    return withOnboarding(
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col">
        <Header onBack={() => setScreen('input')} title="Pick a style" />
        <main className="flex-1 px-4 py-5 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {rankedStyles.map((style, i) => (
              <StylePreviewCard
                key={style.id + '-' + shuffleSeed}
                style={style}
                image={imageElement}
                words={words}
                author={quoteAnalysis?.author || ''}
                format={format}
                onClick={() => selectStyle(style.id)}
                fontsReady={fontsReady}
                index={i}
                photo={photoAnalysis}
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 mt-6">
            <button
              onClick={handleShuffle}
              className="py-3 px-6 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white/80 hover:text-white font-medium transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle styles
            </button>
            <p className="text-xs text-white/40">Not vibing? See different styles</p>
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     EDITOR SCREEN
  ============================================================ */
  if (screen === 'editor' && selectedStyle) {
    return withOnboarding(
      <div className="h-[100dvh] min-h-[100svh] md:h-auto md:min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col overflow-hidden md:overflow-visible">
        <Header
          onBack={() => setScreen('grid')}
          title={selectedStyle.name}
          actions={
            <>
              <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-lg hover:bg-[#141414] disabled:opacity-30">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg hover:bg-[#141414] disabled:opacity-30">
                <Redo2 className="w-4 h-4" />
              </button>
              <button onClick={resetOverrides} className="p-2 rounded-lg hover:bg-[#141414]">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleShowFullPreview}
                className="ml-1 py-2 px-3 rounded-lg bg-[#FFB547] hover:bg-[#FFC46A] text-black font-semibold text-sm flex items-center gap-1.5"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </>
          }
        />
        <main className="flex-1 min-h-0 flex flex-col md:flex-row gap-0 md:gap-4 md:px-4 md:py-4 md:max-w-6xl md:mx-auto w-full overflow-hidden">
          {/* Canvas area — fills available space, always visible */}
          <div className="flex-1 flex items-center justify-center p-3 md:p-4 min-h-0 overflow-hidden">
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl block"
              style={{
                aspectRatio: `${fmt.w} / ${fmt.h}`,
                maxWidth: '100%',
                maxHeight: '100%',
                height: 'auto',
                width: 'auto',
                margin: 'auto'
              }}
            >
              <canvas
                ref={mainCanvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  cursor: 'grab'
                }}
              />
              {/* Floating tip — hides once user has moved anything */}
              {!overrides.offsetX && !overrides.offsetY && !overrides.fontSizeMultiplier && !overrides.perWordOverrides && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-[10px] whitespace-nowrap">
                    Drag · pinch · tap a word
                  </div>
                </div>
              )}
              {/* Full-view button */}
              <button
                onClick={handleShowFullPreview}
                className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur hover:bg-black/90 text-white transition-colors"
                title="View full size"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile inline controls — always visible at bottom */}
          <EditorControlsMobile
            style={selectedStyle}
            overrides={overrides}
            updateOverride={updateOverride}
            photoAnalysis={photoAnalysis}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            image={imageElement}
            words={words}
            quote={quote}
            author={quoteAnalysis?.author || ''}
            onQuoteChange={handleQuoteTextChange}
            onAuthorChange={handleAuthorTextChange}
            selectedStyleId={selectedStyleId}
            onSelectStyle={swapStyle}
            fontsReady={fontsReady}
          />

          {/* Desktop sidebar — unchanged */}
          <EditorControlsDesktop
            style={selectedStyle}
            overrides={overrides}
            updateOverride={updateOverride}
            photoAnalysis={photoAnalysis}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            image={imageElement}
            words={words}
            quote={quote}
            author={quoteAnalysis?.author || ''}
            onQuoteChange={handleQuoteTextChange}
            onAuthorChange={handleAuthorTextChange}
            selectedStyleId={selectedStyleId}
            onSelectStyle={swapStyle}
            fontsReady={fontsReady}
          />
        </main>

        {/* WORD POPOVER */}
        {tappedWordIndex !== null && words[tappedWordIndex] && (
          <WordPopover
            word={words[tappedWordIndex]}
            wordIndex={tappedWordIndex}
            perWordOverride={(overrides.perWordOverrides || {})[tappedWordIndex] || {}}
            style={selectedStyle}
            onClose={() => setTappedWordIndex(null)}
            onUpdate={(patch) => updateWordOverride(tappedWordIndex, patch)}
            onToggleEmphasis={() => {
              // Toggle local emphasis via perWordOverride
              const current = (overrides.perWordOverrides || {})[tappedWordIndex] || {};
              const newVal = current.emphasized !== undefined ? !current.emphasized : !words[tappedWordIndex].emphasized;
              updateWordOverride(tappedWordIndex, { emphasized: newVal });
            }}
          />
        )}

        {/* AUTHOR POPOVER */}
        {authorTapped && (
          <AuthorPopover
            author={author}
            overrides={overrides}
            style={selectedStyle}
            onClose={() => setAuthorTapped(false)}
            onUpdate={(patch) => {
              Object.entries(patch).forEach(([k, v]) => updateOverride(k, v));
            }}
            onUpdateText={handleAuthorTextChange}
          />
        )}

        {/* FULL-SIZE PREVIEW MODAL */}
        {showFullPreview && fullPreviewUrl && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur border-b border-white/10 flex-shrink-0">
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-sm font-medium text-white">Your poster</div>
              <button
                onClick={handleDownload}
                className="p-2 -mr-2 rounded-lg hover:bg-white/10 text-white"
                title="Download PNG"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable image area */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 gap-4">
              <img
                src={fullPreviewUrl}
                alt="Full poster preview"
                className="max-w-full h-auto rounded-xl shadow-2xl select-none"
                style={{ maxHeight: 'none' }}
              />

              {/* Instructions */}
              <div className="max-w-md w-full bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB547]/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-[#FFB547]" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-white mb-1">Save to your phone</div>
                    <div className="text-white/60 leading-relaxed">
                      Take a screenshot of this screen, or tap and hold the image above and choose <span className="text-white">"Save to Photos"</span>.
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/40 pt-2 border-t border-[#2a2a2a]">
                  On desktop or Android, tap the <Download className="w-3 h-3 inline" /> icon above to download a PNG.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
