'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Mail, ExternalLink, Loader2, Search } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Company {
  id: string;
  companyName?: string;
  company_name?: string;
  name?: string;
  priority: string;
  distance_mi?: number;
  distance?: string;
  enrichmentScore?: number;
  score?: number;
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

const statusDisplay = (s: string) => {
  switch (s) {
    case 'NOT_CONTACTED': return 'New';
    case 'IN_PROGRESS': return 'Contacted';
    case 'CONTACTED': return 'Contacted';
    case 'QUALIFIED': return 'Qualified';
    case 'INTERESTED': return 'Interested';
    case 'CONVERTED': return 'Converted';
    default: return s || 'New';
  }
};

function formatDistance(d: number | string | undefined): string {
  if (!d) return '—';
  if (typeof d === 'string') return d;
  return `${d.toFixed(1)} mi`;
}

function formatScore(s: number | undefined): number {
  return s ?? 0;
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
              const cid = company.id || Math.random().toString();
              const name = company.companyName || company.company_name || company.name || 'Unknown';
              const score = formatScore(company.enrichmentScore ?? company.score);
              return (
                <tr key={cid}
                  className="border-b border-border hover:bg-surface2 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === cid ? null : cid)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 max-w-[250px]">
                      {expanded === cid ? <ChevronDown className="w-3 h-3 text-muted shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted shrink-0" />}
                      <span className="text-sm font-semibold truncate">{name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityColor(company.priority) as any}>{company.priority}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{formatDistance(company.distance_mi ?? company.distance)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface2 overflow-hidden">
                        <div className="h-full bg-red rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-sm font-semibold">{score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{formatCoverage(company.contact_coverage ?? company.coverage)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(company.status) as any}>{statusDisplay(company.status)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><Phone className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><Mail className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all"><ExternalLink className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
