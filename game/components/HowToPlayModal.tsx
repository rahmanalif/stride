import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { ThemeConfig } from '@/game/types';

type HowToPlayModalProps = {
  onPlayNow: () => void;
  theme: ThemeConfig;
  visible: boolean;
};

export function HowToPlayModal({ onPlayNow, theme, visible }: HowToPlayModalProps) {
  const { width: screenWidth } = useWindowDimensions();
  const previewIcons = theme.icons.slice(0, 3);
  const [skipHint, setSkipHint] = useState(false);
  const demoGrid = useMemo(
    () => Array.from({ length: 16 }, (_, index) => theme.icons[index % theme.icons.length]),
    [theme.icons]
  );
  const previewGridRows = useMemo(
    () => Array.from({ length: 4 }, (_, index) => demoGrid.slice(index * 4, index * 4 + 4)),
    [demoGrid]
  );
  const modalWidth = Math.min(Math.max(screenWidth - 44, 0), 360);
  const previewCardInnerWidth = modalWidth - 56 - 32;
  const previewGap = 12;
  const previewTileSize = Math.floor((previewCardInnerWidth - previewGap * 3) / 4);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-[rgba(248,250,251,0.96)] px-[22px] py-7">
        <View
          className="w-full max-w-[360px] gap-[18px] rounded-[36px] px-7 py-[34px]"
          style={{
            backgroundColor: theme.palette.panel,
            shadowColor: '#191C1D',
            shadowOpacity: 0.08,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 18 },
            elevation: 12,
          }}>
          <View className="gap-[6px]">
            <Text className="text-[36px] font-black leading-[44px] text-[#0040A1]">How To Play</Text>
            <Text className="text-[18px] font-semibold leading-[26px]" style={{ color: theme.palette.secondary }}>
              {theme.gameName}
            </Text>
          </View>

          <View className="gap-7">
            <Text className="text-[18px] font-normal leading-[30px]" style={{ color: theme.palette.text }}>
              Several symbols will appear at the top. Tap all matching symbols in the grid as quickly as
              possible.
            </Text>

            <View className="items-center gap-[18px] rounded-[32px] px-4 py-[22px]" style={{ backgroundColor: theme.palette.panelAlt }}>
              <View className="flex-row gap-[18px]">
                {previewIcons.map((icon) => (
                  <View key={icon.id} className="h-[58px] w-[58px] items-center justify-center rounded-[22px] bg-white">
                    <GardenIcon icon={icon} size={30} />
                  </View>
                ))}
              </View>

              <View className="w-full gap-y-3">
                {previewGridRows.map((row, rowIndex) => (
                  <View key={`preview-row-${rowIndex}`} className="flex-row justify-between">
                    {row.map((icon, iconIndex) => {
                      const index = rowIndex * 4 + iconIndex;
                      const isMatch = index === 2 || index === 9 || index === 15;

                      return (
                        <View
                          key={`${icon.id}-${index}`}
                          className="items-center justify-center rounded-[24px] bg-white"
                          style={{
                            width: previewTileSize,
                            height: previewTileSize,
                            ...(isMatch ? { borderWidth: 1.5, borderColor: 'rgba(15, 82, 186, 0.28)' } : null),
                          }}>
                          <GardenIcon color={isMatch ? theme.palette.primary : icon.accent} icon={icon} size={24} />
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            className="min-h-[60px] items-center justify-center rounded-[24px]"
            onPress={onPlayNow}
            style={({ pressed }) => ({
              backgroundColor: theme.palette.primary,
              opacity: pressed ? 0.92 : 1,
            })}>
            <Text className="text-[20px] font-extrabold text-white">Play Now</Text>
          </Pressable>

          <View className="min-h-[58px] items-center justify-center rounded-[24px] bg-[#E1E3E4]">
            <Text className="text-[18px] font-extrabold" style={{ color: theme.palette.secondary }}>
              Explore Other Games
            </Text>
          </View>

          <Pressable
            accessibilityRole="checkbox"
            className="flex-row items-center justify-center gap-[14px] pt-[6px]"
            onPress={() => setSkipHint((value) => !value)}>
            <View
              className="h-7 w-7 rounded-[9px] border bg-[#E1E3E4]"
              style={
                skipHint
                  ? { backgroundColor: '#DCE8FF', borderColor: '#A8C0F4' }
                  : { borderColor: '#C0C6D6' }
              }
            />
            <Text className="text-[16px] font-semibold leading-6" style={{ color: theme.palette.text }}>
              Don&apos;t show this again
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
