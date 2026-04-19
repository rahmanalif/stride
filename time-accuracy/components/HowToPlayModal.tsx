import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, Text, View } from 'react-native';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';

type HowToPlayModalProps = {
  onPlayNow: () => void;
  visible: boolean;
};

export function HowToPlayModal({ onPlayNow, visible }: HowToPlayModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-[rgba(8,15,37,0.5)] px-6">
        <View
          className="w-full max-w-[340px] rounded-[32px] border px-7 py-8"
          style={{
            backgroundColor: TIME_ACCURACY_THEME.panel,
            borderColor: 'rgba(255,255,255,0.6)',
            shadowColor: '#191C1D',
            shadowOpacity: 0.18,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 22 },
            elevation: 16,
          }}>
          <View className="mb-4 self-center rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(15, 82, 186, 0.1)' }}>
            <Text className="text-[12px] font-bold uppercase tracking-[1.2px]" style={{ color: TIME_ACCURACY_THEME.primary }}>
              Quick Guide
            </Text>
          </View>
          <Text className="text-[34px] font-black leading-[40px]" style={{ color: TIME_ACCURACY_THEME.primary }}>
            How To Play
          </Text>
          <Text className="mt-2 text-[18px] font-semibold" style={{ color: TIME_ACCURACY_THEME.secondary }}>
            Time Accuracy Check
          </Text>

          <Text className="mt-8 text-[18px] leading-[30px]" style={{ color: TIME_ACCURACY_THEME.text }}>
            Each circle has a fixed red dot and a moving blue dot. Tap the whole grey circle when both dots
            overlap.
          </Text>

          <View
            className="mt-7 rounded-[28px] px-5 py-6"
            style={{ backgroundColor: TIME_ACCURACY_THEME.panelAlt }}>
            <Text className="text-center text-[16px] leading-7" style={{ color: TIME_ACCURACY_THEME.text }}>
              Two circles run at once for 30 seconds, so quick focus shifts and clean timing will raise your
              accuracy.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="mt-8 overflow-hidden rounded-[20px]"
            onPress={onPlayNow}>
            <LinearGradient
              className="min-h-[60px] items-center justify-center"
              colors={[TIME_ACCURACY_THEME.primary, TIME_ACCURACY_THEME.primaryAlt]}
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
