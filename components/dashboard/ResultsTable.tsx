'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Mail, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Company {
  id: string;
  name: string;
  priority: string;
  distance: string;
  score: number;
  coverage: string;
  status: string;
  contacts?: { name: string; role: string; email?: string; phone?: string }[];
  signals?: string[];
}

const mockCompanies: Company[] = [
  { id: '1', name: 'GreenWaste Hayward', priority: 'A', distance: '4.2 mi', score: 94, coverage: '92%', status: 'Interested', contacts: [{ name: 'John Smith', role: 'Ops Manager', email: 'john@greenwaste.com', phone: '510-555-0123' }], signals: ['slurry trucks detected'] },
  { id: '2', name: 'Pacific Concrete Solutions', priority: 'A', distance: '3.8 mi', score: 91, coverage: '88%', status: 'New', contacts: [{ name: 'Maria Garcia', role: 'Facilities Director', email: 'maria@pacificconcrete.com' }], signals: ['recent expansion'] },
  { id: '3', name: 'East Bay Demolition', priority: 'B', distance: '5.1 mi', score: 78, coverage: '65%', status: 'Contacted', contacts: [{ name: 'Bob Chen', role: 'Owner', phone: '510-555-0456' }], signals: ['active permits'] },
  { id: '4', name: 'Alameda County Materials', priority: 'A', distance: '2.9 mi', score: 96, coverage: '95%', status: 'Qualified', contacts: [{ name: 'Sarah Johnson', role: 'Procurement Lead', email: 'sarah@acmaterials.com', phone: '510-555-0789' }], signals: ['fleet expansion', 'new contract'] },
  { id: '5', name: 'Valley Hauling & Disposal', priority: 'B', distance: '6.7 mi', score: 72, coverage: '45%', status: 'New', signals: ['high volume'] },
  { id: '6', name: 'Coastline Recycling', priority: 'C', distance: '8.3 mi', score: 61, coverage: '30%', status: 'New' },
];

const priorityColor = (p: string) => {
  switch (p) {
    case 'A': return 'green';
    case 'B': return 'yellow';
    case 'C': return 'default';
    default: return 'default';
  }
};

const statusVariant = (s: string) => {
  switch (s) {
    case 'Interested': return 'green';
    case 'Qualified': return 'blue';
    case 'Contacted': return 'yellow';
    default: return 'default';
  }
};

export default function ResultsTable() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-surface rounded-3xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Company', 'Priority', 'Distance', 'Score', 'Contact Coverage', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-muted uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockCompanies.map((company) => (
              <>
                <tr
                  key={company.id}
                  className="border-b border-border hover:bg-surface2 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === company.id ? null : company.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {expanded === company.id ? <ChevronDown className="w-3 h-3 text-muted" /> : <ChevronRight className="w-3 h-3 text-muted" />}
                      <span className="text-sm font-semibold">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityColor(company.priority) as any}>{company.priority}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{company.distance}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface2 overflow-hidden">
                        <div className="h-full bg-red rounded-full" style={{ width: `${company.score}%` }} />
                      </div>
                      <span className="text-sm font-semibold">{company.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{company.coverage}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(company.status) as any}>{company.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><Phone className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><Mail className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><ExternalLink className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
                {expanded === company.id && (
                  <tr key={`${company.id}-expanded`}>
                    <td colSpan={7} className="px-4 py-4 bg-surface2">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Contacts</div>
                          {company.contacts?.length ? company.contacts.map((c, i) => (
                            <div key={i} className="text-sm mb-1">
                              <div className="font-medium">{c.name}</div>
                              <div className="text-muted text-xs">{c.role}</div>
                              {c.email && <div className="text-xs text-blue">{c.email}</div>}
                              {c.phone && <div className="text-xs text-muted">{c.phone}</div>}
                            </div>
                          )) : <div className="text-xs text-muted">No contacts found</div>}
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Signals</div>
                          {company.signals?.map((s, i) => (
                            <div key={i} className="text-sm text-muted">• {s}</div>
                          )) || <div className="text-xs text-muted">No signals detected</div>}
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Actions</div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-red/10 text-red text-xs font-semibold rounded-lg hover:bg-red/20 transition-all">Call</button>
                            <button className="px-3 py-1.5 bg-surface text-text text-xs font-semibold rounded-lg border border-border hover:bg-surface2 transition-all">Email</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
