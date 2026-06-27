export default function MarketReportCard() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Market Intelligence Report</div>
      <div className="space-y-4">
        {[
          { label: 'Market Size', value: '43 companies' },
          { label: 'Competitive Density', value: 'Medium' },
          { label: 'Opportunity Index', value: '92', suffix: '/100' },
          { label: 'Coverage Score', value: '84', suffix: '%' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs text-muted">{item.label}</span>
            <span className="text-sm font-semibold">{item.value}{item.suffix}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
