import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
// import { Toaster, toast } from "react-hot-toast";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [generatedLyric, setGeneratedLyric] = useState("");
  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [isWholeContainerVisible, setIsWholeContainerVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);


  // Dropdown functionality
  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };


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
  
  // TODO: ----------------------HANDLE generatedLyric --------------------
 
  const toggleWholeContainer = () => {
    setIsWholeContainerVisible(!isWholeContainerVisible)
  }


  return (
    <div className="bg-secondary-black max-w-5xl mx-auto">
      <Head>
        <title>AI Lyric Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="md:flex h-screen justify-between md:px-5 md:pt-7 md:gap-4 ">
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
                  <div className="">
                    <p className="text-white max-w-max generated-para">
                    By default, breakpoints are min-width to encourage a mobile-first workflow. If you need more control over your media queries, you can also define them using an object syntax that lets you specify explicit min-width and max-width values.
                    By default, breakpoints are min-width to encourage a mobile-first workflow. If you need more control over your media queries, you can also define them using an object syntax that lets you specify explicit min-width and max-width values.
                    </p>
                      {loading ? <p>Loading...</p> : <p className="generated-para">{generatedLyric}</p>}
                  </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
 
        <section className="md:flex">
          <div className="container-down w-96 bg-primary-black h-max p-5">
            <div className="flex justify-center md:hidden" onClick={toggleWholeContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
            </div>
            
            {!isWholeContainerVisible && <div className="toggle">
              <div className="p-1 my-2">
                <div 
                onClick={() => toggleDropdown('theme')} 
                className={`text-white cursor-pointer flex justify-between items-center ${activeDropdown === 'theme' ? 'active' : '' }`}>
                
                  <span>Theme</span>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60"fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'theme' ? '' : 'hide'
                }`}
                >
                  <button className="m-2" >R&B</button>
                  <button className="m-2" >Jazz</button>
                  <button className="m-2" >Reggae</button>
                </div>
              </div>
              <hr />
              <div className="p-1 my-2">
                <div 
                  onClick={() => {
                    toggleDropdown('style')
                    setIsBtnVisible(!isBtnVisible)
                }}
                  className={`cursor-pointer text-white flex justify-between items-center ${
                  activeDropdown === 'style' ? 'active' : ''
                  }`}
                >
                  <span>Style</span>
                  <div 
                  className={`transition duration-300 ease-in-out transform ${isBtnVisible ? 'rotate-180' : ''}`}> 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60" fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'style' ? '' : 'hide'
                }`}
                >
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selectedGenre === "R&B" ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => setSelectedGenre("R&B")}>R&B</button>
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selectedGenre === "Jazz" ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => setSelectedGenre("Jazz")}>Jazz</button>
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selectedGenre === "Reggae" ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => setSelectedGenre("Reggae")}>Reggae</button>
                </div>
              </div>
              <hr />
              <div className="p-1 my-2">
                <div 
                  onClick={() => toggleDropdown('tone')}
                  className={`cursor-pointer text-white flex justify-between items-center ${
                  activeDropdown === 'tone' ? 'active' : ''
                  }`}
                >
                  <span>Tone</span>
                  <div >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60" fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'tone' ? '' : 'hide'
                }`}
                >
                  <button className="m-2" >R&B</button>
                  <button className="m-2" >Jazz</button>
                  <button className="m-2" >Reggae</button>
                </div>
              </div>
              <hr />
            </div>}

            <div className="all-bottom">
              <div className="generate-btn">
                <button
                  className={`m-2 text-white border rounded-md border-outstanding-red  px-4 py-1 ${!selectedGenre ? "border-outstanding-red m-4" : ""}`}
                  onClick={(e) => {
                    console.log('generating...');
                    // generateLyric(e)
                  }}
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
