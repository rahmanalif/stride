import { Text, View } from 'react-native';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';

type ScoreHeaderProps = {
  stats: { emphasis?: boolean; label: string; value: string }[];
};

export function ScoreHeader({ stats }: ScoreHeaderProps) {
  return (
    <View className="flex-row gap-3">
      {stats.map((stat, index) => (
        <View
          key={stat.label}
          className="flex-1 items-center justify-center rounded-[12px] px-3 py-4"
          style={{
            backgroundColor: TIME_ACCURACY_THEME.panelAlt,
            ...(index === 1
              ? {
                  borderColor: 'rgba(0,64,161,0.1)',
                  borderWidth: 1.5,
                  backgroundColor: TIME_ACCURACY_THEME.panelAlt,
                }
              : null),
          }}>
          <Text className="text-[14px] font-medium" style={{ color: TIME_ACCURACY_THEME.secondary }}>
            {stat.label}
          </Text>
          <Text
            className="mt-1 text-[24px] font-extrabold"
            style={{ color: stat.emphasis ? TIME_ACCURACY_THEME.red : TIME_ACCURACY_THEME.blue }}>
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
