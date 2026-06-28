'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Phone, Globe } from 'lucide-react';
import ResultsTable from './ResultsTable';
import type { SearchResult } from '@/types/search';

interface ResultsViewProps {
  results: SearchResult[] | null;
  loading: boolean;
}

function ResultsCards({ results }: { results: SearchResult[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {results.map((r) => {
        const isExpanded = expanded === r.id;
        return (
          <div key={r.id} className="rounded-2xl border border-border bg-surface">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm">{r.companyName}</div>
                  <div className="text-muted text-xs mt-0.5">
                    {r.distanceMiles != null ? `${r.distanceMiles.toFixed(1)} mi` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green font-bold">{r.grade}</div>
                  <div className="text-xs text-muted">{r.leadScore}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={r.phone ? `tel:${r.phone}` : '#'}
                  className="flex-1 rounded-lg border border-border py-2 text-xs text-center"
                >
                  Call
                </a>
                <button
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="flex-1 rounded-lg bg-red py-2 text-xs font-semibold text-white flex items-center justify-center gap-1"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  Details
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-border p-4 space-y-3">
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-sm text-muted hover:text-text">
                    <Phone className="w-3.5 h-3.5" />
                    {r.phone}
                  </a>
                )}
                {r.website && (
                  <a
                    href={r.website.startsWith('http') ? r.website : `https://${r.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted hover:text-text"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {r.website}
                  </a>
                )}
                {r.capabilitySummary && (
                  <div>
                    <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Signals</div>
                    <p className="text-xs text-muted leading-relaxed">{r.capabilitySummary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ResultsView({ results, loading }: ResultsViewProps) {
  return (
    <>
      <div className="hidden lg:block">
        <ResultsTable companies={results} loading={loading} />
      </div>

      <div className="block lg:hidden">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-4 animate-pulse">
                <div className="h-4 bg-surface2 rounded w-2/3 mb-2" />
                <div className="h-3 bg-surface2 rounded w-1/4 mb-3" />
                <div className="flex gap-2">
                  <div className="flex-1 h-9 bg-surface2 rounded-lg" />
                  <div className="flex-1 h-9 bg-surface2 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : !results || results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 flex flex-col items-center justify-center text-center">
            <Search className="w-8 h-8 text-muted mb-3" />
            <div className="text-sm font-medium text-text mb-1">No results yet</div>
            <div className="text-xs text-muted">Set your parameters above and run a discovery search</div>
          </div>
        ) : (
          <ResultsCards results={results} />
        )}
      </div>
    </>
  );
}
