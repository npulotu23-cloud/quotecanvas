export function CompactRow({ children }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}
