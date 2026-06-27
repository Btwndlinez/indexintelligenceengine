'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Mail, ExternalLink, Loader2, Search } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Company {
  id: string;
  company_name?: string;
  name?: string;
  priority: string;
  distance_mi?: number;
  distance?: string;
  score: number;
  contact_coverage?: string;
  coverage?: string;
  status: string;
  contacts?: { name: string; role: string; email?: string; phone?: string }[];
  signals?: string[];
}

interface ResultsTableProps {
  companies?: Company[];
  loading?: boolean;
  demo?: boolean;
  count?: number;
}

const priorityColor = (p: string) => {
  switch (p?.toLowerCase()) {
    case 'a': return 'green';
    case 'b': return 'yellow';
    case 'c': return 'default';
    default: return 'default';
  }
};

const statusVariant = (s: string) => {
  switch (s?.toLowerCase()) {
    case 'interested': return 'green';
    case 'qualified': return 'blue';
    case 'contacted':
    case 'active': return 'yellow';
    default: return 'default';
  }
};

function formatDistance(d: number | string | undefined): string {
  if (!d) return '—';
  if (typeof d === 'string') return d;
  return `${d.toFixed(1)} mi`;
}

function formatCoverage(c: string | number | undefined): string {
  if (!c) return '—';
  if (typeof c === 'number') return `${c}%`;
  return c;
}

export default function ResultsTable({ companies, loading, demo, count }: ResultsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-red animate-spin mb-4" />
        <div className="text-sm font-medium mb-1">Discovering companies...</div>
        <div className="text-xs text-muted">Searching Google Places, enriching contacts, detecting signals</div>
      </div>
    );
  }

  if (!companies?.length) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-12 flex flex-col items-center justify-center text-center">
        <Search className="w-8 h-8 text-muted mb-4" />
        <div className="text-sm font-medium mb-1">No results yet</div>
        <div className="text-xs text-muted">Set your parameters above and run a discovery search</div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl border border-border overflow-hidden">
      {demo && (
        <div className="px-4 py-2 bg-yellow/10 border-b border-yellow/20 text-xs text-yellow font-medium">
          Demo mode — showing sample data. Connect provider keys for live results.
        </div>
      )}
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
            {companies.map((company) => {
              const cid = company.id || company.company_name || Math.random().toString();
              const name = company.company_name || company.name || 'Unknown';
              return (
                <>
                  <tr
                    key={cid}
                    className="border-b border-border hover:bg-surface2 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === cid ? null : cid)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {expanded === cid ? <ChevronDown className="w-3 h-3 text-muted" /> : <ChevronRight className="w-3 h-3 text-muted" />}
                        <span className="text-sm font-semibold">{name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityColor(company.priority) as any}>{company.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{formatDistance(company.distance_mi ?? company.distance)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface2 overflow-hidden">
                          <div className="h-full bg-red rounded-full" style={{ width: `${company.score}%` }} />
                        </div>
                        <span className="text-sm font-semibold">{company.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{formatCoverage(company.contact_coverage ?? company.coverage)}</td>
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
                  {expanded === cid && (
                    <tr key={`${cid}-expanded`}>
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
                            {company.signals?.length ? company.signals.map((s, i) => (
                              <div key={i} className="text-sm text-muted">• {s}</div>
                            )) : <div className="text-xs text-muted">No signals detected</div>}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
