'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface Company {
  id: string;
  companyName: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  distanceMiles: number;
  enrichmentScore: number;
  priority: 'A' | 'B' | 'C';
  status: 'NOT_CONTACTED' | 'CALLED' | 'EMAILED' | 'INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'WON' | 'LOST';
  capabilitySummary?: string;
  contactName?: string;
  contactTitle?: string;
  contactLinkedin?: string;
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  providerName: 'google_places' | 'apollo' | 'gemini_grounding' | 'system_adapter';
  action: string;
  latencyMs: number;
  cost: number;
  isSuccess: boolean;
}

interface VerticalConfig {
  slug: string;
  industryName: string;
  naicsCodes: string[];
  trackers: string[];
  exclusions: string[];
  defaultQueries: string[];
  proximityWeight: number;
  enrichmentWeight: number;
  crawlWeight: number;
}

const SEED_VERTICALS: Record<string, VerticalConfig> = {
  slurry_concrete: {
    slug: 'slurry_concrete',
    industryName: 'Concrete Slurry Recycling',
    naicsCodes: ['562211', '562219'],
    trackers: ['Vacuum Truck', 'Filter Press', 'Dewatering System', 'Silt Separator'],
    exclusions: ['Residential Plumbing', 'Retail Home Depot', 'DIY Concrete Mixing'],
    defaultQueries: ['concrete slurry disposal', 'industrial wastewater recycling'],
    proximityWeight: 30,
    enrichmentWeight: 40,
    crawlWeight: 30
  },
  grease_trap: {
    slug: 'grease_trap',
    industryName: 'Commercial Grease Trap Pumping',
    naicsCodes: ['562219', '562910'],
    trackers: ['Grease Interceptor', 'Vacuum Tanker', 'Hydro-jetter', 'Rendering Tank'],
    exclusions: ['Residential Drain Cleaning', 'Retail Kitchen Supplies', 'Culinary School'],
    defaultQueries: ['grease trap pumping services', 'commercial kitchen grease cleaning'],
    proximityWeight: 40,
    enrichmentWeight: 30,
    crawlWeight: 30
  },
  asbestos_abatement: {
    slug: 'asbestos_abatement',
    industryName: 'Hazardous Asbestos Abatement',
    naicsCodes: ['562910', '541620'],
    trackers: ['Negative Air Machine', 'HEPA Scrubber', 'Decontamination Shower', 'Airlock enclosure'],
    exclusions: ['Home Inspection Services', 'Retail Hardware', 'General Drywallers'],
    defaultQueries: ['certified asbestos removal contractors', 'lead paint abatement commercial'],
    proximityWeight: 20,
    enrichmentWeight: 50,
    crawlWeight: 30
  },
  hydro_excavation: {
    slug: 'hydro_excavation',
    industryName: 'Hydro-Excavation & Non-Destructive Digging',
    naicsCodes: ['238910', '562998'],
    trackers: ['Utility Locator', 'Pressure Digging Rig', 'Debris Vac', 'Potholing Wand'],
    exclusions: ['Sewer backup residential', 'Landscaping contractors', 'DIY garden trenching'],
    defaultQueries: ['hydrovac excavating services', 'subsurface utility engineering'],
    proximityWeight: 35,
    enrichmentWeight: 35,
    crawlWeight: 30
  },
  commercial_roofing: {
    slug: 'commercial_roofing',
    industryName: 'Industrial Flat Roofing Systems',
    naicsCodes: ['238160', '562910'],
    trackers: ['Thermal Drone Scanner', 'Single-ply Membrane Welder', 'EPDM roll applicator'],
    exclusions: ['Residential gutters', 'Vinyl siding repairs', 'Window glazing installers'],
    defaultQueries: ['commercial roofing contractors flat roof', 'industrial membrane roof insulation'],
    proximityWeight: 30,
    enrichmentWeight: 30,
    crawlWeight: 40
  },
  medical_waste: {
    slug: 'medical_waste',
    industryName: 'Biomedical & Infectious Waste Treatment',
    naicsCodes: ['562211', '621511'],
    trackers: ['Red Bag Container', 'Autoclave Shredder', 'Sharps disposal system', 'Pathological incinerator'],
    exclusions: ['Acupuncture centers', 'Family clinics', 'Dental supplies retail'],
    defaultQueries: ['hazardous medical waste hauling', 'biomedical containment transport'],
    proximityWeight: 25,
    enrichmentWeight: 45,
    crawlWeight: 30
  }
};

