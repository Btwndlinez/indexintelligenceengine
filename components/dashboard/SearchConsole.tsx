'use client';

import { useState } from 'react';
import { Search, MapPin, Crosshair, Radio, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SearchConsoleProps {
  onResults: (data: { companies: any[]; count: number; industry?: string }) => void;
  onSearchStart?: () => void;
}

export default function SearchConsole({ onResults, onSearchStart }: SearchConsoleProps) {
  const [vertical, setVertical] = useState('slurry_concrete');
  const [zip, setZip] = useState('94544');
  const [radius, setRadius] = useState('10');
  const [signals, setSignals] = useState('slurry, concrete, pump');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    onSearchStart?.();

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip, radius: parseInt(radius), vertical, signals: signals.split(',').map(s => s.trim()) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      onResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-surface border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red/10 border border-red/20 flex items-center justify-center">
          <Search className="w-5 h-5 text-red" />
        </div>
        <div>
          <div className="text-sm font-semibold">Search Console</div>
          <div className="text-xs text-muted">Define your target market parameters</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Crosshair className="w-3 h-3" /> Vertical
          </label>
          <select value={vertical} onChange={e => setVertical(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20">
            <option value="slurry_concrete">Slurry / Concrete</option>
            <option value="construction">Construction</option>
            <option value="industrial">Industrial</option>
            <option value="energy">Energy</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> ZIP Code
          </label>
          <input value={zip} onChange={e => setZip(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Radius (mi)
          </label>
          <select value={radius} onChange={e => setRadius(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20">
            <option value="10">10 miles</option>
            <option value="20">20 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Radio className="w-3 h-3" /> Signals
          </label>
          <input value={signals} onChange={e => setSignals(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red/10 border border-red/20 text-sm text-red">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">{loading ? 'Searching East Bay slurry contractors...' : 'Enter parameters and run discovery'}</div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Searching...' : 'Run Discovery'}
        </Button>
      </div>
    </div>
  );
}
