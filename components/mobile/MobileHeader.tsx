export default function MobileHeader() {
  return (
    <div className="sticky top-0 z-50 bg-black border-b border-white/10 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">IIE</div>
        <button className="px-3 py-2 rounded-lg border border-white/10 text-sm">
          Menu
        </button>
      </div>
    </div>
  );
}
