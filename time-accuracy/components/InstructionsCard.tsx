import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';

export function InstructionsCard() {
  return (
    <View className="mt-6 flex-row rounded-[16px] px-5 py-6" style={{ backgroundColor: TIME_ACCURACY_THEME.panelAlt }}>
      <View
        className="mr-4 h-11 w-11 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: '#D7F0E1' }}>
        <MaterialCommunityIcons color={TIME_ACCURACY_THEME.secondary} name="information-outline" size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-[16px] font-bold" style={{ color: TIME_ACCURACY_THEME.heading }}>
          How to play
        </Text>
        <Text className="mt-1.5 text-[14px] leading-[23px]" style={{ color: TIME_ACCURACY_THEME.text }}>
          Watch both circles. The red dot stays fixed while the blue dot moves around the edge. Tap the grey
          circle when the two dots overlap to build accuracy.
        </Text>
      </View>
    </View>
  );
}
