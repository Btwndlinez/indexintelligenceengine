import { GooglePlacesProvider } from '../providers/google';
import { SearchRequest, Listing } from '../entities/listing';

export class DiscoveryEngine {
    private provider = new GooglePlacesProvider();

    async find(request: SearchRequest): Promise<Partial<Listing>[]> {
        const results = await this.provider.search({
            zip: request.zip,
            vertical: request.industry,
            radius: request.radius,
        });
        return results.map(r => ({
            ...r,
            name: r.companyName || 'Unknown',
            industry: request.industry,
        })) as Partial<Listing>[];
    }
}
