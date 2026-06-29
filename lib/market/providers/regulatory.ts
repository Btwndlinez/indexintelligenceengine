import { DiscoveryProvider, DiscoveryParams, getStateFromZip } from './base';
import { Company } from '@/types/company';
import { StateScraper, ScraperResult } from './scrapers/types';
import { CalRecycleScraper } from './scrapers/calrecycle';
import { TCEQScraper } from './scrapers/tceq';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class RegulatoryProvider implements DiscoveryProvider {
  name = 'regulatory_permit';
  private scrapers: Map<string, StateScraper> = new Map();

  constructor() {
    this.scrapers.set('CA', new CalRecycleScraper());
    this.scrapers.set('TX', new TCEQScraper());
  }

  async search(params: DiscoveryParams): Promise<Partial<Company>[]> {
    const state = getStateFromZip(params.zip);

    // 1. Try Supabase cache first
    const cached = await this.getCached(state, params.vertical);
    if (cached && !this.isStale(cached)) {
      return cached.records;
    }

    // 2. Run live scraper
    const scraper = this.scrapers.get(state);
    if (!scraper) {
      return [];
    }

    const result = await scraper.scrape(params);

    // 3. Cache result in Supabase if available
    if (result.success && result.records.length > 0) {
      await this.setCached(state, params.vertical, result).catch(() => {});
    }

    return result.records;
  }

  private async getCached(state: string, vertical: string): Promise<{ records: Partial<Company>[]; cachedAt: number } | null> {
    try {
      const { supabaseFetch } = await import('@/lib/db');
      const res = await supabaseFetch(
        `/rest/v1/rpc/get_regulatory_cache?p_state=${state}&p_vertical=${vertical}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.records?.length) return null;
      return { records: data.records, cachedAt: data.cached_at };
    } catch {
      return null;
    }
  }

  private async setCached(state: string, vertical: string, result: ScraperResult): Promise<void> {
    try {
      const { supabaseFetch } = await import('@/lib/db');
      await supabaseFetch('/rest/v1/regulatory_cache', {
        method: 'POST',
        body: JSON.stringify({
          state,
          vertical,
          records: result.records,
          cached_at: Date.now(),
        }),
      });
    } catch {
      // Non-blocking — cache is optional
    }
  }

  private isStale(cached: { cachedAt: number }): boolean {
    return Date.now() - cached.cachedAt > CACHE_TTL_MS;
  }
}
