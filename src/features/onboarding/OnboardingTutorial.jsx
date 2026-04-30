import { ChevronLeft, ChevronRight, Download, ImagePlus, Layers, Paintbrush, Scissors, Sparkles, Type, X } from 'lucide-react';

const STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to QuoteCanvas',
    body: 'Turn speaker photos and quotes into social-ready graphics.'
  },
  {
    icon: ImagePlus,
    title: 'Upload a photo',
    body: 'Start with a meeting or speaker photo from your device.'
  },
  {
    icon: Type,
    title: 'Add a quote and author',
    body: 'Type or paste the quote, then add the speaker name if you have it.'
  },
  {
    icon: Layers,
    title: 'Generate styles',
    body: 'QuoteCanvas creates poster layouts so you can pick the best direction.'
  },
  {
    icon: Paintbrush,
    title: 'Edit your design',
    body: 'Tap words, change colors, adjust layout, shadows, overlays, tint, and filters.'
  },
  {
    icon: Scissors,
    title: 'Remove background',
    body: 'Create clean cutout-style posters when you want the speaker to stand out.'
  },
  {
    icon: Download,
    title: 'Export',
    body: 'Download your finished image when it is ready to share.'
  }
];

export function OnboardingTutorial({ step, onNext, onBack, onSkip, onFinish }) {
  const totalSteps = STEPS.length;
  const currentStep = Math.min(Math.max(step, 0), totalSteps - 1);
  const current = STEPS[currentStep];
  const Icon = current.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/78 px-4 py-6 backdrop-blur-sm">
      <section
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D0D] text-white shadow-2xl sm:max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Skip onboarding"
          >
            <span>Skip</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-7 text-center sm:px-7">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB547]/12 text-[#FFB547]">
            <Icon className="h-7 w-7" />
          </div>
          <h2 id="onboarding-title" className="mb-3 text-2xl font-bold leading-tight text-white" style={{ fontFamily: 'Fraunces, serif' }}>
            {current.title}
          </h2>
          <p className="mx-auto max-w-xs text-base leading-relaxed text-white/62">
            {current.body}
          </p>

          <div className="mt-7 flex justify-center gap-2" aria-label="Onboarding progress">
            {STEPS.map((item, index) => (
              <div
                key={item.title}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? 'w-7 bg-[#FFB547]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onBack}
            disabled={isFirst}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#141414] px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={isLast ? onFinish : onNext}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFB547] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#FFC46A]"
          >
            {isLast ? 'Finish' : 'Next'}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </section>
    </div>
  );
}
