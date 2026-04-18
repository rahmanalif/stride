import { useEffect, useRef, useState } from 'react';

import { FeedbackState, GridCell, ThemeConfig } from '@/game/types';
import { countTargetCells, generateRound } from '@/game/utils/roundGenerator';

type RoundStatus = 'idle' | 'playing' | 'paused' | 'transition';
type RoundResult =
  | {
      accuracyLabel: string;
      hint?: string;
      mistakesLabel?: string;
      nextRoundNumber: number;
      pointsLabel?: string;
      status: 'success' | 'failure';
      timeLabel: string;
      title: string;
    }
  | null;

const defaultFeedback: FeedbackState = {
  tone: 'neutral',
  message: 'Match every garden symbol shown above.',
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function useSymbolTapGame(theme: ThemeConfig) {
  const [roundNumber, setRoundNumber] = useState(0);
  const [currentRound, setCurrentRound] = useState(() => generateRound(theme, 1));
  const [score, setScore] = useState(0);
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mistakesRemaining, setMistakesRemaining] = useState(theme.mistakeLimit);
  const [correctSelections, setCorrectSelections] = useState(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>('idle');
  const [feedback, setFeedback] = useState<FeedbackState>(defaultFeedback);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [comboCount, setComboCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackBeforePauseRef = useRef<FeedbackState>(defaultFeedback);

  const clearScheduledWork = () => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current = [];

    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
  };

  const getMultiplierForCombo = (nextComboCount: number) => {
    if (nextComboCount >= 6) {
      return 3;
    }

    if (nextComboCount >= 3) {
      return 2;
    }

    return 1;
  };

  const resetCombo = () => {
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }

    setComboCount(0);
    setMultiplier(1);
  };

  const armComboWindow = () => {
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }

    comboTimeoutRef.current = setTimeout(() => {
      setComboCount(0);
      setMultiplier(1);
      comboTimeoutRef.current = null;
    }, theme.comboWindowMs);
  };

  const beginRound = (nextRoundNumber: number, options?: { resetMistakes?: boolean }) => {
    clearScheduledWork();
    const nextRound = generateRound(theme, nextRoundNumber);
    const shouldResetMistakes = options?.resetMistakes ?? false;

    setCurrentRound(nextRound);
    setRoundNumber(nextRoundNumber);
    setRoundSeconds(0);
    if (shouldResetMistakes) {
      setMistakes(0);
      setMistakesRemaining(theme.mistakeLimit);
    }
    setCorrectSelections(0);
    setFeedback(defaultFeedback);
    setRoundStatus('playing');
    setRoundResult(null);
    setComboCount(0);
    setMultiplier(1);
  };

  const startGame = () => {
    setHasStarted(true);
    setScore(0);
    setSessionSeconds(0);
    beginRound(1, { resetMistakes: true });
  };

  const returnToIntro = () => {
    clearScheduledWork();
    setHasStarted(false);
    setRoundNumber(0);
    setCurrentRound(generateRound(theme, 1));
    setScore(0);
    setRoundSeconds(0);
    setSessionSeconds(0);
    setMistakes(0);
    setMistakesRemaining(theme.mistakeLimit);
    setCorrectSelections(0);
    setRoundStatus('idle');
    setFeedback(defaultFeedback);
    setRoundResult(null);
    setComboCount(0);
    setMultiplier(1);
  };

  const togglePause = () => {
    if (!hasStarted) {
      return;
    }

    if (roundStatus === 'playing') {
      feedbackBeforePauseRef.current = feedback;
      resetCombo();
      setRoundStatus('paused');
      setFeedback({
        tone: 'neutral',
        message: 'Game paused. Tap play to continue this round.',
      });
      return;
    }

    if (roundStatus === 'paused') {
      setRoundStatus('playing');
      setFeedback(feedbackBeforePauseRef.current);
    }
  };

  const totalTargets = countTargetCells(currentRound.grid, currentRound.targetIds);

  useEffect(() => {
    if (!hasStarted || roundStatus !== 'playing') {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setRoundSeconds((value) => {
        const nextValue = value + 1;

        if (nextValue >= currentRound.roundTimeLimitSeconds) {
          clearInterval(intervalId);
          resetCombo();
          setRoundStatus('transition');
          setFeedback({
            tone: 'danger',
            message: 'Time is up. Take a breath and try the round again.',
          });
          setRoundResult({
            accuracyLabel: `${Math.round((correctSelections / Math.max(correctSelections + mistakes, 1)) * 100)}%`,
            hint: 'Focus on the targets first, then scan row by row.',
            mistakesLabel: `${mistakes}/${theme.mistakeLimit}`,
            nextRoundNumber: roundNumber,
            status: 'failure',
            timeLabel: formatSeconds(currentRound.roundTimeLimitSeconds),
            title: 'Round Failed',
          });

          return currentRound.roundTimeLimitSeconds;
        }

        return nextValue;
      });
      setSessionSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [correctSelections, currentRound.roundTimeLimitSeconds, hasStarted, mistakes, roundNumber, roundStatus, theme.mistakeLimit]);

  useEffect(() => {
    return () => clearScheduledWork();
  }, []);

  const queueNextRound = (nextRoundNumber: number, delayMs: number) => {
    const timeoutId = setTimeout(() => beginRound(nextRoundNumber), delayMs);
    timeoutRefs.current.push(timeoutId);
  };

  const handleRoundComplete = (
    updatedGrid: GridCell[],
    nextCorrectCount: number,
    nextComboCount: number,
    nextMultiplier: number
  ) => {
    const nextRoundNumber = roundNumber + 1;
    const speedBonus = Math.max(20, (currentRound.roundTimeLimitSeconds - roundSeconds) * 10);
    const accuracyBonus = Math.max(0, (theme.mistakeLimit - mistakes) * 18);
    const comboBonus = nextComboCount * 8 + nextMultiplier * 12;
    const roundPoints = speedBonus + accuracyBonus + comboBonus;
    const accuracy = Math.round((nextCorrectCount / Math.max(nextCorrectCount + mistakes, 1)) * 100);

    setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
    setCorrectSelections(nextCorrectCount);
    setScore((value) => value + roundPoints);
    setRoundStatus('transition');
    setFeedback({
      tone: 'success',
      message: `Round cleared. Great focus and clean taps.`,
    });
    resetCombo();
    setRoundResult(null);
    queueNextRound(nextRoundNumber, 1200);
  };

  const handleMistakeLimit = (updatedGrid: GridCell[], nextMistakes: number) => {
    const accuracy = Math.round((correctSelections / Math.max(correctSelections + nextMistakes, 1)) * 100);

    setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
    setMistakes(nextMistakes);
    setMistakesRemaining(0);
    setRoundStatus('transition');
    resetCombo();
    setFeedback({
      tone: 'danger',
      message: 'Mistake limit reached.',
    });
    setRoundResult({
      accuracyLabel: `${accuracy}%`,
      hint: 'Focus on matching the symbols at the top.',
      mistakesLabel: `${nextMistakes}/${theme.mistakeLimit}`,
      nextRoundNumber: roundNumber,
      status: 'failure',
      timeLabel: formatSeconds(roundSeconds),
      title: 'Try Again',
    });
  };

  const handleCellPress = (cellId: string) => {
    if (roundStatus !== 'playing') {
      return;
    }

    const selectedCell = currentRound.grid.find((cell) => cell.id === cellId);
    if (!selectedCell || selectedCell.status === 'hit') {
      return;
    }

    const isTarget = currentRound.targetIds.includes(selectedCell.iconId);

    if (isTarget) {
      const updatedGrid: GridCell[] = currentRound.grid.map((cell) =>
        cell.id === cellId ? { ...cell, status: 'hit' } : cell
      );
      const nextCorrectCount = correctSelections + 1;
      const nextComboCount = comboCount + 1;
      const nextMultiplier = getMultiplierForCombo(nextComboCount);
      const tapPoints = 12 * nextMultiplier;

      setScore((value) => value + tapPoints);
      setComboCount(nextComboCount);
      setMultiplier(nextMultiplier);
      armComboWindow();

      if (nextCorrectCount >= totalTargets) {
        handleRoundComplete(updatedGrid, nextCorrectCount, nextComboCount, nextMultiplier);
        return;
      }

      setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
      setCorrectSelections(nextCorrectCount);
      setFeedback({
        tone: 'neutral',
        message:
          nextMultiplier > 1
            ? `${nextCorrectCount} of ${totalTargets} found. Combo x${nextMultiplier}.`
            : `${nextCorrectCount} of ${totalTargets} matches found.`,
      });
      return;
    }

    const updatedGrid: GridCell[] = currentRound.grid.map((cell) =>
      cell.id === cellId ? { ...cell, status: 'miss' } : cell
    );
    const nextMistakes = mistakes + 1;

    setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
    setMistakes(nextMistakes);
    setMistakesRemaining(Math.max(theme.mistakeLimit - nextMistakes, 0));
    setScore((value) => Math.max(0, value - 10));
    resetCombo();
    setFeedback({
      tone: 'danger',
      message: 'Not target symbol. Slow down and scan again.',
    });

    if (nextMistakes >= theme.mistakeLimit) {
      handleMistakeLimit(updatedGrid, nextMistakes);
      return;
    }

    const timeoutId = setTimeout(() => {
      setCurrentRound((previous) => ({
        ...previous,
        grid: previous.grid.map<GridCell>((cell) => (cell.id === cellId ? { ...cell, status: 'idle' } : cell)),
      }));
    }, 350);

    timeoutRefs.current.push(timeoutId);
  };

  const retryRound = () => {
    beginRound(Math.max(roundNumber, 1), { resetMistakes: true });
  };

  const secondsRemaining = Math.max(currentRound.roundTimeLimitSeconds - roundSeconds, 0);
  const roundTimerTone: 'normal' | 'warning' | 'danger' =
    secondsRemaining <= 5 ? 'danger' : secondsRemaining <= 10 ? 'warning' : 'normal';
  const accuracyPercent = Math.round((correctSelections / Math.max(correctSelections + mistakes, 1)) * 100);

  return {
    accuracyLabel: `${accuracyPercent}%`,
    comboLabel: comboCount > 0 ? `x${multiplier} / ${comboCount}` : 'x1 / 0',
    comboWindowSeconds: Math.ceil(theme.comboWindowMs / 1000),
    currentRound,
    feedback,
    handleCellPress,
    hasStarted,
    isPaused: roundStatus === 'paused',
    mistakes,
    mistakesRemaining,
    multiplier,
    progressLabel: `${correctSelections}/${totalTargets}`,
    roundNumber,
    roundResult,
    roundStatus,
    roundTimerLabel: formatSeconds(secondsRemaining),
    roundTimerTone,
    retryRound,
    score,
    sessionTimerLabel: formatSeconds(sessionSeconds),
    startGame,
    togglePause,
    returnToIntro,
    theme,
  };
}
