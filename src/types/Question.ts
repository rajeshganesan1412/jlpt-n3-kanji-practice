export interface KanjiItem {
  kanji: string;
  reading: string;
  meaning: string;
  test: number;
  distractors: string[];
}

export interface QuestionState {
  kanji: string;
  correctReading: string;
  meaning: string;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex: number | null;
}

export interface TestHistory {
  testNum: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  timeSpent: number; // in seconds
  bestScore: number; // best correctCount out of 50
  lastAttemptDate: string; // ISO date string
  completed: boolean;
}

export interface ActiveTestState {
  testNum: number;
  questions: QuestionState[];
  currentIndex: number;
  timeSpent: number; // in seconds
  timerEnabled: boolean;
  completed: boolean;
}
