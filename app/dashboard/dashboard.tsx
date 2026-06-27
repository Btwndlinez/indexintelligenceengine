'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, Search, Database, Target, TrendingUp, Phone, Mail,
  FileDown, RefreshCw, AlertTriangle, BarChart3, Activity,
  Clock, Users, Building2, CheckCircle, XCircle, MapPin,
} from 'lucide-react';

interface Company {
  id: string;
  companyName: string;
  website?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  zip?: string;
  distanceMiles?: number;
  enrichmentScore: number;
  priority: string;
  status: string;
  capabilitySummary?: string;
  industry?: string;
}

interface SearchRecord {
  id: string;
  vertical: string;
  zip: string;
  radius: number;
  resultCount: number;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ProviderHealth {
  status: string;
  failures: number;
  open: boolean;
}

const DEFAULT_METRICS = {
  totalLeads: 0, priorityA: 0, enrichmentPercentage: 0, conversionRate: 0,
};

export default function Dashboard() {
  const [verticals, setVerticals] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [selectedVertical, setSelectedVertical] = useState('');
  const [zip, setZip] = useState('94544');
  const [radius, setRadius] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [searchHistory, setSearchHistory] = useState<SearchRecord[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [providerHealth, setProviderHealth] = useState<Record<string, ProviderHealth>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load verticals on mount
  useEffect(() => {
    fetch('/api/verticals').then(r => r.json()).then(data => {
      setVerticals(data.verticals || []);
      if (data.verticals?.length) setSelectedVertical(data.verticals[0].slug);
    }).catch(() => {});
  }, []);

  // Load search history
  const loadSearchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/search/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-iie-client-context': selectedVertical },
        body: JSON.stringify({ action: 'list' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSearchHistory(data.searches || []);
      }
    } catch {}
  }, [selectedVertical]);

