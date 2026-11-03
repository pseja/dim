/**
 * Keyboard shortcuts, dispatched per view.
 */

"use strict";

/**
 * Checks whether a key moves forward.
 *
 * @param {string} key - The `key` of a keyboard event.
 *
 * @returns {boolean} True for the right and down arrows and "j".
 */
const isNextKey = (key) =>
  key === "ArrowRight" || key === "ArrowDown" || key === "j";

/**
 * Checks whether a key moves back.
 *
 * @param {string} key - The `key` of a keyboard event.
 *
 * @returns {boolean} True for the left and up arrows and "k".
 */
const isPrevKey = (key) =>
  key === "ArrowLeft" || key === "ArrowUp" || key === "k";

/**
 * The key handler of each view.
 *
 * @type {Object<string, function(KeyboardEvent): void>}
 */
const KEY_HANDLERS = {
  menu: menuKey,
  drill: drillKey,
  results: resultsKey,
  review: reviewKey,
};

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  // leave typing in text fields alone.
  const tag = (event.target.tagName || "").toLowerCase();
  if (
    tag === "textarea" ||
    (tag === "input" && event.target.type !== "checkbox")
  )
    return;

  if (themeDialog) return themeKey(event);
  if (event.key.toLowerCase() === "t" && view !== "drill") {
    event.preventDefault();
    return openThemeDialog();
  }

  KEY_HANDLERS[view](event);
});

/**
 * Maps a digit key to an option index: 1-9 to options 0-8 and 0 to option 9.
 *
 * @param {string} key - The `key` of a keyboard event.
 *
 * @returns {number} The option index, or -1 for any other key.
 */
function digitIndex(key) {
  if (!/^[0-9]$/.test(key)) return -1;
  return key === "0" ? 9 : +key - 1;
}

/**
 * Handles a key press on the menu screen.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function menuKey(event) {
  const key = event.key;
  const digit = digitIndex(key);

  if (digit >= 0 && drills[digit]) {
    event.preventDefault();
    startDrill(drills[digit].questions, drills[digit].name);
  } else if (key.toLowerCase() === "s") {
    toggleShuffle();
  } else if (key.toLowerCase() === "h") {
    setHint(!showHint);
  }
}

/**
 * Handles a key press on the question screen.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function drillKey(event) {
  const key = event.key;
  const digit = digitIndex(key);

  if (digit >= 0) {
    event.preventDefault();
    toggleOption(digit);
  } else if (key.toLowerCase() === "h") {
    setHint(!showHint);
  } else if (isNextKey(key)) {
    event.preventDefault();
    navigate(1);
  } else if (isPrevKey(key)) {
    event.preventDefault();
    navigate(-1);
  } else if (key === " ") {
    event.preventDefault();
    spaceAction();
  } else if (
    key === "Enter" &&
    session.checked &&
    session.viewed === session.index
  ) {
    event.preventDefault();
    next();
  } else if (key === "Escape") {
    quitDrill();
  }
}

/**
 * Handles a key press on the results screen.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function resultsKey(event) {
  const key = event.key.toLowerCase();
  const hasMissed = missedResults().length > 0;

  if (key === "r" && hasMissed) openReview();
  else if (key === "d" && hasMissed) drillMissed();
  else if (key === "n") restartDrill();
  else if (key === "m" || event.key === "Escape") showView("menu");
}

/**
 * Handles a key press on the review screen.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function reviewKey(event) {
  const key = event.key.toLowerCase();

  if (key === "d") {
    drillMissed();
  } else if (isNextKey(event.key) || key === "j") {
    event.preventDefault();
    stepReview(1);
  } else if (isPrevKey(event.key) || key === "k") {
    event.preventDefault();
    stepReview(-1);
  } else if (event.key === "Escape" || key === "b") {
    event.preventDefault();
    showView("results");
  }
}
