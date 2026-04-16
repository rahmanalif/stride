import { useState } from 'react';

import { GameScreen } from '@/game/components/GameScreen';
import { TimeAccuracyCheckScreen } from '@/time-accuracy/components/TimeAccuracyCheckScreen';

export default function IndexScreen() {
  const [activeGame, setActiveGame] = useState<'symbol' | 'time'>('time');

  if (activeGame === 'symbol') {
    return <GameScreen onSelectTab={setActiveGame} />;
  }

  return <TimeAccuracyCheckScreen onSelectTab={setActiveGame} />;
}
