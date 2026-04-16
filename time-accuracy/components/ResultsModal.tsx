import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, Text, View } from 'react-native';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';
import { RoundSummary } from '@/time-accuracy/types';

type ResultsModalProps = {
  onNextRound: () => void;
  onRetry: () => void;
  summary: RoundSummary | null;
  visible: boolean;
};

export function ResultsModal({ onNextRound, onRetry, summary, visible }: ResultsModalProps) {
  if (!summary) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-[rgba(15,23,42,0.2)] px-6">
        <View
          className="w-full max-w-[340px] rounded-[32px] px-6 py-7"
          style={{
            backgroundColor: TIME_ACCURACY_THEME.panel,
            shadowColor: '#191C1D',
            shadowOpacity: 0.12,
            shadowRadius: 26,
            shadowOffset: { width: 0, height: 18 },
            elevation: 14,
          }}>
          <View className="items-center">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-[#DFF3E8]">
              <MaterialCommunityIcons color="#4E7A62" name="check" size={30} />
            </View>
            <Text className="mt-5 text-[30px] font-extrabold leading-9" style={{ color: TIME_ACCURACY_THEME.heading }}>
              Round Complete
            </Text>
            <Text className="mt-3 text-center text-[16px] leading-6" style={{ color: TIME_ACCURACY_THEME.text }}>
              Clean timing and steady focus. Review your score and continue when ready.
            </Text>
          </View>

          <View className="mt-6 rounded-[24px] px-5 py-2" style={{ backgroundColor: TIME_ACCURACY_THEME.panelAlt }}>
            {[
              { label: 'Score', value: summary.score.toString() },
              { label: 'Accuracy', value: `${summary.accuracy}%` },
              { label: 'Hits', value: summary.hits.toString() },
              { label: 'Misses', value: summary.misses.toString() },
            ].map((item, index, items) => (
              <View
                key={item.label}
                className="flex-row items-center justify-between py-4"
                style={
                  index < items.length - 1
                    ? { borderBottomColor: 'rgba(195,198,214,0.45)', borderBottomWidth: 1 }
                    : undefined
                }>
                <Text className="text-[15px] font-medium" style={{ color: TIME_ACCURACY_THEME.mutedText }}>
                  {item.label}
                </Text>
                <Text className="text-[17px] font-extrabold" style={{ color: TIME_ACCURACY_THEME.heading }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-6">
            <Pressable
              accessibilityRole="button"
              className="min-h-[56px] items-center justify-center rounded-[22px]"
              onPress={onNextRound}
              style={({ pressed }) => ({
                backgroundColor: TIME_ACCURACY_THEME.primary,
                opacity: pressed ? 0.92 : 1,
              })}>
              <Text className="text-[18px] font-extrabold text-white">Next Round</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="mt-3 min-h-[56px] items-center justify-center rounded-[22px] border"
              onPress={onRetry}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#F8FAFF' : TIME_ACCURACY_THEME.panel,
                borderColor: 'rgba(15,82,186,0.18)',
              })}>
              <Text className="text-[17px] font-bold" style={{ color: TIME_ACCURACY_THEME.primary }}>
                Retry Round
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
