'use client';

import { useState, useEffect, useCallback } from 'react';
import MetricCard, { MetricCardLoading } from '@/components/dashboard/MetricCard';
import SearchConsole from '@/components/dashboard/SearchConsole';
import ResultsTable from '@/components/dashboard/ResultsTable';
import MarketReportCard from '@/components/dashboard/MarketReportCard';
import ProviderHealthCard from '@/components/dashboard/ProviderHealthCard';
import UsageCard from '@/components/dashboard/UsageCard';
import type { SearchResult } from '@/types/search';

export default function DashboardContent() {
  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [searchData, setSearchData] = useState<{ companies: SearchResult[]; count: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/overview', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data?.metrics) setMetrics(data.metrics);
        setMetricsLoading(false);
      })
      .catch(() => setMetricsLoading(false));
  }, []);

  const handleResults = useCallback((data: { companies: SearchResult[]; count: number }) => {
    setSearchData(data);
    setSearchLoading(false);
  }, []);

  const handleSearchStart = useCallback(() => {
    setSearchLoading(true);
  }, []);

  const metricCards = metrics ? [
    { label: 'Companies Indexed', value: metrics.totalCompanies?.toLocaleString() || '—', change: `${metrics.priorityDistribution?.A || 0} priority A`, positive: true },
    { label: 'Campaigns Active', value: String(metrics.activeCampaigns || '—'), change: `${metrics.callsToday || 0} calls today`, positive: true },
    { label: 'Monthly Searches', value: String(metrics.searchesToday || '—'), change: `${metrics.averageScore || '—'} avg score`, positive: true },
    { label: 'Pipeline Value', value: metrics.pipelineValue || '—', change: `${metrics.totalEnrichments || 0} enrichments`, positive: true },
  ] : null;

  return (
    <div className="w-full min-w-0 max-w-[1400px] mx-auto space-y-6 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricsLoading
          ? Array.from({ length: 4 }).map((_, i) => <MetricCardLoading key={i} />)
          : metricCards?.map((m) => <MetricCard key={m.label} {...m} />)
        }
      </div>

      <div className="w-full relative z-10">
        <SearchConsole onResults={handleResults} onSearchStart={handleSearchStart} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">Results</div>
            <div className="text-xs text-muted">
              {searchLoading ? 'Searching...' : searchData ? `${searchData.count} companies found` : ''}
            </div>
          </div>
          <ResultsTable
            companies={searchData?.companies}
            loading={searchLoading}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <MarketReportCard
            marketSize={searchData?.count ? `${searchData.count} companies` : undefined}
            opportunityIndex={searchData?.companies?.length ? Math.round(searchData.companies.filter(c => c.leadScore >= 70).length / searchData.companies.length * 100) : undefined}
          />
          <ProviderHealthCard />
          <UsageCard />
        </div>
      </div>
    </div>
  );
}
