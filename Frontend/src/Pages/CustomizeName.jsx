import React, { useContext, useState } from 'react'
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBackOutline } from "react-icons/io5";

function CustomizeName() {

    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(UserDataContext);
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async() => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
setLoading(false);
            console.log(result.data);
            setUserData(result.data);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center'>
            {/* back arrow */}
            <IoArrowBackOutline className='absolute top-5 left-7 size-7 hover:text-white' onClick={() => navigate('/customize')}/>
            {/* heading */}
            <h1 className='text-white ms:text-xl lg:text-3xl mb-8 mt-3'>Enter your <span className='text-yellow-300 text-4xl'>Assistant Name</span></h1>
            <div>
                <input type="text" name='name' placeholder='Enter your assistant name' className='border border-white pl-4 py-2 rounded-4xl text-white w-120 bg-transparent' onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />
            </div>
            {
                assistantName && <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer' disabled={loading} onClick={() => {
                    handleUpdateAssistant();
                }}>
                    {!loading ? "Create your Assistant" : "Loading..."}
                </button>
            }
        </div >
    )
}

export default CustomizeName;