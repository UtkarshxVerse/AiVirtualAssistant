import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Customize from './Pages/Customize'
import { UserDataContext } from './Context/UserContext'
import CustomizeName from './Pages/CustomizeName'
import Home from './Pages/Home'

function App() {
  const {userData, setUserData} = useContext(UserDataContext);
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to={"/customize"}/>} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={'/'}/>} />
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={'/'}/>} />
      <Route path='/customize' element={userData ? <Customize/> :  <Navigate to={'/signup'}/>} />
      <Route path='/customizename' element={userData ? <CustomizeName/> :  <Navigate to={'/signup'}/>} />   
    </Routes>
  )
}

export default App;