export function Slider({ label, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs text-white/90 tabular-nums">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full bg-[#2a2a2a] appearance-none accent-[#FFB547]"
      />
    </div>
  );
}
