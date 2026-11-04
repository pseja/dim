/**
 * Generic modal dialog. Only one dialog is open at a time.
 */

"use strict";

/**
 * The open dialog, or null: its root element and its key and close handlers.
 *
 * @type {?{ root: HTMLElement, onKey: ?function(KeyboardEvent): void, onClose: ?Function }}
 */
let activeDialog = null;

/**
 * Opens a dialog over the page. Does nothing if a dialog is already open.
 * Escape and a click outside the frame always close it.
 *
 * @param {object} options - What the dialog shows and how it reacts.
 * @param {string} [options.className] - Extra class for the frame, to size or style it.
 * @param {Array<HTMLElement>} options.content - The elements shown above the key hints.
 * @param {Array<[string, string, Function?]>} options.hints - The key hints, as for `keyHint`.
 * @param {function(KeyboardEvent): void} [options.onKey] - Called for every key except Escape.
 * @param {Function} [options.onClose] - Called after the dialog closes, however it closed.
 *
 * @returns {?{ root: HTMLElement }} The open dialog, or null if it could not open.
 */
function openDialog({ className, content, hints, onKey, onClose }) {
  if (activeDialog) return null;

  const frame = h("div", ("dialog " + (className || "")).trim(), null, [
    ...content,
    keyHint(hints),
  ]);
  const root = h("div", "overlay", null, [frame]);
  root.onclick = (event) => {
    if (event.target === root) closeDialog();
  };

  document.body.appendChild(root);
  activeDialog = { root, onKey: onKey || null, onClose: onClose || null };
  return activeDialog;
}

/**
 * Closes the open dialog and runs its close handler.
 */
function closeDialog() {
  const dialog = activeDialog;
  activeDialog = null;
  dialog.root.remove();
  if (dialog.onClose) dialog.onClose();
}

/**
 * Handles a key press while a dialog is open.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function dialogKey(event) {
  event.preventDefault();

  if (event.key === "Escape") closeDialog();
  else if (activeDialog.onKey) activeDialog.onKey(event);
}
