'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Target, Building2, Briefcase, Users, Send, MapPin,
  TrendingUp, Shield, Search, Layers, ArrowRight, Menu, X
} from 'lucide-react';

const navLinks = [
  { label: 'Opportunities', href: '#opportunities' },
  { label: 'Properties', href: '#properties' },
  { label: 'CRM', href: '#crm' },
  { label: 'Outreach', href: '#outreach' },
];

const features = [
  { icon: Target, title: 'Opportunity Engine', desc: 'Every screen, score, and workflow answers one question: where is the next profitable opportunity?' },
  { icon: Building2, title: 'Property Intelligence', desc: 'Properties are evidence sources. Ownership, permits, violations, age, and utility data feed the graph.' },
  { icon: Briefcase, title: 'Company Graph', desc: 'Architects, contractors, suppliers, and management companies — all connected through the IIE entity graph.' },
  { icon: Users, title: 'CRM', desc: 'Pipeline, deals, contacts, tasks, and notes. Belongs entirely to GC Lead Hub — no reason to move it into Core.' },
  { icon: Send, title: 'Multi-Channel Outreach', desc: 'Campaigns, email, SMS, direct mail, and proposal generation — all GC Lead Hub specific.' },
  { icon: TrendingUp, title: 'Predictions', desc: 'Property age + permit velocity + ownership change + hiring activity = probability of renovation.' },
];

export default function GCLeadHubLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#080A0E', color: '#E8EDF2', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        :root { --gcl-blue: #2E86AB; --gcl-teal: #36C9C6; --gcl-surface: #0E121A; --gcl-border: rgba(255,255,255,0.06); --gcl-muted: #8B95A5; }
        .gcl-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; transition: background 0.3s, border-color 0.3s; background: rgba(8,10,14,0.85); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); border-bottom: 1px solid transparent; }
        .gcl-nav.scrolled { background: rgba(8,10,14,0.96); border-bottom-color: var(--gcl-border); }
        .gcl-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; }
        .gcl-btn-primary { background: var(--gcl-blue); color: white; }
        .gcl-btn-primary:hover { background: #267a9e; transform: translateY(-1px); }
        .gcl-btn-ghost { background: transparent; color: var(--gcl-muted); border: 1px solid var(--gcl-border); }
        .gcl-btn-ghost:hover { border-color: var(--gcl-blue); color: var(--gcl-blue); }
        .gcl-card { background: var(--gcl-surface); border: 1px solid var(--gcl-border); border-radius: 16px; padding: 28px; transition: border-color 0.3s, transform 0.3s; }
        .gcl-card:hover { border-color: rgba(46,134,171,0.3); transform: translateY(-2px); }
        @media (max-width: 768px) { .gcl-nav-link { display: none; } }
        .gcl-gradient { background: linear-gradient(135deg, var(--gcl-blue), var(--gcl-teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      <nav className={`gcl-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={22} color="#2E86AB" />
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.03em' }}>GC Lead Hub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              style={{ fontSize: 14, color: scrolled ? '#E8EDF2' : '#8B95A5', transition: 'color 0.2s', textDecoration: 'none' }}
              className="gcl-nav-link"
              onMouseEnter={e => e.currentTarget.style.color = '#E8EDF2'}
              onMouseLeave={e => e.currentTarget.style.color = '#8B95A5'}>{l.label}</a>
          ))}
          <button className="gcl-btn gcl-btn-primary" style={{ marginLeft: 8 }}>Sign In →</button>
        </div>
        <button style={{ display: 'none', background: 'none', border: 'none', color: '#E8EDF2', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <section style={{ padding: '140px 24px 80px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2E86AB', background: 'rgba(46,134,171,0.1)', border: '1px solid rgba(46,134,171,0.2)', padding: '6px 16px', borderRadius: 100, marginBottom: 24 }}>
          Powered by IIE
        </div>
        <h1 className="fade-up delay-1" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
          <span className="gcl-gradient">Opportunity Intelligence</span><br />
          Built on the IIE Graph
        </h1>
        <p className="fade-up delay-2" style={{ fontSize: 18, color: '#8B95A5', maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Properties are one evidence source. Companies, permits, code violations, ownership changes, 
          contractor activity, and cross-vertical signals all feed a unified opportunity graph. 
          <strong style={{ color: '#E8EDF2' }}> Every screen answers one question: where is the next profitable opportunity, and why do we believe it&apos;s emerging?</strong>
        </p>
        <div className="fade-up delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="gcl-btn gcl-btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>Find Opportunities →</button>
          <button className="gcl-btn gcl-btn-ghost" style={{ padding: '14px 32px', fontSize: 15 }}>Watch Demo</button>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={f.title} className="gcl-card fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <f.icon size={22} color="#2E86AB" style={{ marginBottom: 14 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#8B95A5', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#0E121A', borderTop: '1px solid var(--gcl-border)', borderBottom: '1px solid var(--gcl-border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Graph-Built Opportunities</h2>
            <p style={{ color: '#8B95A5', fontSize: 15 }}>Opportunities emerge from relationships, not single data points.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, fontSize: 14 }}>
            {[
              ['Property', '→', 'Owner', '→', 'LLC', '→', 'Opportunity'],
              ['Company', '→', 'Permit', '→', 'Inspection', '→', 'Opportunity'],
              ['Contractor', '→', 'Equipment', '→', 'Project', '→', 'Opportunity'],
              ['HHR Disposal', '→', 'Concrete Removal', '→', 'Project Site', '→', 'Opportunity'],
            ].map((row, i) => (
              <div key={i} className="gcl-card fade-up" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 20px', animationDelay: `${0.1 * i}s`, flexWrap: 'wrap' }}>
                {row.map((item, j) => (
                  j % 2 === 0
                    ? <span key={j} style={{ fontWeight: 600, color: item === 'Opportunity' ? '#36C9C6' : '#2E86AB' }}>{item}</span>
                    : <span key={j} style={{ color: '#5A6577' }}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          <div className="gcl-card">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2E86AB', marginBottom: 8 }}>Core Score</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>78</div>
            <div style={{ fontSize: 13, color: '#8B95A5' }}>
              Evidence · Confidence · Graph Strength · Freshness · Trust · Signal Weight
            </div>
          </div>
          <div className="gcl-card">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#36C9C6', marginBottom: 8 }}>Product Score</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>91</div>
            <div style={{ fontSize: 13, color: '#8B95A5' }}>
              Revenue · Contractor Fit · Urgency · Win Probability · ROI · Competition
            </div>
          </div>
          <div className="gcl-card">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8B95A5', marginBottom: 8 }}>Signal Sources</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#C8D0DC' }}>
              Property Age · Permit Velocity · Ownership Change · Code Violations · Utility Usage · Business Expansion · Hiring Activity · Nearby Projects
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--gcl-border)', padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#5A6577' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Target size={16} color="#2E86AB" />
          <span style={{ fontWeight: 600, color: '#8B95A5' }}>GC Lead Hub</span>
          <span style={{ color: '#5A6577' }}>·</span>
          <span>Opportunity Intelligence on IIE</span>
        </div>
        <p>Properties are evidence. The graph finds the opportunity.</p>
      </footer>
    </div>
  );
}
