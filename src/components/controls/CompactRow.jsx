export function CompactRow({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 overflow-visible md:overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}
