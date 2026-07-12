'use client';

const companies = [
  { name: 'ABC Holdings LLC', type: 'Property Owner', properties: 8, city: 'Houston', score: 92 },
  { name: 'Pine Ridge Management', type: 'Property Manager', properties: 24, city: 'Houston', score: 88 },
  { name: 'Elm Street Partners', type: 'Developer', properties: 5, city: 'Austin', score: 85 },
  { name: 'Maple Properties Inc', type: 'Property Owner', properties: 12, city: 'Dallas', score: 79 },
  { name: 'Cedar Creek Construction', type: 'Contractor', properties: 3, city: 'San Antonio', score: 74 },
  { name: 'Walnut Group Realty', type: 'Developer', properties: 18, city: 'Austin', score: 71 },
  { name: 'Birchwood Trust', type: 'Investor', properties: 9, city: 'Houston', score: 68 },
];

export default function CompaniesPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Companies</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>Add Company</button>
        </div>
      </div>
      <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr', gap: 8, padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Name</span><span>Type</span><span>Properties</span><span>City</span><span>Score</span>
        </div>
        {companies.map(c => (
          <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, alignItems: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontWeight: 600 }}>{c.name}</span>
            <span style={{ color: '#8B95A5' }}>{c.type}</span>
            <span style={{ color: '#8B95A5' }}>{c.properties}</span>
            <span style={{ color: '#8B95A5' }}>{c.city}</span>
            <span style={{ fontWeight: 700, color: c.score >= 80 ? '#36C9C6' : c.score >= 70 ? '#2E86AB' : '#8B95A5' }}>{c.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
