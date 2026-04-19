import { useState } from 'react';

import { GameScreen } from '@/game/components/GameScreen';
import { OrderMemoryScreen } from '@/order-memory/components/OrderMemoryScreen';
import { TimeAccuracyCheckScreen } from '@/time-accuracy/components/TimeAccuracyCheckScreen';
import { GameTab } from '@/time-accuracy/components/GameChrome';

export default function IndexScreen() {
  const [activeGame, setActiveGame] = useState<GameTab>('time');
  const [navigationSource, setNavigationSource] = useState<'initial' | 'tab'>('initial');

  const handleSelectGame = (tab: GameTab) => {
    setNavigationSource('tab');
    setActiveGame(tab);
  };

  if (activeGame === 'symbol') {
    return <GameScreen onSelectTab={handleSelectGame} skipIntro={navigationSource === 'tab'} />;
  }

  if (activeGame === 'order') {
    return <OrderMemoryScreen onSelectTab={handleSelectGame} skipIntro={navigationSource === 'tab'} />;
  }

  return <TimeAccuracyCheckScreen onSelectTab={handleSelectGame} skipIntro={navigationSource === 'tab'} />;
}
