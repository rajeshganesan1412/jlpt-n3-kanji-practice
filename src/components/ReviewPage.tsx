import React from 'react';
import type { QuestionState } from '../types/Question';
import { ArrowLeft, Check, X, Bookmark } from 'lucide-react';

interface ReviewPageProps {
  questions: QuestionState[];
  onBack: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ questions, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-250 cursor-pointer active:scale-95"
            title="Back to Results"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-350" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-850 dark:text-white">
              Review Answers
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">
              Reviewing all {questions.length} questions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Bookmark className="w-3.5 h-3.5" />
          <span>JLPT N3</span>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="flex flex-col gap-4 mb-8">
        {questions.map((q, idx) => {
          const isCorrect = q.selectedOptionIndex === q.correctOptionIndex;
          const userAnsText = q.selectedOptionIndex !== null ? q.options[q.selectedOptionIndex] : 'Unanswered';
          const correctAnsText = q.correctReading;

          return (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-800 border-2 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 ${
                isCorrect
                  ? 'border-green-100 dark:border-green-950/20 hover:border-green-200 dark:hover:border-green-900/30'
                  : 'border-red-100 dark:border-red-950/20 hover:border-red-200 dark:hover:border-red-900/30'
              }`}
            >
              {/* Question description */}
              <div className="flex items-center gap-4.5">
                {/* Kanji index badge & correct status indicator */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Big Kanji Char and details */}
                <div>
                  <h4 className="text-3xl font-bold font-serif text-slate-850 dark:text-white leading-none mb-1.5 select-all">
                    {q.kanji}
                  </h4>
                  <p className="text-xs font-semibold text-slate-450 dark:text-slate-500">
                    Meaning: <span className="text-slate-650 dark:text-slate-400 font-medium">{q.meaning}</span>
                  </p>
                </div>
              </div>

              {/* Answers readout */}
              <div className="flex flex-wrap gap-3 items-center text-sm md:text-right w-full md:w-auto md:justify-end">
                {/* User selection display */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-850/50 text-slate-600 dark:text-slate-350">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Your answer:</span>
                  <span className="font-semibold tracking-wide">{userAnsText}</span>
                  {isCorrect ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                </div>

                {/* Correct solution display (only show separate if user got it wrong) */}
                {!isCorrect && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400">
                    <span className="text-xs text-green-500 dark:text-green-500">Correct:</span>
                    <span className="font-bold tracking-wide">{correctAnsText}</span>
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Done Button */}
      <button
        onClick={onBack}
        className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 cursor-pointer active:scale-[0.99] mb-12 shadow-sm"
      >
        Done Reviewing
      </button>
    </div>
  );
};
