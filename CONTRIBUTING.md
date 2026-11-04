# Contributing to Driller IMproved

Thanks for wanting to help! This is a small, dependency-free project, so contributing is easy: no build step, no package install, no test runner.

## Getting started

```sh
git clone https://github.com/pseja/dim.git
cd dim
```

Open the codebase in your favorite editor, and open `index.html` in a browser. That is the whole setup. Reload the page after each change.

If you want to try the file import in a browser that blocks `file://` access, serve the folder with any static server, for example, `python -m http.server`.

## Before opening a PR

There are no automated checks, so please verify your change by hand and say in the PR what you tried:

- Run a full drill: answer, check, go back and forward, finish, open the review, drill the missed questions again.
- Use both the keyboard and the mouse (the stuff you expect to be clickable most probably is).
- Import a drill three ways: file drop or browse, pasted JSON, and a JS-literal array (unquoted keys, trailing `;`).
- Check both light and dark mode, and a couple of the themes (`T`).
- Open each dialog (`T`, `D` on the menu, `Esc` during a drill) and use it with the keyboard and the mouse.
- Make sure the browser console shows no errors.
- Reload the page and check that saved drills, the hint setting, and the theme persist.

Refactors should not change behavior. If you do change behavior, describe it in the PR.

## Good first contributions

- Fix bugs and rough edges you run into while drilling.
- Improve the keyboard flow or add missing shortcuts (with footer hints).
- Add new options next to shuffle and hint (they appear in the "enabled" line on the menu).
- Add colour themes (see `js/themes.js`) or new dialogs built on the generic one.
- Improve accessibility, such as focus handling and screen reader labels.
- Improve the docs.
- Share example drills (see [Ground rules](#ground-rules)).

## Project structure

```sh
.
├── index.html      # entry point, loads styles and scripts
├── assets/         # SVG logos and favicon
├── css/            # tokens, base, layout and component styles
└── js/
    ├── views/      # menu, drill, results and review screens, and the dialogs
    ├── dom.js      # DOM-building helpers
    ├── importer.js # drill parsing and validation
    ├── keyboard.js # keyboard shortcuts, one handler per view
    ├── main.js     # entry point
    ├── render.js   # draws the current view
    ├── session.js  # grading and navigation logic
    ├── state.js    # global application state
    ├── storage.js  # localStorage access
    ├── themes.js   # colour theme definitions
    └── utils.js    # small helpers
```

### How it works

- **Plain scripts, no modules.** The files are loaded in order from `index.html` and share a single global scope, so the app runs straight from disk. A new script has to be added to `index.html` in the right place, after the files it uses.
- **State is global.** `state.js` holds the current view, session, and settings. Change state, then call `render()`, which rebuilds the whole page from the current view.
- **Views are functions** that return a DOM element (`menuView`, `drillView`, ...). Each view also builds its own footer of key hints.
- **Keys and clicks share one function.** Every footer hint takes the same function as its key handler in `keyboard.js`, so both always do the same thing.
- **Dialogs are built on `openDialog()`** in `views/dialog.js`. Pass it the content, the key hints, and an `onKey` handler; it provides the overlay, closes on `Esc` or an outside click, and sends the keys to the open dialog only. Look at `views/confirm.js` for the smallest example, and reuse `optionElement()` for lists the user picks from, so they look like the answer options.
- **Never use `innerHTML`.** All text goes through `textContent` via the `h()` helper in `dom.js`, because drill content is user-provided.

## Code style

- Match the already existing surrounding code: 2 spaces, double quotes, semicolons, trailing commas (Prettier defaults).
- Document every function and constant with a JSDoc block in the same format as the existing files (`@param {type} name - Description.`, `@returns`, `@type`). New files start with a short header comment.
- No dependencies and no build tooling. Keep it plain HTML, CSS, and JavaScript.
- Keep the **boxy TUI look**: square corners (no `border-radius`), box borders, monospace text, ASCII markers like `[+]`, `[~]`, `[-]`, and `[!]`.
- Use the color tokens in `css/tokens.css` and make sure the new UI works in both light and dark mode and with every theme (a theme sets the same tokens). Use plain ASCII in the UI, for example `...` rather than the ellipsis character. Orange indicates partial correctness, so don’t reuse it for other things.
- New shortcuts need a footer hint, a handler in `keyboard.js` (or the dialog's `onKey`), and a row in the shortcut table in the README.

## Pull requests

1. Fork the repo and branch from `main`.
2. Keep the PR focused on one change.
3. Update the README if you change usage, shortcuts, or the import format.
4. In the PR description, say what changed, why, and how you tested it. Add a screenshot or a short recording showing visible changes in both themes, if possible.

## Ground rules

- **Drill files:** only share questions you have the right to share. Don't contribute copyrighted exam material.
- **Import format:** keep it compatible with [Fancy-Driller](https://github.com/AdamBalu/Fancy-Driller) so existing drill files continue to work.
- Be kind and constructive in issues and reviews.

## Questions and bugs

Open an issue. For bugs, include your browser, the steps to reproduce, and the drill file if it is relevant (remove anything private first).
