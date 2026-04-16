import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, Text, View } from 'react-native';

import { ThemeConfig } from '@/game/types';

type RoundResultModalProps = {
  accuracyLabel: string;
  hint?: string;
  mistakesLabel?: string;
  onExitGame: () => void;
  onPrimaryAction: () => void;
  pointsLabel?: string;
  primaryActionLabel: string;
  status: 'success' | 'failure';
  theme: ThemeConfig;
  timeLabel?: string;
  title: string;
  visible: boolean;
};

export function RoundResultModal({
  accuracyLabel,
  hint,
  mistakesLabel,
  onExitGame,
  onPrimaryAction,
  pointsLabel,
  primaryActionLabel,
  status,
  theme,
  timeLabel,
  title,
  visible,
}: RoundResultModalProps) {
  const isSuccess = status === 'success';
  const iconName = isSuccess ? 'check' : 'alert';
  const iconTint = isSuccess ? '#4E7A62' : '#7A6B6B';
  const iconBackground = isSuccess ? '#E5F3EA' : '#F3ECEC';
  const stats = isSuccess
    ? [
        { label: 'Score earned', value: pointsLabel ?? '+0 points' },
        { label: 'Time', value: timeLabel ?? '00:00' },
        { label: 'Accuracy', value: accuracyLabel },
      ]
    : [
        { label: 'Mistakes', value: mistakesLabel ?? '0/0' },
        { label: 'Accuracy', value: accuracyLabel },
      ];

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-[rgba(15,23,42,0.18)] px-6">
        <View
          className="w-full max-w-[360px] rounded-[32px] px-6 py-7"
          style={{
            backgroundColor: theme.palette.panel,
            shadowColor: '#191C1D',
            shadowOpacity: 0.1,
            shadowRadius: 26,
            shadowOffset: { width: 0, height: 16 },
            elevation: 14,
          }}>
          <View className="items-center">
            <View
              className="h-[68px] w-[68px] items-center justify-center rounded-full"
              style={{ backgroundColor: iconBackground }}>
              <MaterialCommunityIcons color={iconTint} name={iconName} size={30} />
            </View>
            <Text className="mt-5 text-center text-[28px] font-extrabold leading-9 text-[#1F2937]">{title}</Text>
            {hint ? (
              <Text
                className="mt-3 text-center text-[16px] leading-6"
                style={{ color: theme.palette.text }}>
                {hint}
              </Text>
            ) : null}
          </View>

          <View className="mt-6 rounded-[24px] px-5 py-2" style={{ backgroundColor: theme.palette.panelAlt }}>
            {stats.map((item, index) => (
              <View
                key={item.label}
                className="flex-row items-center justify-between py-4"
                style={
                  index < stats.length - 1
                    ? { borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,214,0.45)' }
                    : undefined
                }>
                <Text className="text-[15px] font-medium leading-6" style={{ color: theme.palette.mutedText }}>
                  {item.label}
                </Text>
                <Text className="text-[17px] font-extrabold leading-6 text-[#1F2937]">{item.value}</Text>
              </View>
            ))}
          </View>

          <View className="mt-6">
            <Pressable
              accessibilityRole="button"
              className="min-h-[56px] items-center justify-center rounded-[22px]"
              onPress={onPrimaryAction}
              style={({ pressed }) => ({
                backgroundColor: theme.palette.primary,
                opacity: pressed ? 0.92 : 1,
              })}>
              <Text className="text-[18px] font-extrabold text-white">{primaryActionLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              className="mt-3 min-h-[56px] items-center justify-center rounded-[22px] border"
              onPress={onExitGame}
              style={({ pressed }) => ({
                borderColor: 'rgba(15, 82, 186, 0.18)',
                backgroundColor: pressed ? '#F8FAFF' : theme.palette.panel,
              })}>
              <Text className="text-[17px] font-bold" style={{ color: theme.palette.primary }}>
                Exit Game
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
