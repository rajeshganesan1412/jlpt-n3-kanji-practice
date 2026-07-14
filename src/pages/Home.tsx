import React, { useState, useEffect } from 'react';
import { TestSelection } from '../components/TestSelection';
import { getHistory, getTheme, saveTheme, getActiveTest } from '../utils/storage';
import type { TestHistory } from '../types/Question';

interface HomeProps {
  onSelectTest: (testNum: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTest }) => {
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [activeTests, setActiveTests] = useState<Record<number, { currentIndex: number }>>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load history, active tests, and theme
  useEffect(() => {
    setHistory(getHistory());
    
    // Check which tests are in progress
    const activeStates: Record<number, { currentIndex: number }> = {};
    for (let testNum = 1; testNum <= 10; testNum++) {
      const activeState = getActiveTest(testNum);
      if (activeState && !activeState.completed) {
        activeStates[testNum] = { currentIndex: activeState.currentIndex };
      }
    }
    setActiveTests(activeStates);

    const activeTheme = getTheme();
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    saveTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <TestSelection
        onSelectTest={onSelectTest}
        history={history}
        activeTestsInProgress={activeTests}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
};
export default Home;
