import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();

  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const [listening , setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      navigate('/signin');
      setUserData(null);
    } catch (error) {
      console.log(error);
    }
  }

  const startRecognition = () => {
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      if(!error.message.includes("start")){
        console.log("Recognition error" , error);
      }      
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      recognitionRef.current?.start();
      startRecognition();
    }
    synth.speak(utterance);
  }

  const handleCommand = (data) => {
    const {type, userInput, response} = data
    speak(response);

    if(type === "google-search"){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if(type === "youtube-search"){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if(type === "youtube-play"){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/watch?v=-YlmnPh-6rE&list=RD-YlmnPh-6rE&start_radio=1`, '_blank');
    }
    if(type === "calculator-open"){
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if(type === "instagram-open"){
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if(type === "facebook-open"){
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if(type === "weather-show"){
      window.open(`https://www.weather.com/`, '_blank');
    }
    if(type === "get-time" || type === "get-date" || type === "get-day" || type === "get-month" || type === "general"){
      // do nothing extra
    }
  }

  useEffect(
    () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      const recognition = new SpeechRecognition()
      recognition.continuous = true,
      recognition.lang = 'en-US'

      recognitionRef.current = recognition;

      const isRecognizingRef = {current: false};

      const safeRecognition = () => {
        if(!isSpeakingRef.current && !isRecognizingRef.current){
          try {
            recognition.start();
            console.log("Recognisation started :)")
          } catch (error) {
            if(error.name != "InvalidStateError"){
              console.log("Recognition error: ", error);
          }
        }
      }
    }

      recognition.onstart = () => {
        console.log("Recognizing Started")
        isRecognizingRef.current = true;
        setListening(true);
      }

      recognition.onend = () => {
        console.log("Recognizing Ended")
        isRecognizingRef.current = false;
        setListening(false);
      }

      if(!isSpeakingRef.current){
        setTimeout(
          () => {
            safeRecognition();
          }, 1000 // delay before starting recognition
        )
      };

      recognition.onerror = (e) => {
        console.warn("Recognition Error: ", e.error);
        isRecognizingRef.current = false;
        setListening(false);
        if(e.error !== "aborted" && !isSpeakingRef.current){
          setTimeout(
            () => {
              safeRecognition();
            },1000 // delay before restarting recognition
          )
        }
      }

      recognition.onresult = async (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();
        console.log("Heard : " + transcript);

        if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
          recognition.stop();
          isRecognizingRef.current = false;
          setListening(false);
          const data = await getGeminiResponse(transcript);
          handleCommand(data);
        }
      }
      // recognition.start();
      const fallback = setInterval(
        () => {
          if(!isSpeakingRef.current && !isRecognizingRef.current){
            safeRecognition();
          }
        },  10000
      )

      safeRecognition();

      return () => {
        recognition.stop();
        setListening(false);
        isRecognizingRef.current = false;
        clearInterval(fallback);
      }

    }, []
  )

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center px-4 py-8 relative'>
      {/* buttons */}
      <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer absolute top-[5px] right-[20px] ' onClick={handleLogout}>LogOut</button>
      <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer absolute top-[5px] left-[20px]' onClick={() => navigate("/customize")}>Customize Assistant</button>

      <div className='h-[300px] w-[220px] flex justify-center items-center overflow-hidden'>
        <img src={userData?.assistantImage} className='h-full w-full object-cover rounded-4xl' />
      </div>
      <div className='mt-5 text-white text-3xl sm:text-xl lg:text-3xl font-bold'>
        Welcome, I am {userData?.assistantName} !
      </div>
    </div>

  )
}

export default Home;