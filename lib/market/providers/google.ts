import { Company } from '@/types/company';

export class GooglePlacesAdapter {
  name = 'google_places';

  async searchWithNegatives(
    queryText: string,
    negativeKeywords: string[]
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

    return filteredPlaces.map((p: any) => ({
      id: p.id,
      companyName: p.displayName?.text || 'Unindexed Business',
      address: p.formattedAddress,
      phone: p.internationalPhoneNumber,
      website: p.websiteUri,
      latitude: p.location?.latitude,
      longitude: p.location?.longitude,
      source: this.name,
      status: 'NOT_CONTACTED' as const,
      createdAt: now,
      updatedAt: now
    }));
  }
}
