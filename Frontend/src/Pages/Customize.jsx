import React, { use, useContext, useRef, useState } from 'react'
import Card from '../components/card'
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

function Customize() {
  const { frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);
  const inputImage = useRef();

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);  // ye file backend ko bhejne ke liye h
    setFrontendImage(URL.createObjectURL(file));  // ye image url generate krke dega
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center'>
      {/* heading */}
      <h1 className='text-white ms:text-xl lg:text-3xl mb-8 mt-3'>Select your <span className='text-yellow-300 text-4xl'>Assistant Image</span></h1>

      {/* cards */}
      <div className='w-[90%] max-w-[60%] flex gap-[20px] justify-center items-center flex-wrap'>
        <Card image={pro1} />
        <Card image={pro2} />
        <Card image={pro3} />
        <Card image={pro4} />
        <Card image={pro5} />
        <Card image={pro6} />
        <Card image={pro7} />
        <Card image={pro8} />
        <div className={`w-[80px] h-[170px] lg:w-[150px] lg:h-[230px] bg-[#3a1c28] rounded-2xl hover:scale-105 duration-300 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-red-500/50 flex flex-col items-center justify-center ${selectedImage == "input" ? "border-3 border-white shadow-xl shadow-red-500/50" : ""}`} onClick={() => {
          inputImage.current.click()
          setSelectedImage("input")
        }}>

          {!frontendImage && <LuImagePlus className=' text-white sm:text-lg md:text-3xl' />}

          {frontendImage && <img src={frontendImage} className='h-full object-cover' />}
        </div>
        <input type="file" accept='image/*' ref={inputImage} onChange={handleImage} hidden />  
      </div>

      {/* next buttton */}
      {
        selectedImage && <button className='bg-white text-black my-8 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer' onClick={() => navigate('/customizename')}>
          Next
        </button>
      }
    </div>
  )
}

export default Customize;