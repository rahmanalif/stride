import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, Text, View } from 'react-native';

import { GardenIcon } from '@/game/components/GardenIcon';
import { OrderMemoryTheme } from '@/order-memory/types';

type HowToPlayModalProps = {
  onPlayNow: () => void;
  theme: OrderMemoryTheme;
  visible: boolean;
};

export function HowToPlayModal({ onPlayNow, theme, visible }: HowToPlayModalProps) {
  const previewItems = theme.items.slice(0, 4);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-[rgba(8,15,37,0.5)] px-6">
        <View
          className="w-full max-w-[360px] rounded-[32px] border px-7 py-5"
          style={{
            backgroundColor: theme.palette.panel,
            borderColor: 'rgba(255,255,255,0.6)',
            shadowColor: '#191C1D',
            shadowOpacity: 0.18,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 22 },
            elevation: 16,
          }}>
          <View className="mb-2 self-center rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(15, 82, 186, 0.1)' }}>
            <Text className="text-[12px] font-bold uppercase tracking-[1.2px]" style={{ color: theme.palette.primary }}>
              Quick Guide
            </Text>
          </View>
          <Text className="text-[34px] font-black leading-[40px] text-[#0040A1] py-4">How To Play</Text>
          <Text className="py-2 text-[18px] font-semibold leading-[26px]" style={{ color: theme.palette.secondary }}>
            {theme.gameName}
          </Text>

          <Text className="py-2 text-[18px] leading-[30px]" style={{ color: theme.palette.text }}>
            Watch each symbol appear one by one. When the full sequence ends, tap the same symbols back in
            the exact order.
          </Text>

          <View className="mt-7 rounded-[28px] px-5 py-6" style={{ backgroundColor: theme.palette.panelAlt }}>
            <View className="flex-row justify-between py-2">
              {previewItems.map((item, index) => (
                <View key={item.id} className="items-center">
                  <View className="h-14 w-14 items-center justify-center rounded-[18px] py-2 bg-white">
                    <GardenIcon icon={item} size={28} />
                  </View>
                  <Text className="mt-2 text-[12px] font-bold" style={{ color: theme.palette.secondary }}>
                    {index + 1}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="mt-5 text-center text-[15px] leading-6 py-2" style={{ color: theme.palette.text }}>
              Large buttons, calm pacing, and one step at a time so the round stays easy to follow.
            </Text>
          </View>

          <Pressable accessibilityRole="button" className="mt-8 overflow-hidden rounded-[22px]" onPress={onPlayNow}>
            <LinearGradient
              className="min-h-[58px] items-center justify-center"
              colors={['#0040A1', '#0056D2']}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}>
              <Text className="text-[20px] font-extrabold text-white">Play Now</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
