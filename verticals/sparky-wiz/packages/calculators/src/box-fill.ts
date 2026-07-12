export interface BoxFillInput {
  boxType: string;
  boxSize: string;
  conductorCount: number;
  clampCount: number;
  supportFittings: number;
  deviceCount: number;
  equipmentGrounds: number;
}

export interface BoxFillResult {
  totalVolumeAllowance: number;
  availableVolume: number;
  remainingVolume: number;
  isOverfilled: boolean;
}

const BOX_VOLUME_TABLE: Record<string, number> = {
  '4x4x1.5': 21.0,
  '4x4x2.125': 30.3,
  '4x4x2.25': 32.0,
  '4-11/16x1.5': 29.5,
  '4-11/16x2.125': 42.0,
  '3x2x1.5': 7.5,
  '3x2x2': 10.0,
  '3x2x2.25': 10.5,
  '3x2x2.5': 12.0,
  '3x2x3': 14.0,
  '4x2x1.5': 10.0,
  onegang: 18.0,
  twogang: 34.0,
  threegang: 50.0,
  fourgang: 66.0,
};

function boxAvailableVolume(boxType: string, size: string): number {
  return BOX_VOLUME_TABLE[size] ?? 18.0;
}

export function calculateBoxFill(input: BoxFillInput): BoxFillResult {
  const conductorAllowance = 2.0;
  const totalAllowance =
    input.conductorCount * conductorAllowance +
    input.clampCount * 1.0 +
    input.supportFittings * 1.0 +
    input.deviceCount * 2.0 +
    input.equipmentGrounds * 1.0;

  const available = boxAvailableVolume(input.boxType, input.boxSize);
  const remaining = available - totalAllowance;

  return {
    totalVolumeAllowance: totalAllowance,
    availableVolume: available,
    remainingVolume: remaining,
    isOverfilled: remaining < 0,
  };
}
