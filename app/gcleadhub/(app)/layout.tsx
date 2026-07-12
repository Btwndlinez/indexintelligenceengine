'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/gcleadhub/dashboard', icon: 'LayoutDashboard' },
  { label: 'Opportunities', href: '/gcleadhub/opportunities', icon: 'Target' },
  { label: 'Properties', href: '/gcleadhub/properties', icon: 'Building2' },
  { label: 'Companies', href: '/gcleadhub/companies', icon: 'Briefcase' },
  { label: 'Contacts', href: '/gcleadhub/contacts', icon: 'Users' },
  { label: 'Map', href: '/gcleadhub/map', icon: 'Map' },
  { label: 'Territories', href: '/gcleadhub/territories', icon: 'MapPinned' },
  { label: 'Pipeline', href: '/gcleadhub/pipeline', icon: 'Kanban' },
  { label: 'Calendar', href: '/gcleadhub/calendar', icon: 'Calendar' },
  { label: 'Reports', href: '/gcleadhub/reports', icon: 'BarChart' },
  { label: 'Settings', href: '/gcleadhub/settings', icon: 'Settings' },
];

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  Target: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Building2: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  Briefcase: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Users: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Map: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v6a2 2 0 0 0 2 2h6"/><path d="M4 22V8l6-4 6 4 6-4v14l-6 4-6-4-6 4Z"/><path d="M10 18V2"/><path d="M14 10v12"/></svg>,
  MapPinned: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Kanban: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="10" y="3" width="4" height="12" rx="1"/><rect x="18" y="3" width="4" height="8" rx="1"/></svg>,
  Calendar: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>,
  BarChart: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  Settings: ({ size }: { size?: number }) => <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

function Icon({ name, size }: { name: string; size?: number }) {
  const El = iconMap[name];
  if (!El) return null;
  return <El size={size} />;
}

export default function GCLeadHubAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: '14 new opportunities found', time: '2m ago', unread: true },
    { id: 2, text: 'Permit filed: 1243 Oak St', time: '15m ago', unread: true },
    { id: 3, text: 'Property sold: 890 Pine Ave', time: '1h ago', unread: false },
    { id: 4, text: 'ABC Holdings added to watchlist', time: '3h ago', unread: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gcleadhub/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080A0E', color: '#E8EDF2', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        :root { --gcl-blue: #2E86AB; --gcl-teal: #36C9C6; --gcl-surface: #0E121A; --gcl-border: rgba(255,255,255,0.06); --gcl-muted: #8B95A5; --gcl-hover: rgba(255,255,255,0.04); --gcl-active: rgba(46,134,171,0.12); }
        .gcl-sb-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 14px; color: var(--gcl-muted); cursor: pointer; transition: all 0.15s; text-decoration: none; border: none; background: none; width: 100%; text-align: left; }
        .gcl-sb-item:hover { background: var(--gcl-hover); color: #E8EDF2; }
        .gcl-sb-item.active { background: var(--gcl-active); color: var(--gcl-blue); font-weight: 600; }
        .gcl-scrollbar::-webkit-scrollbar { width: 4px; }
        .gcl-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .gcl-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .gcl-notif-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gcl-blue); flex-shrink: 0; margin-top: 6px; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .gcl-dropdown { animation: slideDown 0.15s ease; }
      `}</style>

      <aside style={{
        width: sidebarCollapsed ? 60 : 240, transition: 'width 0.2s',
        background: '#0C0F16', borderRight: '1px solid var(--gcl-border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 14px', borderBottom: '1px solid var(--gcl-border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E86AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          {!sidebarCollapsed && <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>GC Lead Hub</span>}
        </div>

        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }} className="gcl-scrollbar">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`gcl-sb-item ${isActive ? 'active' : ''}`} title={sidebarCollapsed ? item.label : undefined}>
                <Icon name={item.icon} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '8px', borderTop: '1px solid var(--gcl-border)' }}>
          <button className="gcl-sb-item" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed
                ? <><polyline points="9 18 15 12 9 6"/></>
                : <><polyline points="15 18 9 12 15 6"/></>}
            </svg>
            {!sidebarCollapsed && <span style={{ fontSize: 13 }}>Collapse</span>}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: 56, borderBottom: '1px solid var(--gcl-border)', background: '#0C0F16',
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', flexShrink: 0,
        }}>
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A6577" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search properties, companies, owners, permits, addresses...  (⌘K)"
              style={{
                width: '100%', height: 36, padding: '0 12px 0 36px', borderRadius: 8,
                background: 'var(--gcl-surface)', border: `1px solid ${searchFocused ? 'var(--gcl-blue)' : 'var(--gcl-border)'}`,
                color: '#E8EDF2', fontSize: 13, outline: 'none', transition: 'border-color 0.15s',
              }}
            />
            {searchFocused && (
              <div className="gcl-dropdown" style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: '#0E121A', border: '1px solid var(--gcl-border)', borderRadius: 8,
                padding: 8, zIndex: 100, maxHeight: 240, overflowY: 'auto',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6577', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 8px' }}>Suggestions</div>
                {['Hotels built before 1995 within 20 miles', 'Strip malls with no permits in 15 years', 'Apartment complexes sold last 12 months', 'Schools needing ADA upgrades'].map(s => (
                  <button key={s} type="button" onMouseDown={() => { setSearchQuery(s); router.push(`/gcleadhub/search?q=${encodeURIComponent(s)}`); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', borderRadius: 6, fontSize: 13, color: '#8B95A5', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gcl-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>{s}</button>
                ))}
              </div>
            )}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            <button style={{ position: 'relative', padding: 8, borderRadius: 8, background: 'none', border: 'none', color: '#8B95A5', cursor: 'pointer' }}
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={e => e.currentTarget.style.color = '#E8EDF2'}
              onMouseLeave={e => e.currentTarget.style.color = '#8B95A5'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#2E86AB' }} />
              {showNotifications && (
                <div className="gcl-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 280, background: '#0E121A', border: '1px solid var(--gcl-border)', borderRadius: 8, zIndex: 100 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, padding: '10px 12px', borderBottom: '1px solid var(--gcl-border)', color: '#8B95A5' }}>Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderBottom: '1px solid var(--gcl-border)', fontSize: 13, background: n.unread ? 'rgba(46,134,171,0.04)' : 'transparent' }}>
                      {n.unread && <div className="gcl-notif-dot" />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: n.unread ? '#E8EDF2' : '#8B95A5', fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#5A6577', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>

            <div style={{ position: 'relative' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: 'none', border: 'none', color: '#8B95A5', cursor: 'pointer' }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                onMouseEnter={e => e.currentTarget.style.color = '#E8EDF2'}
                onMouseLeave={e => e.currentTarget.style.color = '#8B95A5'}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #2E86AB, #36C9C6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>R</div>
                <span style={{ fontSize: 13 }}>Rodger</span>
              </button>
              {showUserMenu && (
                <div className="gcl-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 180, background: '#0E121A', border: '1px solid var(--gcl-border)', borderRadius: 8, zIndex: 100 }}>
                  {['Profile', 'Preferences', 'Team', 'Billing', 'Sign Out'].map(item => (
                    <button key={item} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#8B95A5', background: 'none', border: 'none', cursor: 'pointer', borderBottom: item === 'Billing' ? '1px solid var(--gcl-border)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gcl-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>{item}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: 0 }} className="gcl-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
