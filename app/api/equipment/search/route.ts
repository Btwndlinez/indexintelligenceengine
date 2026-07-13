import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/services';

/* ── types matching the HHR SDK types ── */

type EquipmentClass = 'vacuum_truck_3k' | 'vacuum_truck_5k' | 'excavator_heavy'
  | 'end_dump_trailer' | 'frac_tank_21k' | 'dewatering_pump';

interface EquipmentRentalSearchRequest {
  latitude: number;
  longitude: number;
  radius_miles?: number;
  equipment_class?: EquipmentClass;
  target_date?: string;
}

interface EquipmentRentalResult {
  id: string;
  provider_name: string;
  equipment_class: string;
  distance_miles: number;
  daily_rate: number;
  weekly_rate: number | null;
  monthly_rate: number | null;
  delivery_fee: number;
  proximity_score: number;
  trust_index: number;
  composite_confidence_rating: number;
  is_verified_partner: boolean;
  contact_phone: string | null;
  dispatch_email: string | null;
  city: string | null;
  state: string | null;
  operator_included: boolean;
  requires_cdl: boolean;
  minimum_rental_days: number;
}

interface EquipmentRentalSearchResponse {
  results: EquipmentRentalResult[];
  meta: { total: number; latitude: number; longitude: number; radius_miles: number; execution_ms: number };
}

/* ── fallback mock data ── */

const MOCK_GEAR = [
  { id: 'eq1', name: 'CAT 320 Hydraulic Excavation Rig', class: 'excavator_heavy' as EquipmentClass, baseDistance: 4.8, partner: 'United Rentals - Fremont Branch', rating: 4.8, historicalContracts: 120, insuranceVerified: true, availability: 1.0, rate: 850, deliveryFee: 250, phone: '800-555-0101', dispatchEmail: 'dispatch@unitedrentals.com', city: 'Fremont', state: 'CA', cdl: false, operator: false, minDays: 1 },
  { id: 'eq2', name: 'Sany SY135C Compact Shutter Excavator', class: 'excavator_heavy' as EquipmentClass, baseDistance: 8.2, partner: 'Sunbelt Rentals - Newark Yard', rating: 4.2, historicalContracts: 85, insuranceVerified: true, availability: 0.9, rate: 620, deliveryFee: 180, phone: '800-555-0102', dispatchEmail: null, city: 'Newark', state: 'CA', cdl: false, operator: false, minDays: 1 },
  { id: 'eq3', name: 'Peterbilt 5,000 Gal Tanker (Dual-Line)', class: 'vacuum_truck_5k' as EquipmentClass, baseDistance: 11.5, partner: 'Bay Area Vac Systems', rating: 4.9, historicalContracts: 150, insuranceVerified: true, availability: 0.95, rate: 1450, deliveryFee: 350, phone: '888-555-0103', dispatchEmail: 'dispatch@bayareavacs.com', city: 'Hayward', state: 'CA', cdl: true, operator: true, minDays: 3 },
  { id: 'eq4', name: 'Sewer Equipment CO. 3,000 Gal Jet-Vac', class: 'vacuum_truck_3k' as EquipmentClass, baseDistance: 6.1, partner: 'Fremont Fleet Solutions', rating: 4.5, historicalContracts: 60, insuranceVerified: false, availability: 0.8, rate: 1200, deliveryFee: 290, phone: '510-555-0104', dispatchEmail: null, city: 'Fremont', state: 'CA', cdl: false, operator: false, minDays: 1 },
  { id: 'eq5', name: '21,000 Gal Closed Top Frac Storage Tank', class: 'frac_tank_21k' as EquipmentClass, baseDistance: 19.3, partner: 'Ironwood Supply & Tank', rating: 4.7, historicalContracts: 110, insuranceVerified: true, availability: 1.0, rate: 350, deliveryFee: 450, phone: '800-555-0105', dispatchEmail: 'orders@ironwoodtank.com', city: 'Oakland', state: 'CA', cdl: false, operator: false, minDays: 7 },
  { id: 'eq6', name: '18ft Tandem Axle End Dump Trailer Unit', class: 'end_dump_trailer' as EquipmentClass, baseDistance: 3.5, partner: 'Tri-City Rental Depot', rating: 4.0, historicalContracts: 40, insuranceVerified: true, availability: 0.75, rate: 220, deliveryFee: 110, phone: null, dispatchEmail: null, city: 'Union City', state: 'CA', cdl: true, operator: true, minDays: 1 },
  { id: 'eq7', name: 'Dewatering Pump 6" Hydraulic Submersible', class: 'dewatering_pump' as EquipmentClass, baseDistance: 9.0, partner: 'PumpWorks Rentals', rating: 4.3, historicalContracts: 90, insuranceVerified: true, availability: 0.9, rate: 480, deliveryFee: 200, phone: '800-555-0107', dispatchEmail: null, city: 'San Jose', state: 'CA', cdl: false, operator: false, minDays: 1 },
  { id: 'eq8', name: 'Vacuum Truck 3K 2025 Model', class: 'vacuum_truck_3k' as EquipmentClass, baseDistance: 14.2, partner: 'Allied Waste Services', rating: 4.1, historicalContracts: 45, insuranceVerified: false, availability: 0.85, rate: 1100, deliveryFee: 300, phone: null, dispatchEmail: 'rentals@alliedwaste.com', city: 'San Leandro', state: 'CA', cdl: false, operator: true, minDays: 2 },
];

