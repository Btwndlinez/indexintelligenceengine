export interface AmpacityInput {
  wireSize: string;
  insulationType: string;
  temperatureRating: number;
  ambientTemp: number;
  conduitFillCount: number;
  isUnderground: boolean;
}

export interface AmpacityResult {
  baseAmpacity: number;
  tempDeratingFactor: number;
  conduitFillDeratingFactor: number;
  adjustedAmpacity: number;
  recommendedBreakerSize: number;
}

const TABLE_75C: Record<string, number> = {
  '14': 20, '12': 25, '10': 35, '8': 50, '6': 65,
  '4': 85, '3': 100, '2': 115, '1': 130, '1/0': 150,
  '2/0': 175, '3/0': 200, '4/0': 230, '250': 255,
  '300': 285, '350': 310, '400': 335, '500': 380,
  '600': 420, '750': 475, '1000': 545,
};

const TABLE_90C: Record<string, number> = {
  '14': 25, '12': 30, '10': 40, '8': 55, '6': 75,
  '4': 95, '3': 110, '2': 130, '1': 150, '1/0': 170,
  '2/0': 195, '3/0': 225, '4/0': 260, '250': 290,
  '300': 320, '350': 350, '400': 380, '500': 430,
  '600': 475, '750': 535, '1000': 615,
};

const BREAKER_SIZES = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
  110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500,
  600, 800, 1000, 1200,
];

function baseAmpacity(wireSize: string, tempRating: number): number {
  const key = wireSize.replace('#', '');
  if (tempRating === 90) return TABLE_90C[key] ?? 0;
  if (tempRating === 60) return (TABLE_75C[key] ?? 0) * 0.8;
  return TABLE_75C[key] ?? 0;
}

function temperatureDerating(ambientTemp: number): number {
  if (ambientTemp <= 30) return 1.0;
  if (ambientTemp <= 40) return 0.91;
  if (ambientTemp <= 45) return 0.82;
  if (ambientTemp <= 50) return 0.71;
  if (ambientTemp <= 55) return 0.58;
  if (ambientTemp <= 60) return 0.41;
  return 0.41;
}

function conduitFillDerating(conductorCount: number): number {
  if (conductorCount <= 3) return 1.0;
  if (conductorCount <= 6) return 0.8;
  if (conductorCount <= 9) return 0.7;
  if (conductorCount <= 20) return 0.5;
  return 0.45;
}

function nearestBreakerSize(amps: number): number {
  const size = BREAKER_SIZES.find((b) => b >= amps);
  if (size !== undefined) return size;
  if (amps > 1200) return Math.round(amps);
  return 15;
}

export function calculateAmpacity(input: AmpacityInput): AmpacityResult {
  const base = baseAmpacity(input.wireSize, input.temperatureRating);
  const tempFactor = temperatureDerating(input.ambientTemp);
  const fillFactor = conduitFillDerating(input.conduitFillCount);
  const adjusted = base * tempFactor * fillFactor;
  const breaker = nearestBreakerSize(adjusted);
  const baseWithTemp = base * tempFactor;

  return {
    baseAmpacity: baseWithTemp,
    tempDeratingFactor: tempFactor,
    conduitFillDeratingFactor: fillFactor,
    adjustedAmpacity: adjusted,
    recommendedBreakerSize: breaker,
  };
}
