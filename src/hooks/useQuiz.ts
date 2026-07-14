import { useState, useEffect, useRef } from 'react';
import kanjiDataRaw from '../data/kanji.json';
import type { KanjiItem, QuestionState, TestHistory } from '../types/Question';
import { shuffleArray } from '../utils/shuffle';
import { getActiveTest, saveActiveTest, clearActiveTest, saveHistory } from '../utils/storage';

const kanjiData = kanjiDataRaw as KanjiItem[];

export function useQuiz(testNum: number, onComplete: () => void) {
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Ref to prevent timer running if paused or finished
  const timerRef = useRef<any>(null);

  // Load existing test or initialize a new one
  useEffect(() => {
    const saved = getActiveTest(testNum);
    if (saved) {
      setQuestions(saved.questions);
      setCurrentIndex(saved.currentIndex);
      setTimeSpent(saved.timeSpent);
      setTimerEnabled(saved.timerEnabled);
      setCompleted(saved.completed);
    } else {
      // Create new quiz questions
      // Shuffling the entire 500-kanji pool and taking 50
      const pool = shuffleArray(kanjiData).slice(0, 50);
      const generatedQuestions: QuestionState[] = pool.map(item => {
        const correctReading = item.reading;
        // Merge correct reading and distractors, then shuffle
        const rawOptions = [correctReading, ...item.distractors];
        const options = shuffleArray(rawOptions);
        const correctOptionIndex = options.indexOf(correctReading);

        return {
          kanji: item.kanji,
          correctReading,
          meaning: item.meaning,
          options,
          correctOptionIndex,
          selectedOptionIndex: null
        };
      });

      setQuestions(generatedQuestions);
      setCurrentIndex(0);
      setTimeSpent(0);
      setTimerEnabled(true);
      setCompleted(false);

      // Save initial state
      saveActiveTest({
        testNum,
        questions: generatedQuestions,
        currentIndex: 0,
        timeSpent: 0,
        timerEnabled: true,
        completed: false
      });
    }
    setIsLoaded(true);
  }, [testNum]);

  // Sync state to local storage when questions, index, timer, time, or completion changes
  useEffect(() => {
    if (!isLoaded || completed) return;
    
    saveActiveTest({
      testNum,
      questions,
      currentIndex,
      timeSpent,
      timerEnabled,
      completed
    });
  }, [questions, currentIndex, timeSpent, timerEnabled, completed, isLoaded, testNum]);

  // Timer Effect
  useEffect(() => {
    if (!isLoaded || completed || !timerEnabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoaded, completed, timerEnabled]);

  // Select an option (answers are locked immediately once chosen)
  const selectOption = (optionIndex: number) => {
    if (questions[currentIndex].selectedOptionIndex !== null) return; // locked

    setQuestions(prev => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        selectedOptionIndex: optionIndex
      };
      return updated;
    });
  };

  // Navigate forward
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Navigate backward
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    const pool = shuffleArray(kanjiData).slice(0, 50);
    const generatedQuestions: QuestionState[] = pool.map(item => {
      const correctReading = item.reading;
      const rawOptions = [correctReading, ...item.distractors];
      const options = shuffleArray(rawOptions);
      const correctOptionIndex = options.indexOf(correctReading);

      return {
        kanji: item.kanji,
        correctReading,
        meaning: item.meaning,
        options,
        correctOptionIndex,
        selectedOptionIndex: null
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setTimeSpent(0);
    setTimerEnabled(true);
    setCompleted(false);
    clearActiveTest(testNum);
  };

  // Submit test (finish)
  const submitQuiz = () => {
    setCompleted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Compute final scores
    const correctCount = questions.reduce((acc, q) => {
      return q.selectedOptionIndex === q.correctOptionIndex ? acc + 1 : acc;
    }, 0);
    const wrongCount = questions.length - correctCount;
    const percentage = Math.round((correctCount / questions.length) * 100);

    const historyRecord: Omit<TestHistory, 'bestScore'> = {
      testNum,
      correctCount,
      wrongCount,
      percentage,
      timeSpent,
      lastAttemptDate: new Date().toISOString(),
      completed: true
    };

    saveHistory(historyRecord);
    clearActiveTest(testNum);
    onComplete();
  };

  const toggleTimer = () => {
    setTimerEnabled(prev => !prev);
  };

  // Compute current summary scores
  const correctCount = questions.reduce((acc, q) => {
    return q.selectedOptionIndex === q.correctOptionIndex ? acc + 1 : acc;
  }, 0);
  const answeredCount = questions.filter(q => q.selectedOptionIndex !== null).length;
  const wrongCount = answeredCount - correctCount;

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    timeSpent,
    timerEnabled,
    completed,
    isLoaded,
    selectOption,
    nextQuestion,
    prevQuestion,
    restartQuiz,
    submitQuiz,
    toggleTimer,
    correctCount,
    wrongCount,
    answeredCount,
    totalQuestions: questions.length
  };
}
