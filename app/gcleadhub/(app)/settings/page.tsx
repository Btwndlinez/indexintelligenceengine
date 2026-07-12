'use client';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile', items: ['Name: Rodger Contractor', 'Email: rodger@contractor.com', 'Phone: (713) 555-0100', 'Company: Rodger & Sons Construction'] },
    { title: 'Preferences', items: ['Default Territory: Houston Metro', 'Default View: Dashboard', 'Language: English', 'Theme: Dark'] },
    { title: 'Notifications', items: ['Email: Daily Briefing only', 'SMS: High-value opportunities', 'Push: Enabled', 'In App: All events'] },
    { title: 'Team', items: ['2 Admin · 5 Agents · 3 Viewers', 'Invite: + Add Team Member'] },
    { title: 'Billing', items: ['Plan: Professional', 'Status: Active', 'Next Billing: Aug 1, 2026', '$149/mo'] },
    { title: 'API', items: ['API Key: gclh_••••••••••••••••', 'Rate Limit: 1,000 req/hr', 'Webhooks: 2 configured'] },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Settings</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', marginBottom: 12 }}>{s.title}</div>
            {s.items.map(item => (
              <div key={item} style={{ padding: '6px 0', fontSize: 14, color: '#8B95A5', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
