/**
 * Drill import: parsing, validation and adding to the saved list.
 */

"use strict";

/**
 * Parses drill text into a list of questions.
 * Accepts strict JSON, and also a JS-literal array (unquoted keys, trailing ";").
 *
 * @param {string} text - The text to parse.
 *
 * @returns {Array<{ question: string, correct: Array<string>, wrong: Array<string> }>} The parsed questions.
 *
 * @throws {Error} If the text cannot be parsed or a question is invalid.
 */
function parseDrill(text) {
  const source = text.trim().replace(/;\s*$/, "");
  let data;

  try {
    data = JSON.parse(source);
  } catch (jsonError) {
    try {
      data = new Function('"use strict";return (' + source + "\n)")();
    } catch {
      throw new Error("Could not parse: " + jsonError.message);
    }
  }

  if (!Array.isArray(data) || !data.length) {
    throw new Error("Expected a non-empty array of questions.");
  }

  return data.map((item, i) => {
    if (!item || typeof item.question !== "string") {
      throw new Error(`Item ${i + 1}: missing "question" string.`);
    }
    const correct = (item.correct || []).map(String);
    const wrong = (item.wrong || []).map(String);
    if (!correct.length) {
      throw new Error(`Item ${i + 1}: needs at least one correct answer.`);
    }
    return { question: item.question, correct, wrong };
  });
}

/**
 * Parses and saves a drill, replacing one with the same name, then re-renders.
 * On failure, sets `importError` instead of saving.
 *
 * @param {string} name - The name of the drill.
 * @param {string} text - The text to parse the questions from.
 */
function addDrill(name, text) {
  try {
    const questions = parseDrill(text);
    drills = drills
      .filter((drill) => drill.name !== name)
      .concat([{ name, questions }]);
    saveDrills(drills);
    importError = "";
  } catch (error) {
    importError = error.message;
  }
  render();
}
