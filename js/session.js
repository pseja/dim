/**
 * Drill session logic: answering, grading and navigating between questions.
 *
 * The `session` object has the following shape:
 * - name, questions: The drill name and the (possibly shuffled) question list.
 * - index: The current question, the furthest one reached.
 * - viewed: The question on screen; below `index` while browsing answered ones.
 * - options: The shuffled `{ text, ok }` options of the current question.
 * - selected: The picked option indices of the current question.
 * - checked: Whether the current question has been checked.
 * - results: The `{ item, options, selected, status }` of checked questions,
 *   where status is "ok" | "part" | "bad".
 */

"use strict";

/**
 * Starts a drill and shows its first question.
 * Questions are shuffled if `shuffleQuestions` is enabled.
 *
 * @param {Array<{ question: string, correct: Array<string>, wrong: Array<string> }>} items - The questions to drill.
 * @param {string} name - The name of the drill.
 */
function startDrill(items, name) {
  session = {
    name,
    questions: shuffleQuestions ? shuffle(items) : items,
    index: 0,
    viewed: 0,
    options: null,
    selected: new Set(),
    checked: false,
    results: [],
  };
  prepareQuestion();
  showView("drill");
}

/**
 * Switches to a view and renders it.
 *
 * @param {"menu"|"drill"|"results"|"review"} name - The view to show.
 */
function showView(name) {
  view = name;
  render();
}

/**
 * Prepares the current question: shuffles its options and clears the selection.
 */
function prepareQuestion() {
  const item = session.questions[session.index];
  session.options = shuffle(
    item.correct
      .map((text) => ({ text, ok: true }))
      .concat(item.wrong.map((text) => ({ text, ok: false }))),
  );
  session.selected = new Set();
  session.checked = false;
}

/**
 * Grades the current selection.
 *
 * @returns {"ok"|"part"|"bad"} "ok" if all correct answers and no wrong one are picked,
 * "part" if only correct ones are picked but not all, "bad" otherwise.
 */
function grade() {
  const picked = [...session.selected].map((i) => session.options[i]);
  const hasWrong = picked.some((option) => !option.ok);
  const correctPicked = picked.filter((option) => option.ok).length;
  const correctTotal = session.options.filter((option) => option.ok).length;

  if (!hasWrong && correctPicked === correctTotal) return "ok";
  if (!hasWrong && correctPicked > 0) return "part";
  return "bad";
}

/**
 * Checks the current question and records its result.
 * Does nothing if it is already checked or nothing is selected.
 */
function check() {
  if (session.checked || !session.selected.size) return;
  session.checked = true;
  session.results.push({
    item: session.questions[session.index],
    options: session.options,
    selected: new Set(session.selected),
    status: grade(),
  });
  render();
}

/**
 * Advances to the next question, or to the results after the last one.
 */
function next() {
  if (session.index + 1 >= session.questions.length) {
    showView("results");
    return;
  }
  session.index++;
  session.viewed = session.index;
  prepareQuestion();
  render();
}

/**
 * Moves the viewed question. Moving forward from the checked current question advances.
 *
 * @param {number} delta - The number of questions to move, negative to go back.
 */
function navigate(delta) {
  if (delta > 0 && session.viewed === session.index && session.checked)
    return next();
  session.viewed = Math.max(0, Math.min(session.index, session.viewed + delta));
  render();
}

/**
 * Handles the space action: returns to the current question when browsing,
 * otherwise checks the question or advances.
 */
function spaceAction() {
  if (session.viewed !== session.index) {
    session.viewed = session.index;
    render();
  } else if (session.checked) {
    next();
  } else {
    check();
  }
}

/**
 * Toggles the selection of an option. Does nothing for answered questions.
 *
 * @param {number} index - The zero-based index of the option.
 */
function toggleOption(index) {
  const isReadOnly = session.viewed !== session.index || session.checked;
  if (isReadOnly || index >= session.options.length) return;
  if (session.selected.has(index)) session.selected.delete(index);
  else session.selected.add(index);
  render();
}

/**
 * Asks for confirmation, then quits the drill and returns to the menu.
 */
function quitDrill() {
  if (confirm("Quit this drill?")) showView("menu");
}

/**
 * Toggles the shuffling of questions for the next drill.
 */
function toggleShuffle() {
  shuffleQuestions = !shuffleQuestions;
  render();
}

/**
 * Opens the review of missed questions, starting at the first.
 */
function openReview() {
  reviewIndex = 0;
  showView("review");
}

/**
 * Gets the results that were not fully correct.
 *
 * @returns {Array<{ item: object, options: Array<object>, selected: Set<number>, status: string }>} The missed results.
 */
const missedResults = () =>
  session.results.filter((result) => result.status !== "ok");

/**
 * Gets the drill name without the " (missed)" suffix added by `drillMissed`.
 *
 * @returns {string} The base name of the drill.
 */
const baseDrillName = () => session.name.replace(/ \(missed\)$/, "");

/**
 * Restarts the drill with the questions that were answered.
 */
function restartDrill() {
  startDrill(
    session.results.map((result) => result.item),
    baseDrillName(),
  );
}

/**
 * Starts a new drill with only the missed questions.
 */
function drillMissed() {
  startDrill(
    missedResults().map((result) => result.item),
    baseDrillName() + " (missed)",
  );
}
