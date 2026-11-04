/**
 * Delete dialog
 */

"use strict";

/**
 * Opens the dialog listing the saved drills. Does nothing without drills.
 */
function openDeleteDialog() {
  if (activeDialog || !drills.length) return;

  const picked = new Set();
  const count = h("span", "title br", "0 selected");
  const rows = drills.map((drill, i) => {
    const row = optionElement({ text: drill.name }, i, picked, false, () =>
      toggle(i),
    );
    row.querySelector(".t").title = drill.name;
    row.appendChild(h("span", "dim", `(${drill.questions.length} questions)`));
    return row;
  });

  const toggle = (index) => {
    if (index >= drills.length) return;
    if (!picked.delete(index)) picked.add(index);

    const isPicked = picked.has(index);
    rows[index].classList.toggle("on", isPicked);
    rows[index].children[1].textContent = isPicked ? "[x]" : "[ ]";
    count.textContent = `${picked.size} selected`;
  };

  const confirmDelete = () => {
    if (!picked.size) return;
    [...picked]
      .sort((a, b) => b - a)
      .forEach((index) => drills.splice(index, 1));
    saveDrills(drills);
    closeDialog();
    render();
  };

  const list = h("div", "box", null, [h("span", "title", "Delete drills")]);
  list.append(h("div", "scroll", null, rows), count);

  // shorten names that do not fit the row, now and whenever the window resizes
  const fitNames = () =>
    rows.forEach((row, i) => fitText(row.querySelector(".t"), drills[i].name));

  openDialog({
    className: "delete",
    content: [list],
    onClose: () => window.removeEventListener("resize", fitNames),
    hints: [
      ["1-9", "toggle"],
      ["Space", "delete", confirmDelete],
      ["Esc", "cancel", closeDialog],
    ],
    onKey: (event) => {
      const digit = digitIndex(event.key);
      if (digit >= 0) toggle(digit);
      else if (event.key === "Enter" || event.key === " ") confirmDelete();
    },
  });

  fitNames();
  window.addEventListener("resize", fitNames);
}
