import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import pro1 from '../assets/pro1.jpg'
import pro2 from '../assets/pro2.jpg'
import pro3 from '../assets/pro3.jpg'
import pro4 from '../assets/pro4.jpg'
import pro5 from '../assets/pro5.jpg'
import pro6 from '../assets/pro6.png'
import pro7 from '../assets/pro7.png'
import pro8 from '../assets/pro8.jpg'

import { LuImagePlus } from "react-icons/lu";
import { UserDataContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackOutline } from "react-icons/io5";

function Customize() {
  const { frontendImage, setFrontendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center px-4 py-8'>
      {/* back */}
      <IoArrowBackOutline className='absolute top-5 left-7 size-7 hover:text-white' onClick={() => navigate('/')} />
      {/* heading */}
      <h1 className='text-white text-center text-2xl sm:text-3xl lg:text-4xl mb-8 mt-3 font-semibold'>
        Select your <span className='text-yellow-300 text-3xl sm:text-4xl lg:text-5xl font-bold'>Assistant Image</span>
      </h1>

      {/* cards */}
      <div className='w-full max-w-6xl flex gap-4 sm:gap-5 justify-center items-center flex-wrap'>
        <Card image={pro1} />
        <Card image={pro2} />
        <Card image={pro3} />
        <Card image={pro4} />
        <Card image={pro5} />
        <Card image={pro6} />
        <Card image={pro7} />
        <Card image={pro8} />

        <div
          className={`w-[40%] xs:w-[30%] sm:w-[22%] md:w-[150px] h-[170px] sm:h-[200px] lg:h-[230px] bg-[#3a1c28] rounded-2xl hover:scale-105 duration-300 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-red-500/50 flex flex-col items-center justify-center ${selectedImage == "input" ? "border-4 border-white shadow-xl shadow-red-500/50" : ""}`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && <LuImagePlus className=' text-white text-3xl sm:text-4xl md:text-5xl' />}
          {frontendImage && <img src={frontendImage} className='h-full w-full object-cover' />}
        </div>

        <input type="file" accept='image/*' ref={inputImage} onChange={handleImage} hidden />
      </div>

      {/* next button */}
      {
        selectedImage && <button className='bg-white text-black my-8 px-6 sm:px-8 py-2 rounded-full text-base sm:text-lg font-bold hover:scale-105 duration-300 cursor-pointer' onClick={() => navigate('/customizename')}>
          Next
        </button>
      }
    </div>
  )
}

export default Customize;
