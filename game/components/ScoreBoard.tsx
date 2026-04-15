import { Text, View } from 'react-native';

import { ThemeConfig } from '@/game/types';

type ScoreBoardProps = {
  mistakes: number;
  mistakesRemaining: number;
  progressLabel: string;
  roundNumber: number;
  roundTimerLabel: string;
  score: number;
  sessionTimerLabel: string;
  theme: ThemeConfig;
};

export function ScoreBoard({ mistakes, roundTimerLabel, score, theme }: ScoreBoardProps) {
  const stats = [
    { label: 'Score', value: score.toString(), valueColor: theme.palette.primary },
    { label: 'Timer', value: roundTimerLabel, valueColor: '#191C1D' },
    { label: 'Mistakes', value: `${mistakes}/${theme.mistakeLimit}`, valueColor: '#822800' },
  ];

  return (
    <View className="flex-row gap-3">
      {stats.map((item) => (
        <View key={item.label} className="flex-1 items-center rounded-[18px] px-4 py-[18px]" style={{ backgroundColor: theme.palette.panelAlt }}>
          <Text className="text-[14px] font-semibold leading-5" style={{ color: theme.palette.secondary }}>
            {item.label}
          </Text>
          <Text className="mt-[6px] text-[22px] font-extrabold leading-[30px]" style={{ color: item.valueColor }}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
