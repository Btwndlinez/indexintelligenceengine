import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export default function MetricCard({ label, value, change, positive }: MetricCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all">
      <div className="text-xs text-muted font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {change && (
        <div className={`text-xs font-semibold mt-1 ${positive ? 'text-green' : 'text-muted'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

export function MetricCardLoading() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-muted animate-spin" />
    </div>
  );
}
