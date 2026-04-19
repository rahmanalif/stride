import { View } from 'react-native';

import { AnswerOptionButton } from '@/order-memory/components/AnswerOptionButton';
import { OrderMemoryItem, OrderMemoryTheme } from '@/order-memory/types';

type AnswerGridProps = {
  compact?: boolean;
  disabled?: boolean;
  incorrectItemId?: string | null;
  items: OrderMemoryItem[];
  onSelect: (item: OrderMemoryItem) => void;
  selectedAnswers: OrderMemoryItem[];
  theme: OrderMemoryTheme;
};

export function AnswerGrid({
  compact = false,
  disabled = false,
  incorrectItemId = null,
  items,
  onSelect,
  selectedAnswers,
  theme,
}: AnswerGridProps) {
  const filledItems = [...items];

  if (filledItems.length < 9) {
    const existingIds = new Set(filledItems.map((item) => item.id));
    const missingItems = theme.items.filter((item) => !existingIds.has(item.id));
    filledItems.push(...missingItems.slice(0, 9 - filledItems.length));
  }

  return (
    <View className={`flex-row flex-wrap justify-between ${compact ? 'gap-y-3 pt-2' : 'gap-y-4 pt-4'}`}>
      {filledItems.slice(0, 9).map((item) => {
        const selectedIndex = selectedAnswers.findIndex((selectedItem) => selectedItem.id === item.id);

        return (
          <View key={item.id} className="w-[31%]">
            <AnswerOptionButton
              compact={compact}
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
