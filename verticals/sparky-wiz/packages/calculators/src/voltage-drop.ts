export interface VoltageDropInput {
  voltage: number;
  amperage: number;
  oneWayLength: number;
  phase: 1 | 3;
  resistancePerKFT: number;
}

export interface VoltageDropResult {
  voltageDrop: number;
  voltageAtEnd: number;
  dropPercentage: number;
  meetsNEC: boolean;
}

export function calculateVoltageDrop(input: VoltageDropInput): VoltageDropResult {
  const lengthFactor = input.phase === 1 ? 2.0 : 1.732;
  const vd = (lengthFactor * input.oneWayLength * input.resistancePerKFT * input.amperage) / 1000.0;
  const vEnd = input.voltage - vd;
  const pct = (vd / input.voltage) * 100.0;

  return {
    voltageDrop: Math.max(vd, 0),
    voltageAtEnd: Math.max(vEnd, 0),
    dropPercentage: Math.max(pct, 0),
    meetsNEC: pct <= 3.0,
  };
}
