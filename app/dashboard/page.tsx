'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Search,
  Database,
  Target,
  TrendingUp,
  Phone,
  Mail,
  FileDown,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Company } from '@/types/company';

const DEFAULT_METRICS = {
  totalLeads: 0,
  priorityA: 0,
  priorityB: 0,
  enrichmentPercentage: 0,
  contactedCount: 0,
  conversionRate: 0
};

export default function Dashboard() {
  const [activeVertical, setActiveVertical] = useState('slurry_concrete');
  const [zipCode, setZipCode] = useState('94544');
  const [radius, setRadius] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnection, setIsLiveConnection] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('organizations').select('id').limit(1);
        if (!error) {
          setIsLiveConnection(true);
          setErrorMessage(null);
        } else {
          throw error;
        }
      } catch (err: any) {
        console.warn('[Supabase Connection] Active tables not detected or unauthorized. falling back.');
        setIsLiveConnection(false);
      }
    }
    checkConnection();
  }, []);

  const handleMarketDiscovery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-iie-client-context': activeVertical
        },
        body: JSON.stringify({ zip: zipCode, radius: Number(radius), search: searchQuery })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Serverless API Execution Rejected.');
      }

      const result = await response.json();
      setCompanies(result.companies || []);

      if (result.companies && result.companies.length > 0) {
        const total = result.companies.length;
        const priorityA = result.companies.filter((c: Company) => c.priority === 'A').length;
        const priorityB = result.companies.filter((c: Company) => c.priority === 'B').length;
        const enriched = result.companies.filter((c: Company) => c.email || c.phone).length;
        const contacted = result.companies.filter((c: Company) => c.status !== 'NOT_CONTACTED').length;

        setMetrics({
          totalLeads: total,
          priorityA,
          priorityB,
          enrichmentPercentage: Math.round((enriched / total) * 100),
          contactedCount: contacted,
          conversionRate: total > 0 ? Math.round((contacted / total) * 100) : 0
        });
      } else {
        setMetrics(DEFAULT_METRICS);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to complete market discovery.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleMarketDiscovery();
  }, [activeVertical]);

  const handleExportCSV = async () => {
    if (companies.length === 0) return;
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-iie-client-context': activeVertical
        },
        body: JSON.stringify({ companies })
      });
      const data = await response.json();
      if (data.success && data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.setAttribute('download', data.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert('Failed to generate export file.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans p-6">

      {!isLiveConnection && (
        <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800/40 text-amber-300 rounded-xl flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Local Fallback / Mock Mode Active</span>
            <p className="leading-relaxed">
              The dashboard cannot reach your Supabase database at <span className="font-mono text-cyan-400">https://ciysvuxxxsqkpbgugcyi.supabase.co</span>.
              To activate real-time calculations and live API crawls, configure your <span className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> inside your Vercel project's Environment Variables.
            </p>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-800 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="text-xs uppercase font-mono tracking-widest text-red-500 font-bold">Market Intelligence Control</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">SaaS Prospecting Engine</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeVertical}
            onChange={(e) => setActiveVertical(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            <option value="slurry_concrete">Concrete Slurry Outbound</option>
            <option value="grease_trap">Commercial Grease Trap</option>
            <option value="asbestos_abatement">Asbestos Remediation</option>
            <option value="hydro_excavation">Hydro-Excavation</option>
            <option value="commercial_roofing">Industrial Roofing</option>
            <option value="medical_waste">Infectious Waste</option>
            <option value="scrap_metal">Scrap Metal Processing</option>
            <option value="marine_construction">Heavy Marine Construction</option>
          </select>

          <button
            onClick={() => handleMarketDiscovery()}
            disabled={isLoading}
            className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-300 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 relative">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Discovered</span>
          <span className="text-3xl font-mono font-extrabold text-white mt-2 block">{metrics.totalLeads}</span>
          <span className="text-[9px] text-gray-500 font-mono block mt-1">Local Addressable Market Size</span>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 relative">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">High Priority (Group A)</span>
          <span className="text-3xl font-mono font-extrabold text-red-500 mt-2 block">{metrics.priorityA}</span>
          <span className="text-[9px] text-gray-500 font-mono block mt-1">Within immediate 10-mile radius</span>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 relative">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contact Enrichment</span>
          <span className="text-3xl font-mono font-extrabold text-cyan-400 mt-2 block">{metrics.enrichmentPercentage}%</span>
          <span className="text-[9px] text-gray-500 font-mono block mt-1">Verified with direct email/phone</span>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 relative">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">CRM Conversion Rate</span>
          <span className="text-3xl font-mono font-extrabold text-emerald-400 mt-2 block">{metrics.conversionRate}%</span>
          <span className="text-[9px] text-gray-500 font-mono block mt-1">Advanced status leads count</span>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <form onSubmit={handleMarketDiscovery} className="lg:col-span-4 bg-[#111] border border-gray-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-red-600" />
            Geospatial Search Parameters
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">ZIP Code Range</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-red-600 font-mono"
                placeholder="e.g. 94544"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Hauling Radius: {radius} miles</label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-red-600 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Signal Keywords / Exclusions</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-red-600"
                placeholder="e.g. filter press"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 transition text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg shadow-red-600/10 mt-4"
            >
              {isLoading ? 'Scanning Target Market...' : 'Run Market Sweep'}
            </button>
          </div>
        </form>

        <div className="lg:col-span-8 bg-[#111] border border-gray-800 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-red-600" />
              Target Pipeline Listings
            </h2>
            {companies.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="text-xs px-3 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-xl transition flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> Export CSV
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider border-b border-gray-850">
                  <th className="pb-3">Company Name</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Enrichment Score</th>
                  <th className="pb-3">Contacts</th>
                  <th className="pb-3 text-right">Scraped Signals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 text-gray-300">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-900/20 transition-colors">
                    <td className="py-3 font-semibold text-white">{c.companyName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.priority === 'A' ? 'bg-red-950 text-red-400 border border-red-900/30' :
                        c.priority === 'B' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900/30' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        Group {c.priority}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-red-400">{c.enrichmentScore || 30}</td>
                    <td className="py-3 space-y-1">
                      {c.phone && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                          <Phone className="w-2.5 h-2.5 text-red-500" /> {c.phone}
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                          <Mail className="w-2.5 h-2.5 text-cyan-500" /> {c.email}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right max-w-[200px] truncate text-gray-500" title={c.capabilitySummary}>
                      {c.capabilitySummary || '—'}
                    </td>
                  </tr>
                ))}

                {companies.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500 italic">
                      No prospects found. Run a "Market Sweep" to ingest live geographic data into the pipeline.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  );
}