  // Load campaigns
  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-iie-client-context': selectedVertical },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch {}
  }, [selectedVertical]);

  // Load provider health
  const loadProviderHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setProviderHealth(data.providers || {});
      }
    } catch {}
  }, []);

  useEffect(() => { loadProviderHealth(); }, []);

  const handleDiscovery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedVertical) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-iie-client-context': selectedVertical },
        body: JSON.stringify({ zip, radius: Number(radius), search: searchQuery }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Discovery failed');
      }

      const result = await res.json();
      setCompanies(result.companies || []);

      if (result.companies?.length) {
        const total = result.companies.length;
        const pA = result.companies.filter((c: Company) => c.priority === 'A').length;
        const enriched = result.companies.filter((c: Company) => c.email || c.phone).length;
        setMetrics({
          totalLeads: total,
          priorityA: pA,
          enrichmentPercentage: Math.round((enriched / total) * 100),
          conversionRate: Math.round(result.companies.filter((c: Company) => c.status !== 'NOT_CONTACTED').length / total * 100),
        });
      } else {
        setMetrics(DEFAULT_METRICS);
      }

      loadSearchHistory();
      loadCampaigns();
      loadProviderHealth();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!companies.length) return;
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-iie-client-context': selectedVertical },
        body: JSON.stringify({ companies }),
      });
      const data = await res.json();
      if (data.url) {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = data.fileName || 'iie-export.csv';
        a.click();
      }
    } catch {}
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'NOT_CONTACTED': return 'bg-gray-800 text-gray-400';
      case 'CALLED': case 'EMAILED': return 'bg-blue-500/10 text-blue-400';
      case 'INTERESTED': case 'FOLLOW_UP': return 'bg-amber-500/10 text-amber-400';
      case 'QUALIFIED': return 'bg-purple-500/10 text-purple-400';
      case 'WON': return 'bg-emerald-500/10 text-emerald-400';
      case 'LOST': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const healthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-500';
      case 'DEGRADED': return 'bg-yellow-500';
      case 'OPEN': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentVertical = verticals.find(v => v.slug === selectedVertical);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const campaignConversion = campaigns.length ? Math.round(activeCampaigns / campaigns.length * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dc2626]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Index Intelligence Engine</span>
            <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40 md:inline">Command Center</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium outline-none focus:border-[#dc2626]/50"
            >
              {verticals.map(v => (
                <option key={v.slug} value={v.slug} className="bg-[#0a0a0a]">{v.name}</option>
              ))}
            </select>
            <button
              onClick={handleDiscovery}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-[#dc2626] px-4 py-1.5 text-xs font-medium hover:bg-[#b91c1c] disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
              Run Discovery
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Building2 className="h-3.5 w-3.5" /> Total Leads
            </div>
            <div className="mt-1 text-2xl font-bold">{metrics.totalLeads}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Target className="h-3.5 w-3.5" /> Priority A
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">{metrics.priorityA}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <TrendingUp className="h-3.5 w-3.5" /> Enrichment
            </div>
            <div className="mt-1 text-2xl font-bold text-cyan-400">{metrics.enrichmentPercentage}%</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <BarChart3 className="h-3.5 w-3.5" /> Campaign Conv.
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-400">{campaignConversion}%</div>
          </div>
        </div>

        {/* Row 2: Discovery + Provider Health */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Discovery Engine */}
          <div className="lg:col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
              <Search className="h-3.5 w-3.5" /> Discovery Engine
            </h2>
            <form onSubmit={handleDiscovery} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-[10px] text-white/30">ZIP Code</label>
                <input
                  type="text" required value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dc2626]/50"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-white/30">Radius: {radius} mi</label>
                <input
                  type="range" min="5" max="50" step="5" value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#dc2626]"
                />
              </div>
              <div className="flex-[2]">
                <label className="mb-1 block text-[10px] text-white/30">Keywords / Filters</label>
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. filter press, hazmat"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dc2626]/50"
                />
              </div>
              <button
                type="submit" disabled={isLoading}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-[#dc2626] px-4 text-xs font-medium hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                Search
              </button>
            </form>

            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                <AlertTriangle className="h-3 w-3" /> {errorMessage}
              </div>
            )}
          </div>

          {/* Provider Health */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
              <Activity className="h-3.5 w-3.5" /> Provider Health
            </h2>
            <div className="space-y-3">
              {Object.keys(providerHealth).length === 0 ? (
                <div className="text-xs text-white/30">No provider data — run a discovery first.</div>
              ) : (
                Object.entries(providerHealth).map(([name, h]) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${healthColor(h.status)}`} />
                      <span className="text-xs capitalize text-white/60">{name.replace('_', ' ')}</span>
                    </div>
                    <span className={`text-[10px] font-medium ${
                      h.status === 'HEALTHY' ? 'text-green-400' :
                      h.status === 'DEGRADED' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Companies Table + Search History */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Companies Table */}
          <div className="lg:col-span-3 rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                <Database className="h-3.5 w-3.5" /> Pipeline ({companies.length})
              </h2>
              {companies.length > 0 && (
                <button onClick={handleExport} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-[10px] hover:bg-white/5">
                  <FileDown className="h-3 w-3" /> Export
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-white/30">
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Priority</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium">Distance</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <div className="font-medium text-white">{c.companyName}</div>
                        <div className="text-[10px] text-white/30">{c.city}{c.state ? `, ${c.state}` : ''}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          c.priority === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                          c.priority === 'B' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-white/10 text-white/40'
                        }`}>{c.priority || 'C'}</span>
                      </td>
                      <td className="px-5 py-3 font-mono text-white/60">{c.enrichmentScore || '-'}</td>
                      <td className="px-5 py-3 text-white/40">{c.distanceMiles ? `${c.distanceMiles} mi` : '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${statusColor(c.status)}`}>
                          {c.status?.replace(/_/g, ' ') || 'NEW'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button
                            title="Call"
                            className="rounded border border-white/10 p-1 hover:bg-white/10"
                            onClick={() => window.open(`tel:${c.phone}`, '_blank')}
                          >
                            <Phone className="h-3 w-3" />
                          </button>
                          <button
                            title="Email"
                            className="rounded border border-white/10 p-1 hover:bg-white/10"
                            onClick={() => window.open(`mailto:${c.email}`, '_blank')}
                          >
                            <Mail className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30 italic">Run a discovery to populate the pipeline.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Search History Sidebar */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
              <Clock className="h-3.5 w-3.5" /> Search History
            </h2>
            {searchHistory.length === 0 ? (
              <div className="text-xs text-white/30">No searches yet.</div>
            ) : (
              <div className="space-y-2">
                {searchHistory.slice(0, 10).map((s) => (
                  <div key={s.id} className="rounded-lg border border-white/5 px-3 py-2">
                    <div className="text-xs text-white/70">{s.zip} • {s.radius}mi</div>
                    <div className="text-[10px] text-white/30">{s.resultCount} results • {new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Campaign Manager */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <Target className="h-3.5 w-3.5" /> Campaign Manager
          </h2>
          {campaigns.length === 0 ? (
            <div className="text-xs text-white/30">No campaigns yet. Create one to start outreach.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['draft', 'active', 'paused', 'completed'].map((status) => {
                const count = campaigns.filter(c => c.status === status).length;
                if (!count) return null;
                return (
                  <div key={status} className="rounded-lg border border-white/5 px-4 py-3">
                    <div className="text-xs capitalize text-white/40">{status}</div>
                    <div className="mt-1 text-lg font-bold">{count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="py-4 text-center text-[10px] text-white/20">
          IIE v1.0 • Discovery & Outreach Command Center
        </div>
      </main>
    </div>
  );
}
