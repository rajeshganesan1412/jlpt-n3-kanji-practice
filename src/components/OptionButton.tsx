import React from 'react';

interface OptionButtonProps {
  index: number; // 0-indexed option identifier
  text: string;  // Reading text (e.g., 'けい')
  selectedOptionIndex: number | null;
  correctOptionIndex: number;
  onClick: () => void;
  shortcutKey: string;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  index,
  text,
  selectedOptionIndex,
  correctOptionIndex,
  onClick,
  shortcutKey,
}) => {
  const isAnswered = selectedOptionIndex !== null;
  const isSelected = selectedOptionIndex === index;
  const isCorrect = correctOptionIndex === index;

  let btnClasses = 'w-full flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all duration-200 shadow-sm ';
  let circleClasses = 'w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold ';

  if (!isAnswered) {
    // Idle / clickable state
    btnClasses += 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-accent dark:hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer active:scale-[0.99]';
    circleClasses += 'border-slate-300 dark:border-slate-600 text-slate-400 group-hover:border-slate-400';
  } else {
    // Locked / answered state
    if (isSelected) {
      if (isCorrect) {
        // Correctly answered
        btnClasses += 'bg-green-500 border-green-600 text-white shadow-green-100 dark:shadow-none';
        circleClasses += 'border-white bg-white text-green-600';
      } else {
        // Incorrectly answered
        btnClasses += 'bg-red-500 border-red-600 text-white shadow-red-100 dark:shadow-none';
        circleClasses += 'border-white bg-white text-red-600';
      }
    } else if (isCorrect) {
      // Correct option highlight (when user selected another wrong one)
      btnClasses += 'bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400';
      circleClasses += 'border-green-500 bg-green-500 text-white';
    } else {
      // Other unselected options
      btnClasses += 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60';
      circleClasses += 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700';
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={`group ${btnClasses}`}
    >
      <div className="flex items-center gap-3">
        <span className={circleClasses}>
          {isAnswered && isSelected ? (isCorrect ? '✓' : '✗') : index + 1}
        </span>
        <span className="font-semibold tracking-wide">{text}</span>
      </div>
      
      {/* Shortcut indicator helper (only shown in idle state for desktop) */}
      {!isAnswered && (
        <span className="hidden md:inline-block px-2 py-0.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded-md font-mono border border-slate-200 dark:border-slate-600">
          {shortcutKey}
        </span>
      )}
    </button>
  );
};