export default function IndexIntelligenceDashboard() {
  const [selectedTenantKey, setSelectedTenantKey] = useState<string>('slurry_concrete');
  const [zipCode, setZipCode] = useState<string>('94544');
  const [radius, setRadius] = useState<number>(25);
  const [activeTab, setActiveTab] = useState<'discovery' | 'callsheet' | 'campaign' | 'governance' | 'telemetry'>('discovery');

  const [verticalConfigs, setVerticalConfigs] = useState<Record<string, VerticalConfig>>(SEED_VERTICALS);
  const [companies, setCompanies] = useState<Record<string, Company[]>>({});

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null);
  const [dialerLogType, setDialerLogType] = useState<'CALL' | 'EMAIL' | 'LINKEDIN' | 'NOTE'>('CALL');
  const [dialerLogOutcome, setDialerLogOutcome] = useState<string>('connected_interested');
  const [dialerLogNotes, setDialerLogNotes] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);

  const activeConfig = useMemo(() => verticalConfigs[selectedTenantKey] || SEED_VERTICALS.slurry_concrete, [verticalConfigs, selectedTenantKey]);
  const activeCompanies = useMemo(() => companies[selectedTenantKey] || [], [companies, selectedTenantKey]);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return activeCompanies;
    const cleanQ = searchQuery.toLowerCase();
    return activeCompanies.filter(c =>
      c.companyName.toLowerCase().includes(cleanQ) ||
      (c.city || '').toLowerCase().includes(cleanQ) ||
      (c.capabilitySummary || '').toLowerCase().includes(cleanQ)
    );
  }, [activeCompanies, searchQuery]);

  const aggregatedMetrics = useMemo(() => {
    const total = activeCompanies.length;
    const priorityA = activeCompanies.filter(c => c.priority === 'A').length;
    const priorityB = activeCompanies.filter(c => c.priority === 'B').length;
    const priorityC = activeCompanies.filter(c => c.priority === 'C').length;
    const contacted = activeCompanies.filter(c => c.status !== 'NOT_CONTACTED').length;
    const won = activeCompanies.filter(c => c.status === 'WON').length;
    const interested = activeCompanies.filter(c => c.status === 'INTERESTED').length;
    const enrichedCount = activeCompanies.filter(c => c.email || c.phone).length;
    const enrichmentRate = total > 0 ? Math.round((enrichedCount / total) * 100) : 0;
    const conversionRate = contacted > 0 ? Math.round((won / contacted) * 100) : 0;
    const totalSystemCost = telemetryLogs.reduce((acc, log) => acc + log.cost, 0);
    const meanLatency = telemetryLogs.length > 0
      ? Math.round(telemetryLogs.reduce((acc, log) => acc + log.latencyMs, 0) / telemetryLogs.length)
      : 0;

    return { total, priorityA, priorityB, priorityC, enrichmentRate, contacted, won, interested, conversionRate, totalSystemCost, meanLatency };
  }, [activeCompanies, telemetryLogs]);

  useEffect(() => {
    if (activeCompanies.length > 0) {
      setFocusedLeadId(activeCompanies[0].id);
    } else {
      setFocusedLeadId(null);
    }
  }, [selectedTenantKey, activeCompanies]);

  useEffect(() => {
    fetchCompanies();
    fetchTelemetry();
  }, [selectedTenantKey]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-iie-client-context': selectedTenantKey,
        },
        body: JSON.stringify({ zip: zipCode, radius }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.companies?.length) {
        setCompanies({ [selectedTenantKey]: data.companies });
      }
    } catch {
      // API not reachable
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-iie-client-context': selectedTenantKey,
        },
        body: JSON.stringify({ action: 'get-telemetry' }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.stats) {
        const log: TelemetryLog = {
          id: `tel-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          providerName: 'system_adapter',
          action: `API calls: ${data.stats.totalApiCalls}, Cost: $${data.stats.accumulatedCost}, Avg latency: ${data.stats.averageLatencyMs}ms`,
          latencyMs: data.stats.averageLatencyMs,
          cost: data.stats.accumulatedCost,
          isSuccess: true,
        };
        setTelemetryLogs([log]);
      }
    } catch {
      // API not reachable
    }
  };

  const triggerDiscoverySync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-iie-client-context': selectedTenantKey,
        },
        body: JSON.stringify({ zip: zipCode, radius }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.companies?.length) {
          setCompanies({ [selectedTenantKey]: data.companies });
        }
        const trace: TelemetryLog = {
          id: `tr-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          providerName: 'google_places',
          action: `Search around ${zipCode} / ${radius}mi for ${selectedTenantKey}`,
          latencyMs: 0,
          cost: 0,
          isSuccess: true,
        };
        setTelemetryLogs(prev => [trace, ...prev]);
      }
    } catch {
      const trace: TelemetryLog = {
        id: `tr-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        providerName: 'system_adapter',
        action: 'Discovery sync failed — API unreachable',
        latencyMs: 0,
        cost: 0,
        isSuccess: false,
      };
      setTelemetryLogs(prev => [trace, ...prev]);
    }
    setIsSyncing(false);
  };

  const submitInteractionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!focusedLeadId) return;

    let nextStatus: Company['status'] = 'CALLED';
    if (dialerLogOutcome === 'connected_interested') nextStatus = 'INTERESTED';
    else if (dialerLogOutcome === 'sent_proposal') nextStatus = 'QUALIFIED';
    else if (dialerLogOutcome === 'connected_not_interested') nextStatus = 'LOST';
    else if (dialerLogOutcome === 'left_voicemail' || dialerLogOutcome === 'busy') nextStatus = 'FOLLOW_UP';
    else if (dialerLogOutcome === 'out_of_service') nextStatus = 'LOST';

    setCompanies(prev => {
      const tenantList = prev[selectedTenantKey] || [];
      const updated = tenantList.map(c => {
        if (c.id === focusedLeadId) {
          return { ...c, status: nextStatus, capabilitySummary: `[Enriched CRM Notes] ${dialerLogNotes || 'Logged outreach connection.'} — ${c.capabilitySummary || ''}` };
        }
        return c;
      });
      return { ...prev, [selectedTenantKey]: updated };
    });

    const timestamp = new Date().toLocaleTimeString();
    const actionLogTrace: TelemetryLog = {
      id: `tr-outreach-${Date.now()}`,
      timestamp,
      providerName: 'system_adapter',
      action: `Logged Outreach Interaction (${dialerLogType}) -> Moved lead ID ${focusedLeadId} to status: ${nextStatus}`,
      latencyMs: 8,
      cost: 0.0,
      isSuccess: true
    };
    setTelemetryLogs(prev => [actionLogTrace, ...prev]);
    setDialerLogNotes('');
  };

  const handleWeightChange = (key: 'proximityWeight' | 'enrichmentWeight' | 'crawlWeight', val: number) => {
    setVerticalConfigs(prev => {
      const config = prev[selectedTenantKey];
      return { ...prev, [selectedTenantKey]: { ...config, [key]: val } };
    });
  };

  const activeFocusedLead = useMemo(() => {
    return activeCompanies.find(c => c.id === focusedLeadId) || null;
  }, [activeCompanies, focusedLeadId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">

      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">INDEX INTELLIGENCE ENGINE</span>
              <p className="text-xs text-slate-400 font-mono">v1.0 Headless Multi-Tenant Lead Pipeline</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Active Workspace Target:</span>
            <select
              value={selectedTenantKey}
              onChange={(e) => setSelectedTenantKey(e.target.value)}
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-600 transition"
            >
              {Object.values(verticalConfigs).map(v => (
                <option key={v.slug} value={v.slug}>{v.industryName}</option>
              ))}
            </select>
          </div>

        </div>
      </nav>

      <section className="bg-slate-900/40 border-b border-slate-800/60 px-6 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">B2B Pipelines</p>
              <h4 className="text-xl font-bold">{aggregatedMetrics.total} Total Leads</h4>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Enrichment Rate</p>
              <h4 className="text-xl font-bold">{aggregatedMetrics.enrichmentRate}% Enriched</h4>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Conversion Rate</p>
              <h4 className="text-xl font-bold">{aggregatedMetrics.conversionRate}% Won</h4>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Accumulated Cost</p>
              <h4 className="text-xl font-bold font-mono">${aggregatedMetrics.totalSystemCost.toFixed(5)}</h4>
            </div>
          </div>

        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6 overflow-hidden">

        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'discovery', label: 'Market Discovery', icon: '🔍' },
              { id: 'callsheet', label: 'Callsheet & CRM', icon: '📋' },
              { id: 'campaign', label: 'Outbound Dialer', icon: '📞' },
              { id: 'governance', label: 'Dynamic Tuning', icon: '⚙️' },
              { id: 'telemetry', label: 'Telemetry stream', icon: '📡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Full-Text Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs w-60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          </div>
        </div>

        {activeTab === 'discovery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Discovery Engine Parameters</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-medium">Target Postal ZIP Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Scan Radius</span>
                      <span className="text-indigo-400 font-mono font-bold">{radius} miles</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl text-xs flex flex-col gap-2">
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wide text-[10px]">NAICS Query Constraints</span>
                      <p className="font-mono mt-0.5 text-slate-300">{activeConfig.naicsCodes.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wide text-[10px]">Dynamic Scraper Target Keywords</span>
                      <p className="mt-0.5 text-slate-300 italic">{activeConfig.trackers.slice(0, 3).join(', ')}...</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={triggerDiscoverySync}
                disabled={isSyncing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing Dual-Vector Sync...
                  </>
                ) : (
                  <><span>⚡</span> Run Discovery Sync</>
                )}
              </button>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Geospatial Distribution Map</span>
                <span className="text-xs font-mono text-slate-500">Center: ZIP {zipCode}</span>
              </div>

              <div className="relative h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex items-center justify-center">

                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <circle cx="50%" cy="50%" r="40" fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="50%" cy="50%" r="80" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="50%" cy="50%" r="120" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="1 1" />
                </svg>

                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="h-3.5 w-3.5 bg-indigo-500 rounded-full animate-ping absolute"></div>
                  <div className="h-3 w-3 bg-indigo-600 rounded-full border-2 border-white"></div>
                  <span className="bg-slate-900/90 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800 mt-1 font-mono">{zipCode}</span>
                </div>

                {filteredCompanies.map((c, i) => {
                  const angle = (i * (360 / Math.max(1, filteredCompanies.length))) * (Math.PI / 180);
                  const scale = Math.min(120, 20 + (c.distanceMiles * 7));
                  const leftPos = `calc(50% + ${Math.cos(angle) * scale}px)`;
                  const topPos = `calc(50% + ${Math.sin(angle) * scale}px)`;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setFocusedLeadId(c.id)}
                      style={{ left: leftPos, top: topPos }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full group transition duration-300 z-10 ${
                        focusedLeadId === c.id ? 'scale-125 z-20' : 'hover:scale-110'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center border-2 shadow-md ${
                        c.priority === 'A' ? 'bg-emerald-500 border-emerald-300' :
                        c.priority === 'B' ? 'bg-indigo-500 border-indigo-300' :
                        'bg-slate-500 border-slate-400'
                      }`}>
                        <span className="text-[8px] font-black text-white">{c.priority}</span>
                      </div>

                      <div className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-slate-900 border border-slate-800 text-xs text-slate-100 p-2.5 rounded-xl shadow-xl w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 text-center z-30">
                        <p className="font-bold">{c.companyName}</p>
                        <p className="text-slate-400 font-mono mt-0.5 text-[10px]">{c.distanceMiles} mi | Score: {c.enrichmentScore}%</p>
                      </div>
                    </button>
                  );
                })}

              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-emerald-500 rounded-full"></span> Priority Group A (Distance &lt; 10 mi)</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-indigo-500 rounded-full"></span> Priority Group B (Distance &lt; 15 mi)</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-slate-500 rounded-full"></span> Priority Group C (Distance &gt; 15 mi)</span>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'callsheet' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Priority-Sorted CRM Leads List</h3>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full font-semibold">{filteredCompanies.length} Active matches found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-3 font-semibold px-2">Company Name</th>
                    <th className="pb-3 font-semibold">City/Zip</th>
                    <th className="pb-3 font-semibold">Priority</th>
                    <th className="pb-3 font-semibold">MIE Scoring</th>
                    <th className="pb-3 font-semibold">CRM Pipeline Status</th>
                    <th className="pb-3 font-semibold">Real-Time Machine Signals</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredCompanies.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setFocusedLeadId(c.id)}
                      className={`hover:bg-slate-850/60 transition cursor-pointer ${
                        focusedLeadId === c.id ? 'bg-slate-850/80 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="py-4 font-bold text-slate-100 px-2">
                        {c.companyName}
                        {c.website && <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{c.website}</span>}
                      </td>
                      <td className="py-4 font-medium text-slate-300">{c.city}, {c.zipCode}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.priority === 'A' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          c.priority === 'B' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          Group {c.priority}
                        </span>
                      </td>
                      <td className="py-4 font-mono font-bold text-slate-200">{c.enrichmentScore}%</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400' :
                          c.status === 'LOST' ? 'bg-rose-500/10 text-rose-400' :
                          c.status === 'INTERESTED' ? 'bg-purple-500/10 text-purple-400' :
                          c.status === 'NOT_CONTACTED' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400 max-w-xs truncate" title={c.capabilitySummary}>
                        {c.capabilitySummary}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            setFocusedLeadId(c.id);
                            setActiveTab('campaign');
                          }}
                          className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition"
                        >
                          Dial Lead
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 italic">No companies matched this filter string.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Outreach dialer</span>
                <h3 className="text-base font-bold text-slate-200 mt-1">Lead Connection Workbench</h3>
              </div>

              {activeFocusedLead ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Company Focus Name</span>
                    <h4 className="text-base font-bold text-indigo-400">{activeFocusedLead.companyName}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Direct Phone</span>
                      <p className="text-xs font-mono font-medium text-slate-200 mt-0.5">{activeFocusedLead.phone || 'No Phone Enriched'}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Decision Maker</span>
                      <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">{activeFocusedLead.contactName || 'Unresolved contact'}</p>
                      <p className="text-[9px] text-slate-400 truncate">{activeFocusedLead.contactTitle || ''}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Extracted Grounded signals</span>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed italic">{activeFocusedLead.capabilitySummary}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-500 italic">
                  Select an active target lead to begin callsheet outreach progression.
                </div>
              )}
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Log Interaction & Auto-Advance CRM Stage</h3>
              </div>

              <form onSubmit={submitInteractionLog} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-medium">Outreach Modality</label>
                    <select
                      value={dialerLogType}
                      onChange={(e) => setDialerLogType(e.target.value as any)}
                      className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-100"
                    >
                      <option value="CALL">Outgoing Voice Dial Sequence</option>
                      <option value="EMAIL">Outbound Custom Enrichment Mail</option>
                      <option value="LINKEDIN">LinkedIn Direct Connection message</option>
                      <option value="NOTE">Log Administrative Note / Audit Change</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-medium">Outreach Interaction Outcome</label>
                    <select
                      value={dialerLogOutcome}
                      onChange={(e) => setDialerLogOutcome(e.target.value)}
                      className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-100"
                    >
                      <option value="connected_interested">Connected: Highly Interested & Hooked</option>
                      <option value="sent_proposal">Connected: Sent Contract Quote proposal</option>
                      <option value="left_voicemail">No Answer: Left voicemail successfully</option>
                      <option value="busy">No Answer: Busy callback set</option>
                      <option value="connected_not_interested">Connected: Out of market / Rejected</option>
                      <option value="out_of_service">System Error: Disconnected Line</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Outreach Interaction Log Notes</label>
                  <textarea
                    placeholder="Enter detailed callback parameters, key decision points, machinery confirmations..."
                    value={dialerLogNotes}
                    onChange={(e) => setDialerLogNotes(e.target.value)}
                    rows={4}
                    className="bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-650"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!focusedLeadId}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-xl text-xs transition self-end"
                >
                  Submit Log & Advance CRM status
                </button>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'governance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Vertical Regulatory Constraints (CRUD)</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Industry Name Descriptor</label>
                  <input
                    type="text"
                    value={activeConfig.industryName}
                    onChange={(e) => setVerticalConfigs(prev => ({
                      ...prev,
                      [selectedTenantKey]: { ...prev[selectedTenantKey], industryName: e.target.value }
                    }))}
                    className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Target NAICS Regulatory Codes (Comma Separated)</label>
                  <input
                    type="text"
                    value={activeConfig.naicsCodes.join(', ')}
                    onChange={(e) => setVerticalConfigs(prev => ({
                      ...prev,
                      [selectedTenantKey]: { ...prev[selectedTenantKey], naicsCodes: e.target.value.split(',').map(s => s.trim()) }
                    }))}
                    className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Active Scraper Target Machinery (Comma Separated)</label>
                  <input
                    type="text"
                    value={activeConfig.trackers.join(', ')}
                    onChange={(e) => setVerticalConfigs(prev => ({
                      ...prev,
                      [selectedTenantKey]: { ...prev[selectedTenantKey], trackers: e.target.value.split(',').map(s => s.trim()) }
                    }))}
                    className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-5">
              <div>
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Dynamic Scoring Multipliers Vector</h3>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Proximity Weight (Spatial closeness)</span>
                      <span className="text-indigo-400 font-mono font-bold">{activeConfig.proximityWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeConfig.proximityWeight}
                      onChange={(e) => handleWeightChange('proximityWeight', Number(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Enrichment Completeness Weight (Contacts)</span>
                      <span className="text-indigo-400 font-mono font-bold">{activeConfig.enrichmentWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeConfig.enrichmentWeight}
                      onChange={(e) => handleWeightChange('enrichmentWeight', Number(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Scraper Asset Match Signal Weight (Grounded LLM)</span>
                      <span className="text-indigo-400 font-mono font-bold">{activeConfig.crawlWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeConfig.crawlWeight}
                      onChange={(e) => handleWeightChange('crawlWeight', Number(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {activeConfig.proximityWeight + activeConfig.enrichmentWeight + activeConfig.crawlWeight !== 100 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs text-center">
                  ⚠️ Score Vector mismatch: Weights sum to <strong>{activeConfig.proximityWeight + activeConfig.enrichmentWeight + activeConfig.crawlWeight}%</strong>. It is recommended to balance weights to exactly 100% for normalization accuracy.
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs text-center">
                  ✅ Vector Balanced: Scoring parameters are properly normalized at exactly 100%.
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Observability Diagnostics</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Average API Execution Latency</span>
                    <h4 className="text-2xl font-bold font-mono mt-1 text-slate-100">{aggregatedMetrics.meanLatency} ms</h4>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Accumulated API Token Fees</span>
                    <h4 className="text-2xl font-bold font-mono mt-1 text-indigo-400">${aggregatedMetrics.totalSystemCost.toFixed(5)}</h4>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={fetchTelemetry}
                  className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Refresh Telemetry from API
                </button>

                <button
                  onClick={() => triggerDiscoverySync()}
                  className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Run Discovery Sync
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Headless API Execution Logs</h3>
              </div>

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3 font-semibold">Timestamp</th>
                      <th className="pb-3 font-semibold">Microservice</th>
                      <th className="pb-3 font-semibold">Execution Tracing Action</th>
                      <th className="pb-3 font-semibold">Latency</th>
                      <th className="pb-3 font-semibold">Cost</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {telemetryLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-850/40 transition">
                        <td className="py-3 text-slate-500">{log.timestamp}</td>
                        <td className={`py-3 font-bold ${
                          log.providerName === 'gemini_grounding' ? 'text-indigo-400' :
                          log.providerName === 'google_places' ? 'text-amber-400' :
                          log.providerName === 'apollo' ? 'text-blue-400' :
                          'text-slate-400'
                        }`}>{log.providerName}</td>
                        <td className="py-3 text-slate-300">{log.action}</td>
                        <td className="py-3 text-slate-400">{log.latencyMs}ms</td>
                        <td className="py-3 text-slate-400">${log.cost.toFixed(5)}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {log.isSuccess ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Index Intelligence Engine. Underpinned by Supabase RLS boundaries, Google Maps Search APIs, and Grounded Gemini Scraper pipelines.</p>
      </footer>

    </div>
  );
}
