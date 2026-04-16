import { Text, View } from 'react-native';

import { RotatingTarget } from '@/time-accuracy/components/RotatingTarget';
import { RotatingTargetState } from '@/time-accuracy/types';

type AccuracyCheckBoardProps = {
  onTargetTap: (targetId: string) => void;
  targets: RotatingTargetState[];
};

export function AccuracyCheckBoard({ onTargetTap, targets }: AccuracyCheckBoardProps) {
  return (
    <View
      className="rounded-[32px] px-4 pt-6 pb-6"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(195,198,214,0.2)',
        borderWidth: 1,
        shadowColor: '#191C1D',
        shadowOpacity: 0.05,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
        elevation: 7,
      }}>
      <View className="items-center">
        <Text className="text-center text-[18px] font-bold leading-7 text-[#191C1D]">
          Tap when dots overlap
        </Text>
        <Text className="mt-2 max-w-[250px] text-center text-[14px] leading-[22px] text-[#424654]">
          Tap the grey circle area when the blue and red dots overlap.
        </Text>
      </View>

      <View
        className="pt-8"
        style={{
          marginTop: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
        {targets.map((target) => (
          <View key={target.id} style={{ flex: 1, alignItems: 'center' }}>
            <RotatingTarget onPress={() => onTargetTap(target.id)} state={target} />
          </View>
        ))}
      </View>
    </View>
  );
}
