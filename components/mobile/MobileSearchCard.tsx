export default function MobileSearchCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-4">
      <h2 className="text-xl font-semibold">Search Market</h2>

      <select className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm">
        <option>Slurry / Concrete</option>
      </select>

      <input
        placeholder="ZIP code"
        className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm"
      />

      <select className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm">
        <option>25 miles</option>
      </select>

      <button className="w-full bg-red-600 rounded-xl py-3 font-semibold text-sm">
        Run Discovery
      </button>
    </div>
  );
}
