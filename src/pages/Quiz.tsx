import React from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import type { QuestionState } from '../types/Question';
import { formatTime } from '../utils/score';
import { Home, RotateCcw, Clock, Eye, EyeOff } from 'lucide-react';

interface QuizProps {
  testNum: number;
  onBackHome: () => void;
  onCompleteTest: (quizSummary: {
    testNum: number;
    correctCount: number;
    wrongCount: number;
    percentage: number;
    timeSpent: number;
    questions: QuestionState[];
  }) => void;
}

export const Quiz: React.FC<QuizProps> = ({ testNum, onBackHome, onCompleteTest }) => {
  const {
    questions,
    currentIndex,
    currentQuestion,
    timeSpent,
    timerEnabled,
    selectOption,
    nextQuestion,
    prevQuestion,
    restartQuiz,
    submitQuiz,
    toggleTimer,
    answeredCount,
    totalQuestions,
    isLoaded
  } = useQuiz(testNum, () => {
    // onComplete callback: triggers when submitQuiz is finished
  });

  // Intercept completion to pass summary results upwards
  const handleFinishQuiz = () => {
    // Perform submit first
    submitQuiz();

    // Compute stats
    const correct = questions.reduce((acc, q) => {
      return q.selectedOptionIndex === q.correctOptionIndex ? acc + 1 : acc;
    }, 0);
    const wrong = questions.length - correct;
    const percentage = Math.round((correct / questions.length) * 100);

    onCompleteTest({
      testNum,
      correctCount: correct,
      wrongCount: wrong,
      percentage,
      timeSpent,
      questions
    });
  };

  if (!isLoaded || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Loading Test questions...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Top Action Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* Back Home */}
          <button
            onClick={onBackHome}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-colors duration-200 cursor-pointer active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Title / Active Test */}
          <div className="text-center">
            <h2 className="text-base font-extrabold text-slate-850 dark:text-white">
              Test {testNum} Practice
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wide uppercase">
              JLPT N3 Kanji
            </p>
          </div>

          {/* Restart Quiz */}
          <button
            onClick={restartQuiz}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-colors duration-200 cursor-pointer active:scale-95 shadow-sm"
            title="Restart Test"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Dashboard Progress & Timer Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 md:p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <ProgressBar
              current={currentIndex + 1}
              total={totalQuestions}
              answeredCount={answeredCount}
            />
          </div>

          {/* Timer Display Column */}
          <div className="flex items-center justify-between md:justify-end gap-3 md:border-l md:border-slate-200 md:dark:border-slate-700 md:pl-6">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimer}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                title={timerEnabled ? 'Disable Timer' : 'Enable Timer'}
              >
                {timerEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock className="w-4.5 h-4.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Timer</span>
              </div>
            </div>
            
            <span className={`text-xl font-bold font-mono ${timerEnabled ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
              {timerEnabled ? formatTime(timeSpent) : '--:--'}
            </span>
          </div>
        </div>

        {/* Active Question Card */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            onSelectOption={selectOption}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            onSubmit={handleFinishQuiz}
          />
        )}
      </div>
    </div>
  );
};
export default Quiz;
