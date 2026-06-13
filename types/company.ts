export interface Company {
    id: string;
    name: string;
    industry: string;
    city: string;
    zip: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    distance: number;
    score: number; // 0-100
    tier: 'A' | 'B' | 'C';
    employees?: number;
    revenue?: string;
    verified: boolean;
}

export interface SearchFilters {
    industry: string;
    zip: string;
    radius: number;
}
