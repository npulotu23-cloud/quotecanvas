export function ColorSwatch({ color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg transition-transform ${active ? 'ring-2 ring-offset-2 ring-offset-[#0D0D0D] ring-[#FFB547] scale-110' : 'hover:scale-105'}`}
      style={{ backgroundColor: color }}
    />
  );
}
