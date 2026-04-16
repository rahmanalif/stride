import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';
import { AccuracyCheckBoard } from '@/time-accuracy/components/AccuracyCheckBoard';
import { BottomNav, TopBar } from '@/time-accuracy/components/GameChrome';
import { HowToPlayModal } from '@/time-accuracy/components/HowToPlayModal';
import { InstructionsCard } from '@/time-accuracy/components/InstructionsCard';
import { ResultsModal } from '@/time-accuracy/components/ResultsModal';
import { ScoreHeader } from '@/time-accuracy/components/ScoreHeader';
import { useAccuracyCheckGame } from '@/time-accuracy/hooks/useAccuracyCheckGame';

type TimeAccuracyCheckScreenProps = {
  onSelectTab?: (tab: 'symbol' | 'time') => void;
};

export function TimeAccuracyCheckScreen({ onSelectTab }: TimeAccuracyCheckScreenProps) {
  const game = useAccuracyCheckGame();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: TIME_ACCURACY_THEME.background }}>
      <HowToPlayModal onPlayNow={game.handlePlayNow} visible={game.status === 'howToPlay'} />
      <ResultsModal
        onNextRound={game.handleNextRound}
        onRetry={game.handleRetry}
        summary={game.resultsSummary}
        visible={game.status === 'roundComplete'}
      />

      <TopBar onBack={game.handleExit} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-2">
          <ScoreHeader stats={game.headerStats} />

          <View className="mt-6">
            <AccuracyCheckBoard onTargetTap={game.handleTapTarget} targets={game.targets} />
          </View>

          <InstructionsCard />

          <View className="mt-5 items-center">
            <Text className="text-[13px]" style={{ color: TIME_ACCURACY_THEME.text }}>
              Round {game.round}  |  Hits {game.hits}  |  Misses {game.misses}  |  Streak {game.streak}
            </Text>
          </View>
        </View>
      </ScrollView>

      {game.status === 'countdown' ? (
        <View className="absolute inset-0 items-center justify-center bg-[rgba(248,250,251,0.72)]">
          <View
            className="h-24 w-24 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#191C1D',
              shadowOpacity: 0.08,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 10,
            }}>
            <Text className="text-[36px] font-black" style={{ color: TIME_ACCURACY_THEME.primary }}>
              {game.countdown}
            </Text>
          </View>
        </View>
      ) : null}

      <BottomNav activeTab="time" onSelectTab={(tab) => onSelectTab?.(tab)} />
    </SafeAreaView>
  );
}
