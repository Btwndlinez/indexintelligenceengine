'use client';

const contacts = [
  { name: 'Jane Smith', title: 'Owner', company: 'ABC Holdings LLC', email: 'jane@abcholdings.com', phone: '(713) 555-0142', city: 'Houston' },
  { name: 'Mark Jones', title: 'Property Manager', company: 'Pine Ridge Mgmt', email: 'mjones@pineridge.com', phone: '(713) 555-0187', city: 'Houston' },
  { name: 'Robert Chen', title: 'Facilities Director', company: 'Elm Street Partners', email: 'rchen@elmpartners.com', phone: '(512) 555-0234', city: 'Austin' },
  { name: 'Lisa Ray', title: 'Tenant Contact', company: 'Ray Commercial', email: 'lray@raycom.com', phone: '(713) 555-0341', city: 'Houston' },
  { name: 'David Park', title: 'Architect', company: 'Park Designs Studio', email: 'david@parkdesigns.com', phone: '(214) 555-0456', city: 'Dallas' },
];

export default function ContactsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Contacts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(46,134,171,0.12)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.2)', cursor: 'pointer' }}>Import Contacts</button>
          <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#0E121A', color: '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>Add Contact</button>
        </div>
      </div>
      <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr 1fr', gap: 8, padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Name</span><span>Title</span><span>Email</span><span>Phone</span><span>City</span>
        </div>
        {contacts.map(c => (
          <div key={c.email} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr 1fr', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, alignItems: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontWeight: 600 }}>{c.name}</span>
            <span style={{ color: '#8B95A5' }}>{c.title}</span>
            <span style={{ color: '#8B95A5' }}>{c.email}</span>
            <span style={{ color: '#8B95A5' }}>{c.phone}</span>
            <span style={{ color: '#8B95A5' }}>{c.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
