const providers = [
  { name: 'Google API', pct: 98 },
  { name: 'Apollo API', pct: 94 },
  { name: 'DeepSeek API', pct: 99 },
  { name: 'Campaign Engine', pct: 97 },
];

const colorFor = (pct: number) => {
  if (pct >= 97) return 'text-green';
  if (pct >= 90) return 'text-yellow';
  return 'text-red';
};

const barColor = (pct: number) => {
  if (pct >= 97) return 'bg-green';
  if (pct >= 90) return 'bg-yellow';
  return 'bg-red';
};

export default function ProviderHealthCard() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Provider Health</div>
      <div className="space-y-4">
        {providers.map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted">{p.name}</span>
              <span className={`font-semibold ${colorFor(p.pct)}`}>{p.pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface2 overflow-hidden">
              <div className={`h-full rounded-full ${barColor(p.pct)}`} style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
