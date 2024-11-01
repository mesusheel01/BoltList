import React, { useState } from 'react'
import Signup from './components/Signup'
import { Route, Routes, BrowserRouter, useNavigate } from 'react-router-dom'
import Signin from './components/Signin'


const App = () => {
    const [buttonClicked, setButtonClicked] = useState(false)
  return (
    <BrowserRouter>
    {!buttonClicked && <ButtonNavigationToSignInSignUp setButtonClicked={setButtonClicked} />}
        <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
        </Routes>
    </BrowserRouter>
  )
}

const ButtonNavigationToSignInSignUp = ({setButtonClicked})=>{
    const navigate = useNavigate()

    return (
        <div>
            <button onClick={()=> {
            setButtonClicked(true)
            navigate('/signup')}} >Signup</button>
            <button onClick={()=> {
            setButtonClicked(true)
            navigate('/signin')}} >Signin</button>
        </div>
    )
}

export default App
