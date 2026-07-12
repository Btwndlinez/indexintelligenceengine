'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = [
    { type: 'Opportunity', title: '1243 Oak St — Commercial Remodel', score: 92, value: '$120K', snippet: 'Property recently filed permit #2024-08921. Water usage declined 40%. Fire code citation active.' },
    { type: 'Opportunity', title: '890 Pine Ave — Multifamily Renovation', score: 88, value: '$340K', snippet: '24-unit complex. Multiple deferred maintenance flags. Ownership change detected 6 months ago.' },
    { type: 'Property', title: '1243 Oak Street', subtitle: 'Houston, TX 77001', snippet: 'Commercial · 24,000 SF · Built 1986 · Zoned C-2 · Assessed $1.2M' },
    { type: 'Property', title: '567 Elm Drive', subtitle: 'Austin, TX 73301', snippet: 'Commercial · 12,000 SF · Built 1995 · Zoned C-3 · Assessed $680K' },
    { type: 'Company', title: 'ABC Holdings LLC', subtitle: 'Houston, TX', snippet: 'Property Owner · 8 properties · 4 active opportunities · Avg score 87' },
    { type: 'Contact', title: 'Jane Smith', subtitle: 'Owner at ABC Holdings', snippet: 'jane@abcholdings.com · (713) 555-0142 · Houston' },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Search Results</h1>
      {query && <p style={{ fontSize: 14, color: '#8B95A5', marginBottom: 20 }}>Showing results for &ldquo;{query}&rdquo; · {results.length} matches</p>}
      {!query && <p style={{ fontSize: 14, color: '#8B95A5', marginBottom: 20 }}>Enter a search term to find properties, companies, contacts, and opportunities.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.map(r => (
          <div key={r.title} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(46,134,171,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2E86AB', background: 'rgba(46,134,171,0.08)', padding: '2px 6px', borderRadius: 4 }}>{r.type}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</span>
              </div>
              {'score' in r && <span style={{ fontSize: 16, fontWeight: 800, color: '#36C9C6' }}>{r.score}</span>}
            </div>
            {'subtitle' in r && <div style={{ fontSize: 12, color: '#5A6577', marginBottom: 4 }}>{(r as any).subtitle}</div>}
            <p style={{ fontSize: 13, color: '#8B95A5', lineHeight: 1.5 }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, color: '#8B95A5' }}>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
