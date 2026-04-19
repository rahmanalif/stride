import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';
import { AccuracyCheckBoard } from '@/time-accuracy/components/AccuracyCheckBoard';
import { BottomNav, TopBar } from '@/time-accuracy/components/GameChrome';
import { HowToPlayModal } from '@/time-accuracy/components/HowToPlayModal';
import { InstructionsCard } from '@/time-accuracy/components/InstructionsCard';
import { ResultsModal } from '@/time-accuracy/components/ResultsModal';
import { ScoreHeader } from '@/time-accuracy/components/ScoreHeader';
import { GameTab } from '@/time-accuracy/components/GameChrome';
import { useAccuracyCheckGame } from '@/time-accuracy/hooks/useAccuracyCheckGame';

type TimeAccuracyCheckScreenProps = {
  onSelectTab?: (tab: GameTab) => void;
  skipIntro?: boolean;
};

export function TimeAccuracyCheckScreen({ onSelectTab, skipIntro = false }: TimeAccuracyCheckScreenProps) {
  const game = useAccuracyCheckGame();
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (!skipIntro || hasAutoStartedRef.current || game.status !== 'howToPlay') {
      return;
    }

    hasAutoStartedRef.current = true;
    game.handlePlayNow();
  }, [game.status, skipIntro]);

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

          <View
            className="mt-6 flex-row items-center justify-between rounded-[24px] p-6"
            style={{ backgroundColor: TIME_ACCURACY_THEME.panelAlt }}>
            <View>
              <Text className="text-[18px] font-extrabold leading-7" style={{ color: TIME_ACCURACY_THEME.heading }}>
                Round {game.round}
              </Text>
              <Text className="mt-[2px] max-w-[220px] text-[14px] leading-5" style={{ color: TIME_ACCURACY_THEME.text }}>
                {game.isPaused
                  ? 'Game paused. Tap play to continue this round.'
                  : `Hits ${game.hits}  |  Misses ${game.misses}  |  Streak ${game.streak}`}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={game.isPaused ? 'Resume game' : 'Pause game'}
              accessibilityRole="button"
              disabled={!['active', 'paused'].includes(game.status)}
              hitSlop={8}
              onPress={game.togglePause}
              style={({ pressed }) => ({
                opacity: !['active', 'paused'].includes(game.status) ? 0.55 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}>
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: TIME_ACCURACY_THEME.primary,
                  shadowColor: '#0F52BA',
                  shadowOpacity: 0.22,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                }}>
                <MaterialCommunityIcons color="#FFFFFF" name={game.isPaused ? 'play' : 'pause'} size={18} />
              </View>
            </Pressable>
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
