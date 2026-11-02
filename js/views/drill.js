/**
 * Question screen. Shows the current question, or a read-only answered one while browsing.
 */

"use strict";

/**
 * The verdict text of each grade.
 *
 * @type {Object<string, string>}
 */
const VERDICT_TEXT = {
  ok: "[+] CORRECT",
  part: "[~] PARTIALLY CORRECT: no wrong picks, but some correct answers missed",
  bad: "[-] INCORRECT",
};

/**
 * Builds the question view.
 *
 * @returns {HTMLElement} The view.
 */
function drillView() {
  const root = h("div", "page");
  const item = session.questions[session.viewed];
  const result = session.results[session.viewed];
  const options = result ? result.options : session.options;
  const selected = result ? result.selected : session.selected;

  const count = (status) =>
    session.results.filter((r) => r.status === status).length;
  const wrongCount = session.results.length - count("ok") - count("part");
  root.appendChild(
    topBar(
      session.name,
      `ok ${count("ok")}  partial ${count("part")}  wrong ${wrongCount}`,
    ),
  );

  const box = h("div", "box", null, [h("span", "title", "Question")]);
  box.appendChild(questionElement(item.question));

  if (showHint) {
    const total = item.correct.length;
    box.appendChild(
      h(
        "div",
        "dim",
        `hint: ${total} correct ${total === 1 ? "answer" : "answers"} of ${options.length}`,
      ),
    );
  }

  const optionList = h("div");
  optionList.style.marginTop = "1.5em";
  options.forEach((option, i) =>
    optionList.appendChild(
      optionElement(option, i, selected, !!result, () => toggleOption(i)),
    ),
  );
  box.appendChild(optionList);

  if (result)
    box.appendChild(
      h("div", "verdict " + result.status, VERDICT_TEXT[result.status]),
    );
  box.appendChild(
    h(
      "span",
      "title br",
      `${session.viewed + 1} of ${session.questions.length}`,
    ),
  );

  root.append(h("div", "stage", null, [box]), keyHint(drillKeyHints(result)));
  return root;
}

/**
 * Gets the key hints of the question view, which depend on whether the viewed question
 * is the current one and whether it has been checked.
 *
 * @param {?{ status: string }} result - The result of the viewed question, if it has been checked.
 *
 * @returns {Array<[string, string, Function?]>} The hints as [key, description, onclick?].
 */
function drillKeyHints(result) {
  const isCurrent = session.viewed === session.index;
  const isLast = session.index + 1 >= session.questions.length;

  let primary;
  if (!isCurrent) primary = [["Space", "back to current", spaceAction]];
  else if (result)
    primary = [["Space", isLast ? "finish" : "next", spaceAction]];
  else
    primary = [
      ["1-9", "toggle option"],
      ["Space", "check", spaceAction],
    ];

  return primary.concat([
    ["k/←", "prev", () => navigate(-1)],
    ["j/→", "next", () => navigate(1)],
    ["H", "hint", () => setHint(!showHint)],
    ["Esc", "quit", quitDrill],
  ]);
}
