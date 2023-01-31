import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
// import { Toaster, toast } from "react-hot-toast";
// import ResizablePanel from "../components/ResizablePanel";
import Balancer from 'react-wrap-balancer'


const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [generatedLyric, setGeneratedLyric] = useState("");
  const [isThemeDropdownVisible, setIsThemeDropdownVisible] = useState(false);
  const [isStyleDropdownVisible, setIsStyleDropdownVisible] = useState(false);
  const [isToneDropdownVisible, setIsToneDropdownVisible] = useState(false);
  const [isWholeContainerVisible, setIsWholeContainerVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');


  // Dropdown functionality
  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
      setIsThemeDropdownVisible(true)
      setIsStyleDropdownVisible(true)
      setIsToneDropdownVisible(true)
    }
  };


  console.log("Streamed response: ", generatedLyric); //Will be removed 

  const handleClick = (value: string, group: 'theme' | 'genre' | 'tone') => {
    const existing = selected.find((item) => item.startsWith(group));
    if (existing) {
      setSelected((prev) =>
        prev.map((item) =>
          item === existing ? `${group}:${value}` : item
        )
      );
    } else {
      setSelected((prev) => [...prev, `${group}:${value}`]);
    }
    setPrompt(`Generate a song lyric with the following preferences - ${selected.toString()}`);
    // prompt = `Generate a song lyric with the following preferences - ${selected.toString()}`

    console.log(prompt);
  };

  const generateLyric = async (e: any) => {
    e.preventDefault();
    setGeneratedLyric("");
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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = response.body.getReader();
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
  
  // TODO: ----------------------HANDLE generatedLyric --------------------


  return (
    <div className="bg-secondary-black max-w-5xl mx-auto">
      <Head>
        <title>AI Lyric Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="md:flex justify-between md:px-5 md:pt-7 md:gap-4 ">
        {/* <ResizablePanel> */}
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10">
                  <div className="text-white"> 
                      {loading ? <p className="text-lg m-3">Generating...
                      </p> : <p className="">
                      <Balancer>{generatedLyric}</Balancer>
                      </p>}
                  </div>
            </motion.div>
          </AnimatePresence>
        {/* </ResizablePanel> */}
 
        <section className="md:flex md:static absolute bottom-0 w-full md:w-auto">
          <div className="selectors-wrapper md:w-96 bg-primary-black h-max px-5 pb-2 rounded-t-xl md:rounded-b-xl">
            <div 
            className={`flex justify-center md:hidden transition duration-300 ease-in-out transform ${!isWholeContainerVisible ? 'rotate-180' : ''}`}
            onClick={() => {
              setIsWholeContainerVisible(!isWholeContainerVisible)
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60"fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
            </div>
            
            {!isWholeContainerVisible && <div className="toggle">
              <div className="p-1 my-2">
                <div 
                onClick={() => {
                  toggleDropdown('theme')
                  setIsThemeDropdownVisible(!isThemeDropdownVisible)
              }} 
                className={`text-white cursor-pointer flex justify-between items-center ${activeDropdown === 'theme' ? 'active' : '' }`}>
                
                  <span>Theme</span>
                  <div
                  className={`transition duration-300 ease-in-out transform ${isThemeDropdownVisible ? 'rotate-180' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60"fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'theme' ? '' : 'hide'
                }`}
                >
                  <button 
                  onClick={() => {
                    handleClick('Love', 'theme')
                    // handleSelectedOption('Love')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("theme:Love") ? "border-outstanding-red rounded-md" : ""}`}
                  >Love</button>
                  <button 
                  onClick={() => {
                    handleClick('Heartbreak', 'theme')
                    // handleSelectedOption('Heartbreak')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("theme:Heartbreak") ? "border-outstanding-red rounded-md" : ""}`}
                  >Heartbreak</button>
                  <button 
                  onClick={() => {
                    handleClick('Motivation', 'theme')
                    // handleSelectedOption('Motivation')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("theme:Motivation") ? "border-outstanding-red rounded-md" : ""}`}
                  >Motivation</button>
                </div>
              </div>
              <hr />
              {/* --------------------STYLE------------------------ */}
              <div className="p-1 my-2">
                <div 
                  onClick={() => {
                    toggleDropdown('style')
                    setIsStyleDropdownVisible(!isStyleDropdownVisible)
                }}
                  className={`cursor-pointer text-white flex justify-between items-center ${
                  activeDropdown === 'style' ? 'active' : ''
                  }`}
                >
                  <span>Style</span>
                  <div 
                  className={`transition duration-300 ease-in-out transform ${isStyleDropdownVisible ? 'rotate-180' : ''}`}> 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60" fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'style' ? '' : 'hide'
                }`}
                >
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("genre:R&B") ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => {
                    handleClick('R&B', 'genre')
                    // setSelectedGenre("R&B")
                    // handleSelectedOption('R&B')
                  }}>R&B
                  </button>
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("genre:Jazz") ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => {
                    handleClick('Jazz', 'genre')
                    // setSelectedGenre("Jazz")
                    // handleSelectedOption('Jazz')
                  }}>Jazz</button>
                  <button 
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes("genre:Reggae") ? "border-outstanding-red rounded-md" : ""}`} 
                  onClick={() => {
                    handleClick('Reggae', 'genre')
                    // setSelectedGenre("Reggae")
                    // handleSelectedOption('Reggae')
                  }}>Raggae</button>
                </div>
              </div>
              <hr />
              <div className="p-1 my-2">
                <div 
                  onClick={() => {
                    toggleDropdown('tone')
                    setIsToneDropdownVisible(!isToneDropdownVisible)
                }}
                  className={`cursor-pointer text-white flex justify-between items-center ${
                  activeDropdown === 'tone' ? 'active' : ''
                  }`}
                >
                  <span>Tone</span>
                  <div 
                  className={`transition duration-300 ease-in-out transform ${isToneDropdownVisible ? 'rotate-180' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 60" fill="grey" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                  </div>
                </div>
                <div 
                className={`container-btn ${
                  activeDropdown === 'tone' ? '' : 'hide'
                }`}
                >
                  <button 
                  onClick={() => {
                    handleClick('Nostalgic', 'tone')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes('tone:Nostalgic') ? "border-outstanding-red rounded-md" : ""}`}
                  >Nostalgic</button>
                  <button 
                  onClick={() => {
                    handleClick('Romantic', 'tone')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes('tone:Romantic') ? "border-outstanding-red rounded-md" : ""}`}
                  >Romantic</button>
                  <button 
                  onClick={() => {
                    handleClick('Suspenseful', 'tone')
                  }}
                  className={`m-2 text-white border rounded-md border-slate-700  px-4 py-1 ${selected.includes('tone:Suspenseful') ? "border-outstanding-red rounded-md" : ""}`}
                  >Suspenseful</button>
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
                    generateLyric(e)
                  }}
                >
                  Generate lyric &rarr;
                </button>
              </div>
              <div className="navigation-container md:hidden text-white">
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
