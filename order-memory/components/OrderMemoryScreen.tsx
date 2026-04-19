import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerGrid } from '@/order-memory/components/AnswerGrid';
import { HowToPlayModal } from '@/order-memory/components/HowToPlayModal';
import { MemorySequenceDisplay } from '@/order-memory/components/MemorySequenceDisplay';
import { ProgressHeader } from '@/order-memory/components/ProgressHeader';
import { RoundResultModal } from '@/order-memory/components/RoundResultModal';
import { ORDER_MEMORY_RULES, orderMemoryTheme } from '@/order-memory/config';
import { useOrderMemoryGame } from '@/order-memory/hooks/useOrderMemoryGame';
import { BottomNav, GameTab } from '@/time-accuracy/components/GameChrome';

type OrderMemoryScreenProps = {
  onSelectTab?: (tab: GameTab) => void;
  skipIntro?: boolean;
};

function getPhaseLabel(phase: string) {
  switch (phase) {
    case 'memorization':
      return 'Memorize';
    case 'answering':
      return 'Answer';
    case 'success':
      return 'Success';
    case 'failure':
      return 'Try Again';
    case 'transition':
      return 'Ready';
    case 'gameOver':
      return 'Complete';
    default:
      return 'Ready';
  }
}

function getPreviewMessage(phase: string) {
  switch (phase) {
    case 'memorization':
      return 'Remember this\nsequence';
    case 'answering':
      return 'Tap the sequence\nin order';
    case 'success':
      return 'Sequence\ncomplete';
    case 'failure':
      return 'Sequence\nbroken';
    case 'transition':
      return 'Get ready\nto answer';
    default:
      return 'Remember this\nsequence';
  }
}

