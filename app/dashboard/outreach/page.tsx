'use client';

import { Phone, Mail, Check, SkipForward, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

const queue = [
  { name: 'GreenWaste Hayward', contact: 'John Smith', role: 'Ops Manager', phone: '510-555-0123', priority: 'A' },
  { name: 'Pacific Concrete Solutions', contact: 'Maria Garcia', role: 'Facilities Director', phone: '510-555-0456', priority: 'A' },
  { name: 'East Bay Demolition', contact: 'Bob Chen', role: 'Owner', phone: '510-555-0789', priority: 'B' },
];

export default function OutreachPage() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-xl font-bold">Outreach</h1>
        <p className="text-sm text-muted mt-1">Mission control for your outreach queue</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Call Queue</div>
          {queue.map((item) => (
            <div key={item.name} className="p-6 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-base font-bold">{item.name}</div>
                  <div className="text-sm text-muted">{item.contact} — {item.role}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  item.priority === 'A' ? 'bg-green/10 text-green' : 'bg-yellow/10 text-yellow'
                }`}>
                  Priority {item.priority}
                </span>
              </div>
              <div className="text-sm text-muted mb-4">{item.phone}</div>
              <div className="flex gap-2">
                <Button size="sm"><Phone className="w-3.5 h-3.5" /> Call Next</Button>
                <button className="h-8 px-3 rounded-xl bg-surface2 border border-border text-xs font-semibold text-muted hover:text-text transition-all"><SkipForward className="w-3.5 h-3.5" /> Skip</button>
                <button className="h-8 px-3 rounded-xl bg-green/10 text-green text-xs font-semibold hover:bg-green/20 transition-all"><Check className="w-3.5 h-3.5" /> Complete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Activity Feed</div>
            <div className="space-y-3">
              {[
                { action: 'Called GreenWaste Hayward', time: '5m ago', status: 'No answer' },
                { action: 'Emailed Pacific Concrete', time: '2h ago', status: 'Opened' },
                { action: 'Updated East Bay status', time: '1d ago', status: 'Interested' },
              ].map((a, i) => (
                <div key={i} className="text-sm">
                  <div className="text-text">{a.action}</div>
                  <div className="text-xs text-muted">{a.time} — {a.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
