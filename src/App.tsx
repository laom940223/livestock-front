


import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/protectedRoute'
import SignIn from './pages/login'
import SignUp from './pages/sigup'
import { Layout } from './pages/layout'

function App() {
  

  return (
    <>
            <Routes>
                <Route path='/'
                  element={
                    <ProtectedRoute/>
                  }
                
                >
                   <Route path='' element={<Layout/>}  /> 

                </Route>
                  

                <Route path='/login' element={<SignIn/>} />
                <Route path="/signup" element={<SignUp/>}/>
            </Routes>
    </>
  )
}

export default App
