/**
 * Dartboard Geometry & Scoring Utilities
 * Based on official dartboard dimensions
 */

// Standard dartboard dimensions (in mm, we'll scale for display)
// Based on official specifications from dimensions.com
// NOTE: Bulls are measured as RADIUS (half diameter), rings measured as RADIUS from center
export const DARTBOARD_DIMENSIONS = {
  TOTAL_RADIUS: 225.5, // 451mm diameter / 2 = 225.5mm radius
  DOUBLE_OUTER: 170, // 6.69" | 170mm from center to outer edge
  DOUBLE_INNER: 162, // 170 - 8 (ring width) = 162mm from center to inner edge
  TRIPLE_OUTER: 107, // 4.21" | 107mm from center to outer edge
  TRIPLE_INNER: 99, // 107 - 8 (ring width) = 99mm from center to inner edge
  OUTER_BULL: 16, // 1.26" | 32mm diameter / 2 = 16mm radius
  BULL: 6.35, // 0.5" | 12.7mm diameter / 2 = 6.35mm radius
} as const;

// The dartboard number sequence (clockwise from top)
export const DARTBOARD_NUMBERS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
] as const;

// Colors for dartboard segments
export const COLORS = {
  BLACK: '#000000',
  WHITE: '#F5E6D3',
  RED: '#DC143C',
  GREEN: '#228B22',
  BULL: '#DC143C',
  OUTER_BULL: '#228B22',
  BACKGROUND: '#1a1a1a',
} as const;

/**
 * Convert cartesian coordinates to polar coordinates
 */
export function cartesianToPolar(x: number, y: number): { radius: number; angle: number } {
  const radius = Math.sqrt(x * x + y * y);
  let angle = Math.atan2(y, x) * (180 / Math.PI);

  // Normalise angle to 0-360 range, starting from top (12 o'clock)
  angle = (angle + 90 + 360) % 360;

  return { radius, angle };
}

/**
 * Get the segment number based on angle (0-360)
 */
export function getSegmentNumber(angle: number): number {
  // Each segment is 18 degrees (360 / 20)
  // Offset by 9 degrees so segments are centered on their numbers
  const adjustedAngle = (angle + 9) % 360;
  const segmentIndex = Math.floor(adjustedAngle / 18);
  return DARTBOARD_NUMBERS[segmentIndex];
}

/**
 * Determine what type of hit this is and calculate score
 */
export function calculateScore(
  x: number,
  y: number,
  scale: number = 1
): {
  score: number;
  multiplier: 1 | 2 | 3;
  segmentNumber: number;
  region: 'miss' | 'single' | 'double' | 'triple' | 'outer-bull' | 'bull';
  description: string;
} {
  const { radius, angle } = cartesianToPolar(x, y);
  const scaledRadius = radius / scale;

  // Bullseye
  if (scaledRadius <= DARTBOARD_DIMENSIONS.BULL) {
    return {
      score: 50,
      multiplier: 1,
      segmentNumber: 0,
      region: 'bull',
      description: "Bullseye! 50 points",
    };
  }

  // Outer bull (25 ring)
  if (scaledRadius <= DARTBOARD_DIMENSIONS.OUTER_BULL) {
    return {
      score: 25,
      multiplier: 1,
      segmentNumber: 0,
      region: 'outer-bull',
      description: 'Outer Bull - 25 points',
    };
  }

  // Outside the dartboard
  if (scaledRadius > DARTBOARD_DIMENSIONS.TOTAL_RADIUS) {
    return {
      score: 0,
      multiplier: 1,
      segmentNumber: 0,
      region: 'miss',
      description: 'Miss!',
    };
  }

  // Get segment number for scoring
  const segmentNumber = getSegmentNumber(angle);

  // Triple ring
  if (
    scaledRadius >= DARTBOARD_DIMENSIONS.TRIPLE_INNER &&
    scaledRadius <= DARTBOARD_DIMENSIONS.TRIPLE_OUTER
  ) {
    return {
      score: segmentNumber * 3,
      multiplier: 3,
      segmentNumber,
      region: 'triple',
      description: `Triple ${segmentNumber}!`,
    };
  }

  // Double ring
  if (
    scaledRadius >= DARTBOARD_DIMENSIONS.DOUBLE_INNER &&
    scaledRadius <= DARTBOARD_DIMENSIONS.DOUBLE_OUTER
  ) {
    return {
      score: segmentNumber * 2,
      multiplier: 2,
      segmentNumber,
      region: 'double',
      description: `Double ${segmentNumber}!`,
    };
  }

  // Single (anywhere else on the board)
  return {
    score: segmentNumber,
    multiplier: 1,
    segmentNumber,
    region: 'single',
    description: `${segmentNumber}`,
  };
}

/**
 * Check if a segment should be dark or light coloured
 * (alternating pattern around the board)
 */
export function isSegmentDark(segmentIndex: number): boolean {
  return segmentIndex % 2 === 0;
}
