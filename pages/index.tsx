import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [generatedLyric, setGeneratedLyric] = useState("");

  console.log("Streamed response: ", generatedLyric);
  let prompt = ''
  function handleClick() {
    switch (selectedGenre) {
      case 'R&B':
        prompt = `Generate a song lyric with the style/genre, ${selectedGenre}.`
        break;
      case "Jazz":
        prompt = `Generate a song lyric with the style/genre, ${selectedGenre}.`
        break;
      case "Reggae":
        prompt = `Generate a song lyric with the style/genre, ${selectedGenre}.`
        break;
      default:
        break;
    }
  }

  const generateLyric = async (e: any) => {
    e.preventDefault();
    setGeneratedLyric("");
    handleClick()
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    // console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    // -----------
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedLyric((prev) => prev + chunkValue);
    }
    // ------------
    setLoading(false);
  };


  // ----------------------HANDLE generatedLyric --------------------
    let verses: string[] = [];
    let choruses: string[] = [];
    const matchVerse = generatedLyric.match(/Verse (.*)/g);
    if (matchVerse) {
        verses = matchVerse
    }

    const matchChorus = generatedLyric.match(/Chorus (.*)/g);
    if (matchChorus) {
    choruses = matchChorus
    }
  // -------------------------------------------------------------



  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AI Lyric Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
 
        <div className="max-w-xl">

          <p>----</p>
          <div>
            <button className="m-2" onClick={() => setSelectedGenre("R&B")}>R&B</button>
            <button className="m-2" onClick={() => setSelectedGenre("Jazz")}>Jazz</button>
            <button className="m-2" onClick={() => setSelectedGenre("Reggae")}>Reggae</button>
          </div>

            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateLyric(e)}
            >
              Generate lyric &rarr;
            </button>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated lyric
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      {/* {loading ? <p>Loading...</p> : <p>{generatedLyric}</p>} */}
                      {verses.map((verse, index) => (
                        <p key={index}>{verse}</p>
                      ))}
                      {choruses.map((chorus, index) => (
                        <cite key={index}>{chorus}</cite>
                      ))}
                  </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
    </div>
  );
};

export default Home;
