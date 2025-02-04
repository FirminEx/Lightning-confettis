import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function useConfetti(isEnabled: boolean) {
  useEffect(() => {
    if (!isEnabled) return;

    const duration = 15 * 99999999;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return;
      }

      const particleCount = 50;

      confetti({
        particleCount,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isEnabled]);
} 