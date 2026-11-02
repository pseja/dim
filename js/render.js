/**
 * Rendering of the current view into the page.
 */

"use strict";

/**
 * The element the views are rendered into.
 *
 * @type {HTMLElement}
 */
const appRoot = document.getElementById("app");

/**
 * The function that builds each view.
 *
 * @type {Object<string, function(): HTMLElement>}
 */
const VIEWS = {
  menu: menuView,
  drill: drillView,
  results: resultsView,
  review: reviewView,
};

/**
 * Replaces the whole page with the current view.
 */
function render() {
  appRoot.replaceChildren(VIEWS[view]());
  if (view !== "menu") window.scrollTo(0, 0);
}
