'use client';

const properties = [
  { address: '1243 Oak St', city: 'Houston', type: 'Commercial', built: 1986, units: 1, score: 92, status: 'Active' },
  { address: '890 Pine Ave', city: 'Houston', type: 'Multifamily', built: 1972, units: 24, score: 88, status: 'Active' },
  { address: '567 Elm Dr', city: 'Austin', type: 'Commercial', built: 1995, units: 1, score: 85, status: 'Active' },
  { address: '234 Maple Ct', city: 'Dallas', type: 'Commercial', built: 2001, units: 1, score: 79, status: 'Monitoring' },
  { address: '901 Birch Ln', city: 'San Antonio', type: 'Industrial', built: 1988, units: 1, score: 74, status: 'Monitoring' },
  { address: '135 Cedar Rd', city: 'Houston', type: 'Commercial', built: 1978, units: 1, score: 71, status: 'Active' },
  { address: '246 Walnut Ave', city: 'Austin', type: 'Multifamily', built: 1965, units: 36, score: 68, status: 'Monitoring' },
];

export default function PropertiesPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Properties</h1>
        <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>Add Property</button>
      </div>

      <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 0.5fr 0.5fr', gap: 8, padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Address</span><span>City</span><span>Type</span><span>Built</span><span>Score</span><span>Status</span>
        </div>
        {properties.map(p => (
          <div key={p.address} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 0.5fr 0.5fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, alignItems: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontWeight: 600 }}>{p.address}</span>
            <span style={{ color: '#8B95A5' }}>{p.city}</span>
            <span style={{ color: '#8B95A5' }}>{p.type}</span>
            <span style={{ color: '#8B95A5' }}>{p.built}</span>
            <span style={{ fontWeight: 700, color: p.score >= 80 ? '#36C9C6' : p.score >= 70 ? '#2E86AB' : '#8B95A5' }}>{p.score}</span>
            <span style={{ color: p.status === 'Active' ? '#36C9C6' : '#8B95A5', fontSize: 12 }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
