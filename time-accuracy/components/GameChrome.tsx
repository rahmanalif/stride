import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';

type GameChromeProps = {
  onBack: () => void;
  title?: string;
};

export type GameTab = 'symbol' | 'order' | 'time';

type BottomNavProps = {
  activeTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
};

export function TopBar({ onBack, title = 'Time Accuracy Check' }: GameChromeProps) {
  return (
    <View
      className="flex-row items-center px-6 pt-3 pb-4 "
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
    { icon: 'format-list-bulleted', key: 'order', label: 'Order Memory' },
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
        const isActive = activeTab === item.key;

        return (
          <Pressable
            key={item.label}
            onPress={() => onSelectTab(item.key)}
            style={{ flex: 1, alignItems: 'center' }}>
            {isActive ? (
              <LinearGradient
                className="rounded-[24px] px-3 py-3"
                style={{ width: '100%', maxWidth: 110 }}
                colors={[TIME_ACCURACY_THEME.blue, TIME_ACCURACY_THEME.primaryAlt]}
                end={{ x: 0.85, y: 0.7 }}
                start={{ x: 0.1, y: 0.1 }}>
                <View className="min-h-[52px] items-center justify-center">
                  <MaterialCommunityIcons color="#FFFFFF" name={item.icon} size={18} />
                  <Text className="mt-1 text-center text-[11px] leading-[14px] text-white" numberOfLines={2}>
                    {item.label}
                  </Text>
                </View>
              </LinearGradient>
            ) : (
              <View className="rounded-[24px] px-3 py-3" style={{ width: '100%', maxWidth: 110 }}>
                <View className="min-h-[52px] items-center justify-center">
                  <MaterialCommunityIcons color={TIME_ACCURACY_THEME.secondary} name={item.icon} size={18} />
                  <Text
                    className="mt-1 text-center text-[11px] leading-[14px]"
                    numberOfLines={2}
                    style={{ color: TIME_ACCURACY_THEME.secondary }}>
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
