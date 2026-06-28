'use client';

import { useState } from 'react';

export default function MobileSearchCard() {
  const [radius, setRadius] = useState(10);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-4">
      <h2 className="text-xl font-semibold">Search Market</h2>

      <select className="w-full rounded-xl bg-black border border-white/10 p-3 text-sm">
        <option>Slurry / Concrete</option>
      </select>

      <input
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

      <button className="w-full bg-red-600 rounded-xl py-3 font-semibold text-sm">
        Run Discovery
      </button>
    </div>
  );
}
