import React from 'react';
import { getScoreFeedback, formatTime } from '../utils/score';
import { Award, Clock, RefreshCw, Home, ClipboardList, Check, X } from 'lucide-react';

interface ResultPageProps {
  testNum: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  timeSpent: number;
  onRetry: () => void;
  onHome: () => void;
  onReview: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  testNum,
  correctCount,
  wrongCount,
  percentage,
  timeSpent,
  onRetry,
  onHome,
  onReview,
}) => {
  const feedback = getScoreFeedback(percentage);
  const totalQuestions = correctCount + wrongCount;

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-xl text-center">
      {/* Title */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/30">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
          Test {testNum} Complete
        </h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium text-sm mt-1">
          Test Practice Session
        </p>
      </div>

      {/* Visual Ring Score Indicator */}
      <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100 dark:text-slate-750"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
            className={`${feedback.colorClass} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800 dark:text-white">
            {percentage}%
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            {correctCount} / {totalQuestions} Correct
          </span>
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mb-8">
        <h3 className={`text-2xl font-black tracking-wide ${feedback.colorClass} mb-1 animate-bounce`}>
          {feedback.text}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          You answered {correctCount} out of {totalQuestions} questions correctly!
        </p>
      </div>

      {/* Statistical Details Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-100/50 dark:border-green-900/20 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mb-1.5">
            <Check className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs font-semibold text-slate-450 dark:text-slate-500">Correct</span>
          <span className="text-lg font-bold text-green-700 dark:text-green-400">{correctCount}</span>
        </div>

        <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-1.5">
            <X className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-xs font-semibold text-slate-450 dark:text-slate-500">Wrong</span>
          <span className="text-lg font-bold text-red-700 dark:text-red-400">{wrongCount}</span>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center mb-1.5">
            <Clock className="w-4.5 h-4.5 text-accent dark:text-accent-light" />
          </div>
          <span className="text-xs font-semibold text-slate-450 dark:text-slate-500">Time Taken</span>
          <span className="text-lg font-bold text-slate-700 dark:text-slate-350">{formatTime(timeSpent)}</span>
        </div>
      </div>

      {/* Control Buttons Grid */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onReview}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent hover:bg-accent-dark text-white font-bold text-base transition-all duration-200 shadow-md shadow-blue-100 dark:shadow-none active:scale-[0.99] cursor-pointer"
        >
          <ClipboardList className="w-5 h-5" />
          <span>Review Answers</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 py-4.5 rounded-2xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <RefreshCw className="w-4.5 h-4.5" />
            <span>Retry Test</span>
          </button>

          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 py-4.5 rounded-2xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <Home className="w-4.5 h-4.5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
