import { ORDER_MEMORY_RULES } from '@/order-memory/config';
import { OrderMemoryDifficulty, OrderMemoryItem } from '@/order-memory/types';

function shuffleItems<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  }

  return copy;
}

export function getRoundDifficulty(round: number): OrderMemoryDifficulty {
  return {
    roundDurationSeconds: Math.max(16, 28 - Math.floor((round - 1) / 2) * 2),
    sequenceLength: Math.min(3 + round - 1, 7),
    showItemDurationMs: Math.max(850, 1500 - (round - 1) * 90),
    transitionDelayMs: Math.max(180, 420 - (round - 1) * 24),
    answerBonusWindowSeconds: Math.max(8, 16 - round),
  };
}

export function generateTargetSequence(items: OrderMemoryItem[], length: number) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length }, () => items[Math.floor(Math.random() * items.length)]);
}

export function generateAnswerPool(items: OrderMemoryItem[]) {
  return shuffleItems(items.slice(0, ORDER_MEMORY_RULES.answerPoolSize));
}

export function calculateRoundPoints(
  difficulty: OrderMemoryDifficulty,
  answerSeconds: number,
  isSuccess: boolean
) {
  if (!isSuccess) {
    return 0;
  }

  const lengthBonus = difficulty.sequenceLength * 40;
  const speedBonus = Math.max(0, (difficulty.answerBonusWindowSeconds - answerSeconds) * 12);

  return ORDER_MEMORY_RULES.roundBasePoints + lengthBonus + speedBonus;
}

export function calculateAccuracy(correctCount: number, totalCount: number) {
  if (totalCount <= 0) {
    return 0;
  }

  return Math.round((correctCount / totalCount) * 100);
}

export function validateAnswerTap(expectedId: string, tappedId: string) {
  return expectedId === tappedId;
}
