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
 * Loads the list of drills from localStorage.
 *
 * @returns {Array} The list of drills, or an empty array if none are found.
 */
function loadDrills() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
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
