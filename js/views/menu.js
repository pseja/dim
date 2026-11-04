/**
 * Start screen: import box, drill list and the enabled-options line.
 */

"use strict";

/**
 * Builds the menu view.
 *
 * @returns {HTMLElement} The view.
 */
function menuView() {
  const root = h("div", "page");
  const stage = h("div", "stage");

  root.appendChild(topBar("Driller IMproved", "multi-select drill"));
  stage.appendChild(importBox());
  stage.appendChild(drillListBox());
  root.append(
    stage,
    keyHint([
      ["1-9", "start drill"],
      ["D", "delete", openDeleteDialog],
      ["S", "shuffle", toggleShuffle],
      ["H", "hint", () => setHint(!showHint)],
      ["T", "theme", openThemeDialog],
      ["Tab", "move focus"],
    ]),
  );
  return root;
}

/**
 * Builds the box for importing drills from a file or pasted text.
 *
 * @returns {HTMLElement} The box.
 */
function importBox() {
  const box = h("div", "box", null, [h("span", "title", "Import drill")]);

  // file drop zone / picker
  const drop = h("div", "drop", "Drop a JSON file here, or click to browse");
  const fileInput = h("input");
  fileInput.type = "file";
  fileInput.accept = ".json,.js,.txt,application/json";
  fileInput.multiple = true;
  fileInput.hidden = true;

  const readFiles = (files) =>
    [...files].forEach((file) =>
      file
        .text()
        .then((text) => addDrill(file.name.replace(/\.[^.]+$/, ""), text)),
    );
  drop.onclick = () => fileInput.click();
  fileInput.onchange = () => readFiles(fileInput.files);
  drop.ondragover = (event) => {
    event.preventDefault();
    drop.classList.add("over");
  };
  drop.ondragleave = () => drop.classList.remove("over");
  drop.ondrop = (event) => {
    event.preventDefault();
    drop.classList.remove("over");
    readFiles(event.dataTransfer.files);
  };

  // paste area
  const textarea = h("textarea");
  textarea.id = "paste";
  textarea.placeholder =
    '[{ "question": "What is A?", "correct": ["A1","A2"], "wrong": ["X1","X2"] }]';

  const nameInput = h("input");
  nameInput.placeholder = "pasted drill";
  nameInput.style.cssText =
    "font:inherit;background:var(--bg);color:var(--fg);border:2px solid var(--line);padding:2px 8px;margin-right:8px";

  const importPasted = button("Import pasted", () =>
    addDrill(nameInput.value.trim() || "pasted drill", textarea.value),
  );

  box.append(
    drop,
    fileInput,
    textarea,
    h("div", null, null, [nameInput, importPasted]),
  );
  box.appendChild(
    h(
      "div",
      "dim",
      'Questions with a line starting with " |" render as monospace tables.',
    ),
  );
  if (importError) box.appendChild(h("div", "err", "[!] " + importError));
  return box;
}

/**
 * Builds the box listing the saved drills.
 *
 * @returns {HTMLElement} The box.
 */
function drillListBox() {
  const box = h("div", "box", null, [h("span", "title", "Drills")]);

  if (!drills.length)
    box.appendChild(h("div", "dim", "No drills yet. Import one above."));

  drills.forEach((drill, i) => {
    const row = h("div", "row", null, [
      h("span", "dim", keyLabel(i) + "."),
      h("span", null, drill.name),
      h("span", "dim", `(${drill.questions.length} questions)`),
    ]);
    row.onclick = () => startDrill(drill.questions, drill.name);
    box.appendChild(row);
  });

  box.appendChild(enabledOptionsLine());
  return box;
}

/**
 * Builds the line listing the enabled options, e.g. "enabled: shuffle, hint".
 *
 * @returns {HTMLElement} The line.
 */
function enabledOptionsLine() {
  const enabled = [shuffleQuestions && "shuffle", showHint && "hint"].filter(
    Boolean,
  );
  const line = h("div", "dim", "enabled: ");
  line.style.marginTop = "8px";
  line.appendChild(
    h(
      "span",
      enabled.length ? "ok-t" : "dim",
      enabled.length ? enabled.join(", ") : "none",
    ),
  );
  return line;
}
