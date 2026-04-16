import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';

type GameChromeProps = {
  onBack: () => void;
  title?: string;
};

type BottomNavProps = {
  activeTab: 'symbol' | 'time';
  onSelectTab: (tab: 'symbol' | 'time') => void;
};

export function TopBar({ onBack, title = 'Time Accuracy Check' }: GameChromeProps) {
  return (
    <View
      className="flex-row items-center px-6 pt-3 pb-4"
      style={{ backgroundColor: 'rgba(248,250,251,0.92)' }}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        className="h-8 w-8 items-center justify-center rounded-full"
        onPress={onBack}>
        <MaterialCommunityIcons color={TIME_ACCURACY_THEME.primary} name="arrow-left" size={22} />
      </Pressable>
      <Text className="ml-4 text-[20px] font-bold tracking-[-0.5px]" style={{ color: TIME_ACCURACY_THEME.blue }}>
        {title}
      </Text>
    </View>
  );
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const items = [
    { icon: 'view-grid-outline', key: 'symbol', label: 'Symbol Tap' },
    { active: false, icon: 'format-list-bulleted', label: 'Order Memory' },
    { icon: 'timer-outline', key: 'time', label: 'Time Accuracy' },
  ] as const;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 12) + 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: 'rgba(248,250,251,0.94)',
        shadowColor: '#191C1D',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -4 },
        elevation: 18,
      }}>
      {items.map((item) => {
        if ('active' in item) {
          return (
            <View key={item.label} className="px-4 py-2 opacity-70">
              <View className="items-center">
                <MaterialCommunityIcons color={TIME_ACCURACY_THEME.secondary} name={item.icon} size={18} />
                <Text className="mt-1 text-[11px]" style={{ color: TIME_ACCURACY_THEME.secondary }}>
                  {item.label}
                </Text>
              </View>
            </View>
          );
        }

        const isActive = activeTab === item.key;

        return (
          <Pressable key={item.label} onPress={() => onSelectTab(item.key)}>
            {isActive ? (
              <LinearGradient
                className="rounded-[24px] px-4 py-2"
                colors={[TIME_ACCURACY_THEME.blue, TIME_ACCURACY_THEME.primaryAlt]}
                end={{ x: 0.85, y: 0.7 }}
                start={{ x: 0.1, y: 0.1 }}>
                <View className="min-w-[74px] items-center">
                  <MaterialCommunityIcons color="#FFFFFF" name={item.icon} size={18} />
                  <Text className="mt-1 text-[11px] text-white">{item.label}</Text>
                </View>
              </LinearGradient>
            ) : (
              <View className="px-4 py-2">
                <View className="min-w-[74px] items-center">
                  <MaterialCommunityIcons color={TIME_ACCURACY_THEME.secondary} name={item.icon} size={18} />
                  <Text className="mt-1 text-[11px]" style={{ color: TIME_ACCURACY_THEME.secondary }}>
                    {item.label}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
