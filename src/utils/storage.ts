import type { TestHistory, ActiveTestState } from '../types/Question';

const HISTORY_KEY = 'jlpt_kanji_history';
const ACTIVE_PREFIX = 'jlpt_kanji_active_';
const THEME_KEY = 'jlpt_kanji_theme';

/**
 * Retrieves all completed test records from Local Storage.
 */
export function getHistory(): TestHistory[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Saves a completed test record. Keeps track of the best score historically.
 */
export function saveHistory(record: Omit<TestHistory, 'bestScore'>): void {
  const history = getHistory();
  const index = history.findIndex(h => h.testNum === record.testNum);
  
  let bestScore = record.correctCount;
  if (index !== -1) {
    bestScore = Math.max(history[index].bestScore, record.correctCount);
    history[index] = {
      ...record,
      bestScore
    };
  } else {
    history.push({
      ...record,
      bestScore
    });
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Gets the persisted active state of a test in progress, or null if none exists.
 */
export function getActiveTest(testNum: number): ActiveTestState | null {
  const data = localStorage.getItem(`${ACTIVE_PREFIX}${testNum}`);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Saves the active state of an ongoing test to allow resuming later.
 */
export function saveActiveTest(state: ActiveTestState): void {
  localStorage.setItem(`${ACTIVE_PREFIX}${state.testNum}`, JSON.stringify(state));
}

/**
 * Clears the saved session of an active test (called when test completes or is explicitly restarted).
 */
export function clearActiveTest(testNum: number): void {
  localStorage.removeItem(`${ACTIVE_PREFIX}${testNum}`);
}

/**
 * Retrieves the current theme settings. Defaults to system preference if not set.
 */
export function getTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Saves the user theme preference.
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}
