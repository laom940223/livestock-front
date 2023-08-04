


import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/protectedRoute'
import SignIn from './pages/login'
import SignUp from './pages/sigup'
import { Layout } from './pages/layout'
import { Dashboard } from './pages/dashboard'
import { FarmDetail } from './pages/farm-detail'
import { AnimalDetail } from './pages/animal-detail'

function App() {
  

  return (
    <>
            <Routes>
                <Route path='/'
                  element={
                    <ProtectedRoute/>
                  }
                
                >
                   <Route path='' element={<Layout/>} >

                      <Route path='' element={<Dashboard/>}/>
                      <Route path='/farms/:id'  element={<FarmDetail/>}/>
                      <Route path='/farms/:farmId/animals/:animalId' element={ <AnimalDetail/>}/>

                      


                      <Route path="*" element={<> Not Found</>} />
                   </Route>
                </Route>
                  

                <Route path='/login' element={<SignIn/>} />
                <Route path="/signup" element={<SignUp/>}/>
            </Routes>
    </>
  )
}

export default App
