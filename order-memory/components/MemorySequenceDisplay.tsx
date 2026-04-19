import { Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type MemorySequenceDisplayProps = {
  compact?: boolean;
  currentItem: OrderMemoryItem | null;
  currentStep: number;
  message: string;
  sequenceLength: number;
  theme: OrderMemoryTheme;
};

export function MemorySequenceDisplay({
  compact = false,
  currentItem,
  currentStep,
  message,
  sequenceLength,
  theme,
}: MemorySequenceDisplayProps) {
  const shellPadding = compact ? 'px-6 py-8' : 'px-10 py-[72px]';
  const iconBox = compact ? 56 : 72;
  const iconSize = compact ? 52 : 68;
  const placeholderRadius = compact ? 18 : 24;
  const messageClass = compact ? 'mt-5 text-[17px] leading-6' : 'mt-8 text-[20px] leading-7';
  const dotsGap = compact ? 'gap-2' : 'gap-3';
  const dotsMargin = compact ? 'mt-5' : 'mt-8';

  return (
    <View
      className={`items-center rounded-[32px] border-2 ${shellPadding}`}
      style={{
        backgroundColor: theme.palette.panel,
        borderColor: 'rgba(195,198,214,0.2)',
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}>
      <View className="items-center justify-center" style={{ width: iconBox, height: iconBox }}>
        {currentItem ? (
          <GardenIcon color={theme.palette.secondary} icon={currentItem} size={iconSize} />
        ) : (
          <View
            className="items-center justify-center"
            style={{ width: iconBox, height: iconBox, borderRadius: placeholderRadius, backgroundColor: theme.palette.panelAlt }}>
            <Text className={`${compact ? 'text-[18px]' : 'text-[20px]'} font-bold`} style={{ color: theme.palette.secondary }}>
              ?
            </Text>
          </View>
        )}
      </View>

      <Text className={`${messageClass} text-center font-medium text-[#191C1D]`}>{message}</Text>

      <View className={`${dotsMargin} flex-row ${dotsGap}`}>
        {Array.from({ length: sequenceLength }).map((_, index) => {
          const isActive = index === Math.min(currentStep, Math.max(sequenceLength - 1, 0));
          const isCompleted = index < currentStep;

          return (
            <View
              key={`sequence-dot-${index}`}
              className={`${compact ? 'h-[10px] w-[10px]' : 'h-3 w-3'} rounded-full`}
              style={{
                backgroundColor: isCompleted || isActive ? theme.palette.secondary : '#E1E3E4',
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
