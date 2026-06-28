const results = [
  {
    name: "Crete Crush",
    score: "A",
    value: 92,
    distance: "3.1 mi",
  },
];

export default function MobileResults() {
  return (
    <div className="space-y-4">
      {results.map((r) => (
        <div
          key={r.name}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-zinc-500 text-sm">{r.distance}</div>
            </div>

            <div className="text-right">
              <div className="text-green-400 font-bold">{r.score}</div>
              <div className="text-sm text-zinc-500">{r.value}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-white/10 py-2 text-sm">
              Call
            </button>

            <button className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold">
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