function computeScoring(baseDistance: number, radiusMiles: number, rating: number, historicalContracts: number, insuranceVerified: boolean, availability: number) {
  const s_prox = Math.max(0, 100 * (1 - baseDistance / radiusMiles));
  const r_partner = (rating / 5.0) * 100;
  const c_historical = Math.min(100, (historicalContracts / 150) * 100);
  const i_insurance = insuranceVerified ? 100 : 0;
  const trustIndex = 0.50 * r_partner + 0.30 * c_historical + 0.20 * i_insurance;
  const compositeRank = 0.40 * s_prox + 0.40 * trustIndex + 0.20 * (availability * 100);
  return { s_prox: Math.round(s_prox), trustIndex: Math.round(trustIndex), compositeRank: Math.round(compositeRank) };
}

function fallbackSearch(latitude: number, longitude: number, radius_miles: number, equipment_class?: string): EquipmentRentalResult[] {
  const latDiff = Math.abs(latitude - 37.7749);
  const lngDiff = Math.abs(longitude + 122.4194);
  const spatialMultiplier = 1.0 + (latDiff + lngDiff) * 6;

  return MOCK_GEAR
    .filter(g => !equipment_class || g.class === equipment_class)
    .filter(g => g.baseDistance * spatialMultiplier <= radius_miles)
    .map(g => {
      const distance = Math.round(g.baseDistance * spatialMultiplier * 10) / 10;
      const { s_prox, trustIndex, compositeRank } = computeScoring(distance, radius_miles, g.rating, g.historicalContracts, g.insuranceVerified, g.availability);
      return {
        id: g.id,
        provider_name: g.partner,
        equipment_class: g.class,
        distance_miles: distance,
        daily_rate: g.rate,
        weekly_rate: Math.round(g.rate * 5 * 0.9),
        monthly_rate: Math.round(g.rate * 22 * 0.8),
        delivery_fee: g.deliveryFee,
        proximity_score: s_prox,
        trust_index: trustIndex,
        composite_confidence_rating: compositeRank,
        is_verified_partner: g.insuranceVerified,
        contact_phone: g.phone,
        dispatch_email: g.dispatchEmail,
        city: g.city,
        state: g.state,
        operator_included: g.operator,
        requires_cdl: g.cdl,
        minimum_rental_days: g.minDays,
      };
    })
    .sort((a, b) => b.composite_confidence_rating - a.composite_confidence_rating);
}

function formatResponse(rows: any[], latitude: number, longitude: number, radius_miles: number, start: number): NextResponse<EquipmentRentalSearchResponse> {
  const results: EquipmentRentalResult[] = (rows || []).map((r: any) => ({
    id: r.id,
    provider_name: r.partner_name || r.provider_name || 'Unknown',
    equipment_class: r.equipment_class || 'other',
    distance_miles: Math.round((r.distance_miles ?? 0) * 10) / 10,
    daily_rate: Number(r.daily_rate) || 0,
    weekly_rate: r.weekly_rate ? Number(r.weekly_rate) : null,
    monthly_rate: r.monthly_rate ? Number(r.monthly_rate) : null,
    delivery_fee: Number(r.delivery_fee) || 0,
    proximity_score: r.proximity_score ?? 0,
    trust_index: r.trust_index ?? 0,
    composite_confidence_rating: Math.round(r.composite_rank ?? 0),
    is_verified_partner: r.is_verified_partner ?? false,
    contact_phone: r.contact_phone || null,
    dispatch_email: r.dispatch_email || null,
    city: r.city || null,
    state: r.state || null,
    operator_included: r.operator_included ?? false,
    requires_cdl: r.requires_cdl ?? false,
    minimum_rental_days: r.minimum_rental_days ?? 1,
  }));

  return NextResponse.json({
    results,
    meta: { total: results.length, latitude, longitude, radius_miles, execution_ms: Date.now() - start },
  });
}

export async function POST(req: NextRequest) {
  const start = Date.now();

  let body: EquipmentRentalSearchRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { latitude, longitude, radius_miles = 25, equipment_class, target_date } = body;

  if (latitude == null || longitude == null) {
    return NextResponse.json({ error: 'latitude and longitude are required' }, { status: 400 });
  }

  try {
    const res = await db.supabaseRpc('search_equipment_by_location', {
      p_lat: latitude,
      p_lon: longitude,
      p_radius_miles: radius_miles,
      p_equipment_class: equipment_class || null,
      p_target_date: target_date || null,
      p_limit: 25,
    });

    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0) {
        return formatResponse(rows, latitude, longitude, radius_miles, start);
      }
    }
  } catch (err: any) {
    console.warn('Supabase equipment search unavailable, using fallback', err.message);
  }

  const fallback = fallbackSearch(latitude, longitude, radius_miles, equipment_class);
  return NextResponse.json({
    results: fallback,
    meta: { total: fallback.length, latitude, longitude, radius_miles, execution_ms: Date.now() - start },
  });
}
