import React from 'react';

interface ProgressBarProps {
  current: number; // 1-indexed
  total: number;
  answeredCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answeredCount }) => {
  const progressPercent = (current / total) * 100;
  const answeredPercent = (answeredCount / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Question <span className="text-slate-800 dark:text-slate-100 font-bold text-base">{current}</span> / {total}
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Answered: {answeredCount} / {total} ({Math.round(answeredPercent)}%)
        </span>
      </div>
      
      {/* Outer progress bar */}
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
        {/* Answered progress (background layer) */}
        <div 
          className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-600 transition-all duration-300 ease-out"
          style={{ width: `${answeredPercent}%` }}
        />
        {/* Current position indicator (foreground layer) */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
