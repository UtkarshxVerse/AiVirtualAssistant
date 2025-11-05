import React, { useContext, useState } from 'react'
import bg from '../assets/bg1.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import axios from 'axios';

function SignUp() {
    const { serverUrl, userData, setUserData } = useContext(UserDataContext)
    const [showPassword, setPassword] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const HandleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true })
            setUserData(result.data)
            setLoading(false);
            navigate('/customize');
        } catch (error) {
            console.log(error);
            setUserData(null);
            setLoading(false);
            setError(error.response.data.message);
        }
    }


    return (
        <div
            className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-8"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <form
                onSubmit={HandleSignup}
                className="flex flex-col justify-center items-center w-full max-w-md sm:w-[80%] md:w-[60%] lg:w-[400px] mx-auto px-6 py-10 sm:py-12 gap-4 rounded-2xl backdrop-blur-md shadow-lg shadow-red-600"
            >
                {/* Form heading */}
                <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-white text-center leading-tight">
                    Register to <span className="text-blue-400">Virtual Assistant</span>
                </h1>

                {/* Input fields */}
                <div className="w-full">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="border border-white pl-4 py-2 rounded-full text-white w-full bg-transparent placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>

                <div className="w-full">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your Email"
                        className="border border-white pl-4 py-2 rounded-full text-white w-full bg-transparent placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className="w-full relative">
                    <input
                        type={showPassword ? "password" : "text"}
                        name="password"
                        placeholder="Enter your Password"
                        onChange={(e) => setPass(e.target.value)}
                        value={password}
                        className="border border-white pl-4 py-2 rounded-full text-white w-full bg-transparent placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {showPassword ? (
                        <FaEye
                            onClick={() => setPassword(!showPassword)}
                            className="absolute right-4 top-3.5 cursor-pointer text-white"
                        />
                    ) : (
                        <FaEyeSlash
                            onClick={() => setPassword(!showPassword)}
                            className="absolute right-4 top-3.5 cursor-pointer text-white"
                        />
                    )}
                </div>

                {error.length > 0 && <p className="text-red-500 text-sm text-center">*{error}</p>}

                {/* Signup button */}
                <button
                    type="submit"
                    className="bg-white text-black mt-2 px-6 py-2 rounded-full font-bold hover:scale-105 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>

                {/* Redirect to Signin */}
                <p className="text-white text-sm sm:text-base text-center mt-2">
                    Already have an account?
                    <span
                        className="text-blue-400 cursor-pointer ml-1 hover:underline"
                        onClick={() => navigate('/signin')}
                    >
                        Sign In
                    </span>
                </p>
            </form>
        </div>
    )
}

export default SignUp;