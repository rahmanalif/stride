import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemeIcon } from '@/game/types';

type GardenIconProps = {
  color?: string;
  icon: ThemeIcon;
  size?: number;
};

export function GardenIcon({ color, icon, size = 28 }: GardenIconProps) {
  return <MaterialCommunityIcons color={color ?? icon.accent} name={icon.iconName as never} size={size} />;
}
