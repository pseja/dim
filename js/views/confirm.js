/**
 * Confirm dialog
 */

"use strict";

/**
 * Opens a dialog asking the user to confirm an action.
 *
 * @param {string} message - The question to ask.
 * @param {string} confirmLabel - The label of the confirming action, e.g. "quit".
 * @param {Function} onConfirm - Called if the user confirms; cancelling does nothing.
 */
function openConfirmDialog(message, confirmLabel, onConfirm) {
  const accept = () => {
    closeDialog();
    onConfirm();
  };

  openDialog({
    className: "confirm",
    content: [
      h("div", "box", null, [
        h("span", "title", "Confirm"),
        h("p", null, message),
      ]),
    ],
    hints: [
      ["Space", confirmLabel, accept],
      ["Esc", "cancel", closeDialog],
    ],
    onKey: (event) => {
      const key = event.key.toLowerCase();
      if (key === " " || key === "y" || key === "enter") accept();
      else if (key === "n" || key === "q") closeDialog();
    },
  });
}
