import { supabaseRpc } from '@/core/db';

export interface DashboardOverview {
  totalCompanies: number;
  totalContacts: number;
  activeCampaigns: number;
  totalBids: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface DashboardReport {
  label: string;
  value: number;
  change?: number;
  period?: string;
}

export async function getOverview(organizationId: string): Promise<DashboardOverview> {
  try {
    const res = await supabaseRpc('get_dashboard_overview', { p_org_id: organizationId });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return { totalCompanies: 0, totalContacts: 0, activeCampaigns: 0, totalBids: 0 };
}

export async function getReports(organizationId: string): Promise<DashboardReport[]> {
  try {
    const res = await supabaseRpc('get_dashboard_reports', { p_org_id: organizationId });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return [];
}

export async function getCompanies(organizationId: string): Promise<DashboardReport[]> {
  try {
    const res = await supabaseRpc('get_dashboard_companies', { p_org_id: organizationId });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return [];
}

export async function getCampaigns(organizationId: string): Promise<DashboardReport[]> {
  try {
    const res = await supabaseRpc('get_dashboard_campaigns', { p_org_id: organizationId });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return [];
}
