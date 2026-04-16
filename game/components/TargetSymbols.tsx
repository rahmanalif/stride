import { Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { ThemeConfig } from '@/game/types';

type TargetSymbolsProps = {
  targetIds: string[];
  theme: ThemeConfig;
};

export function TargetSymbols({ targetIds, theme }: TargetSymbolsProps) {
  const targets = targetIds
    .map((targetId) => theme.icons.find((icon) => icon.id === targetId))
    .filter((icon) => Boolean(icon));

  return (
    <View className="gap-[14px]">
      <Text className="pl-2 text-[18px] font-bold leading-7" style={{ color: theme.palette.text }}>
        Find these symbols
      </Text>
      <View className="flex-row flex-wrap justify-center gap-4">
        {targets.map((icon) => (
          <View key={icon!.id} className="h-20 w-20 items-center justify-center rounded-[18px] bg-[#E1E3E4]">
            <GardenIcon icon={icon!} size={34} />
          </View>
        ))}
      </View>
    </View>
  );
}
