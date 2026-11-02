"use strict";

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 *
 * @param {*} items - The array to shuffle.
 *
 * @returns {Array} A new shuffled array.
 */
function shuffle(items) {
  const copy = items.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
