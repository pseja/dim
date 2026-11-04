"use strict";

/**
 * Key for drills in localStorage.
 */
const STORAGE_KEY = "driller-improved";
/**
 * Key for hint setting in localStorage.
 */
const HINT_KEY = STORAGE_KEY + "-hint";

/**
 * The drill a first-time visitor starts with.
 */
const EXAMPLE_DRILL = {
  name: "Example Drill",
  questions: [
    {
      question: "What is A?",
      correct: ["A1", "A2"],
      wrong: ["X1", "X2", "X3"],
    },
    {
      question: "How does B work?",
      correct: ["B1", "B2", "B3", "B4"],
      wrong: [],
    },
  ],
};

/**
 * Loads the list of drills from localStorage.
 *
 * @returns {Array} The saved drills, the example drill if nothing was ever saved,
 * or an empty array on errors.
 */
function loadDrills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [structuredClone(EXAMPLE_DRILL)];
    return JSON.parse(saved) || [];
  } catch {
    return [];
  }
}

/**
 * Saves the list of drills to localStorage.
 *
 * @param {*} drills - The list of drills to save.
 */
function saveDrills(drills) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drills));
  } catch {}
}

/**
 * Loads the hint setting from localStorage.
 *
 * @returns {boolean} The hint setting, or false if none is found.
 */
function loadHint() {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Saves the hint setting to localStorage.
 *
 * @param {*} enabled - The hint setting to save.
 */
function saveHint(enabled) {
  try {
    localStorage.setItem(HINT_KEY, enabled ? "1" : "0");
  } catch {}
}

/**
 * Key for the colour theme in localStorage.
 */
const THEME_KEY = STORAGE_KEY + "-theme";

/**
 * Loads the id of the saved colour theme from localStorage.
 *
 * @returns {string} The theme id, or "" for the default theme.
 */
function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * Saves the id of the colour theme to localStorage.
 *
 * @param {string} id - The theme id, or "" for the default theme.
 */
function saveTheme(id) {
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {}
}
