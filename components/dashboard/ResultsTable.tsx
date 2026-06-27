'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Mail, ExternalLink, Loader2, Search, MapPin, Globe, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface CompanyData {
  id: string;
  companyName?: string;
  company_name?: string;
  name?: string;
  priority: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  source?: string;
  distanceMiles?: number;
  distance_mi?: number;
  distance?: string;
  enrichmentScore?: number;
  score?: number;
  contact_coverage?: string;
  coverage?: string;
  status: string;
  capabilitySummary?: string;
  contacts?: { name?: string; role?: string; email?: string; phone?: string }[];
  signals?: string[];
}

interface Contact {
  id: string;
  companyId: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  isPrimary: boolean;
}

interface ResultsTableProps {
  companies?: CompanyData[];
  contacts?: Contact[];
  loading?: boolean;
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

function formatCoverage(c: string | number | undefined): string {
  if (!c) return '—';
  if (typeof c === 'number') return `${c}%`;
  return c;
}

export default function ResultsTable({ companies, contacts: allContacts, loading }: ResultsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-red animate-spin mb-4" />
        <div className="text-sm font-medium mb-1">Discovering companies...</div>
        <div className="text-xs text-muted">Searching, enriching contacts, detecting signals</div>
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
              const score = company.enrichmentScore ?? company.score ?? 0;
              const companyContacts = allContacts?.filter(c => c.companyId === cid) || company.contacts || [];
              const isExpanded = expanded === cid;

              return (
                <Fragment key={cid}>
                  <tr
                    className="border-b border-border hover:bg-surface2 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : cid)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 max-w-[280px]">
                        {isExpanded ? <ChevronDown className="w-3 h-3 text-muted shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted shrink-0" />}
                        <span className="text-sm font-semibold truncate">{name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityColor(company.priority) as any}>{company.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{formatDistance(company.distanceMiles ?? company.distance_mi ?? company.distance)}</td>
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
                        <a
                          href={company.phone ? `tel:${company.phone}` : '#'}
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1.5 rounded-lg transition-all ${company.phone ? 'hover:bg-surface2 text-muted hover:text-green' : 'text-border cursor-not-allowed'}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={company.email ? `mailto:${company.email}` : '#'}
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1.5 rounded-lg transition-all ${company.email ? 'hover:bg-surface2 text-muted hover:text-blue' : 'text-border cursor-not-allowed'}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={company.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1.5 rounded-lg transition-all ${company.website ? 'hover:bg-surface2 text-muted hover:text-text' : 'text-border cursor-not-allowed'}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="border-t border-border bg-surface2/50">
                          <div className="p-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Contact</div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                                  <span className="text-muted">{company.address || 'No address'}</span>
                                </div>
                                {company.phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                                    <a href={`tel:${company.phone}`} className="text-blue hover:underline">{company.phone}</a>
                                  </div>
                                )}
                                {company.email && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                                    <a href={`mailto:${company.email}`} className="text-blue hover:underline">{company.email}</a>
                                  </div>
                                )}
                                {company.website && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Globe className="w-3.5 h-3.5 text-muted shrink-0" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline truncate">{company.website}</a>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Lead Score</div>
                                <div className="flex items-center gap-3">
                                  <div className="w-full max-w-[120px] h-2 rounded-full bg-surface2 overflow-hidden">
                                    <div className="h-full bg-red rounded-full" style={{ width: `${score}%` }} />
                                  </div>
                                  <span className="text-lg font-bold">{score}</span>
                                  <Badge variant={priorityColor(company.priority) as any}>{company.priority}</Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Status</div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={statusVariant(company.status) as any}>{statusDisplay(company.status)}</Badge>

                                </div>
                              </div>
                            </div>

                            {company.capabilitySummary && company.capabilitySummary.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Signals</div>
                                <p className="text-sm text-muted leading-relaxed">{company.capabilitySummary}</p>
                              </div>
                            )}

                            {company.signals && company.signals.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Detected Signals</div>
                                <div className="flex flex-wrap gap-2">
                                  {company.signals.map((s, i) => (
                                    <span key={i} className="px-2 py-1 text-xs rounded-lg bg-surface2 text-muted border border-border">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {companyContacts.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Contacts ({companyContacts.length})</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {companyContacts.map((ct, i) => {
                                    const ctName = 'firstName' in ct
                                      ? [ct.firstName, ct.lastName].filter(Boolean).join(' ')
                                      : (ct as any).name || 'Unknown';
                                    return (
                                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
                                        <div className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center shrink-0">
                                          <User className="w-4 h-4 text-muted" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-sm font-semibold">{ctName}</div>
                                          {'title' in ct && ct.title && <div className="text-xs text-muted">{ct.title}</div>}
                                          {'role' in ct && (ct as any).role && <div className="text-xs text-muted">{(ct as any).role}</div>}
                                          <div className="flex items-center gap-2 mt-1">
                                            {'phone' in ct && ct.phone && <a href={`tel:${ct.phone}`} className="p-1 rounded-lg hover:bg-surface2 text-muted hover:text-green transition-all"><Phone className="w-3 h-3" /></a>}
                                            {'email' in ct && ct.email && <a href={`mailto:${ct.email}`} className="p-1 rounded-lg hover:bg-surface2 text-muted hover:text-blue transition-all"><Mail className="w-3 h-3" /></a>}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
