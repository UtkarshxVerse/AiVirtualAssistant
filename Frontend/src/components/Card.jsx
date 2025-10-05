import React, { useContext } from 'react'
import { UserDataContext } from '../Context/UserContext';

function Card({image}) {

  const {selectedImage , setSelectedImage} = useContext(UserDataContext);

  return (
    <div className={`w-[80px] h-[170px] lg:w-[150px] lg:h-[230px] bg-[#3a1c28] rounded-2xl hover:scale-105 duration-300 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-red-500/50 ${selectedImage == image ? "border-3 border-white shadow-xl shadow-red-500/50" : ""}`} onClick={() => setSelectedImage(image) }>
        <img src={image} className='h-full object-cover'/>
    </div>
  )
}

export default Card;