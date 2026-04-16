export type TapJudgment = 'perfect' | 'good' | 'miss';

export type CircleFeedbackTone = 'idle' | TapJudgment;

export type GameStatus =
  | 'idle'
  | 'howToPlay'
  | 'countdown'
  | 'active'
  | 'paused'
  | 'roundComplete'
  | 'gameOver';

export type RotatingTargetState = {
  angleRed: number;
  angleBlue: number;
  feedbackTone: CircleFeedbackTone;
  id: string;
  redSpeed: number;
  blueSpeed: number;
};

export type RoundSummary = {
  accuracy: number;
  hits: number;
  misses: number;
  round: number;
  score: number;
};
