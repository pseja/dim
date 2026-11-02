/**
 * Global application state. Shared by every script via the global scope.
 */

"use strict";

/**
 * The list of drills, loaded from localStorage. Each drill is an object with a name and a list of questions.
 * Each question is an object with a question string, a list of correct answers, and a list of wrong answers.
 *
 * @type {Array<{ name: string, questions: Array<{ question: string, correct: Array<string>, wrong: Array<string> }> }>}
 */
let drills = loadDrills();
/**
 * Whether to shuffle questions and options when starting a drill.
 *
 * @type {boolean}
 */
let shuffleQuestions = true;
/**
 * Whether to show hints (the correct answers) when answering questions.
 *
 * @type {boolean}
 */
let showHint = loadHint();

/**
 * The current view: "menu" | "drill" | "results" | "review"
 */
let view = "menu";
/**
 * The active drill, see `startDrill` in session.js
 */
let session = null;
/**
 * Position within the missed questions on the review screen
 */
let reviewIndex = 0;
/**
 * Message shown under the import box
 */
let importError = "";

/**
 * Sets the hint setting and saves it to localStorage.
 *
 * @param {*} enabled - The hint setting to save.
 */
function setHint(enabled) {
  showHint = enabled;
  saveHint(enabled);
  render();
}
