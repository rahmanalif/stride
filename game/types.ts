export type IconId =
  | 'sunflower'
  | 'rose'
  | 'tulip'
  | 'sprout'
  | 'leaf'
  | 'butterfly'
  | 'bee'
  | 'shovel'
  | 'watering';

export type GridCellStatus = 'idle' | 'hit' | 'miss';

export interface ThemeIcon {
  id: IconId;
  label: string;
  shortLabel: string;
  iconName: string;
  accent: string;
}

export interface ThemePalette {
  background: string;
  panel: string;
  panelAlt: string;
  primary: string;
  secondary: string;
  text: string;
  mutedText: string;
  success: string;
  danger: string;
  shadow: string;
}

export interface ThemeConfig {
  id: string;
  gameName: string;
  themeName: string;
  promptTitle: string;
  promptBody: string;
  icons: ThemeIcon[];
  palette: ThemePalette;
  gridColumns: number;
  gridCellCount: number;
  targetRange: {
    min: number;
    max: number;
  };
  requiredMatchesRange: {
    min: number;
    max: number;
  };
  mistakeLimit: number;
  comboWindowMs: number;
  roundTimeRange: {
    min: number;
    max: number;
  };
}

export interface GridCell {
  id: string;
  iconId: IconId;
  status: GridCellStatus;
}

export interface RoundDefinition {
  id: number;
  columns: number;
  difficulty: 'normal' | 'hard';
  gridCellCount: number;
  roundTimeLimitSeconds: number;
  targetIds: IconId[];
  grid: GridCell[];
}

export interface FeedbackState {
  tone: 'neutral' | 'success' | 'danger';
  message: string;
}
