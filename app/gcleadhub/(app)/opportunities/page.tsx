'use client';

import Link from 'next/link';

const opportunities = [
  { id: 'OPP-001', property: '1243 Oak St', owner: 'ABC Holdings', type: 'Commercial Remodel', score: 92, value: '$120K', stage: 'Scored', confidence: 94, distance: '2.3 mi', updated: '2h ago' },
  { id: 'OPP-002', property: '890 Pine Ave', owner: 'Pine Ridge LLC', type: 'Multifamily Renovation', score: 88, value: '$340K', stage: 'Validated', confidence: 87, distance: '5.1 mi', updated: '4h ago' },
  { id: 'OPP-003', property: '567 Elm Dr', owner: 'Elm Street Partners', type: 'ADA Compliance', score: 85, value: '$65K', stage: 'Scored', confidence: 91, distance: '0.8 mi', updated: '1d ago' },
  { id: 'OPP-004', property: '234 Maple Ct', owner: 'Maple Properties Inc', type: 'Roof Replacement', score: 79, value: '$48K', stage: 'Detected', confidence: 76, distance: '3.4 mi', updated: '1d ago' },
  { id: 'OPP-005', property: '901 Birch Ln', owner: 'Birchwood Trust', type: 'HVAC Upgrade', score: 74, value: '$32K', stage: 'Detected', confidence: 72, distance: '6.2 mi', updated: '2d ago' },
  { id: 'OPP-006', property: '135 Cedar Rd', owner: 'Cedar Creek Mgmt', type: 'Fire System Retrofit', score: 71, value: '$89K', stage: 'Validated', confidence: 80, distance: '1.1 mi', updated: '2d ago' },
  { id: 'OPP-007', property: '246 Walnut Ave', owner: 'Walnut Group', type: 'Electrical Upgrade', score: 68, value: '$55K', stage: 'Detected', confidence: 65, distance: '4.0 mi', updated: '3d ago' },
];

const stageColors: Record<string, string> = {
  Detected: '#8B95A5', Validated: '#2E86AB', Scored: '#E8EDF2',
};

const sortOptions = ['Opportunity Score', 'Estimated Revenue', 'Distance', 'Project Urgency', 'Recently Updated'];
const displayModes = ['Cards', 'Table'];

export default function OpportunitiesPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Opportunities</h1>
          <p style={{ fontSize: 13, color: '#8B95A5' }}>{opportunities.length} opportunities found</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>New Opportunity</button>
          <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#0E121A', color: '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>Export</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', display: 'flex', alignItems: 'center', padding: '0 4px' }}>Sort:</div>
        {sortOptions.map(s => (
          <button key={s} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: s === 'Opportunity Score' ? 'rgba(46,134,171,0.12)' : 'rgba(255,255,255,0.03)', color: s === 'Opportunity Score' ? '#2E86AB' : '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {opportunities.map(o => (
          <Link key={o.id} href={`/gcleadhub/opportunities/${o.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 300, background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(46,134,171,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{o.property}</div>
                  <div style={{ fontSize: 12, color: '#8B95A5' }}>{o.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: o.score >= 80 ? '#36C9C6' : o.score >= 70 ? '#2E86AB' : '#8B95A5' }}>{o.score}</div>
                  <div style={{ fontSize: 10, color: '#5A6577' }}>SCORE</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#8B95A5', marginBottom: 10 }}>
                <span>{o.value}</span>
                <span>·</span>
                <span>{o.distance}</span>
                <span>·</span>
                <span style={{ color: stageColors[o.stage] || '#8B95A5', fontWeight: 600 }}>{o.stage}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5A6577', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span>Confidence: {o.confidence}%</span>
                <span>{o.updated}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
