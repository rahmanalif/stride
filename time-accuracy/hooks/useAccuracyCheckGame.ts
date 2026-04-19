import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TIME_ACCURACY_RULES } from '@/time-accuracy/config';
import { useGameTimer } from '@/time-accuracy/hooks/useGameTimer';
import { GameStatus, RoundSummary, RotatingTargetState, TapJudgment } from '@/time-accuracy/types';
import { advanceAngle, getAngularDistance, judgeTap } from '@/time-accuracy/utils/circularMotion';

function formatSeconds(totalSeconds: number) {
  return `00:${Math.max(totalSeconds, 0).toString().padStart(2, '0')}`;
}

function buildTargets(round: number): RotatingTargetState[] {
  const speedOffset = Math.min(round - 1, 12) * 5;
  const blueDelta = Math.min(round - 1, 10) * 2;

  return [
    {
      angleBlue: 215,
      angleRed: 90,
      blueSpeed: 42 + speedOffset,
      feedbackTone: 'idle',
      id: 'target-1',
      redSpeed: 0,
    },
    {
      angleBlue: 35,
      angleRed: 270,
      blueSpeed: 38 + speedOffset + blueDelta,
      feedbackTone: 'idle',
      id: 'target-2',
      redSpeed: 0,
    },
  ];
}

function getThresholds(round: number) {
  const perfect = Math.max(3, TIME_ACCURACY_RULES.perfectThreshold - Math.floor((round - 1) / 4));
  const good = Math.max(8, TIME_ACCURACY_RULES.goodThreshold - Math.floor((round - 1) / 3));

  return { good, perfect };
}

function getPointsForJudgment(judgment: TapJudgment, streak: number) {
  if (judgment === 'perfect') {
    return TIME_ACCURACY_RULES.perfectPoints + Math.min(streak, 6) * 8;
  }

  if (judgment === 'good') {
    return TIME_ACCURACY_RULES.goodPoints + Math.min(streak, 6) * 4;
  }

  return -TIME_ACCURACY_RULES.tapPenalty;
}

