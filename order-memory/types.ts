import { ThemeIcon, ThemePalette } from '@/game/types';

export type OrderMemoryPhase =
  | 'howToPlay'
  | 'ready'
  | 'memorization'
  | 'transition'
  | 'answering'
  | 'paused'
  | 'success'
  | 'failure'
  | 'roundComplete'
  | 'gameOver';

export type OrderMemoryFeedbackTone = 'neutral' | 'success' | 'danger';

export type OrderMemoryFeedback = {
  message: string;
  tone: OrderMemoryFeedbackTone;
};

export type OrderMemoryItem = ThemeIcon;

export type OrderMemoryTheme = {
  id: string;
  gameName: string;
  themeName: string;
  palette: ThemePalette;
  promptTitle: string;
  promptBody: string;
  items: OrderMemoryItem[];
};

export type OrderMemoryDifficulty = {
  roundDurationSeconds: number;
  sequenceLength: number;
  showItemDurationMs: number;
  transitionDelayMs: number;
  answerBonusWindowSeconds: number;
};

export type OrderMemoryRoundResult = {
  accuracy: number;
  failedAtStep: number | null;
  isSuccess: boolean;
  pointsEarned: number;
  round: number;
  score: number;
  sequenceLength: number;
};
