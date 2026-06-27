'use client';

import { Users, Building2, Activity, BarChart3, Shield, AlertTriangle } from 'lucide-react';

const sections = [
  { icon: Users, label: 'Organizations', desc: 'Multi-tenant org management', value: '12 active' },
  { icon: Building2, label: 'Users', desc: 'User roles and permissions', value: '48 total' },
  { icon: Activity, label: 'Usage', desc: 'API consumption by org', value: '82% capacity' },
  { icon: BarChart3, label: 'Telemetry', desc: 'System performance metrics', value: '99.2% uptime' },
  { icon: Shield, label: 'API Health', desc: 'Provider circuit status', value: 'All healthy' },
  { icon: AlertTriangle, label: 'Errors', desc: 'Recent error logs', value: '3 new' },
];

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-xl font-bold">Admin</h1>
        <p className="text-sm text-muted mt-1">System administration and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.label} className="p-6 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center">
                <s.icon className="w-5 h-5 text-muted" />
              </div>
              <span className="text-xs text-muted font-medium">{s.value}</span>
            </div>
            <h3 className="font-bold text-base mb-1">{s.label}</h3>
            <p className="text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
