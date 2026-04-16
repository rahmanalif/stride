import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gardeningTheme } from '@/game/config/themes';
import { HowToPlayModal } from '@/game/components/HowToPlayModal';
import { RoundResultModal } from '@/game/components/RoundResultModal';
import { ScoreBoard } from '@/game/components/ScoreBoard';
import { SymbolGrid } from '@/game/components/SymbolGrid';
import { TargetSymbols } from '@/game/components/TargetSymbols';
import { useSymbolTapGame } from '@/game/hooks/useSymbolTapGame';

export function GameScreen() {
  const game = useSymbolTapGame(gardeningTheme);

  const handleBackPress = () => {
    game.returnToIntro();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: gardeningTheme.palette.background }}>
      <HowToPlayModal onPlayNow={game.startGame} theme={gardeningTheme} visible={!game.hasStarted} />
      <RoundResultModal
        accuracyLabel={game.roundResult?.accuracyLabel ?? game.accuracyLabel}
        hint={game.roundResult?.hint}
        mistakesLabel={game.roundResult?.mistakesLabel}
        onExitGame={game.returnToIntro}
        onPrimaryAction={game.retryRound}
        primaryActionLabel="Retry"
        status="failure"
        theme={gardeningTheme}
        timeLabel={game.roundResult?.timeLabel}
        title="Try Again"
        visible={game.roundResult?.status === 'failure'}
      />

      <View className="border-b bg-[rgba(255,255,255,0.92)] border-[rgba(195,198,214,0.35)]">
        <View className="h-16 flex-row items-center px-6">
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBackPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}>
            <MaterialCommunityIcons color={gardeningTheme.palette.primary} name="arrow-left" size={22} />
          </Pressable>
          <Text className="ml-4 text-[18px] font-bold leading-7 text-[#1E3A8A]">Symbol Tap</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 132 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <ScoreBoard
            comboLabel={game.comboLabel}
            mistakes={game.mistakes}
            mistakesRemaining={game.mistakesRemaining}
            progressLabel={game.progressLabel}
            roundNumber={game.roundNumber}
            roundTimerLabel={game.roundTimerLabel}
            roundTimerTone={game.roundTimerTone}
            score={game.score}
            sessionTimerLabel={game.sessionTimerLabel}
            theme={gardeningTheme}
          />

          <View className="mt-8">
            <TargetSymbols targetIds={game.currentRound.targetIds} theme={gardeningTheme} />
          </View>

          <View className="mt-8">
            <SymbolGrid
              cells={game.currentRound.grid}
              columns={game.currentRound.columns}
              onCellPress={game.handleCellPress}
              theme={gardeningTheme}
            />
          </View>

          <View className="mt-8 flex-row items-center justify-between rounded-[24px] p-6" style={{ backgroundColor: gardeningTheme.palette.panelAlt }}>
            <View>
              <Text className="text-[18px] font-extrabold leading-7 text-[#191C1D]">Round {game.roundNumber || 1}</Text>
              <Text className="mt-[2px] max-w-[220px] text-[14px] leading-5" numberOfLines={2} style={{ color: gardeningTheme.palette.text }}>
                {game.feedback.tone === 'neutral'
                  ? `Find all targets before time runs out. Combo window: ${game.comboWindowSeconds}s.`
                  : game.feedback.message}
              </Text>
            </View>
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: gardeningTheme.palette.primary,
                shadowColor: '#0F52BA',
                shadowOpacity: 0.22,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,
              }}>
              <MaterialCommunityIcons color="#FFFFFF" name="pause" size={16} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row justify-between rounded-t-[28px] bg-[rgba(255,255,255,0.96)] px-7 pt-4 pb-6"
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 18,
        }}>
        <View className="min-w-[72px] items-center justify-center rounded-[16px] bg-[#EFF6FF] px-4 py-2">
          <MaterialCommunityIcons color={gardeningTheme.palette.primary} name="gamepad-variant" size={20} />
          <Text className="mt-1 text-[14px] font-medium leading-5 text-[#1E40AF]">Play</Text>
        </View>
        <View className="min-w-[72px] items-center justify-center rounded-[16px] px-4 py-2">
          <MaterialCommunityIcons color="#64748B" name="poll" size={20} />
          <Text className="mt-1 text-[14px] font-medium leading-5 text-[#64748B]">Scores</Text>
        </View>
        <View className="min-w-[72px] items-center justify-center rounded-[16px] px-4 py-2">
          <MaterialCommunityIcons color="#64748B" name="account-outline" size={20} />
          <Text className="mt-1 text-[14px] font-medium leading-5 text-[#64748B]">Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
