'use client';

import { useState, useEffect } from 'react';
import { Zap, Search, Database, Target, TrendingUp, Menu, X, ArrowRight, Check, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const navLinks = [
  { label: 'Product', href: '#engines' },
  { label: 'Features', href: '#verticals' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
];

const metrics = [
  { value: '48', label: 'Markets Indexed' },
  { value: '2.4M', label: 'Companies Scored' },
  { value: '18K', label: 'Campaigns' },
  { value: '94.2%', label: 'Accuracy' },
];

const engines = [
  { icon: Search, title: 'Discovery Engine', desc: 'Search across 8+ verticals with geo-intelligence and intent signals.' },
  { icon: Database, title: 'Enrichment Engine', desc: 'Auto-populate company data, emails, and decision-maker contacts.' },
  { icon: Target, title: 'Scoring Engine', desc: 'Priority rankings based on revenue, fleet, and buying signals.' },
  { icon: TrendingUp, title: 'Campaign Engine', desc: 'Deploy outreach campaigns and track every touchpoint to close.' },
];

const verticals = [
  { name: 'Waste', status: 'Live' },
  { name: 'Construction', status: 'Beta' },
  { name: 'Industrial', status: 'Beta' },
  { name: 'Energy', status: 'Q3 2026' },
  { name: 'Hospitality', status: 'Q4 2026' },
  { name: 'Events', status: 'Q4 2026' },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full h-20 border-b z-50 transition-all duration-300 ${scrolled ? 'border-border bg-bg/80 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red rounded-xl flex items-center justify-center shadow-lg shadow-red/25">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none">IIE</span>
              <span className="text-[9px] font-medium text-muted tracking-wider uppercase">Intelligence Engine</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors rounded-lg hover:bg-surface2">{link.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors rounded-lg hover:bg-surface2">Login</Link>
            <a href="#cta" className="px-5 py-2.5 bg-red text-white text-sm font-semibold rounded-xl hover:bg-red/90 transition-all shadow-lg shadow-red/20">Book Demo</a>
          </div>

          <button className="md:hidden p-2.5 rounded-xl hover:bg-surface2 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-surface border-t border-border px-6 lg:px-8 py-6 space-y-2">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="block px-4 py-3 text-sm text-muted hover:bg-surface2 rounded-xl" onClick={() => setMobileOpen(false)}>{link.label}</a>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link href="/dashboard" className="px-4 py-3 text-sm text-muted hover:bg-surface2 rounded-xl">Login</Link>
              <a href="#cta" className="text-center px-4 py-3 bg-red text-white text-sm font-semibold rounded-xl">Book Demo</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen pt-32 pb-24 lg:pt-44 lg:pb-36">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface2 border border-border text-muted text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
                </span>
                INDEX INTELLIGENCE ENGINE
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tight leading-[1.05]">
                Build Proprietary{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red to-orange-500">
                  Market Intelligence
                </span>
                <br />
                <span className="text-muted">Systems</span>
              </h1>

              <div className="space-y-3 text-lg text-muted">
                <p className="flex items-center gap-3"><Search className="w-5 h-5 text-red" /> Search markets.</p>
                <p className="flex items-center gap-3"><Database className="w-5 h-5 text-red" /> Enrich companies.</p>
                <p className="flex items-center gap-3"><Target className="w-5 h-5 text-red" /> Score opportunities.</p>
                <p className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-red" /> Deploy outreach.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/dashboard" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-red text-white font-semibold rounded-2xl hover:bg-red/90 transition-all shadow-xl shadow-red/25">
                  Start Index <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#cta" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-surface2 text-text font-semibold rounded-2xl border border-border hover:bg-border transition-all">
                  Book Demo
                </a>
              </div>
            </div>

            {/* Animated Pipeline */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-red/10 via-blue/5 to-transparent rounded-[40px] blur-3xl" />
              <div className="relative bg-surface border border-border rounded-3xl p-8 space-y-4">
                {[
                  { label: 'Google Places', color: 'text-blue', desc: 'Geo-intelligence' },
                  { label: 'Apollo', color: 'text-green', desc: 'Contact enrichment' },
                  { label: 'DeepSeek', color: 'text-yellow', desc: 'Signal detection' },
                  { label: 'IIE Engine', color: 'text-red', desc: 'Scoring + dedup' },
                  { label: 'Campaign Engine', color: 'text-text', desc: 'Outreach deployment' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface2 border border-border group hover:border-border/80 transition-all">
                      <div className={`w-2 h-2 rounded-full bg-current ${item.color}`} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-muted">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </div>
                    {i < 4 && <div className="absolute -bottom-3 left-6 w-px h-3 bg-border" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE METRICS */}
      <section className="py-16 border-y border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="text-center p-8 rounded-3xl bg-surface border border-border hover:border-border/80 transition-all">
                <div className="text-4xl lg:text-5xl font-black text-text mb-2">{m.value}</div>
                <div className="text-sm text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE ENGINES */}
      <section id="engines" className="py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface2 border border-border text-muted text-xs font-semibold mb-6">
              <Layers className="w-3 h-3" />
              Core Engines
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything You Need to{' '}
              <span className="text-muted">Dominate</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {engines.map((e) => (
              <div key={e.title} className="group p-8 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-surface2 border border-border flex items-center justify-center mb-6 group-hover:border-red/30 transition-all">
                  <e.icon className="w-6 h-6 text-muted group-hover:text-red transition-colors" />
                </div>
                <h3 className="font-bold text-xl mb-3">{e.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section id="verticals" className="py-24 border-y border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface2 border border-border text-muted text-xs font-semibold mb-6">
              <Layers className="w-3 h-3" />
              Vertical Expansion
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red to-orange-500">Any Industry</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verticals.map((v) => (
              <div key={v.name} className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                v.status === 'Live'
                  ? 'border-red/30 bg-red/5'
                  : 'border-border bg-surface hover:border-border/80'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg">{v.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    v.status === 'Live' ? 'bg-red text-white' : 'bg-surface2 text-muted'
                  }`}>
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-red/5 via-blue/5 to-transparent rounded-[40px] blur-3xl" />
            <div className="relative bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow/60" />
                  <div className="w-3 h-3 rounded-full bg-green/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 bg-surface rounded-lg text-[11px] text-muted font-mono">
                    app.indexintelligence.io/dashboard
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[{ l: 'Markets', v: '48' }, { l: 'Companies', v: '2.4M' }, { l: 'Campaigns', v: '18K' }, { l: 'Accuracy', v: '94.2%' }].map((k) => (
                    <div key={k.l} className="p-4 rounded-xl bg-surface2 border border-border">
                      <div className="text-[10px] text-muted uppercase tracking-wider mb-1">{k.l}</div>
                      <div className="text-xl font-bold">{k.v}</div>
                    </div>
                  ))}
                </div>
                <div className="h-48 rounded-xl bg-surface2 border border-border p-6 flex items-end justify-around gap-2">
                  {[45, 65, 52, 85, 70, 92, 82, 75, 88, 95, 78, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-red to-red/60 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red/5 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Start Building{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red to-orange-500">Your Index</span>
          </h2>
          <p className="text-xl text-muted mb-10 max-w-xl mx-auto">
            Book a 20-minute demo. We'll map your market live and show you exactly where the revenue is hiding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:demo@indexintelligence.io" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red text-white font-semibold rounded-2xl hover:bg-red/90 transition-all shadow-xl shadow-red/25">
              Book Demo <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface2 text-text font-semibold rounded-2xl border border-border hover:bg-border transition-all">
              Get Access
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-bold tracking-tight">IIE</span>
            </div>
            <div className="text-xs text-muted">© 2026 Index Intelligence Engine. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
