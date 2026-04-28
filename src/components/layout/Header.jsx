import { ChevronLeft, Sparkles } from 'lucide-react';

export function Header({ onBack, title, actions }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-[#141414]">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#FFB547] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {title || 'QuoteCanvas'}
            </span>
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}
