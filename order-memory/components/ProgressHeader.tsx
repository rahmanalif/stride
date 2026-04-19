import { Text, View } from 'react-native';

import { OrderMemoryTheme } from '@/order-memory/types';

type ProgressHeaderProps = {
  compact?: boolean;
  mistakesLabel: string;
  round: number;
  score: number;
  theme: OrderMemoryTheme;
};

export function ProgressHeader({ compact = false, mistakesLabel, round, score, theme }: ProgressHeaderProps) {
  return (
    <View
      className={`flex-row items-center justify-between rounded-[24px] ${compact ? 'px-4 py-4' : 'px-6 py-6'}`}
      style={{
        backgroundColor: theme.palette.panelAlt,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}>
      <View>
        <Text className={`${compact ? 'text-[11px]' : 'text-[12px]'} font-semibold tracking-[1.2px]`} style={{ color: '#737785' }}>
          SCORE
        </Text>
        <Text className={`mt-1 ${compact ? 'text-[20px]' : 'text-[24px]'} font-extrabold text-[#191C1D]`}>
          {score.toLocaleString()}
        </Text>
      </View>

      <View className={`rounded-[16px] ${compact ? 'px-4 py-2' : 'px-6 py-2'}`} style={{ backgroundColor: 'rgba(0,64,161,0.1)' }}>
        <Text className={`${compact ? 'text-[16px]' : 'text-[18px]'} font-bold`} style={{ color: theme.palette.primary }}>
          Round {round}
        </Text>
      </View>

      <View className="items-end">
        <Text className={`${compact ? 'text-[11px]' : 'text-[12px]'} font-semibold tracking-[1.2px]`} style={{ color: '#737785' }}>
          MISTAKES
        </Text>
        <Text className={`mt-1 ${compact ? 'text-[20px]' : 'text-[24px]'} font-extrabold text-[#822800]`}>
          {mistakesLabel}
        </Text>
      </View>
    </View>
  );
}
