import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, useWindowDimensions, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { GridCell, ThemeConfig } from '@/game/types';

type SymbolGridProps = {
  cells: GridCell[];
  columns: number;
  onCellPress: (cellId: string) => void;
  theme: ThemeConfig;
};

export function SymbolGrid({ cells, columns, onCellPress, theme }: SymbolGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = 48;
  const gap = 16;
  const gridWidth = Math.max(screenWidth - horizontalPadding, 0);
  const tileSize = Math.max(Math.floor((gridWidth - gap * (columns - 1)) / columns), 56);
  const iconSize = columns === 5 ? 22 : 30;
  const rows = Array.from({ length: Math.ceil(cells.length / columns) }, (_, index) =>
    cells.slice(index * columns, index * columns + columns)
  );

  return (
    <View className="gap-y-4">
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row justify-between">
          {row.map((cell) => {
            const icon = theme.icons.find((item) => item.id === cell.iconId);
            const isHit = cell.status === 'hit';
            const isMiss = cell.status === 'miss';
            const iconColor = isHit ? theme.palette.secondary : isMiss ? '#BA1A1A' : icon?.accent;

            return (
              <Pressable
                accessibilityLabel={`Symbol ${icon?.label ?? cell.iconId}`}
                accessibilityRole="button"
                className="items-center justify-center rounded-xl bg-white border-2 border-gray-200 p-4  "
                key={cell.id}
                onPress={() => onCellPress(cell.id)}
                style={({ pressed }) => ({
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: isHit ? theme.palette.success : isMiss ? theme.palette.danger : '#FFFFFF',
                  borderColor: isHit
                    ? 'rgba(71, 101, 84, 0.3)'
                    : isMiss
                      ? '#BA1A1A'
                      : 'rgba(195, 198, 214, 0.2)',
                  borderWidth: isMiss ? 2 : 1.5,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  shadowColor: '#000000',
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 2,
                })}>
                {icon ? <GardenIcon color={iconColor} icon={icon} size={iconSize} /> : null}
                {isHit ? (
                  <View
                    className="absolute items-center justify-center rounded-full"
                    style={{
                      top: -8,
                      right: -8,
                      width: 18,
                      height: 18,
                      backgroundColor: theme.palette.secondary,
                    }}>
                    <MaterialCommunityIcons color="#FFFFFF" name="check" size={10} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
