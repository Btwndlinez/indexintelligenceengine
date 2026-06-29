'use client';

import { useState, useCallback } from 'react';
import MetricsRow from './MetricsRow';
import SearchConsole from './SearchConsole';
import ResultsView from './ResultsView';
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
    <div className="space-y-6 md:space-y-8">
      <MetricsRow />

      <SearchConsole onResults={handleResults} onSearchStart={handleSearchStart} />

      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h2
            className="font-black uppercase tracking-wider"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1.375rem',
              letterSpacing: '0.06em',
              color: 'var(--color-text)',
            }}
          >
            Results
          </h2>
          <div
            className="text-sm font-semibold"
            style={{ color: 'var(--color-muted)' }}
          >
            {searchLoading
              ? 'Searching...'
              : searchData
              ? `${searchData.count} companies found`
              : 'Run a search above'}
          </div>
        </div>
        <ResultsView results={searchData?.companies ?? null} loading={searchLoading} />
      </div>
    </div>
  );
}
