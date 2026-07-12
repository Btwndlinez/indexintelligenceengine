'use client';

const territories = [
  { name: 'Houston Metro', type: 'County', opportunities: 24, properties: 380, score: 92, status: 'Active' },
  { name: 'Austin Area', type: 'Radius (50mi)', opportunities: 12, properties: 210, score: 85, status: 'Active' },
  { name: 'Dallas-Fort Worth', type: 'County', opportunities: 18, properties: 450, score: 79, status: 'Active' },
  { name: 'San Antonio', type: 'City', opportunities: 8, properties: 140, score: 74, status: 'Monitoring' },
  { name: 'El Paso', type: 'Custom Polygon', opportunities: 3, properties: 65, score: 62, status: 'Exploring' },
];

export default function TerritoriesPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Territories</h1>
        <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>New Territory</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {territories.map(t => (
          <div key={t.name} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: '#5A6577' }}>{t.type}</div>
              </div>
              <div style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: t.status === 'Active' ? 'rgba(54,201,198,0.1)' : 'rgba(139,149,165,0.1)', color: t.status === 'Active' ? '#36C9C6' : '#8B95A5' }}>{t.status}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#8B95A5' }}>
              <span>{t.opportunities} opps</span>
              <span>{t.properties} props</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#2E86AB', marginTop: 8 }}>{t.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
