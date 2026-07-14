import React from 'react';
import type { TestHistory } from '../types/Question';
import { Sun, Moon, Play, CheckCircle2, Award, Calendar, ChevronRight } from 'lucide-react';

interface TestSelectionProps {
  onSelectTest: (testNum: number) => void;
  history: TestHistory[];
  activeTestsInProgress: Record<number, { currentIndex: number }>;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const TestSelection: React.FC<TestSelectionProps> = ({
  onSelectTest,
  history,
  activeTestsInProgress,
  theme,
  onToggleTheme,
}) => {
  const tests = Array.from({ length: 41 }, (_, i) => i + 1);
  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header and Theme Toggle */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
            <span>JLPT N3 Kanji Practice</span>
            <span className="text-xs bg-red-100 dark:bg-red-950/40 text-primary border border-red-200 dark:border-red-900/30 px-2 py-0.5 rounded-md font-bold tracking-wide">
              N3 LEVEL
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
            Test your kanji reading proficiency offline. Select a test to begin.
          </p>
        </div>

        <button
          onClick={onToggleTheme}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer text-slate-600 dark:text-slate-400 active:scale-95 shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
          Select a Test
        </h2>
      </div>

      {/* Grid of Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map(testNum => {
          const record = history.find(h => h.testNum === testNum);
          const inProgress = activeTestsInProgress[testNum];
          
          return (
            <button
              key={testNum}
              onClick={() => onSelectTest(testNum)}
              className="group text-left w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-accent dark:hover:border-accent p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer relative overflow-hidden"
            >
              {/* Card visual highlight */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 dark:bg-slate-700 group-hover:bg-accent transition-colors duration-300" />

              <div className="flex items-center gap-4.5 pl-1.5">
                {/* Number Badge */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 flex items-center justify-center font-bold text-lg text-slate-700 dark:text-slate-300 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {testNum}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 dark:text-white text-lg">
                      Test {testNum}
                    </span>
                    
                    {record?.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                    
                    {inProgress && !record?.completed && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[10px] font-extrabold text-accent border border-blue-100 dark:border-blue-900/30">
                        IN PROGRESS (Q{inProgress.currentIndex + 1})
                      </span>
                    )}
                  </div>

                  {record ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-semibold text-slate-450 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Best: {record.bestScore} / 50 ({Math.round((record.bestScore / 50) * 100)}%)</span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(record.lastAttemptDate)}</span>
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                      50 Kanji Questions • Not attempted
                    </p>
                  )}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="w-10 h-10 rounded-full border border-slate-150 dark:border-slate-700/60 flex items-center justify-center text-slate-450 dark:text-slate-500 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300 shrink-0">
                {inProgress ? (
                  <Play className="w-4.5 h-4.5 fill-current" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
