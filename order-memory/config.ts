import { gardeningTheme } from '@/game/config/themes';

import { OrderMemoryTheme } from '@/order-memory/types';

export const orderMemoryTheme: OrderMemoryTheme = {
  id: 'gardening-order-memory',
  gameName: 'Order Memory',
  themeName: 'Gardening',
  palette: gardeningTheme.palette,
  promptTitle: 'Memorize the shown sequence',
  promptBody:
    'Watch the gardening symbols one by one, then tap them back in the same order from the answer grid.',
  items: gardeningTheme.icons,
};

export const ORDER_MEMORY_RULES = {
  answerPoolSize: gardeningTheme.icons.length,
  failOnMistake: true,
  maxRounds: 8,
  readyDelayMs: 700,
  roundBasePoints: 100,
  showResultDelayMs: 600,
} as const;
