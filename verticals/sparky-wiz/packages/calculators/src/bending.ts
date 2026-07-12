export interface BendingInput {
  conduitType: string;
  conduitSize: string;
  bendAngle: number;
  stubLength?: number;
  offsetHeight?: number;
}

export interface BendingResult {
  shrink: number;
  bendMark: number;
  takeUp: number;
  totalLength: number;
}

const TAKE_UP_TABLE: Record<string, number> = {
  '1/2': 5,
  '3/4': 5,
  '1': 6,
  '1-1/4': 7,
  '1-1/2': 8,
  '2': 9,
  '2-1/2': 12,
  '3': 14,
  '3-1/2': 16,
  '4': 18,
};

function getTakeUp(conduitSize: string): number {
  return TAKE_UP_TABLE[conduitSize] ?? 6;
}

export function calculateBending(input: BendingInput): BendingResult {
  const tu = getTakeUp(input.conduitSize);

  const shrinkFactor =
    input.bendAngle === 30 ? 0.25 :
    input.bendAngle === 45 ? 0.414 :
    input.bendAngle === 60 ? 0.577 : 0;

  let shrink = 0;
  let bendMark = 0;
  let totalLength = 0;

  if (input.stubLength !== undefined) {
    bendMark = input.stubLength + tu;
    totalLength = bendMark;
    shrink = 0;
  } else if (input.offsetHeight !== undefined) {
    const distance = input.offsetHeight / Math.sin((input.bendAngle * Math.PI) / 180);
    shrink = input.offsetHeight * shrinkFactor;
    bendMark = 0;
    totalLength = distance + shrink;
  }

  return {
    shrink,
    bendMark,
    takeUp: tu,
    totalLength,
  };
}
