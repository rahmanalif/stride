import { ThemeConfig } from '@/game/types';

export const gardeningTheme: ThemeConfig = {
  id: 'gardening',
  gameName: 'Symbol Tap',
  themeName: 'Gardening',
  promptTitle: 'Train quick garden matching',
  promptBody:
    'Spot the garden symbols shown at the top, then tap every matching tile in the grid as quickly and accurately as you can.',
  icons: [
    { id: 'sunflower', label: 'Plant Pot', shortLabel: 'POT', iconName: 'pot-outline', accent: '#4B6958' },
    { id: 'rose', label: 'Leaf', shortLabel: 'LEAF', iconName: 'leaf', accent: '#4B6958' },
    { id: 'tulip', label: 'Water Drop', shortLabel: 'DROP', iconName: 'water-outline', accent: '#0F52BA' },
    { id: 'sprout', label: 'Sprout', shortLabel: 'SPRT', iconName: 'sprout-outline', accent: '#4B6958' },
    { id: 'leaf', label: 'Garden Grid', shortLabel: 'GRID', iconName: 'view-grid-outline', accent: '#C0C6D6' },
    { id: 'butterfly', label: 'Sunlight', shortLabel: 'SUN', iconName: 'white-balance-sunny', accent: '#C0C6D6' },
    { id: 'bee', label: 'Bloom', shortLabel: 'FLOW', iconName: 'flower-pollen-outline', accent: '#C0C6D6' },
    { id: 'shovel', label: 'Seed', shortLabel: 'SEED', iconName: 'seed-outline', accent: '#C0C6D6' },
    { id: 'watering', label: 'Watering Can', shortLabel: 'WATR', iconName: 'watering-can-outline', accent: '#4B6958' },
  ],
  palette: {
    background: '#F8FAFB',
    panel: '#FFFFFF',
    panelAlt: '#F2F4F5',
    primary: '#0F52BA',
    secondary: '#476554',
    text: '#424654',
    mutedText: '#64748B',
    success: '#C6E8D2',
    danger: '#FFDAD6',
    shadow: 'rgba(25, 28, 29, 0.08)',
  },
  gridColumns: 4,
  gridCellCount: 16,
  targetRange: {
    min: 2,
    max: 4,
  },
  requiredMatchesRange: {
    min: 2,
    max: 3,
  },
  mistakeLimit: 3,
  comboWindowMs: 2600,
  roundTimeRange: {
    min: 20,
    max: 30,
  },
};
