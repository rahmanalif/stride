import { useState } from 'react';

import { GameScreen } from '@/game/components/GameScreen';
import { OrderMemoryScreen } from '@/order-memory/components/OrderMemoryScreen';
import { TimeAccuracyCheckScreen } from '@/time-accuracy/components/TimeAccuracyCheckScreen';
import { GameTab } from '@/time-accuracy/components/GameChrome';

export default function IndexScreen() {
  const [activeGame, setActiveGame] = useState<GameTab>('time');

  if (activeGame === 'symbol') {
    return <GameScreen onSelectTab={setActiveGame} />;
  }

  if (activeGame === 'order') {
    return <OrderMemoryScreen onSelectTab={setActiveGame} />;
  }

  return <TimeAccuracyCheckScreen onSelectTab={setActiveGame} />;
}
