import {l33t} from "./badWords"
/**
 * This function creates a regex string for to identify a word and its variations
 * @param {string} word
 * @return {string} A regex
 */
function wordToRegex(word, endings) {
  /* Creates a string that is a partial regex to be added to the end of the regex word.
   * It defines all endings that a word can have*/
  let endingRegex = "";
  endings.forEach((ending) => {
    endingRegex = "|" + ending + endingRegex;
  });

  // Change the last character of word to the ending regex
  word = word.slice(0, -1) + `(${word.slice(-1)}${endingRegex})`;

  /* Returns the regex of the word with all the vowels changed to a regex
   * including their l33t similar*/
  let l;
  return word.replace(/[a-z]/g, (c) => {
    l = l33t[c];
    if (l == undefined) return `\\s*[${c}#*$]+`;
    else return `\\s*[${c}${l}*#$]+`;
  });
}

export function createRegexString(badWords, endings) {
  //console.log(badWords)
  return (
    "\\b(" + badWords.map(word => wordToRegex(word, endings)).join("[sz]*|") + ")(\\W|\\n|\\s|$)"
  );
  //console.log(badWordsRegexString);
}

// Checks if there is any bad words in the text and changes hasBadWords value
export function checkText(badWordsRegex, text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Removes accentuation
    .replace(/[^\w!@#$%&*\n ]/g, "") // Removes especial characters diferent from !@#$%&* and new lines
    .match(badWordsRegex);
}
