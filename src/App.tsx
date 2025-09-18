import { useEffect } from 'react'
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  
} from 'react-router-dom'

import NavBar from './components/nav-bar.tsx'
import HomePage from './pages/HomePage.tsx'
import ItemsPage from './pages/ItemsPage.tsx'
import SchedulePage from './pages/SchedulePage.tsx'
import AccountPage from './pages/AccountPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import ProtectedRouter from './pages/ProtectedRouter.tsx'


import CreateItemPageV2 from './pages/CreateItemPageV2.tsx'




  


function App() {
  const location = useLocation()
  const hideNavOnRoutes = ['/login','/items/create_item','/items/create_dealer']
  const shouldHideNav = hideNavOnRoutes.includes(location.pathname)
  const navigate = useNavigate()

  useEffect(()=>{
    const checkSession = async ()=>{
      try{
          const res = await fetch('/api',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({}),
            credentials:'include'});
        
          if(res.status !== 200){
            localStorage.removeItem('user')
            navigate('/login')
          }
        } catch(error){
          console.log(error)
          localStorage.removeItem('user')
          navigate('/login')
        }
      }

      checkSession()

    },[navigate])

  return (
    <div className='App'>
      {!shouldHideNav && <NavBar />}

      <Routes>
        <Route path="/login" element={<LoginPage/>}></Route>
        
        <Route path="/" 
        element={<ProtectedRouter><HomePage/></ProtectedRouter>} 
        />
        <Route path="/items/create_item"
        element={<ProtectedRouter><CreateItemPageV2 /></ProtectedRouter>}
        />
        <Route path="/items" 
        element={<ProtectedRouter><ItemsPage/></ProtectedRouter>} 
        />
        <Route path="/schedule"
        element={<ProtectedRouter><SchedulePage/></ProtectedRouter>} 
        />
        <Route path="/Account" 
        element={<ProtectedRouter><AccountPage/></ProtectedRouter>} 
        />
      </Routes>
    </div>
  )
}

export default App
