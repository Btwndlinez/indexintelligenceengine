'use client';

import { Search } from 'lucide-react';

interface MobileResultsProps {
  results: any[] | null;
  loading: boolean;
}

export default function MobileResults({ results, loading }: MobileResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-zinc-950 p-4 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-2/3 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-1/4 mb-3" />
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-zinc-800 rounded-lg" />
              <div className="flex-1 h-9 bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 flex flex-col items-center justify-center text-center">
        <Search className="w-8 h-8 text-zinc-600 mb-3" />
        <div className="text-sm font-medium text-zinc-400 mb-1">No results yet</div>
        <div className="text-xs text-zinc-600">Set your parameters above and run a discovery search</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-zinc-500 font-medium">
        {results.length} {results.length === 1 ? 'company' : 'companies'} found
      </div>
      {results.map((r: any, i: number) => (
        <div
          key={r.id || r.companyName || i}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold">{r.companyName || r.name}</div>
              <div className="text-zinc-500 text-sm">
                {r.distance
                  ? typeof r.distance === 'string'
                    ? r.distance
                    : `${r.distance} mi`
                  : r.city
                  ? `${r.city}, ${r.state || ''}`
                  : ''}
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-400 font-bold">{r.score || r.grade || '—'}</div>
              <div className="text-sm text-zinc-500">{r.score_value || r.value || ''}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-white/10 py-2 text-sm">
              Call
            </button>

            <button className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold">
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
