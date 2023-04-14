import Head from "next/head";
import { useRef, useState } from "react";
import { IoSend as SendIcon } from "react-icons/io5";
import { BsFillPlusCircleFill as AddIcon } from "react-icons/bs";
import { badWords, endings, l33t } from "../badWords";

export default function Home() {
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
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
      if (l == undefined) return `\\s*[${c}#*$]+`;
      else return `\\s*[${c}${l}*#$]+`;
    });
  }

  let badWordsRegexString =
    "\\b(" +
    badWords.map(createRegexString).join("[sz]*|") +
    ")(\\W|\\n|\\s|$)";
  //console.log(badWordsRegexString);

  let badWordsRegex = new RegExp(badWordsRegexString, "ig");

  // Checks if there is any bad words in the text and changes hasBadWords value
  function checkText() {
    const matches = textareaRef.current.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Removes accentuation
      .replace(/[^\w!@#$%&*\n ]/g, "") // Removes especial characters diferent from !@#$%&* and new lines
      .match(badWordsRegex);

    setFoundBadWords(matches ? [...new Set(matches)] : []);
  }

  /**
   * This function adds a bad word to the bad word's list "badWords"
   * @param {string} badWord
   */
  function addBadWord(badWord) {
    console.log(badWord);
    badWords.push(badWord);

    // Updates badWords regex
    badWordsRegexString =
      "\\b(" +
      badWords.map(createRegexString).join("[sz]*|") +
      ")(\\W|\\n|\\s|$)";
    //console.log(badWordsRegexString);

    badWordsRegex = new RegExp(badWordsRegexString, "ig");
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
        className="flex min-h-screen flex-col items-center justify-between 
          bg-neutral-900 space-y-4 text-neutral-50
          px-4 py-6
          md:px-8 md:py-10
        "
      >
        <h1 className="font-bold text-3xl text-center">
          Detector de palavrões
        </h1>
        <h2 className="text-xl px-4 md-px-12 text-center font-semibold">
          Escreva o seu texto e verifique se ele contém algum palavrão
        </h2>

        {/*Add bad word input and button*/}
        <div className="relative flex items-center justify-center w-full md:w-5/6">
          <input
            className="bg-neutral-800 focus:outline-none border-4 w-full
              border-neutral-700 rounded-full p-2 pr-10 pl-4 
              placeholder:font-bold placeholder:text-sm
            "
            placeholder="Adicione um palavrão"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key == "Enter" && !e.shiftKey) {
                //e.preventDefault();
                addBadWord(e.target.value);
                e.target.value = ""
              }
            }}
          />
          <button
            className="transition-all hover:scale-110 absolute z-10 
            inset-y-0 right-2 text-center text-cyan-800 hover:text-cyan-700
            text-3xl"
            onClick={() => {
              addBadWord(inputRef.current.value);
              inputRef.current.value = "";
            }}
          >
            <AddIcon />
          </button>
        </div>

        <div
          className="flex  items-center justify-center w-full 
              h-full 
              flex-col space-y-2
              md:flex-row md:space-x-2 md:space-y-0
            "
        >
          {/*Custom Textarea*/}
          <div
            className={`
            group relative flex flex-col w-full h-72 bg-neutral-800 
            overflow-hidden border-4 border-neutral-700 rounded-md p-2`}
          >
            <textarea
              className="resize-none w-full h-full bg-inherit 
                outline-none border-transparent focus:border-transparent 
                focus:ring-0 placeholder:font-bold"
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
            className="group flex items-center justify-center bg-cyan-900 border-4 
              border-cyan-800 rounded-md p-4 font-bold whitespace-pre
              transition-all hover:scale-[102%] hover:bg-cyan-800 
              hover:border-cyan-700
              w-full h-20 text-xl
              md:w-24 md:h-72 md:flex-col
            "
            onClick={checkText}
          >
            Analisar{" "}
            <SendIcon
              className="translate-y-[3px] group-hover:translate-x-2 
                transition-all md:group-hover:translate-x-0 
                md:group-hover:translate-y-2"
            />
          </button>
        </div>

        {/*Result box*/}
        <div
          className="flex flex-col h-full w-full items-center justify-center 
           space-y-2"
        >
          <h2 className="font-bold text-2xl">Resultado</h2>

          <div
            className={`flex items-center justify-center w-full h-52 bg-neutral-800 
              border-4 border-neutral-700 rounded-md p-2 font-bold overflow-x-scroll
              break-words text-md md:text-xl md:w-5/6
              ${foundBadWords.length != 0 ? "text-red-500" : "text-green-500"}`}
          >
            {foundBadWords.length != 0 ? (
              <div
                className="flex flex-col items-center justify-center
                h-full"
              >
                <p>Existem palavras impróprias no texto!</p>
                <ul
                  className="list-none h-full w-max overflow-y-scroll p-2 rounded-md 
                  break-all bg-transparent text-center"
                >
                  {foundBadWords.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
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
