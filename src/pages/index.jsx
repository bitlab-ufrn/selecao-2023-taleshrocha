import Head from "next/head";
import { useRef, useState } from "react";
import { BsFillSendFill as SendIcon } from "react-icons/bs";
import { badWords, endings, l33t } from "../badWords";

export default function Home() {
  const textareaRef = useRef(null);
  const [foundBadWords, setFoundBadWords] = useState([]);

  /**
   * This function creates a regex string for to identify a word and its variations
   * @param {string} word
   * @return {string} A regex
   */
  function createRegexString(word) {
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
      if (l == undefined) return `${c}+`;
      else return `[${c}${l}]+`;
    });
  }

  const badWordsRegexString =
    "\\b(" + badWords.map(createRegexString).join("|") + ")\\b";

  const badWordsRegex = new RegExp(badWordsRegexString, "ig");

  // Checks if there is any bad words in the text and changes hasBadWords value
  function checkText() {
    const matches = textareaRef.current.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Removes accentuation
      .replace(/[^a-zA-Z0-9 ]/g, "") // Removes especial characters
      .match(badWordsRegex);

    setFoundBadWords(matches ? [...new Set(matches)] : []);
  }

  return (
    <>
      <Head>
        <title>Detector</title>
        <meta name="description" content="Detector" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="flex min-h-screen flex-col items-center justify-between px-48
           py-24 bg-neutral-900 space-y-4"
      >
        <h1 className="text-neutral-50 font-bold text-3xl">Detector</h1>

        <div className="flex items-center justify-center w-full h-full space-x-2">
          {/*Custom Textarea*/}
          <div
            className={`
            group relative flex flex-col w-full h-72 bg-neutral-800 
            overflow-hidden border-4 border-neutral-700 rounded-md p-2`}
          >
            <textarea
              className="resize-none w-full h-full bg-inherit 
                outline-none border-transparent focus:border-transparent 
                focus:ring-0 text-neutral-50 placeholder:font-bold"
              placeholder="Escreva seu texto aqui"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key == "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  checkText();
                }
              }}
            />
          </div>

          <button
            className="flex items-center justify-center bg-cyan-900 border-4 border-cyan-800 rounded-md
              h-32 text-neutral-50 p-4"
            onClick={checkText}
          >
            Analisar <SendIcon />
          </button>
        </div>

        {/*Result box*/}
        <div
          className="flex flex-col h-full w-full items-center justify-center 
          text-neutral-50 space-y-2"
        >
          <h2 className="font-bold text-2xl">Resultado</h2>
          <div
            className={`flex items-center justify-center w-full h-32 bg-neutral-800 
             border-4 border-neutral-700 rounded-md p-2 font-bold overflow-x-scroll
            ${foundBadWords.length != 0 ? "text-red-500" : "text-green-500"}`}
          >
            {foundBadWords.length != 0 ? (
              <div className="flex flex-col items-center justify-center
                h-full break-all">
                <p>Existem palavras impróprias no texto!</p>
                <ul className="list-none h-min w-max overflow-y-scroll p-2 rounded-md 
                  break-all bg-neutral-700 text-center">
                  {foundBadWords.map((word, index) => (
                    <li key={index}>
                    {word}
                    </li>
                  )
                  )}
                </ul>
              </div>
            ) : (
              <p>Não existem palavras impróprias no texto</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
