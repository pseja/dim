/**
 * Theme dialog: a list of colour themes with a live preview.
 */

"use strict";

/**
 * The custom properties a theme sets, the same as in css/tokens.css.
 */
const THEME_VARS = [
  "bg",
  "fg",
  "dim",
  "line",
  "sel",
  "ok",
  "part",
  "bad",
  "acc",
];

/**
 * The entries of the dialog: the default theme, then every theme in THEMES.
 *
 * @type {Array<{ id: string, name: string, mode: string, colors: ?Object<string, string> }>}
 */
const THEME_ENTRIES = [
  { id: "", name: "Default", mode: "auto", colors: null },
  ...THEMES,
];

/**
 * The id of the applied theme, "" for the default.
 *
 * @type {string}
 */
let themeId = loadTheme();
/**
 * The open dialog, or null: its root element, its rows and the highlighted index.
 *
 * @type {?{ root: HTMLElement, rows: Array<HTMLElement>, index: number }}
 */
let themeDialog = null;

/**
 * Applies a theme to the page, without saving it.
 *
 * @param {string} id - The theme id, "" or an unknown id for the default.
 */
function applyTheme(id) {
  const root = document.documentElement;
  const theme = THEMES.find((entry) => entry.id === id);

  THEME_VARS.forEach((name) => root.style.removeProperty("--" + name));
  if (!theme) {
    delete root.dataset.theme;
    return;
  }

  root.dataset.theme = theme.mode;
  THEME_VARS.forEach((name) =>
    root.style.setProperty("--" + name, theme.colors[name]),
  );
}

/**
 * Builds the strip of colour swatches of a theme entry.
 *
 * @param {{ colors: ?Object<string, string> }} entry - The theme entry.
 *
 * @returns {HTMLElement} The strip, empty for the default theme.
 */
function themeSwatches(entry) {
  const strip = h("span", "swatches");
  if (!entry.colors) return strip;

  const outline = `1px solid ${entry.colors.dim}`;
  ["bg", "fg", "acc", "ok", "part", "bad"].forEach((name) => {
    const swatch = h("i");
    swatch.style.cssText = `background:${entry.colors[name]};outline:${outline}`;
    strip.appendChild(swatch);
  });

  return strip;
}

/**
 * Builds the preview pane, coloured by whatever theme is applied.
 *
 * @returns {HTMLElement} The pane.
 */
function themePreview() {
  const pane = h("div", "box preview", null, [h("span", "title", "Preview")]);
  pane.append(
    h("p", null, "Which of these are correct?"),
    h("div", "opt", null, [
      h("span", "n", "1"),
      h("span", null, "[ ]"),
      h("span", "t", "An open option"),
    ]),
    h("div", "opt on", null, [
      h("span", "n", "2"),
      h("span", null, "[x]"),
      h("span", "t", "A picked option"),
    ]),
    h("div", "ok-t", "[+] correct"),
    h("div", "part-t", "[~] partial"),
    h("div", "bad-t", "[-] wrong"),
    h("div", "dim", "dim text, 3 questions"),
  );
  return pane;
}

/**
 * Opens the theme dialog on the applied theme.
 */
function openThemeDialog() {
  if (themeDialog) return;

  const index = Math.max(
    0,
    THEME_ENTRIES.findIndex((entry) => entry.id === themeId),
  );
  const rows = THEME_ENTRIES.map((entry, i) => {
    const row = h("div", "row", null, [
      h("span", "dim", entry.mode),
      h("span", "name", entry.name),
      themeSwatches(entry),
    ]);
    row.onclick = () => moveTheme(i);
    row.ondblclick = () => chooseTheme();

    return row;
  });

  const list = h("div", "box list", null, [h("span", "title", "Themes")]);
  list.appendChild(h("div", "scroll", null, rows));
  list.appendChild(
    h("span", "title br", `${index + 1} of ${THEME_ENTRIES.length}`),
  );

  const root = h("div", "overlay", null, [
    h("div", "dialog", null, [
      h("div", "panes", null, [list, themePreview()]),
      keyHint([
        ["j/k", "move"],
        ["Space", "select", chooseTheme],
        ["Esc", "cancel", closeThemeDialog],
      ]),
    ]),
  ]);
  root.onclick = (event) => {
    if (event.target === root) closeThemeDialog();
  };

  document.body.appendChild(root);
  themeDialog = { root, rows, index: -1 };

  moveTheme(index);
}

/**
 * Highlights a theme and previews it on the page.
 *
 * @param {number} index - The index into THEME_ENTRIES, clamped to its range.
 */
function moveTheme(index) {
  const dialog = themeDialog;
  index = Math.min(THEME_ENTRIES.length - 1, Math.max(0, index));
  if (index === dialog.index) return;

  dialog.rows.forEach((row, i) => row.classList.toggle("cur", i === index));
  dialog.rows[index].scrollIntoView({ block: "nearest" });
  dialog.root.querySelector(".title.br").textContent =
    `${index + 1} of ${THEME_ENTRIES.length}`;
  dialog.index = index;

  applyTheme(THEME_ENTRIES[index].id);
}

/**
 * Keeps the highlighted theme, saves it and closes the dialog.
 */
function chooseTheme() {
  themeId = THEME_ENTRIES[themeDialog.index].id;
  saveTheme(themeId);
  closeThemeDialog();
}

/**
 * Closes the dialog and restores the saved theme, unless one was just chosen.
 */
function closeThemeDialog() {
  themeDialog.root.remove();
  themeDialog = null;
  applyTheme(themeId);
}

/**
 * Handles a key press while the theme dialog is open.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function themeKey(event) {
  const key = event.key;
  const index = themeDialog.index;
  event.preventDefault();

  if (isNextKey(key)) moveTheme(index + 1);
  else if (isPrevKey(key)) moveTheme(index - 1);
  else if (key === "Home" || key === "g") moveTheme(0);
  else if (key === "End" || key === "G") moveTheme(THEME_ENTRIES.length);
  else if (key === "PageDown") moveTheme(index + 8);
  else if (key === "PageUp") moveTheme(index - 8);
  else if (key === "Enter" || key === " ") chooseTheme();
  else if (key === "Escape" || key === "q") closeThemeDialog();
}
