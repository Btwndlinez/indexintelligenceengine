'use client';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayEvents = [
  { time: '10:00 AM', title: 'Site Visit — 1243 Oak St', type: 'Site Visit' },
  { time: '2:00 PM', title: 'Call — ABC Holdings', type: 'Call' },
  { time: '4:30 PM', title: 'Review Permit Drawings', type: 'Review' },
];
const monthEvents = [
  { day: 14, count: 3 },
  { day: 15, count: 1 },
  { day: 18, count: 2 },
  { day: 22, count: 4 },
];

export default function CalendarPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Calendar</h1>
        <div style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>July 2026</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '4px 10px', borderRadius: 6, background: '#0E121A', color: '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: 12 }}>←</button>
              <button style={{ padding: '4px 10px', borderRadius: 6, background: '#0E121A', color: '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: 12 }}>→</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {weekDays.map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', color: '#5A6577', padding: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3;
              const hasEvent = monthEvents.find(e => e.day === day);
              return (
                <div key={i} style={{
                  padding: 8, textAlign: 'center', fontSize: 13, borderRadius: 8,
                  color: day === 12 ? '#E8EDF2' : day > 0 && day <= 31 ? '#8B95A5' : '#3A4050',
                  background: day === 12 ? 'rgba(46,134,171,0.2)' : 'transparent',
                  cursor: day > 0 && day <= 31 ? 'pointer' : 'default',
                  position: 'relative',
                }}>
                  {day > 0 && day <= 31 ? day : ''}
                  {hasEvent && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2E86AB', margin: '2px auto 0' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Today</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayEvents.map(e => (
            <div key={e.title} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#2E86AB', fontWeight: 600, marginBottom: 4 }}>{e.time}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
              <div style={{ fontSize: 11, color: '#5A6577', marginTop: 2 }}>{e.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
