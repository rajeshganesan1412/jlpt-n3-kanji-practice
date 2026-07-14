import { useState } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import type { QuestionState } from './types/Question';

type Screen = 'home' | 'quiz' | 'result';

interface QuizSummary {
  testNum: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  timeSpent: number;
  questions: QuestionState[];
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedTestNum, setSelectedTestNum] = useState<number | null>(null);
  const [summary, setSummary] = useState<QuizSummary | null>(null);

  const handleSelectTest = (testNum: number) => {
    setSelectedTestNum(testNum);
    setScreen('quiz');
  };

  const handleCompleteTest = (quizSummary: QuizSummary) => {
    setSummary(quizSummary);
    setScreen('result');
  };

  const handleGoToHome = () => {
    setSelectedTestNum(null);
    setSummary(null);
    setScreen('home');
  };

  const handleGoToQuiz = () => {
    if (selectedTestNum !== null) {
      setSummary(null);
      setScreen('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {screen === 'home' && (
        <Home onSelectTest={handleSelectTest} />
      )}
      {screen === 'quiz' && selectedTestNum !== null && (
        <Quiz
          key={selectedTestNum} // Force clean rerender if test index shifts
          testNum={selectedTestNum}
          onBackHome={handleGoToHome}
          onCompleteTest={handleCompleteTest}
        />
      )}
      {screen === 'result' && (
        <Result
          summary={summary}
          onGoToHome={handleGoToHome}
          onGoToQuiz={handleGoToQuiz}
        />
      )}
    </div>
  );
}

export default App;
