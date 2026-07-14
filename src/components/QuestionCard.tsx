import React, { useEffect } from 'react';
import type { QuestionState } from '../types/Question';
import { OptionButton } from './OptionButton';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionState;
  currentIndex: number;
  totalQuestions: number;
  onSelectOption: (idx: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectOption,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const isAnswered = question.selectedOptionIndex !== null;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent running if in a form field (if any exist)
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key >= '1' && e.key <= '4') {
        const optionIdx = parseInt(e.key) - 1;
        onSelectOption(optionIdx);
      } else if (e.key === 'ArrowRight') {
        if (isAnswered) {
          if (isLastQuestion) {
            onSubmit();
          } else {
            onNext();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isFirstQuestion) {
          onPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [question, currentIndex, isAnswered, isLastQuestion, isFirstQuestion, onSelectOption, onNext, onPrev, onSubmit]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Kanji Presentation Area */}
      <div className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-10 md:p-14 mb-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative background circle */}
        <div className="absolute w-48 h-48 rounded-full bg-red-50 dark:bg-red-950/10 -top-12 -right-12 pointer-events-none transition-all duration-300" />
        
        <span className="text-[80px] md:text-[96px] font-black text-slate-800 dark:text-slate-100 leading-none select-none tracking-normal font-serif">
          {question.kanji}
        </span>
        
        {isAnswered && (
          <div className="mt-4 text-sm font-medium text-slate-400 dark:text-slate-500 animate-fade-in">
            Meaning: <span className="text-slate-700 dark:text-slate-300 font-semibold">{question.meaning}</span>
          </div>
        )}
      </div>

      {/* Answer Options Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option, idx) => (
          <OptionButton
            key={idx}
            index={idx}
            text={option}
            selectedOptionIndex={question.selectedOptionIndex}
            correctOptionIndex={question.correctOptionIndex}
            onClick={() => onSelectOption(idx)}
            shortcutKey={(idx + 1).toString()}
          />
        ))}
      </div>

      {/* Navigation & Actions Controls */}
      <div className="w-full flex justify-between items-center gap-4 mt-2">
        <button
          onClick={onPrev}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold transition-all duration-200 ${
            isFirstQuestion
              ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 text-white shadow-md ${
              !isAnswered
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'bg-primary hover:bg-primary-dark shadow-red-200 dark:shadow-none'
            }`}
          >
            <span>Finish Test</span>
            <CheckCircle2 className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 text-white shadow-md ${
              !isAnswered
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'bg-accent hover:bg-accent-dark shadow-blue-200 dark:shadow-none'
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
};
