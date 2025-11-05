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

    const handleUpdateAssistant = async () => {
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
        <div className="w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center px-4 relative">
            {/* back arrow */}
            <IoArrowBackOutline
                className="absolute top-5 left-5 size-6 sm:size-7 hover:text-white cursor-pointer"
                onClick={() => navigate('/customize')}
            />

            {/* heading */}
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8 mt-6 text-center">
                Enter your <span className="text-yellow-300 text-3xl sm:text-4xl">Assistant Name</span>
            </h1>

            {/* input field */}
            <div className="w-full max-w-md">
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your assistant name"
                    className="border border-white pl-4 py-2 rounded-full text-white w-full bg-transparent placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    onChange={(e) => setAssistantName(e.target.value)}
                    value={assistantName}
                />
            </div>

            {/* button */}
            {assistantName && (
                <button
                    className="bg-white text-black my-7 px-6 py-2 rounded-full font-bold hover:scale-105 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    onClick={() => handleUpdateAssistant()}
                >
                    {!loading ? "Create your Assistant" : "Loading..."}
                </button>
            )}
        </div>

    )
}

export default CustomizeName;