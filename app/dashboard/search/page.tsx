'use client';

import SearchConsole from '@/components/dashboard/SearchConsole';
import ResultsTable from '@/components/dashboard/ResultsTable';
import MarketReportCard from '@/components/dashboard/MarketReportCard';
import ProviderHealthCard from '@/components/dashboard/ProviderHealthCard';
import UsageCard from '@/components/dashboard/UsageCard';

export default function SearchPage() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-xl font-bold">Search</h1>
        <p className="text-sm text-muted mt-1">Discover and enrich target companies</p>
      </div>

      <SearchConsole />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
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
