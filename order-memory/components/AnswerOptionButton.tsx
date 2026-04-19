import { Pressable, Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type AnswerOptionButtonProps = {
  compact?: boolean;
  disabled?: boolean;
  isIncorrectSelection?: boolean;
  item: OrderMemoryItem;
  onPress: (item: OrderMemoryItem) => void;
  selectedOrder: number | null;
  theme: OrderMemoryTheme;
};

export function AnswerOptionButton({
  compact = false,
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
        className={`${compact ? 'min-h-[84px] rounded-[18px] px-2 py-2' : 'min-h-[104px] rounded-[20px] px-2 py-3'} items-center justify-center border-2`}
        style={{
          backgroundColor,
          borderColor,
          shadowColor,
          shadowOpacity: isSelected || isIncorrectSelection ? 1 : 0,
          shadowRadius: isSelected || isIncorrectSelection ? 0 : 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: 0,
        }}>
        <GardenIcon color={iconColor} icon={item} size={compact ? 20 : 24} />
        <Text className={`text-center font-semibold ${compact ? 'mt-1 text-[12px] leading-[14px]' : 'mt-2 text-[13px] leading-4'}`} style={{ color: labelColor }}>
          {item.label}
        </Text>
        {selectedOrder ? (
          <Text className={`${compact ? 'mt-[2px] text-[10px]' : 'mt-1 text-[11px]'} font-bold tracking-[0.4px]`} style={{ color: labelColor }}>
            {isIncorrectSelection ? 'WRONG' : `STEP ${selectedOrder}`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
