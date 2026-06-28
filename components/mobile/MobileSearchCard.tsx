'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface MobileSearchCardProps {
  onSearch: (data: { companies: any[]; count: number }) => void;
  onSearchStart: () => void;
}

export default function MobileSearchCard({ onSearch, onSearchStart }: MobileSearchCardProps) {
  const [vertical, setVertical] = useState('slurry_concrete');
  const [zip, setZip] = useState('');
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!zip.trim()) {
      setError('Please enter a ZIP code.');
      return;
    }

    setLoading(true);
    setError(null);
    onSearchStart();

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip: zip.trim(),
          radius,
          vertical,
          signals: ['slurry', 'concrete', 'pump'],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      onSearch(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-4">
      <h2 className="text-xl font-semibold">Search Market</h2>

      <select
        value={vertical}
        onChange={(e) => setVertical(e.target.value)}
        className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm"
      >
        <option value="slurry_concrete">Slurry / Concrete</option>
        <option value="construction">Construction</option>
        <option value="industrial">Industrial</option>
        <option value="energy">Energy</option>
      </select>

      <input
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="ZIP code"
        className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm"
      />

      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm"
      >
        <option value={10}>10 miles</option>
        <option value={20}>20 miles</option>
        <option value={50}>50 miles</option>
        <option value={100}>100 miles</option>
      </select>

      {error && (
        <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-red-600 rounded-xl py-3 font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? 'Searching...' : 'Run Discovery'}
      </button>
    </div>
  );
}
