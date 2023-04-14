import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { IoSend as SendIcon } from "react-icons/io5";
import { BsFillPlusCircleFill as AddIcon } from "react-icons/bs";
import { FiDelete as DeleteIcon } from "react-icons/fi";
import {
  AiFillEye as VisibleIcon,
  AiFillEyeInvisible as InvisibleIcon,
} from "react-icons/ai";
import { badWordsList, endingsList } from "../badWords";
import { createRegexString, checkText } from "../utils";

export default function Home() {
  const textareaRef = useRef(null);
  const inputRef = useRef(null);

  const [isBadWordsVisible, setIsBadWordsVisible] = useState(false);

  const [foundBadWords, setFoundBadWords] = useState([]);
  const [badWords, setBadWords] = useState(badWordsList);
  const [endings, setEndings] = useState(endingsList);
  const [badWordsRegex, setBadWordsRegex] = useState(
    new RegExp(createRegexString(badWords, endings), "ig")
  );

  useEffect(() => {
    setBadWordsRegex(new RegExp(createRegexString(badWords, endings), "ig"));
  }, [badWords]);

  /**
   * This function adds a bad word to the bad word's list "badWords"
   * @param {string} badWord
   */
  function addBadWord(badWord) {
    //console.log(badWord);
    setBadWords((badWords) => [...badWords, badWord]);
  }

  /**
   * This function adds a bad word to the bad word's list "badWords"
   * @param {string} badWord
   */
  function removeBadWord(word) {
    setBadWords(badWords.filter((badWord) => badWord !== word));
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
                  const matches = checkText(badWordsRegex, e.target.value);
                  setFoundBadWords(matches ? [...new Set(matches)] : []);
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
            onClick={() => {
              const matches = checkText(
                badWordsRegex,
                textareaRef.current.value
              );
              setFoundBadWords(matches ? [...new Set(matches)] : []);
            }}
          >
            Analisar{" "}
            <SendIcon
              className="translate-y-[3px] group-hover:translate-x-2 
                transition-all md:group-hover:translate-x-0 
                md:group-hover:translate-y-2"
            />
          </button>
        </div>

        {/*Down part*/}
        <div
          className="flex flex-col w-full items-center justify-between
           space-y-2
           md:flex-row md:space-y-0 md:space-x-4
          "
        >
          {/*Result box*/}
          <div
            className={`flex items-center justify-center w-full h-52 bg-neutral-800 
              border-4 border-neutral-700 rounded-md p-2 font-bold overflow-x-scroll
              break-words text-md md:text-xl
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

          {/*Left box*/}
          <div
            className="flex flex-col items-center justify-center h-52
              w-full bg-neutral-800 border-4 border-neutral-700 rounded-md
              overflow-hidden p-2
            "
          >
            {/*Add bad word input and button*/}
            <div className="relative w-full pr-10 pl-4">
              <input
                className="focus:outline-none w-full placeholder:font-bold 
              placeholder:text-sm bg-transparent
            "
                placeholder="Adicione um palavrão"
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && !e.shiftKey) {
                    //e.preventDefault();
                    addBadWord(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="transition-all hover:scale-110 absolute z-10 
              inset-y-0 right-2 text-center text-cyan-700 hover:text-cyan-600
              text-3xl
            "
                onClick={() => {
                  addBadWord(inputRef.current.value);
                  inputRef.current.value = "";
                }}
              >
                <AddIcon />
              </button>
            </div>
            {/*Make visible buttom*/}
            <div className="flex items-center justify-center w-full h-full p-2">
              <p className="font-semibold">Lista de palavrões</p>
              <button
                className="ml-2 transition-all hover:scale-110 text-center 
                text-cyan-700 hover:text-cyan-600 text-3xl
            "
                onClick={() => setIsBadWordsVisible(!isBadWordsVisible)}
              >
                {isBadWordsVisible ? <VisibleIcon /> : <InvisibleIcon />}
              </button>
            </div>

            {/*List of all bad words*/}
            <div className="flex flex-col overflow-x-scroll w-full px-4 py-4 font-semibold">
              {badWords.map((word, index) => (
                <ul className="inline-flex justify-between" key={index + "d"}>
                  <li key={index}>
                    {isBadWordsVisible ? word : "*".repeat(word.length)}
                  </li>
                  <button key={index + "b"} onClick={() => removeBadWord(word)}>
                    <DeleteIcon className="text-red-700" key={index + "i"} />
                  </button>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
