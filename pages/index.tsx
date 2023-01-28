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
  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [isWholeContainerVisible, setIsWholeContainerVisible] = useState(false);

  console.log("Streamed response: ", generatedLyric); //Will be removed 
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
    // const verses: string[] = [];
    // const choruses: string[] = [];
    // const matchVerse = generatedLyric.match(/Verse (.*)/g);
    // if (matchVerse) {
    //     verses = matchVerse
    // }

    // const matchChorus = generatedLyric.match(/Chorus (.*)/g);
    // if (matchChorus) {
    // choruses = matchChorus
    // }
  // -------------------------------------------------------------
  // -------------------------------------------------------------

    // if(generatedLyric.includes("Verse")) {
    //   const verseRegex = /Verse\s\d+[^\n]+/g;
    //   verses = generatedLyric.match(verseRegex);
    // }

    // if(generatedLyric.includes("Chorus")) {
    //   const chorusRegex = /Chorus[^\n]+/g;
    //   choruses = generatedLyric.match(chorusRegex);
    // }
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const toggleWholeContainer = () => {
    setIsWholeContainerVisible(!isWholeContainerVisible)
  }

  const toggleButtonContainer = () => {
    setIsBtnVisible(!isBtnVisible)
  }


  return (
    <div>
      <Head>
        <title>AI Lyric Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
      <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
                  <div className="">
                      {loading ? <p>Loading...</p> : <p className="generated-para">{generatedLyric}</p>}
                  </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
 
        <section>
          <div className="container-down">
            <div className="flex justify-center " onClick={toggleWholeContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
            </div>
            
            {!isWholeContainerVisible && <div className="toggle">
              <div className="options-container theme">
                <div className="title">
                  <span>Theme</span>
                </div>
                <div className="container-btn hide">
                  <button className="m-2" >R&B</button>
                  <button className="m-2" >Jazz</button>
                  <button className="m-2" >Reggae</button>
                </div>
              </div>
              <div className="options-container theme">
                <div className="title">
                  <span
                  onClick={toggleButtonContainer}
                  >Style</span>
                </div>
                {!isBtnVisible && <div className="container-btn-style">
                  <button className="m-2" onClick={() => setSelectedGenre("R&B")}>R&B</button>
                  <button className="m-2" onClick={() => setSelectedGenre("Jazz")}>Jazz</button>
                  <button className="m-2" onClick={() => setSelectedGenre("Reggae")}>Reggae</button>
                </div>}
              </div>
              <div className="options-container theme">
                <div className="title">
                  <span>Tone</span>
                </div>
                <div className="container-btn hide">
                  <button className="m-2" >R&B</button>
                  <button className="m-2" >Jazz</button>
                  <button className="m-2" >Reggae</button>
                </div>
              </div>
            </div>}

            <div className="all-bottom">
              <div className="generate-btn">
                <button
                  className=""
                  onClick={(e) => generateLyric(e)}
                >
                  Generate lyric &rarr;
                </button>
              </div>
              <div className="navigation-container">
                <nav>
                  <ul>
                    <li>
                      <a href="#">Contact</a>
                    </li>
                    <li>
                      <a href="#">About</a>
                    </li>
                    <li>
                      <a href="#">LyricAI</a>
                    </li>
                    <li>
                      <a href="#">Feedback</a>
                    </li>
                    <li>
                      <a href="#">More</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
