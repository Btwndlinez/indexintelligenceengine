'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, Recycle, Factory, ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Materials', href: '#materials' },
  { label: 'Supply Chain', href: '#supply-chain' },
  { label: 'Tracking', href: '#tracking' },
];

const features = [
  { icon: Recycle, title: 'Material Intelligence', desc: 'Track industrial waste, scrap metal, and medical waste streams from source to processor.' },
  { icon: Factory, title: 'Facility Discovery', desc: 'Find wastewater treatment, scrap yards, and medical waste processors by vertical and region.' },
  { icon: Truck, title: 'Supply Chain Visibility', desc: 'Map supplier → processor → endpoint relationships with full IIE entity graph integration.' },
  { icon: Package, title: 'Material Tracking', desc: 'Monitor material flows, compliance status, and processing capacity across the network.' },
];

export default function MadeFromLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800' : ''}`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">Made From</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-emerald-400 transition">
                {link.label}
              </a>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Material Intelligence for
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Industrial Waste Streams</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Discover, track, and optimize industrial waste, scrap metal, and medical waste processing across the supply chain.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full font-medium transition">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section id="materials" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition">
              <f.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
