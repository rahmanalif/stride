import { useEffect, useRef, useState } from 'react';

import { FeedbackState, GridCell, ThemeConfig } from '@/game/types';
import { countTargetCells, generateRound } from '@/game/utils/roundGenerator';

type RoundStatus = 'idle' | 'playing' | 'transition';

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

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearScheduledWork = () => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  };

  const beginRound = (nextRoundNumber: number) => {
    clearScheduledWork();
    const nextRound = generateRound(theme, nextRoundNumber);

    setCurrentRound(nextRound);
    setRoundNumber(nextRoundNumber);
    setRoundSeconds(0);
    setMistakes(0);
    setMistakesRemaining(theme.mistakeLimit);
    setCorrectSelections(0);
    setFeedback(defaultFeedback);
    setRoundStatus('playing');
  };

  const startGame = () => {
    setHasStarted(true);
    setScore(0);
    setSessionSeconds(0);
    beginRound(1);
  };

  const totalTargets = countTargetCells(currentRound.grid, currentRound.targetIds);

  useEffect(() => {
    if (!hasStarted || roundStatus !== 'playing') {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setRoundSeconds((value) => value + 1);
      setSessionSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hasStarted, roundStatus]);

  useEffect(() => {
    return () => clearScheduledWork();
  }, []);

  const queueNextRound = (nextRoundNumber: number, delayMs: number) => {
    const timeoutId = setTimeout(() => beginRound(nextRoundNumber), delayMs);
    timeoutRefs.current.push(timeoutId);
  };

  const handleRoundComplete = (updatedGrid: GridCell[], nextCorrectCount: number) => {
    const nextRoundNumber = roundNumber + 1;
    const speedBonus = Math.max(20, 120 - roundSeconds * 8);
    const accuracyBonus = Math.max(0, (theme.mistakeLimit - mistakes) * 18);
    const roundPoints = nextCorrectCount * 10 + speedBonus + accuracyBonus;

    setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
    setCorrectSelections(nextCorrectCount);
    setScore((value) => value + roundPoints);
    setRoundStatus('transition');
    setFeedback({
      tone: 'success',
      message: `Round cleared. +${roundPoints} points. Fresh garden coming up.`,
    });
    queueNextRound(nextRoundNumber, 1200);
  };

  const handleMistakeLimit = (updatedGrid: GridCell[], nextMistakes: number) => {
    const nextRoundNumber = roundNumber + 1;

    setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
    setMistakes(nextMistakes);
    setMistakesRemaining(0);
    setRoundStatus('transition');
    setFeedback({
      tone: 'danger',
      message: 'Mistake limit reached. New round starting.',
    });
    queueNextRound(nextRoundNumber, 1000);
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

      if (nextCorrectCount >= totalTargets) {
        handleRoundComplete(updatedGrid, nextCorrectCount);
        return;
      }

      setCurrentRound((previous) => ({ ...previous, grid: updatedGrid }));
      setCorrectSelections(nextCorrectCount);
      setFeedback({
        tone: 'neutral',
        message: `${nextCorrectCount} of ${totalTargets} matches found.`,
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
    setScore((value) => Math.max(0, value - 8));
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

  return {
    currentRound,
    feedback,
    handleCellPress,
    hasStarted,
    mistakes,
    mistakesRemaining,
    progressLabel: `${correctSelections}/${totalTargets}`,
    roundNumber,
    roundStatus,
    roundTimerLabel: formatSeconds(roundSeconds),
    score,
    sessionTimerLabel: formatSeconds(sessionSeconds),
    startGame,
    theme,
  };
}
