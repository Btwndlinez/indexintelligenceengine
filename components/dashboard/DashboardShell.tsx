'use client';

import { useState, useCallback, useMemo } from 'react';
import MetricsRow from './MetricsRow';
import SearchConsole from './SearchConsole';
import ResultsView from './ResultsView';
import DailyIntelligenceHub from './DailyIntelligenceHub';
import type { SearchResult } from '@/types/search';

function zipToState(zip: string): string {
  if (!zip || zip.length < 1) return 'CA';
  const code = parseInt(zip[0]);
  if (code >= 0 && code <= 2) return 'MA';
  if (code >= 3 && code <= 4) return 'GA';
  if (code >= 5 && code <= 6) return 'IL';
  if (code >= 7 && code <= 8) return 'TX';
  return 'CA';
}

export default function DashboardShell() {
  const [searchData, setSearchData] = useState<{ companies: SearchResult[]; count: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [vertical, setVertical] = useState('slurry_concrete');
  const [zip, setZip] = useState('');

  const locationState = useMemo(() => zipToState(zip), [zip]);

  const handleResults = useCallback((data: { companies: SearchResult[]; count: number }) => {
    setSearchData(data);
    setSearchLoading(false);
  }, []);

  const handleSearchStart = useCallback(() => {
    setSearchLoading(true);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Metrics row */}
      <MetricsRow />

      {/* Search console */}
      <SearchConsole
        onResults={handleResults}
        onSearchStart={handleSearchStart}
        vertical={vertical}
        onVerticalChange={setVertical}
        zip={zip}
        onZipChange={setZip}
      />

      {/* Results + Intelligence */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        <div className="xl:col-span-8 min-w-0">
          {/* Section header */}
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

        <div className="xl:col-span-4">
          <DailyIntelligenceHub vertical={vertical} locationState={locationState} />
        </div>
      </div>
    </div>
  );
}
