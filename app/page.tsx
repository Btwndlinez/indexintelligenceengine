'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const FacilitySearchModal = dynamic(() => import('@/components/FacilitySearchModal'), { ssr: false })
const FacilityVerificationBoard = dynamic(() => import('@/components/FacilityVerificationBoard'), { ssr: false })
const FacilityDirectory = dynamic(() => import('@/components/FacilityDirectory'), { ssr: false })
const MarketIntelligenceDashboard = dynamic(() => import('@/components/MarketIntelligenceDashboard'), { ssr: false })
const OutreachTemplateLibrary = dynamic(() => import('@/components/OutreachTemplateLibrary'), { ssr: false })

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
)

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showSearch, setShowSearch] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('dashboard')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'dark') setTheme('dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('dip-theme', next)
  }

  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'search', label: 'Search' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'call-sheets', label: 'Call Sheets' },
  ]

  return (
    <div className="dot-grid-bg" style={{ minHeight: '100vh' }}>

      <nav className="site-nav" id="main-nav">
        <div className="nav-logo">
          <div className="nav-logo-icon nav-logo-icon-red">
            <LogoIcon />
          </div>
          <span>DIP</span>
        </div>

        <div className="nav-links">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="nav-link" onClick={() => setActiveSection(s.id)}>
              {s.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            id="theme-toggle"
          >
            <div className="theme-toggle-knob">
              {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            </div>
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="btn btn-primary"
            id="find-facility-btn"
          >
            Find Facility
          </button>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          1,420+ Facilities Verified
        </div>

        <h1>
          Find Verified Disposal <span>Facilities Fast</span>
        </h1>

        <p className="hero-sub">
          Locate verified slurry disposal facilities by city, radius, material type,
          operating hours, and distance. Before your trucks leave the jobsite.
        </p>

        <div className="hero-cta">
          <button onClick={() => setShowSearch(true)} className="btn btn-primary" id="hero-cta-primary">
            + Start Discovery
          </button>
          <a href="#facilities" className="btn btn-secondary" id="hero-cta-secondary">
            Browse Directory
          </a>
        </div>

        <p className="hero-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          The industry standard for construction waste disposal intelligence
        </p>
      </section>

      <section className="section" id="workflow">
        <div className="section-label">• How It Works</div>
        <h2 className="section-title">Verified Disposal in 4 Steps</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {[
            { step: '1', title: 'Search', desc: 'Enter job location and material type to find local disposal options' },
            { step: '2', title: 'Discover', desc: 'AI-assisted indexing finds facilities that aren\'t listed on public maps' },
            { step: '3', title: 'Verify', desc: 'Confirm capacity, pricing, and operating hours via our outreach engine' },
            { step: '4', title: 'Dispose', desc: 'Get approval and route trucks to the most cost-effective facility' },
          ].map((item, i) => (
            <div key={i} className="engine-card" style={{ cursor: 'default', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent)', marginBottom: '16px' }}>{item.step}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="usecases">
        <div className="section-label">• Use Cases</div>
        <h2 className="section-title">Slurry Disposal Intelligence</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {[
            { title: 'Concrete Slurry', desc: 'Find facilities equipped to handle high-pH concrete wastewater and solids.' },
            { title: 'Asphalt Slurry', desc: 'Locate recycling centers specialized in asphalt grindings and slurry waste.' },
            { title: 'Mixed Construction Waste', desc: 'Route loads containing mixed materials to the appropriate processing plants.' },
          ].map((item, i) => (
            <div key={i} className="engine-card" style={{ cursor: 'default' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="dashboard">
        <div className="section-label">• Dashboard</div>
        <h2 className="section-title">Market Intelligence</h2>
        <MarketIntelligenceDashboard />
      </section>

      <section className="section" id="search">
        <div className="section-label">• Verification Pipeline</div>
        <h2 className="section-title">Facility Lifecycle</h2>
        <FacilityVerificationBoard />
      </section>

      <section className="section" id="facilities">
        <div className="section-label">• Facility Directory</div>
        <h2 className="section-title">Verified Locations</h2>
        <FacilityDirectory />
      </section>

      <section className="section" id="call-sheets">
        <div className="section-label">• Call Sheets</div>
        <h2 className="section-title">Verification Scripts</h2>
        <OutreachTemplateLibrary />
      </section>

      <section className="section" id="marketplace" style={{ textAlign: 'center' }}>
        <div className="section-label">• COMING SOON</div>
        <h2 className="section-title">Disposal Marketplace</h2>
        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          We're building a real-time marketplace where facilities can bid on your waste transportation contracts.
        </p>
        <div className="hero-cta" style={{ justifyContent: 'center' }}>
          <a href="#" className="btn btn-primary">Join Marketplace Waitlist</a>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo-icon nav-logo-icon-red" style={{ width: 22, height: 22 }}>
              <LogoIcon />
            </div>
            Disposal Intelligence Platform
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#workflow" className="footer-link">How It Works</a>
            <span className="footer-link" style={{ cursor: 'default' }}>© 2026</span>
          </div>
        </div>
      </footer>

      <FacilitySearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </div>
  )
}
