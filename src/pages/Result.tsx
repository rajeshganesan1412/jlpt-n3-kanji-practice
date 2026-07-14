import React, { useState } from 'react';
import { ResultPage } from '../components/ResultPage';
import { ReviewPage } from '../components/ReviewPage';
import type { QuestionState } from '../types/Question';

interface ResultProps {
  summary: {
    testNum: number;
    correctCount: number;
    wrongCount: number;
    percentage: number;
    timeSpent: number;
    questions: QuestionState[];
  } | null;
  onGoToHome: () => void;
  onGoToQuiz: () => void;
}

export const Result: React.FC<ResultProps> = ({ summary, onGoToHome, onGoToQuiz }) => {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  if (!summary) {
    // If somehow accessed without summary data, redirect to home
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-4">No test results found.</p>
        <button
          onClick={onGoToHome}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary-dark active:scale-95"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-8 min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center">
      {isReviewing ? (
        <ReviewPage
          questions={summary.questions}
          onBack={() => setIsReviewing(false)}
        />
      ) : (
        <ResultPage
          testNum={summary.testNum}
          correctCount={summary.correctCount}
          wrongCount={summary.wrongCount}
          percentage={summary.percentage}
          timeSpent={summary.timeSpent}
          onRetry={onGoToQuiz}
          onHome={onGoToHome}
          onReview={() => setIsReviewing(true)}
        />
      )}
    </div>
  );
};
export default Result;
