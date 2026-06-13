'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import SearchFilters from '@/components/company-index/SearchFilters';
import CompanyTable from '@/components/company-index/CompanyTable';
import CallSheet from '@/components/outreach/CallSheet';
import { MOCK_COMPANIES } from '@/lib/mock/companies';
import { Company, SearchFilters as ISearchFilters } from '@/types/company';
import { Globe, Shield, Target, MousePointer2, FileText } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<ISearchFilters>({
    industry: 'Waste Disposal',
    zip: '94544',
    radius: 15
  });
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [isSearching, setIsSearching] = useState(false);
  const [showCallSheet, setShowCallSheet] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      const filtered = MOCK_COMPANIES.filter(c =>
        (c.industry === filters.industry || filters.industry === 'Any') &&
        (c.distance <= filters.radius)
      );
      setCompanies(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleExportCSV = () => {
    const headers = ['Company', 'Industry', 'Distance', 'Phone', 'Email', 'Website'];
    const rows = companies.map(c => [
      c.name, c.industry, `${c.distance} mi`, c.phone, c.email, c.website
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mie_index_${filters.industry.toLowerCase().replace(' ', '_')}.csv`;
    link.click();
  };

  return (
    <div className="dot-grid-bg" style={{ minHeight: '100vh' }}>
      <Header onSearchClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} />

      <section className="hero" id="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Market Intelligence Engine v0.1
        </div>

        <h1>
          Build Proprietary <span>Local Business Indexes</span>
        </h1>

        <p className="hero-sub">
          Enrich records, score opportunities, and generate high-conversion outreach
          campaigns for any local-service market.
        </p>

        <div className="hero-cta">
          <button onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">
            Get Started
          </button>
          <a href="#features" className="btn btn-secondary">
            View Roadmap
          </a>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-label">• Core Functions</div>
        <h2 className="section-title">Automated Market Intelligence</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { icon: <Globe size={20} />, title: 'Enrich Records', desc: 'Auto-populate company data, websites, and emails.' },
            { icon: <Target size={20} />, title: 'Score Opportunities', desc: 'Priority rankings based on proprietary signals.' },
            { icon: <FileText size={20} />, title: 'Call Sheets', desc: 'Instantly generated scripts for rapid outreach.' },
            { icon: <MousePointer2 size={20} />, title: 'Match Marketplace', desc: 'Direct connection between buyers and providers.' },
          ].map((f, i) => (
            <div key={i} className="engine-card">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-red-600 mb-4 w-fit">
                {f.icon}
              </div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="search-section">
        <div className="section-label">• Discovery</div>
        <h2 className="section-title">Search Local Index</h2>

        <SearchFilters
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
        />

        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0d0d0d] rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
            <div className="loading-spinner mb-4" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enriching market records...</p>
          </div>
        ) : (
          <CompanyTable
            companies={companies}
            onGenerateCallSheet={() => setShowCallSheet(true)}
            onExportCSV={handleExportCSV}
          />
        )}
      </section>

      <section className="section" id="roadmap">
        <div className="section-label">• Roadmap</div>
        <h2 className="section-title">Vertical Expansion</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {[
            { phase: '1', title: 'Waste & Recycling', active: true },
            { phase: '2', title: 'Contractors', active: false },
            { phase: '3', title: 'Industrial Services', active: false },
            { phase: '4', title: 'Any Local Service', active: false },
          ].map((p, i) => (
            <div key={i} className={`p-6 rounded-[2rem] border transition-all ${p.active ? 'border-red-600 bg-red-50/10' : 'border-gray-100 dark:border-gray-800'}`}>
              <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Phase {p.phase}</div>
              <h4 className="font-bold text-sm">{p.title}</h4>
              {p.active && <div className="mt-4 text-[10px] font-black text-red-600 uppercase">Live Now</div>}
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand font-black tracking-tighter text-black dark:text-white">
            MARKET INTELLIGENCE ENGINE
          </div>
          <div className="footer-links">
            <span className="text-[10px] font-bold text-gray-400">v0.1.0-alpha</span>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>

      <CallSheet
        isOpen={showCallSheet}
        onClose={() => setShowCallSheet(false)}
        companies={companies}
      />
    </div>
  );
}


