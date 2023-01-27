import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
// import DropDown, { StyleType } from "../components/DropDown";
// import Footer from "../components/Footer";
// import Github from "../components/GitHub";
// import Header from "../components/Header";
// import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  // const [bio, setBio] = useState("");
  // const [style, setStyle] = useState<StyleType>("R&B");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [generatedLyric, setGeneratedLyric] = useState("");

  console.log("Streamed response: ", generatedLyric);
  /* Generate a song lyric with the style/genre ${vibe}  */
  function handleClick() {
    let prompt = ''
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
    setGeneratedLyric(generatedLyric)
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
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedLyric((prev) => prev + chunkValue);
    }
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Generator</title>
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

          {/* {!loading && ( */}
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateLyric(e)}
            >
              Generate lyric &rarr;
            </button>
          {/* )} */}
          {/* {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )} */}
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
              {/* {!generatedLyric && ( */}
                {/* <> */}
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated lyric
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      <p>{generatedLyric}</p>
                  </div>
                {/* </> */}
              {/* )} */}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
  // const prompt =
  //   style === "Reggae"
  //     ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${
  //         bio.slice(-1) === "." ? "" : "."
  //       }`
  //     : `Generate 2 ${style} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${
  //         bio.slice(-1) === "." ? "" : "."
  //       }`;




                 {/* {generatedLyric
                      .substring(generatedLyric.indexOf("1") + 3)
                      .split("2.")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Bio copied to clipboard", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                          </div>
                        );
                      })} */}