export function OrderMemoryScreen({ onSelectTab, skipIntro = false }: OrderMemoryScreenProps) {
  const game = useOrderMemoryGame(orderMemoryTheme);
  const hasAutoStartedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isCompact = height < 820;
  const isFinalRound = game.round >= 8;
  const mistakesMade = game.failedAtStep ? 1 : 0;
  const mistakesLimit = ORDER_MEMORY_RULES.failOnMistake ? 1 : 3;
  const incorrectItemId =
    game.phase === 'failure' || (game.roundResult && !game.roundResult.isSuccess)
      ? game.selectedAnswers.at(-1)?.id ?? null
      : null;
  const primaryAction =
    game.roundResult?.isSuccess === false
      ? game.handleRetry
      : isFinalRound || game.phase === 'gameOver'
        ? game.handlePlayNow
        : game.handleNextRound;
  const primaryActionLabel =
    game.roundResult?.isSuccess === false
      ? 'Retry'
      : isFinalRound || game.phase === 'gameOver'
        ? 'Play Again'
        : 'Next Round';

  useEffect(() => {
    if (!skipIntro || hasAutoStartedRef.current || game.phase !== 'howToPlay') {
      return;
    }

    hasAutoStartedRef.current = true;
    game.handlePlayNow();
  }, [game.phase, skipIntro]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: orderMemoryTheme.palette.background }}>
      <HowToPlayModal onPlayNow={game.handlePlayNow} theme={orderMemoryTheme} visible={game.phase === 'howToPlay'} />
      <RoundResultModal
        onExitGame={game.handleExit}
        onPrimaryAction={primaryAction}
        primaryActionLabel={primaryActionLabel}
        result={game.roundResult}
        theme={orderMemoryTheme}
        visible={game.phase === 'roundComplete' || game.phase === 'gameOver'}
      />

      <View
        className="border-b border-[rgba(195,198,214,0.18)] bg-[rgba(255,255,255,0.8)]"
        style={{
          shadowColor: '#1E3A8A',
          shadowOpacity: 0.05,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}>
        <View className="h-16 flex-row items-center px-6">
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="h-8 w-8 items-center justify-center rounded-full"
            hitSlop={10}
            onPress={game.handleExit}>
            <MaterialCommunityIcons color={orderMemoryTheme.palette.primary} name="arrow-left" size={22} />
          </Pressable>
          <View className="flex-1 items-center px-4">
            <Text className="text-4xl font-semibold tracking-[-0.4px] text-[#1D4ED8]">Order Memory</Text>
          </View>
          <View className="h-8 w-8" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: isCompact ? 14 : 18,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: Math.max(insets.bottom, 12) + 110,
        }}
        showsVerticalScrollIndicator={false}>
        <ProgressHeader
          compact={isCompact}
          mistakesLabel={`${mistakesMade}/${mistakesLimit}`}
          round={game.round}
          score={game.score}
          theme={orderMemoryTheme}
        />

        <View style={{ paddingTop: isCompact ? 12 : 18 }}>
          <MemorySequenceDisplay
            compact={isCompact}
            currentItem={game.phase === 'memorization' ? game.currentPrompt : null}
            currentStep={
              game.phase === 'memorization'
                ? game.memorizationIndex
                : game.phase === 'answering'
                  ? game.currentAnswerIndex
                  : Math.max(game.targetSequence.length - 1, 0)
            }
            message={getPreviewMessage(game.phase)}
            sequenceLength={game.targetSequence.length}
            theme={orderMemoryTheme}
          />
        </View>

        <View style={{ paddingTop: isCompact ? 10 : 16 }}>
          <AnswerGrid
            compact={isCompact}
            disabled={game.phase !== 'answering'}
            incorrectItemId={incorrectItemId}
            items={game.availableOptions}
            onSelect={game.handleAnswerTap}
            selectedAnswers={game.selectedAnswers}
            theme={orderMemoryTheme}
          />
        </View>

        <View style={{ paddingTop: isCompact ? 10 : 14 }}>
          <View className={`${isCompact ? 'px-4' : 'px-8'}`}>
            <Text
              className={`text-center font-medium ${isCompact ? 'text-[14px] leading-[22px]' : 'text-[16px] leading-[26px]'}`}
              style={{ color: '#737785' }}>
              {game.phase === 'answering'
                ? 'Tap the symbols in the exact order they appeared on the screen.'
                : `${getPhaseLabel(game.phase)}: ${game.feedback.message}`}
            </Text>
            {!isCompact ? (
              <Text className="mt-1 text-center text-[16px] font-medium leading-[26px]" style={{ color: '#737785' }}>
                Focus on the colors and shapes.
              </Text>
            ) : null}
          </View>
        </View>

        <View className="items-center" style={{ paddingTop: isCompact ? 18 : 24 }}>
          {game.isPaused ? (
            <Text className="mb-3 text-[14px] font-semibold" style={{ color: orderMemoryTheme.palette.primary }}>
              Paused
            </Text>
          ) : null}
          <Pressable
            accessibilityLabel={game.isPaused ? 'Resume game' : 'Pause game'}
            accessibilityRole="button"
            disabled={!['ready', 'memorization', 'transition', 'answering', 'paused'].includes(game.phase)}
            hitSlop={10}
            onPress={game.togglePause}
            style={({ pressed }) => ({
              opacity: !['ready', 'memorization', 'transition', 'answering', 'paused'].includes(game.phase)
                ? 0.45
                : pressed
                  ? 0.9
                  : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}>
            <View
              className={`${isCompact ? 'h-12 w-12' : 'h-14 w-14'} items-center justify-center rounded-full`}
              style={{
                backgroundColor: orderMemoryTheme.palette.primary,
                shadowColor: '#0F52BA',
                shadowOpacity: 0.22,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              }}>
              <MaterialCommunityIcons color="#FFFFFF" name={game.isPaused ? 'play' : 'pause'} size={isCompact ? 18 : 22} />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav activeTab="order" onSelectTab={(tab) => onSelectTab?.(tab)} />
    </SafeAreaView>
  );
}
