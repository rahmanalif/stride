import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ORDER_MEMORY_RULES } from '@/order-memory/config';
import {
  calculateAccuracy,
  calculateRoundPoints,
  generateAnswerPool,
  generateTargetSequence,
  getRoundDifficulty,
  validateAnswerTap,
} from '@/order-memory/utils/sequence';
import {
  OrderMemoryFeedback,
  OrderMemoryItem,
  OrderMemoryPhase,
  OrderMemoryRoundResult,
  OrderMemoryTheme,
} from '@/order-memory/types';

const defaultFeedback: OrderMemoryFeedback = {
  message: 'Watch the sequence carefully, then tap it back in order.',
  tone: 'neutral',
};

export function useOrderMemoryGame(theme: OrderMemoryTheme) {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<OrderMemoryPhase>('howToPlay');
  const [score, setScore] = useState(0);
  const [targetSequence, setTargetSequence] = useState<OrderMemoryItem[]>([]);
  const [availableOptions, setAvailableOptions] = useState<OrderMemoryItem[]>(() => generateAnswerPool(theme.items));
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<OrderMemoryItem[]>([]);
  const [memorizationIndex, setMemorizationIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<OrderMemoryItem | null>(null);
  const [roundResult, setRoundResult] = useState<OrderMemoryRoundResult | null>(null);
  const [feedback, setFeedback] = useState<OrderMemoryFeedback>(defaultFeedback);
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [failedAtStep, setFailedAtStep] = useState<number | null>(null);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pausedPhaseRef = useRef<OrderMemoryPhase>('howToPlay');

  const difficulty = useMemo(() => getRoundDifficulty(round), [round]);

  const clearScheduledWork = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const resetRoundState = useCallback(
    (nextRound: number, nextScore?: number) => {
      const nextDifficulty = getRoundDifficulty(nextRound);
      const nextSequence = generateTargetSequence(theme.items, nextDifficulty.sequenceLength);

      setRound(nextRound);
      if (typeof nextScore === 'number') {
        setScore(nextScore);
      }
      setTargetSequence(nextSequence);
      setAvailableOptions(generateAnswerPool(theme.items));
      setCurrentAnswerIndex(0);
      setSelectedAnswers([]);
      setMemorizationIndex(0);
      setCurrentPrompt(null);
      setRoundResult(null);
      setAnswerSeconds(0);
      setRemainingSeconds(nextDifficulty.roundDurationSeconds);
      setFailedAtStep(null);
      setFeedback(defaultFeedback);
    },
    [theme.items]
  );

  const finalizeRound = useCallback(
    (isSuccess: boolean, overrideFailedAtStep?: number | null) => {
      const nextFailedAtStep = overrideFailedAtStep ?? failedAtStep;
      const accuracy = calculateAccuracy(
        isSuccess ? targetSequence.length : currentAnswerIndex,
        targetSequence.length
      );
      const pointsEarned = calculateRoundPoints(difficulty, answerSeconds, isSuccess);
      const nextScore = score + pointsEarned;
      const result: OrderMemoryRoundResult = {
        accuracy,
        failedAtStep: nextFailedAtStep,
        isSuccess,
        pointsEarned,
        round,
        score: nextScore,
        sequenceLength: targetSequence.length,
      };

      if (isSuccess) {
        setScore(nextScore);
      }

      setRoundResult(result);
      setPhase(round >= ORDER_MEMORY_RULES.maxRounds && isSuccess ? 'gameOver' : 'roundComplete');
    },
    [answerSeconds, currentAnswerIndex, difficulty, failedAtStep, round, score, targetSequence.length]
  );

  const startMemorization = useCallback(() => {
    clearScheduledWork();
    setPhase('memorization');
    setFeedback({
      message: 'Memorize the order. No taps needed yet.',
      tone: 'neutral',
    });

    targetSequence.forEach((item, index) => {
      const showDelay = index * (difficulty.showItemDurationMs + difficulty.transitionDelayMs);

      timeoutsRef.current.push(
        setTimeout(() => {
          setMemorizationIndex(index);
          setCurrentPrompt(item);
        }, showDelay)
      );
    });

    const totalDuration =
      targetSequence.length * difficulty.showItemDurationMs +
      Math.max(targetSequence.length - 1, 0) * difficulty.transitionDelayMs;

    timeoutsRef.current.push(
      setTimeout(() => {
        setPhase('transition');
        setCurrentPrompt(null);
        setFeedback({
          message: 'Get ready to tap the same order back.',
          tone: 'neutral',
        });
      }, totalDuration)
    );

    timeoutsRef.current.push(
      setTimeout(() => {
        setPhase('answering');
        setAnswerSeconds(0);
        setFeedback({
          message: 'Tap the symbols in the same order they appeared.',
          tone: 'neutral',
        });
      }, totalDuration + 650)
    );
  }, [clearScheduledWork, difficulty, targetSequence]);

  const togglePause = useCallback(() => {
    if (!['ready', 'memorization', 'transition', 'answering', 'paused'].includes(phase)) {
      return;
    }

    if (phase === 'paused') {
      const previousPhase = pausedPhaseRef.current;

      if (previousPhase === 'answering') {
        setPhase('answering');
        setFeedback({
          message: 'Tap the symbols in the same order they appeared.',
          tone: 'neutral',
        });
        return;
      }

      if (previousPhase === 'ready') {
        setPhase('ready');
        setFeedback(defaultFeedback);
        return;
      }

      startMemorization();
      return;
    }

    pausedPhaseRef.current = phase;
    clearScheduledWork();
    setPhase('paused');
    setFeedback({
      message: 'Game paused. Tap play to continue this round.',
      tone: 'neutral',
    });
  }, [clearScheduledWork, phase, startMemorization]);

  const startRound = useCallback(
    (nextRound: number, resetScore = false) => {
      clearScheduledWork();
      resetRoundState(nextRound, resetScore ? 0 : undefined);
      setPhase('ready');
    },
    [clearScheduledWork, resetRoundState]
  );

  useEffect(() => {
    if (phase !== 'ready') {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      startMemorization();
    }, ORDER_MEMORY_RULES.readyDelayMs);

    return () => clearTimeout(timeoutId);
  }, [phase, startMemorization]);

  useEffect(() => {
    if (phase !== 'answering') {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setAnswerSeconds((value) => value + 1);
      setRemainingSeconds((value) => {
        const nextValue = Math.max(value - 1, 0);

        if (nextValue === 0) {
          clearInterval(intervalId);
          setPhase('failure');
          setFailedAtStep(currentAnswerIndex + 1);
          setFeedback({
            message: 'Time ran out before the full sequence was completed.',
            tone: 'danger',
          });
        }

        return nextValue;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentAnswerIndex, phase]);

  useEffect(() => {
    if (phase !== 'success' && phase !== 'failure') {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      finalizeRound(phase === 'success', phase === 'failure' ? failedAtStep : null);
    }, ORDER_MEMORY_RULES.showResultDelayMs);

    return () => clearTimeout(timeoutId);
  }, [failedAtStep, finalizeRound, phase]);

  useEffect(() => {
    return () => clearScheduledWork();
  }, [clearScheduledWork]);

  const handlePlayNow = useCallback(() => {
    startRound(1, true);
  }, [startRound]);

  const handleRetry = useCallback(() => {
    startRound(round, false);
  }, [round, startRound]);

  const handleNextRound = useCallback(() => {
    const nextRound = Math.min(round + 1, ORDER_MEMORY_RULES.maxRounds);
    startRound(nextRound, false);
  }, [round, startRound]);

  const handleExit = useCallback(() => {
    clearScheduledWork();
    setPhase('howToPlay');
    resetRoundState(1, 0);
  }, [clearScheduledWork, resetRoundState]);

  const handleAnswerTap = useCallback(
    async (item: OrderMemoryItem) => {
      if (phase !== 'answering') {
        return;
      }

      const expectedItem = targetSequence[currentAnswerIndex];
      if (!expectedItem) {
        return;
      }

      const isCorrect = validateAnswerTap(expectedItem.id, item.id);
      const nextSelections = [...selectedAnswers, item];
      setSelectedAnswers(nextSelections);

      if (!isCorrect) {
        setFailedAtStep(currentAnswerIndex + 1);
        setFeedback({
          message: `That was not item ${currentAnswerIndex + 1} in the sequence.`,
          tone: 'danger',
        });
        setPhase('failure');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const nextIndex = currentAnswerIndex + 1;
      setCurrentAnswerIndex(nextIndex);
      setFeedback({
        message:
          nextIndex >= targetSequence.length
            ? 'Sequence complete.'
            : `${nextIndex} of ${targetSequence.length} correct so far.`,
        tone: 'success',
      });
      void Haptics.selectionAsync();

      if (nextIndex >= targetSequence.length) {
        setPhase('success');
      }
    },
    [currentAnswerIndex, phase, selectedAnswers, targetSequence]
  );

  return {
    answerSeconds,
    availableOptions,
    currentAnswerIndex,
    currentPrompt,
    failedAtStep,
    feedback,
    handleAnswerTap,
    handleExit,
    handleNextRound,
    handlePlayNow,
    handleRetry,
    isPaused: phase === 'paused',
    memorizationIndex,
    phase,
    remainingSeconds,
    round,
    roundResult,
    score,
    selectedAnswers,
    targetSequence,
    theme,
    togglePause,
  };
}
