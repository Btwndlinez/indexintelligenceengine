import { AlertTriangle, Newspaper, FileText } from 'lucide-react';

const alerts = [
  {
    icon: AlertTriangle,
    iconColor: 'text-red',
    label: 'New EPA slurry filtration rule in California',
    detail: 'Effective: Aug 1, 2026 · $25,000/day fine',
  },
  {
    icon: Newspaper,
    iconColor: 'text-blue',
    label: 'Cement prices up 12% in Q2',
    detail: 'Supply chain constraints drive cost increases',
  },
  {
    icon: FileText,
    iconColor: 'text-yellow',
    label: 'SB 54 Waste Disposal Update',
    detail: 'New reporting requirements for industrial waste',
  },
];

export default function DailyIntelligenceHub() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider">
        Daily Intelligence Hub
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.label} className="p-4 rounded-2xl bg-surface border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface2 border border-border flex items-center justify-center shrink-0">
                <a.icon className={`w-4 h-4 ${a.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium leading-snug">{a.label}</div>
                <div className="text-xs text-muted mt-1">{a.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
