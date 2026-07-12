export interface WireEntry {
  size: string;
  quantity: number;
}

export interface ConduitFillInput {
  conduitType: string;
  conduitSize: string;
  wires: WireEntry[];
}

export interface ConduitFillResult {
  totalWireArea: number;
  maxAllowedArea: number;
  fillPercentage: number;
  maxFillPercentage: number;
  isCompliant: boolean;
}

export function calculateConduitFill(
  input: ConduitFillInput,
  wireAreas: Record<string, number>,
  conduitArea: number
): ConduitFillResult {
  let totalWireArea = 0;
  let totalWireCount = 0;

  for (const wire of input.wires) {
    const area = wireAreas[wire.size];
    if (area !== undefined) {
      totalWireArea += area * wire.quantity;
      totalWireCount += wire.quantity;
    }
  }

  let maxFillPercentage: number;
  switch (totalWireCount) {
    case 1:
      maxFillPercentage = 0.53;
      break;
    case 2:
      maxFillPercentage = 0.31;
      break;
    default:
      maxFillPercentage = 0.4;
  }

  const maxAllowedArea = conduitArea * maxFillPercentage;
  const fillPercentage = totalWireArea / conduitArea;
  const isCompliant = totalWireArea <= maxAllowedArea;

  return {
    totalWireArea,
    maxAllowedArea,
    fillPercentage,
    maxFillPercentage,
    isCompliant,
  };
}
