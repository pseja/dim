/**
 * Summary screen shown after the last question.
 */

"use strict";

/**
 * Builds the results view.
 *
 * @returns {HTMLElement} The view.
 */
function resultsView() {
  const root = h("div", "page");
  const total = session.results.length;
  const count = (status) =>
    session.results.filter((r) => r.status === status).length;

  root.appendChild(topBar(`${session.name} - results`, "done"));

  const percent = Math.round((100 * count("ok")) / total);
  const filled = Math.round(percent / 5);
  const box = h("div", "box", null, [h("span", "title", "Summary")]);
  box.appendChild(
    h(
      "div",
      "progress",
      "[" +
        "█".repeat(filled) +
        "░".repeat(20 - filled) +
        "] " +
        percent +
        "% fully correct",
    ),
  );
  box.appendChild(h("div", "ok-t", `[+] correct    ${count("ok")}`));
  box.appendChild(h("div", "part-t", `[~] partial    ${count("part")}`));
  box.appendChild(h("div", "bad-t", `[-] incorrect  ${count("bad")}`));

  const hints = [];
  if (missedResults().length) {
    hints.push(
      ["R", "review missed", openReview],
      ["D", "drill missed", drillMissed],
    );
  }
  hints.push(
    ["N", "restart", restartDrill],
    ["M/Esc", "menu", () => showView("menu")],
  );

  root.append(h("div", "stage", null, [box]), keyHint(hints));
  return root;
}
