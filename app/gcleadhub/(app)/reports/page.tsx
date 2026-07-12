'use client';

export default function ReportsPage() {
  const reports = [
    { title: 'Pipeline Summary', desc: 'Active opportunities by stage and total value', type: 'Standard' },
    { title: 'Territory Performance', desc: 'Opportunity density and win rate by territory', type: 'Standard' },
    { title: 'Opportunity Score Trends', desc: 'Score distribution and movement over time', type: 'Analytics' },
    { title: 'Competitor Activity', desc: 'Projects won by competing contractors', type: 'Intelligence' },
    { title: 'Lead Source Attribution', desc: 'Opportunity origin by signal type and source', type: 'Analytics' },
    { title: 'User Activity Log', desc: 'Team actions, views, and outreach history', type: 'Administration' },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Reports</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {reports.map(r => (
          <div key={r.title} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(46,134,171,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(46,134,171,0.1)', color: '#2E86AB', fontWeight: 600 }}>{r.type}</div>
            </div>
            <p style={{ fontSize: 13, color: '#8B95A5', lineHeight: 1.5 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
