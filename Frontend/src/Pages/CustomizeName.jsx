import React, { useContext, useState } from 'react'
import { UserDataContext } from '../Context/UserContext';

function CustomizeName() {

    const { userData } = useContext(UserDataContext);
    const [AssistantName, setAssistantName] = useState(userData?.AssistantName || "");

    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-blue-950 to-pink-900 flex flex-col items-center justify-center'>
            {/* heading */}
            <h1 className='text-white ms:text-xl lg:text-3xl mb-8 mt-3'>Enter your <span className='text-yellow-300 text-4xl'>Assistant Name</span></h1>
            <div>
                <input type="text" name='name' placeholder='Enter your assistant name' className='border border-white pl-4 py-2 rounded-4xl text-white w-120 bg-transparent' onChange={(e) => setAssistantName(e.target.value)} value={AssistantName} />
            </div>
            {
                AssistantName && <button className='bg-white text-black my-7 px-5 py-2 rounded-4xl font-bold hover:scale-105 duration-300 cursor-pointer' onClick={() => navigate('/customizename')}>
                    Create your Assistant
                </button>
            }
        </div >
    )
}

export default CustomizeName;