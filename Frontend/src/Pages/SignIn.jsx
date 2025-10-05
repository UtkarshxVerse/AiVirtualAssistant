import React, { useContext, useState } from 'react'
import bg from '../assets/bg1.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import axios from 'axios';

function SignIn() {
  const { serverUrl, userData , setUserData } = useContext(UserDataContext)
  const [showPassword, setPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HandleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      setUserData(result.data);
      setLoading(false);
      navigate('/' );
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setError(error.response.data.message);
    }
  }


  return (
    <div className='w-full h-[100vh] bg-cover flex justify-between items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form onSubmit={HandleSignin} className='flex flex-col justify-center items-center w-fit m-auto px-5 py-12 gap-4 rounded-2xl backdrop-blur-sm shadow-lg shadow-red-600'>
        {/* Form heading */}
        <h1 className='font-bold text-xl mb-5 text-white'>SignIn to <span className='text-blue-400'>Virtual Assistant</span> </h1>

        {/* Input fields */}
        <div>
          <input type="email" name='email' placeholder='Enter your Email' className='border border-white pl-4 py-2 rounded-4xl text-white w-90 bg-transparent' onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div>
          <input type={showPassword ? "password" : "text"} name='password' placeholder='Enter your Password' onChange={(e) => setPass(e.target.value)} value={password} className=' border border-white pl-4 py-2 rounded-4xl text-white w-90 relative bg-transparent' />

          {showPassword ? <FaEye onClick={() => setPassword(!showPassword)} className='relative left-[90%] bottom-7 cursor-pointer text-white' /> : <FaEyeSlash onClick={() => setPassword(!showPassword)} className='relative left-[90%] bottom-7 cursor-pointer text-white bg-transparent' />}
        </div>

        {/* return error */}
        {
          error.length > 0 && <p className='text-red-600'> *{error} </p>
        }

        {/* Signup button */}
        <button type='Submit' className='bg-white text-black my-1 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer' disabled={loading}>
          {loading ? "Loading..." :"SignIn"}
        </button>

        {/* Redirect to Signin */}
        <div>
          <p className='text-white' onClick={() => navigate('/signup')}>Don't have an account?
            <span className='text-blue-400 cursor-pointer ml-1'>SignUp</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignIn;