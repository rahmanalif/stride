import { View } from 'react-native';

import { AnswerOptionButton } from '@/order-memory/components/AnswerOptionButton';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type AnswerGridProps = {
  disabled?: boolean;
  incorrectItemId?: string | null;
  items: OrderMemoryItem[];
  onSelect: (item: OrderMemoryItem) => void;
  selectedAnswers: OrderMemoryItem[];
  theme: OrderMemoryTheme;
};

export function AnswerGrid({
  disabled = false,
  incorrectItemId = null,
  items,
  onSelect,
  selectedAnswers,
  theme,
}: AnswerGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-4 pt-4">
      {items.map((item) => {
        const selectedIndex = selectedAnswers.findIndex((selectedItem) => selectedItem.id === item.id);

        return (
          <View key={item.id} className="w-[31%]">
            <AnswerOptionButton
              disabled={disabled}
              isIncorrectSelection={incorrectItemId === item.id}
              item={item}
              onPress={onSelect}
              selectedOrder={selectedIndex >= 0 ? selectedIndex + 1 : null}
              theme={theme}
            />
          </View>
        );
      })}
    </View>
  );
}
