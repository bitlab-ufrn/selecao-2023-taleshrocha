import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function convertWordToRegexString(word) {
    // Start by escaping any special characters that might be in the string:
    word = escapeRegExp(word);
    const l33t = { a: "4@", e: "3", i: "1|!", o: "0" };

    return word.replace(/[aeio]/g, (c) => `[${c}${l33t[c]}]+`);
  }

  const badWords = ["cat", "dog"];

  const badWordsRegexString =
    "\\b(" + badWords.map(convertWordToRegexString).join("|") + ")\\b";

  console.log(badWordsRegexString);

  const badWordsRegex = new RegExp(badWordsRegexString, "ig");

  function submitComment() {
    if (
      badWordsRegex.test(
        commentContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )
    )
      return true;

    setCommentContent("");
    return false;
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
        className="flex min-h-screen flex-col items-center justify-center p-24
          bg-neutral-900 space-y-4"
      >
        <div
          className={`
            group relative flex flex-col w-full h-full bg-gray-900 
            overflow-hidden
            text-white border-4 border-gray-800 rounded-lg p-2
            ${
              badWordsRegex.test(commentContent) &&
              isTextAreaFocused &&
              "border-red-600"
            }
        `}
        >
          <span
            className={`
              absolute right-48 -top-4 invisible
              ${
                badWordsRegex.test(commentContent) &&
                isTextAreaFocused &&
                "!visible"
              }
          `}
          >
            <span
              className={`
                fixed text-red-500 bg-gray-900 px-2
            `}
            >
              Conteúdo impróprio
            </span>
          </span>
          <textarea
            className="resize-none w-full h-full text-white bg-inherit 
              outline-none border-transparent focus:border-transparent 
              focus:ring-0"
            placeholder="Adicione o seu comentário aqui"
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
            onFocus={() => setIsTextAreaFocused(true)}
            onBlur={() => setIsTextAreaFocused(false)}
          />
        </div>

        <button 
          className="bg-neutral-800 border-2 border-neutral-500 rounded-full"
          onClick={submitComment}
        >
          Enviar
        </button>
      </main>
    </>
  );
}