export function useAccuracyCheckGame() {
  const [status, setStatus] = useState<GameStatus>('howToPlay');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [countdown, setCountdown] = useState<number>(TIME_ACCURACY_RULES.countdownFrom);
  const [targets, setTargets] = useState<RotatingTargetState[]>(() => buildTargets(1));
  const [resultsSummary, setResultsSummary] = useState<RoundSummary | null>(null);

  const targetsRef = useRef(targets);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const missesRef = useRef(0);
  const opportunityStateRef = useRef<Record<string, { inWindow: boolean; tapped: boolean }>>({});

  const registerMiss = useCallback(() => {
    missesRef.current += 1;
    setMisses(missesRef.current);
    setStreak(0);
    setScore((value) => Math.max(0, value - TIME_ACCURACY_RULES.tapPenalty));
  }, []);

  const handleRoundExpire = useCallback(() => {
    setStatus('roundComplete');
    setResultsSummary({
      accuracy: hits + missesRef.current > 0 ? Math.round((hits / (hits + missesRef.current)) * 100) : 0,
      hits,
      misses: missesRef.current,
      round,
      score,
    });
  }, [hits, round, score]);

  const { remainingSeconds, resetTimer, setRemainingSeconds } = useGameTimer(
    status === 'active',
    TIME_ACCURACY_RULES.roundDurationSeconds,
    handleRoundExpire
  );

  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);

  useEffect(() => {
    if (status !== 'countdown') {
      return undefined;
    }

    setCountdown(TIME_ACCURACY_RULES.countdownFrom);

    const intervalId = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(intervalId);
          setStatus('active');
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status !== 'active') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimestampRef.current = null;
      opportunityStateRef.current = {};
      return undefined;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setTargets((previous) =>
        previous.map((target) => {
          const nextAngleBlue = advanceAngle(target.angleBlue, target.blueSpeed, deltaSeconds);
          const distance = getAngularDistance(target.angleRed, nextAngleBlue);
          const withinWindow = distance <= thresholds.good;
          const opportunityState = opportunityStateRef.current[target.id] ?? { inWindow: false, tapped: false };

          if (withinWindow && !opportunityState.inWindow) {
            opportunityStateRef.current[target.id] = { inWindow: true, tapped: false };
          } else if (!withinWindow && opportunityState.inWindow) {
            if (!opportunityState.tapped) {
              registerMiss();
            }

            opportunityStateRef.current[target.id] = { inWindow: false, tapped: false };
          }

          return {
            ...target,
            angleBlue: nextAngleBlue,
            angleRed: target.angleRed,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'active') {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setTargets((previous) =>
        previous.map((target) => (target.feedbackTone === 'idle' ? target : { ...target, feedbackTone: 'idle' }))
      );
    }, 320);

    return () => clearTimeout(timeoutId);
  }, [targets, status]);

  const accuracy = useMemo(() => {
    return hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
  }, [hits, misses]);

  const headerStats = useMemo(
    () => [
      { label: 'Score', value: score.toString() },
      { label: 'Timer', value: formatSeconds(remainingSeconds), emphasis: remainingSeconds <= 8 },
      { label: 'Accuracy', value: `${accuracy}%` },
    ],
    [accuracy, remainingSeconds, score]
  );

  const thresholds = getThresholds(round);

  const handleTapTarget = useCallback(
    async (targetId: string) => {
      if (status !== 'active') {
        return;
      }

      const target = targetsRef.current.find((item) => item.id === targetId);
      if (!target) {
        return;
      }

      const distance = getAngularDistance(target.angleRed, target.angleBlue);
      const judgment = judgeTap(distance, thresholds);
      const opportunityState = opportunityStateRef.current[targetId];

      setTargets((previous) =>
        previous.map((item) =>
          item.id === targetId ? { ...item, feedbackTone: judgment } : item
        )
      );

      if (judgment === 'miss') {
        registerMiss();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (opportunityState?.inWindow) {
        opportunityStateRef.current[targetId] = { ...opportunityState, tapped: true };
      }

      setHits((value) => value + 1);
      setStreak((value) => value + 1);
      setScore((value) => value + getPointsForJudgment(judgment, streak + 1));
      void Haptics.selectionAsync();
    },
    [registerMiss, status, streak, thresholds]
  );

  const startRound = useCallback(
    (nextRound: number, resetScore = false) => {
      setRound(nextRound);
      setTargets(buildTargets(nextRound));
      setResultsSummary(null);
      setStatus('countdown');
      setCountdown(TIME_ACCURACY_RULES.countdownFrom);
      setRemainingSeconds(TIME_ACCURACY_RULES.roundDurationSeconds);
      resetTimer();

      if (resetScore) {
        setScore(0);
        setHits(0);
        setMisses(0);
        missesRef.current = 0;
        setStreak(0);
      }

      opportunityStateRef.current = {};
    },
    [resetTimer, setRemainingSeconds]
  );

  const handlePlayNow = useCallback(() => {
    startRound(1, true);
  }, [startRound]);

  const handleRetry = useCallback(() => {
    startRound(round, true);
  }, [round, startRound]);

  const handleNextRound = useCallback(() => {
    const nextRound = Math.min(round + 1, TIME_ACCURACY_RULES.maxRounds);
    startRound(nextRound);
  }, [round, startRound]);

  const handleExit = useCallback(() => {
    setStatus('howToPlay');
    setRound(1);
    setTargets(buildTargets(1));
    setResultsSummary(null);
    setScore(0);
    setHits(0);
    setMisses(0);
    missesRef.current = 0;
    setStreak(0);
    setCountdown(TIME_ACCURACY_RULES.countdownFrom);
    setRemainingSeconds(TIME_ACCURACY_RULES.roundDurationSeconds);
    opportunityStateRef.current = {};
  }, [setRemainingSeconds]);

  const togglePause = useCallback(() => {
    setStatus((currentStatus) => {
      if (currentStatus === 'active') {
        return 'paused';
      }

      if (currentStatus === 'paused') {
        return 'active';
      }

      return currentStatus;
    });
  }, []);

  return {
    accuracy,
    countdown,
    handleExit,
    handleNextRound,
    handlePlayNow,
    handleRetry,
    handleTapTarget,
    isPaused: status === 'paused',
    headerStats,
    hits,
    misses,
    remainingSeconds,
    resultsSummary,
    round,
    score,
    status,
    streak,
    togglePause,
    targets,
  };
}
