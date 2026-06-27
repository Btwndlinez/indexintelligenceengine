export default function UsageCard() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Usage & Billing</div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted">Searches</span>
            <span className="font-semibold">2,482 / 10,000</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface2 overflow-hidden">
            <div className="h-full bg-red rounded-full" style={{ width: '24.8%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted">Apollo Credits</span>
            <span className="font-semibold">280 / 1,000</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface2 overflow-hidden">
            <div className="h-full bg-yellow rounded-full" style={{ width: '28%' }} />
          </div>
        </div>
        <div className="pt-2">
          <div className="text-xs text-muted mb-1">Plan</div>
          <div className="text-sm font-semibold">Growth</div>
        </div>
      </div>
    </div>
  );
}
