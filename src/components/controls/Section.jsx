export function Section({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-2">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
