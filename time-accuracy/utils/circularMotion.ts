import { TapJudgment } from '@/time-accuracy/types';

function normalizeAngle(angle: number) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function advanceAngle(angle: number, speedDegPerSecond: number, deltaSeconds: number) {
  return normalizeAngle(angle + speedDegPerSecond * deltaSeconds);
}

export function getAngularDistance(angleA: number, angleB: number) {
  const normalizedA = normalizeAngle(angleA);
  const normalizedB = normalizeAngle(angleB);
  const direct = Math.abs(normalizedA - normalizedB);

  return Math.min(direct, 360 - direct);
}

export function judgeTap(distance: number, thresholds: { good: number; perfect: number }): TapJudgment {
  if (distance <= thresholds.perfect) {
    return 'perfect';
  }

  if (distance <= thresholds.good) {
    return 'good';
  }

  return 'miss';
}
