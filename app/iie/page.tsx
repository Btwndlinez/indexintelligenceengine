'use client';

import { useState, useEffect } from 'react';
import { Search, Building2, Truck, Factory, ArrowRight, Menu, X, Layers } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Verticals', href: '#verticals' },
  { label: 'Architecture', href: '#architecture' },
];

const verticals = [
  { name: 'Hard Hat Required', domain: 'hardhatrequired.com', desc: 'Construction & contractor intelligence', icon: Building2 },
  { name: 'Sparky Wiz', domain: 'sparkywiz.com', desc: 'Electrical contractor intelligence', icon: Search },
  { name: 'GC Lead Hub', domain: 'gcleadhub.com', desc: 'Opportunity intelligence for general contractors', icon: Layers },
  { name: 'Made From', domain: 'madefrom.us', desc: 'Industrial waste & material intelligence', icon: Factory },
];

export default function IIESiteLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200' : ''}`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">IIE</span>
            </div>
            <span className="font-bold text-lg">Index Intelligence Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition">
                {link.label}
              </a>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-600" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            One Platform.
            <span className="block text-slate-500">Many Verticals.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            The Index Intelligence Engine powers a family of industry-specific intelligence products —
            each with its own domain, branding, and UX, all running on shared infrastructure.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition">
            Explore Verticals <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section id="verticals" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">IIE Vertical Products</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {verticals.map((v) => (
              <a
                key={v.domain}
                href={`https://${v.domain}`}
                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-900 hover:shadow-lg transition"
              >
                <v.icon className="w-10 h-10 text-slate-900 mb-4" />
                <h3 className="text-xl font-bold mb-1">{v.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{v.desc}</p>
                <code className="text-xs text-slate-400">{v.domain}</code>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 mt-4 transition" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4 text-left text-slate-600">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">1</span>
              <p>User visits a product domain (e.g., hardhatrequired.com)</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">2</span>
              <p>Next.js middleware resolves the domain → tenant slug → product manifest</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">3</span>
              <p>Runtime loads the product's manifest, verticals, branding, and navigation</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">4</span>
              <p>Shared IIE Core handles search, providers, graph, scoring, auth, and telemetry</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">5</span>
              <p>User sees a fully branded product — no knowledge of the underlying platform</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>Index Intelligence Engine — One deployment. Many products.</p>
        </div>
      </footer>
    </div>
  );
}
