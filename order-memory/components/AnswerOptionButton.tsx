import { Pressable, Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type AnswerOptionButtonProps = {
  disabled?: boolean;
  isIncorrectSelection?: boolean;
  item: OrderMemoryItem;
  onPress: (item: OrderMemoryItem) => void;
  selectedOrder: number | null;
  theme: OrderMemoryTheme;
};

export function AnswerOptionButton({
  disabled = false,
  isIncorrectSelection = false,
  item,
  onPress,
  selectedOrder,
  theme,
}: AnswerOptionButtonProps) {
  const isSelected = selectedOrder !== null;
  const backgroundColor = isIncorrectSelection ? theme.palette.danger : isSelected ? theme.palette.success : theme.palette.panel;
  const borderColor = isIncorrectSelection
    ? 'rgba(186,26,26,0.2)'
    : isSelected
      ? 'rgba(71,101,84,0.2)'
      : 'rgba(195,198,214,0.2)';
  const shadowColor = isIncorrectSelection ? 'rgba(186,26,26,0.2)' : isSelected ? 'rgba(71,101,84,0.2)' : 'transparent';
  const labelColor = isIncorrectSelection ? '#93000A' : isSelected ? '#4B6958' : '#737785';
  const iconColor = isIncorrectSelection ? '#BA1A1A' : isSelected ? theme.palette.secondary : '#475569';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => onPress(item)}
      style={({ pressed }) => ({
        opacity: disabled ? 0.6 : pressed ? 0.88 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <View
        className="min-h-[120px] items-center justify-center rounded-[24px] border-2 px-3 py-4"
        style={{
          backgroundColor,
          borderColor,
          shadowColor,
          shadowOpacity: isSelected || isIncorrectSelection ? 1 : 0,
          shadowRadius: isSelected || isIncorrectSelection ? 0 : 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: 0,
        }}>
        <GardenIcon color={iconColor} icon={item} size={30} />
        <Text className="mt-3 text-center text-[16px] font-semibold" style={{ color: labelColor }}>
          {item.label}
        </Text>
        {selectedOrder ? (
          <Text className="mt-1 text-[12px] font-bold tracking-[0.6px]" style={{ color: labelColor }}>
            {isIncorrectSelection ? 'WRONG' : `STEP ${selectedOrder}`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
