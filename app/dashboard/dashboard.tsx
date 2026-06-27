'use client';

import MetricCard from '@/components/dashboard/MetricCard';
import SearchConsole from '@/components/dashboard/SearchConsole';
import ResultsTable from '@/components/dashboard/ResultsTable';
import MarketReportCard from '@/components/dashboard/MarketReportCard';
import ProviderHealthCard from '@/components/dashboard/ProviderHealthCard';
import UsageCard from '@/components/dashboard/UsageCard';

const metrics = [
  { label: 'Companies Indexed', value: '92K', change: '+12% this month', positive: true },
  { label: 'Campaigns Active', value: '18', change: '3 paused', positive: false },
  { label: 'Monthly Searches', value: '2,281', change: '68% of limit', positive: true },
  { label: 'Pipeline Value', value: '$482K', change: '+8.2%', positive: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* SEARCH CONSOLE */}
      <SearchConsole />

      {/* RESULTS + INTELLIGENCE SPLIT */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">Results</div>
            <div className="text-xs text-muted">6 companies found</div>
          </div>
          <ResultsTable />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <MarketReportCard />
          <ProviderHealthCard />
          <UsageCard />
        </div>
      </div>
    </div>
  );
}
