import { Text, View } from 'react-native';

import { ThemeConfig } from '@/game/types';

type ScoreBoardProps = {
  comboLabel: string;
  mistakes: number;
  mistakesRemaining: number;
  progressLabel: string;
  roundNumber: number;
  roundTimerLabel: string;
  roundTimerTone: 'normal' | 'warning' | 'danger';
  score: number;
  sessionTimerLabel: string;
  theme: ThemeConfig;
};

export function ScoreBoard({ comboLabel, mistakes, roundTimerLabel, roundTimerTone, score, theme }: ScoreBoardProps) {
  const timerColor =
    roundTimerTone === 'danger'
      ? '#B42318'
      : roundTimerTone === 'warning'
        ? '#B54708'
        : '#191C1D';
  const stats = [
    { label: 'Score', value: score.toString(), valueColor: theme.palette.primary },
    { label: 'Time Left', value: roundTimerLabel, valueColor: timerColor },
    // { label: 'Combo', value: comboLabel, valueColor: theme.palette.secondary },
    { label: 'Mistakes', value: `${mistakes}/${theme.mistakeLimit}`, valueColor: '#822800' },
  ];

  return (
    <View className="flex-row flex-wrap gap-3">
      {stats.map((item) => (
        <View
          key={item.label}
          className="flex-1 items-center rounded-[18px] px-4 py-[10px]"
          style={{ backgroundColor: theme.palette.panelAlt }}>
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
