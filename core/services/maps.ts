export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
}

export async function geocodeZip(zip: string): Promise<Coordinates | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zip)}&countrycodes=us&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'IndexIntelligenceEngine/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getStateFromZip(zip: string): string {
  const z = parseInt(zip);
  if (z >= 35000 && z < 37000) return 'AL';
  if (z >= 99500 && z < 100000) return 'AK';
  if (z >= 85000 && z < 87000) return 'AZ';
  if (z >= 71600 && z < 73000) return 'AR';
  if (z >= 90000 && z < 96200) return 'CA';
  if (z >= 80000 && z < 81700) return 'CO';
  if (z >= 6000 && z < 7000) return 'CT';
  if (z >= 19700 && z < 20000) return 'DE';
  if (z >= 32000 && z < 35000) return 'FL';
  if (z >= 30000 && z < 32000) return 'GA';
  if (z >= 96700 && z < 96900) return 'HI';
  if (z >= 83200 && z < 83900) return 'ID';
  if (z >= 60000 && z < 63000) return 'IL';
  if (z >= 46000 && z < 48000) return 'IN';
  if (z >= 50000 && z < 53000) return 'IA';
  if (z >= 66000 && z < 68000) return 'KS';
  if (z >= 40000 && z < 42800) return 'KY';
  if (z >= 70000 && z < 71500) return 'LA';
  if (z >= 3900 && z < 5000) return 'ME';
  if (z >= 20600 && z < 22000) return 'MD';
  if (z >= 1000 && z < 2800) return 'MA';
  if (z >= 48000 && z < 50000) return 'MI';
  if (z >= 55000 && z < 56800) return 'MN';
  if (z >= 38600 && z < 40000) return 'MS';
  if (z >= 63000 && z < 66000) return 'MO';
  if (z >= 59000 && z < 60000) return 'MT';
  if (z >= 68000 && z < 69400) return 'NE';
  if (z >= 88900 && z < 89900) return 'NV';
  if (z >= 3000 && z < 3900) return 'NH';
  if (z >= 7000 && z < 9000) return 'NJ';
  if (z >= 87000 && z < 88500) return 'NM';
  if (z >= 10000 && z < 15000) return 'NY';
  if (z >= 27000 && z < 29000) return 'NC';
  if (z >= 58000 && z < 58900) return 'ND';
  if (z >= 43000 && z < 46000) return 'OH';
  if (z >= 73000 && z < 75000) return 'OK';
  if (z >= 97000 && z < 97900) return 'OR';
  if (z >= 15000 && z < 19700) return 'PA';
  if (z >= 2800 && z < 3000) return 'RI';
  if (z >= 29000 && z < 30000) return 'SC';
  if (z >= 57000 && z < 58000) return 'SD';
  if (z >= 37000 && z < 38600) return 'TN';
  if (z >= 75000 && z < 80000) return 'TX';
  if (z >= 84000 && z < 84700) return 'UT';
  if (z >= 5000 && z < 6000) return 'VT';
  if (z >= 22000 && z < 24700) return 'VA';
  if (z >= 98000 && z < 99500) return 'WA';
  if (z >= 24700 && z < 26900) return 'WV';
  if (z >= 53000 && z < 55000) return 'WI';
  if (z >= 82000 && z < 83200) return 'WY';
  return 'CA';
}
