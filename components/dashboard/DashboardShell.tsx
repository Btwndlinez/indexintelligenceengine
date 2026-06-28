'use client';

import { useState, useCallback } from 'react';
import MetricsRow from './MetricsRow';
import SearchConsole from './SearchConsole';
import ResultsView from './ResultsView';
import DailyIntelligenceHub from './DailyIntelligenceHub';
import type { SearchResult } from '@/types/search';

export default function DashboardShell() {
  const [searchData, setSearchData] = useState<{ companies: SearchResult[]; count: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleResults = useCallback((data: { companies: SearchResult[]; count: number }) => {
    setSearchData(data);
    setSearchLoading(false);
  }, []);

  const handleSearchStart = useCallback(() => {
    setSearchLoading(true);
  }, []);

  return (
    <div className="space-y-6">
      <MetricsRow />

      <SearchConsole onResults={handleResults} onSearchStart={handleSearchStart} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">Results</div>
            <div className="text-xs text-muted">
              {searchLoading ? 'Searching...' : searchData ? `${searchData.count} companies found` : ''}
            </div>
          </div>
          <ResultsView results={searchData?.companies ?? null} loading={searchLoading} />
        </div>

        <div className="xl:col-span-4">
          <DailyIntelligenceHub />
        </div>
      </div>
    </div>
  );
}
