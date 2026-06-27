'use client';

import { useState } from 'react';
import { Search, MapPin, Crosshair, Radio } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SearchConsole() {
  const [vertical, setVertical] = useState('slurry_concrete');
  const [zip, setZip] = useState('94544');
  const [radius, setRadius] = useState('25');
  const [signals, setSignals] = useState('slurry, concrete, pump');

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <input value={radius} onChange={e => setRadius(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Radio className="w-3 h-3" /> Signals
          </label>
          <input value={signals} onChange={e => setSignals(e.target.value)}
            className="h-10 px-3.5 bg-surface2 border border-border rounded-xl text-sm text-text focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">Estimated: ~43 companies in target area</div>
        <Button>
          <Search className="w-4 h-4" /> Run Discovery
        </Button>
      </div>
    </div>
  );
}
