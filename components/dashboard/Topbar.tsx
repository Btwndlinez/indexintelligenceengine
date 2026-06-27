'use client';

import { Search, Bell, Zap } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="fixed top-0 left-[280px] right-0 h-[72px] bg-surface/80 backdrop-blur-xl border-b border-border z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search companies, markets, campaigns..."
          className="flex-1 bg-transparent text-sm text-text placeholder:text-muted/50 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface2 border border-border text-xs">
          <Zap className="w-3 h-3 text-yellow" />
          <span className="text-muted">2,482 / 10,000</span>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-surface2 transition-all">
          <Bell className="w-4 h-4 text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red to-red/60 flex items-center justify-center text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
}
