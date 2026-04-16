import { Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type MemorySequenceDisplayProps = {
  currentItem: OrderMemoryItem | null;
  currentStep: number;
  message: string;
  sequenceLength: number;
  theme: OrderMemoryTheme;
};

export function MemorySequenceDisplay({ currentItem, currentStep, message, sequenceLength, theme }: MemorySequenceDisplayProps) {
  return (
    <View
      className="items-center rounded-[40px] border-2 px-10 py-[72px]"
      style={{
        backgroundColor: theme.palette.panel,
        borderColor: 'rgba(195,198,214,0.2)',
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}>
      <View className="h-[72px] w-[72px] items-center justify-center">
        {currentItem ? (
          <GardenIcon color={theme.palette.secondary} icon={currentItem} size={68} />
        ) : (
          <View
            className="h-[72px] w-[72px] items-center justify-center rounded-[24px]"
            style={{ backgroundColor: theme.palette.panelAlt }}>
            <Text className="text-[20px] font-bold" style={{ color: theme.palette.secondary }}>
              ?
            </Text>
          </View>
        )}
      </View>

      <Text className="mt-8 text-center text-[20px] font-medium leading-7 text-[#191C1D]">{message}</Text>

      <View className="mt-8 flex-row gap-3">
        {Array.from({ length: sequenceLength }).map((_, index) => {
          const isActive = index === Math.min(currentStep, Math.max(sequenceLength - 1, 0));
          const isCompleted = index < currentStep;

          return (
            <View
              key={`sequence-dot-${index}`}
              className="h-3 w-3 rounded-full"
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
