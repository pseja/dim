/**
 * Review screen: steps through the questions that were not fully correct.
 */

"use strict";

/**
 * Builds the review view.
 *
 * @returns {HTMLElement} The view.
 */
function reviewView() {
  const root = h("div", "page");
  const missed = missedResults();
  reviewIndex = Math.max(0, Math.min(missed.length - 1, reviewIndex));
  const result = missed[reviewIndex];
  const isPartial = result.status === "part";

  root.appendChild(
    topBar(`${session.name} - review`, `${missed.length} to review`),
  );

  const box = h("div", "box", null, [
    h(
      "span",
      "title " + (isPartial ? "part-t" : "bad-t"),
      isPartial ? "partial" : "incorrect",
    ),
  ]);
  box.style.borderColor = isPartial ? "var(--part)" : "var(--bad)";
  box.appendChild(questionElement(result.item.question));

  const optionList = h("div");
  optionList.style.marginTop = "1.5em";
  result.options.forEach((option, i) =>
    optionList.appendChild(optionElement(option, i, result.selected, true)),
  );
  box.append(
    optionList,
    h("span", "title br", `${reviewIndex + 1} of ${missed.length}`),
  );

  root.append(
    h("div", "stage", null, [box]),
    keyHint([
      ["k/←", "prev", () => stepReview(-1)],
      ["j/→", "next", () => stepReview(1)],
      ["D", "drill these again", drillMissed],
      ["Esc", "back to results", () => showView("results")],
    ]),
  );
  return root;
}

/**
 * Moves to another missed question. The index is clamped when the view is rebuilt.
 *
 * @param {number} delta - The number of questions to move, negative to go back.
 */
function stepReview(delta) {
  reviewIndex += delta;
  render();
}
