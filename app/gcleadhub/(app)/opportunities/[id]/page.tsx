'use client';

import { useParams, useRouter } from 'next/navigation';

export default function OpportunityWorkspacePage() {
  const params = useParams();
  const id = params.id as string;

  const scoreBars = [
    { label: 'Evidence Score', value: 82, color: '#2E86AB' },
    { label: 'Confidence Score', value: 91, color: '#2E86AB' },
    { label: 'Revenue Score', value: 76, color: '#36C9C6' },
    { label: 'Urgency Score', value: 88, color: '#36C9C6' },
    { label: 'Win Probability', value: 64, color: '#36C9C6' },
  ];

  const evidenceItems = [
    { source: 'County Permit', label: 'Building permit #2024-08921 filed 6mo ago', confidence: 96 },
    { source: 'Assessor Record', label: 'Property assessed at $1.2M, last appraisal 2022', confidence: 94 },
    { source: 'Satellite Imagery', label: 'Roof shows visible wear, estimated age 18+ years', confidence: 88 },
    { source: 'Code Violation', label: 'Fire system citation issued 45 days ago', confidence: 91 },
    { source: 'Utility Data', label: 'Water usage dropped 40% over 3 months', confidence: 78 },
  ];

  const tasks = [
    { text: 'Call property owner', done: false },
    { text: 'Schedule site visit', done: false },
    { text: 'Pull permit history', done: true },
    { text: 'Review lien status', done: false },
    { text: 'Prepare preliminary estimate', done: true },
  ];

  return (
    <div style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => window.history.back()} style={{ padding: '6px 10px', borderRadius: 6, background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', color: '#8B95A5', cursor: 'pointer', fontSize: 13 }}>← Back</button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577' }}>Opportunity {id}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 240px', gap: 16, flex: 1, minHeight: 0 }}>
        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, overflowY: 'auto' }}>
          <SectionTitle>Property Summary</SectionTitle>
          <InfoRow label="Address" value="1243 Oak Street" />
          <InfoRow label="Parcel" value="12-345-6789" />
          <InfoRow label="Zoning" value="C-2 Commercial" />
          <InfoRow label="Built" value="1986" />
          <InfoRow label="Sq Ft" value="24,000" />
          <Divider />
          <SectionTitle>Owner</SectionTitle>
          <InfoRow label="Name" value="ABC Holdings LLC" />
          <InfoRow label="Contact" value="since 2019" />
          <Divider />
          <SectionTitle>Contacts</SectionTitle>
          {['Jane Smith (Owner)', 'Mark Jones (PM)', 'Lisa Ray (Tenant)'].map(c => (
            <div key={c} style={{ fontSize: 13, color: '#E8EDF2', padding: '4px 0' }}>{c}</div>
          ))}
        </div>

        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, overflowY: 'auto' }}>
          <SectionTitle>AI Summary</SectionTitle>
          <p style={{ fontSize: 13, color: '#8B95A5', lineHeight: 1.6, marginBottom: 16 }}>
            Commercial property likely undergoing deferred maintenance. Recent permit activity, water usage decline, and fire code citation suggest owner is preparing for renovation or sale. Previous contractor relationships indicate preference for negotiated work. Estimated project value $80K–$160K.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#5A6577', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Opportunity Score</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#36C9C6' }}>88</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#5A6577', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Revenue Estimate</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#36C9C6' }}>$120K</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#5A6577', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Risk Score</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2E86AB' }}>32</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#5A6577', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Confidence</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2E86AB' }}>91%</div>
            </div>
          </div>

          <SectionTitle>Evidence</SectionTitle>
          {evidenceItems.map(e => (
            <div key={e.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#E8EDF2' }}>{e.label}</div>
                <div style={{ fontSize: 11, color: '#5A6577' }}>{e.source}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: e.confidence >= 90 ? '#36C9C6' : e.confidence >= 80 ? '#2E86AB' : '#8B95A5' }}>{e.confidence}%</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, overflowY: 'auto' }}>
          <SectionTitle>Tasks</SectionTitle>
          {tasks.map(t => (
            <label key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13, color: t.done ? '#5A6577' : '#E8EDF2', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={t.done} style={{ accentColor: '#2E86AB' }} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </label>
          ))}
          <Divider />
          <SectionTitle>Activity</SectionTitle>
          {[
            { text: 'Owner viewed opportunity', time: '1h ago' },
            { text: 'Permit history pulled', time: '3h ago' },
            { text: 'AI analysis completed', time: '5h ago' },
          ].map(a => (
            <div key={a.text} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
              <div style={{ color: '#E8EDF2' }}>{a.text}</div>
              <div style={{ color: '#5A6577', fontSize: 11 }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', marginBottom: 8, marginTop: 4 }}>{children}</div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}><span style={{ color: '#5A6577' }}>{label}</span><span style={{ color: '#E8EDF2' }}>{value}</span></div>;
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0' }} />;
}
