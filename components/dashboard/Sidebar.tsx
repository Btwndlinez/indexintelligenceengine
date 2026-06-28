'use client';

import { Zap, LayoutDashboard, Search, TrendingUp, Layers, Phone, BarChart3, CreditCard, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { section: 'MAIN', items: [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Search, label: 'Search', href: '/dashboard/search' },
    { icon: TrendingUp, label: 'Markets', href: '/dashboard/markets' },
  ]},
  { section: 'SALES', items: [
    { icon: Layers, label: 'Campaigns', href: '/dashboard/campaigns' },
    { icon: Phone, label: 'Outreach', href: '/login' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  ]},
  { section: 'ADMIN', items: [
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: Shield, label: 'Admin', href: '/dashboard/admin' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 shrink-0 min-h-screen bg-surface border-r border-border flex-col">
      <div className="h-[72px] flex items-center gap-3 px-6 border-b border-border shrink-0">
        <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="font-bold text-base tracking-tight">IIE</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="px-3 mb-2 text-[10px] font-semibold text-muted uppercase tracking-widest">{group.section}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-red/10 text-red'
                        : 'text-muted hover:text-text hover:bg-surface2'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border shrink-0">
        <div className="px-3 py-2.5 rounded-xl bg-surface2 border border-border">
          <div className="text-[10px] text-muted font-medium">Growth Plan</div>
          <div className="text-xs text-text font-semibold mt-1">2,482 / 10,000 credits</div>
        </div>
      </div>
    </aside>
  );
}
