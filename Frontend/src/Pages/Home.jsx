import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiVoice from '../Assets/aiVoice.gif';
import userVoice from '../Assets/userVoice.gif';
import { TbMenuDeep } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menu, setMenu] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Start recognition safely
  const startRecognition = () => {
    if (!recognitionRef.current) return;
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
        console.log("Recognition started/restarted");
      } catch (error) {
        if (error.name !== "InvalidStateError") console.log("Recognition start error:", error);
      }
    }
  };

  // ✅ Speak text safely
  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';

    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      setTimeout(() => startRecognition(), 800);
    };

    synth.cancel(); // stop any previous speech
    synth.speak(utterance);
  };

  // ✅ Handle Commands
  const handleCommand = (data) => {
    if (!data) return;
    const { type, userInput, response } = data;

    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === "youtube-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if (type === "youtube-play") {
      window.open(`https://www.youtube.com/watch?v=-YlmnPh-6rE&list=RD-YlmnPh-6rE&start_radio=1`, '_blank');
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
  };

  // ✅ Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const tryStart = () => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition started");
        } catch (error) {
          if (error.name !== "InvalidStateError") console.log("Start error:", error);
        }
      }
    };

    const startTimeout = setTimeout(tryStart, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(tryStart, 800);
      }
    };

    recognition.onerror = (e) => {
      console.warn("Recognition error:", e.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (e.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(tryStart, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        setUserText(transcript);
        const data = await getGeminiResponse(transcript);

        setAiText(data?.response || "");
        handleCommand(data);
        setUserText("");
      }
    };

    // Initial Greeting
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name || "user"}, how can I assist you today?`);
    greeting.lang = 'hi-IN';
    synth.cancel();
    synth.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#373778] flex flex-col items-center justify-center px-4 py-8 relative'>
      {/* For mob view */}
      <TbMenuDeep className='text-3xl block lg:hidden absolute top-6 right-5' onClick={() => setMenu(true)} />

      <div className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg flex flex-col items-center ${menu ? "translate-x-0" : 'translate-x-full'} lg:hidden duration-300 ease-in-out p-6 gap-3`}>
        <RxCross1 className='text-3xl block lg:hidden absolute top-6 right-5' onClick={() => setMenu(false)} />

        <button className='bg-white block lg:hidden text-black w-[80%] mt-20 my-2 px-5 py-2 rounded-xl font-bold hover:scale-105 duration-300 cursor-pointer' onClick={handleLogout}>LogOut</button>

        <button className='bg-white block lg:hidden text-black w-[80%] my-0 px-5 py-2 rounded-xl font-bold hover:scale-105 duration-300 cursor-pointer' onClick={() => navigate("/customize")}>Customize Assistant</button>

        <h1 className='text-white font-bold text-4xl my-8'>History</h1>

        <div className='font-lg w-full h-[400px] flex flex-col text-white overflow-auto p-4 '>
          {userData?.history?.length > 0 ? (
            userData.history.map((his, index) => (
              <span key={index} className='truncate-y text-[15px] flex flex-row items-center gap-2'>
                <GoDotFill className='text-white' /> {his}
              </span>
            ))
          ) : (
            <span className="text-gray-300 italic">No history yet</span>
          )}
        </div>
      </div>

      {/* buttons for large view*/}
      <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer absolute top-[5px] right-[20px] hidden lg:block' onClick={handleLogout}>LogOut</button>

      <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer absolute top-[5px] left-[20px] hidden lg:block' onClick={() => navigate("/customize")}>Customize Assistant</button>

      <div className='mt-5 text-white text-3xl sm:text-lg lg:text-2xl font-bold mb-5'>
        Welcome, I am <span className='text-yellow-300'>{userData?.assistantName}</span> !
      </div>

      <div className='h-[300px] w-[220px] flex justify-center items-center overflow-hidden'>
        <img src={userData?.assistantImage} className='h-full w-full object-cover rounded-4xl' alt="assistant" />
      </div>

      {!aiText && <img src={userVoice} className='w-[200px] mt-3' alt="user speaking" />}
      {aiText && <img src={aiVoice} className='w-[200px] mt-2' alt="ai speaking" />}

      <h2 className='text-white font-mono'>
        {userText ? userText : aiText ? aiText : ""}
      </h2>
    </div>
  );
}

export default Home;
