export function CompactSlider({ label, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div className="flex flex-col gap-2 min-w-0 md:min-w-[110px] w-full flex-1">
      <div className="flex justify-between items-center">
        <span className="text-xs md:text-[10px] text-white/50 uppercase tracking-wide">{label}</span>
        <span className="text-xs md:text-[10px] text-white/80 tabular-nums">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-8 md:h-1 rounded-full bg-transparent md:bg-[#2a2a2a] appearance-auto md:appearance-none accent-[#FFB547]"
      />
    </div>
  );
}
