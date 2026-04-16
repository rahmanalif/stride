import { useEffect, useState } from 'react';

export function useGameTimer(isRunning: boolean, initialSeconds: number, onExpire: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          clearInterval(intervalId);
          onExpire();
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, onExpire]);

  return {
    remainingSeconds,
    resetTimer: () => setRemainingSeconds(initialSeconds),
    setRemainingSeconds,
  };
}
