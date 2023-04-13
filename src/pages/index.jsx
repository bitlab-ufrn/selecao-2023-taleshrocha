import Head from "next/head";
import { useRef, useState } from "react";
import { BsFillSendFill as SendIcon } from "react-icons/bs";
import { badWords, ending } from "../badWords"

export default function Home() {
  const textareaRef = useRef(null);
  const [hasBadWords, setHasBadWords] = useState(false);

  function convertWordToRegexString(word) {
    const l33t = { a: "4@", b: "8", e: "3", i: "1|!", l: "1", o: "0u", t: "7", u: "0o" };

    let end = ""
    ending.forEach(e => {
      end = "|" + e + end
    })

    word = word.slice(0, -1) + `(${word.slice(-1)}${end})`

    return word.replace(/[a-z]/g, (c) => {
      let l = l33t[c];
      if (l == undefined) return `${c}+`;
      else return `[${c}${l}]+`;
    });
  }

  const badWordsRegexString =
    "\\b(" + badWords.map(convertWordToRegexString).join("|") + ")\\b";

  const badWordsRegex = new RegExp(badWordsRegexString, "ig");
  console.log(badWordsRegex);

  function analizeText() {
    console.log(
      textareaRef.current.value.slice(
      textareaRef.current.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .search(badWordsRegex), -1)
    );
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
            group relative flex flex-col w-full h-32 bg-neutral-800 
            overflow-hidden border-4 border-neutral-700 rounded-md p-2`}
          >
            <textarea
              className="resize-none w-full h-full bg-inherit 
                outline-none border-transparent focus:border-transparent 
                focus:ring-0 text-neutral-50 placeholder:font-bold"
              placeholder="Escreva seu texto aqui"
              ref={textareaRef}
            />
          </div>

          <button
            className="flex items-center justify-center bg-cyan-900 border-4 border-cyan-800 rounded-md
              h-32 text-neutral-50 p-4"
            onClick={analizeText}
          >
            Analisar <SendIcon />
          </button>
        </div>

        <div
          className="flex flex-col h-full w-full items-center justify-center 
          text-neutral-50 space-y-2"
        >
          <h2 className="font-bold text-2xl">Resultado</h2>
          <div
            className="flex items-center justify-center w-full h-32 bg-neutral-800 
             border-4 border-neutral-700 rounded-md p-2"
          >
            <span>
              {badWords ? "Não existem" : "Existem"} palavras impróprias no
              texto
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
