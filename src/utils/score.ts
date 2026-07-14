export interface ScoreFeedback {
  text: string;
  colorClass: string; // Tailwind colors for feedback text
  bgClass: string; // Tailwind colors for progress highlights
}

/**
 * Returns custom feedback message and styles based on the percentage score.
 */
export function getScoreFeedback(percentage: number): ScoreFeedback {
  if (percentage >= 90) {
    return {
      text: 'Excellent!',
      colorClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-600 dark:bg-green-500'
    };
  } else if (percentage >= 75) {
    return {
      text: 'Great job!',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-600 dark:bg-emerald-500'
    };
  } else if (percentage >= 60) {
    return {
      text: 'Good effort!',
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-500 dark:bg-amber-400'
    };
  } else {
    return {
      text: 'Keep practicing!',
      colorClass: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-600 dark:bg-red-500'
    };
  }
}

/**
 * Formats time spent in MM:SS format.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
