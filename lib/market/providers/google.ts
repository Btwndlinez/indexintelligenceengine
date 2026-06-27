import { Company } from '@/types/company';
import { DiscoveryProvider, DiscoveryParams } from './base';
import { haversineDistance } from '@/lib/geo';

export class GooglePlacesProvider implements DiscoveryProvider {
  name = 'google_places';

  async search(params: DiscoveryParams): Promise<Partial<Company>[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return [];

    const allResults: Partial<Company>[] = [];
    const searchQueries = [
      'concrete slurry recycling',
      'concrete washout',
      'slurry disposal',
      'ready mix reclaiming',
      'concrete reclaiming',
    ];

    for (const query of searchQueries) {
      const textQuery = `${query} ${params.zip}`;
      try {
        const results = await this.searchWithNegatives(textQuery, [], params.lat, params.lng);
        allResults.push(...results);
      } catch (err) {
        console.error(`[GooglePlacesProvider] Query '${textQuery}' failed:`, err);
      }
    }

    return allResults;
  }

  async searchWithNegatives(
    queryText: string,
    negativeKeywords: string[],
    zipLat?: number,
    zipLng?: number
  ): Promise<Partial<Company>[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not configured.");
    }

    const url = 'https://places.googleapis.com/v1/places:searchText';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber,places.websiteUri,places.primaryType'
      },
      body: JSON.stringify({ textQuery: queryText })
    });

    if (!response.ok) {
      throw new Error(`Google Places API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawPlaces = data.places || [];

    const filteredPlaces = rawPlaces.filter((place: any) => {
      const name = (place.displayName?.text || '').toLowerCase();
      const address = (place.formattedAddress || '').toLowerCase();
      const type = (place.primaryType || '').toLowerCase();

      return !negativeKeywords.some(keyword => {
        const cleanK = keyword.toLowerCase();
        return name.includes(cleanK) || address.includes(cleanK) || type.includes(cleanK);
      });
    });

    const now = new Date().toISOString();

    return filteredPlaces.map((p: any) => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      const distanceMiles = (zipLat != null && zipLng != null && lat != null && lng != null)
        ? Math.round(haversineDistance(zipLat, zipLng, lat, lng) * 10) / 10
        : undefined;

      return {
        id: p.id,
        companyName: p.displayName?.text || 'Unindexed Business',
        address: p.formattedAddress,
        phone: p.internationalPhoneNumber,
        website: p.websiteUri,
        latitude: lat,
        longitude: lng,
        distanceMiles,
        source: this.name,
        status: 'NOT_CONTACTED' as const,
        createdAt: now,
        updatedAt: now
      };
    });
  }
}

export class GooglePlacesAdapter extends GooglePlacesProvider {}
