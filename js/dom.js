/**
 * Small DOM-building helpers. All text goes through textContent, never innerHTML.
 */

"use strict";

/**
 * Creates an element with an optional class, text content and children.
 *
 * @param {string} tag - The tag name of the element.
 * @param {?string} [className] - The class attribute of the element.
 * @param {?string} [text] - The text content of the element.
 * @param {Array<Node>} [children] - The nodes to append to the element.
 *
 * @returns {HTMLElement} The created element.
 */
function h(tag, className, text, children) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  (children || []).forEach((child) => element.appendChild(child));
  return element;
}

/**
 * Creates a button element.
 *
 * @param {string} label - The text shown on the button.
 * @param {Function} onclick - The function called when the button is clicked.
 *
 * @returns {HTMLButtonElement} The created button.
 */
function button(label, onclick) {
  const element = h("button", "btn", label);
  element.onclick = onclick;
  return element;
}

/**
 * Sets the text of a single-line element, cutting it off with "..." if it does not fit.
 * The element must be laid out already and clip its overflow.
 *
 * @param {HTMLElement} element - The element to fill.
 * @param {string} text - The full text.
 */
function fitText(element, text) {
  const fits = () => element.scrollWidth <= element.clientWidth;

  element.textContent = text;
  if (fits()) return;

  let low = 0;
  let high = text.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    element.textContent = text.slice(0, mid) + "...";
    if (fits()) low = mid;
    else high = mid - 1;
  }
  element.textContent = text.slice(0, low) + "...";
}

/**
 * Gets the key label of an option: 1-9, then 0 for the tenth.
 *
 * @param {number} index - The zero-based index of the option.
 *
 * @returns {string} The label of the key that toggles the option, or "-" if it has none.
 */
function keyLabel(index) {
  if (index < 9) return String(index + 1);
  return index === 9 ? "0" : "-";
}

/**
 * Creates the footer of key hints. Hints with an onclick are clickable.
 *
 * @param {Array<[string, string, Function?]>} hints - The hints as [key, description, onclick?].
 *
 * @returns {HTMLElement} The created footer.
 */
function keyHint(hints) {
  const footer = h("div", "keys foot");

  hints.forEach(([key, description, onclick], i) => {
    if (i) footer.appendChild(document.createTextNode("  "));
    const hint = h("span", onclick ? "act" : null, null, [
      h("kbd", null, key),
      document.createTextNode(" " + description),
    ]);
    if (onclick) hint.onclick = onclick;
    footer.appendChild(hint);
  });

  return footer;
}

/**
 * Creates the top bar with a left and a right label.
 *
 * @param {string} left - The text on the left side.
 * @param {string} right - The text on the right side.
 *
 * @returns {HTMLElement} The created bar.
 */
function topBar(left, right) {
  return h("div", "bar", null, [h("span", null, left), h("span", null, right)]);
}

/**
 * Creates the question text. Any line starting with " |" turns it into a monospace table.
 *
 * @param {string} text - The question text.
 *
 * @returns {HTMLElement} The created paragraph, or preformatted block for tables.
 */
function questionElement(text) {
  const isTable = text.split("\n").some((line) => line.startsWith(" |"));
  return h(isTable ? "pre" : "p", "q", text);
}

/**
 * Creates an answer option. Once checked, it is coloured by outcome:
 * ok (picked, correct), bad (picked, wrong), miss (not picked, correct).
 *
 * @param {{ text: string, ok: boolean }} option - The option to show.
 * @param {number} index - The zero-based index of the option.
 * @param {Set<number>} selected - The indices of the picked options.
 * @param {boolean} checked - Whether the question has been checked.
 * @param {Function} [onclick] - The function called when the option is clicked.
 *
 * @returns {HTMLElement} The created option.
 */
function optionElement(option, index, selected, checked, onclick) {
  const isSelected = selected.has(index);
  let className = "opt";
  let tag = "";

  if (checked) {
    className += " locked";
    if (isSelected && option.ok) {
      className += " ok";
      tag = "[+] correct";
    } else if (isSelected && !option.ok) {
      className += " bad";
      tag = "[-] wrong";
    } else if (!isSelected && option.ok) {
      className += " miss";
      tag = "[!] missed";
    }
  } else if (isSelected) {
    className += " on";
  }

  const element = h("div", className, null, [
    h("span", "n", keyLabel(index)),
    h("span", null, isSelected ? "[x]" : "[ ]"),
    h("span", "t", option.text),
    h("span", "tag", tag),
  ]);
  if (onclick) element.onclick = onclick;

  return element;
}
