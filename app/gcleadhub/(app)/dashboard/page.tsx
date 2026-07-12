'use client';

export default function DashboardPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(46,134,171,0.1), rgba(54,201,198,0.08))', border: '1px solid rgba(46,134,171,0.2)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#36C9C6', marginBottom: 4 }}>Daily Briefing</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Good Morning, Rodger</h1>
        <p style={{ fontSize: 14, color: '#8B95A5', marginBottom: 20 }}>Here&apos;s what changed since yesterday.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'New Opportunities', value: '+14', color: '#36C9C6' },
            { label: 'High Probability Remodels', value: '3', color: '#2E86AB' },
            { label: 'Buildings Sold', value: '2', color: '#E8EDF2' },
            { label: 'New Permits', value: '7', color: '#8B95A5' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#8B95A5' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: '#8B95A5' }}>Estimated Pipeline:</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#36C9C6' }}>$4.2M</div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Call ABC Holdings', 'Visit Industrial Park', 'Bid School Renovation'].map(a => (
            <button key={a} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>{a} →</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Opportunities', value: '47', sub: '+12 this week' },
          { label: 'Win Rate', value: '34%', sub: '+2% vs last month' },
          { label: 'Avg. Project Value', value: '$87K', sub: '±$12K range' },
          { label: 'Territories Covered', value: '6', sub: '3 with new activity' },
        ].map(w => (
          <div key={w.label} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, color: '#8B95A5', marginBottom: 4 }}>{w.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 2 }}>{w.value}</div>
            <div style={{ fontSize: 12, color: '#36C9C6' }}>{w.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: 300 }}>
        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: '#E8EDF2' }}>Opportunity Feed</div>
          {[
            { prop: '1243 Oak St', type: 'Commercial Remodel', score: 92, value: '$120K' },
            { prop: '890 Pine Ave', type: 'Multifamily Renovation', score: 88, value: '$340K' },
            { prop: '567 Elm Dr', type: 'ADA Compliance', score: 85, value: '$65K' },
            { prop: '234 Maple Ct', type: 'Roof Replacement', score: 79, value: '$48K' },
            { prop: '901 Birch Ln', type: 'HVAC Upgrade', score: 74, value: '$32K' },
          ].map(o => (
            <div key={o.prop} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(46,134,171,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#2E86AB' }}>{o.score}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{o.prop}</div>
                <div style={{ fontSize: 12, color: '#8B95A5' }}>{o.type}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#36C9C6' }}>{o.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: '#E8EDF2' }}>Upcoming Follow-ups</div>
          {[
            { label: 'Call ABC Holdings', date: 'Today, 2pm' },
            { label: 'Site Visit: 1243 Oak', date: 'Tomorrow, 10am' },
            { label: 'Proposal Due: School', date: 'Jul 15' },
            { label: 'Review Permits: Elm', date: 'Jul 16' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
              <span style={{ color: '#E8EDF2' }}>{f.label}</span>
              <span style={{ color: '#5A6577' }}>{f.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
