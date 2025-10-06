import { useEffect,useContext,useRef,useState } from 'react'
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  
} from 'react-router-dom'

import NavBar from './Components/Navigation_Components/NavBarMobile.tsx'
import HomePage from './pages/HomePage.tsx'
import ItemsPage from './pages/ItemsPage.tsx'
import SchedulePage from './pages/SchedulePage.tsx'

import LoginPage from './pages/LoginPage.tsx'
import MenuPage from './pages/MenuPage.tsx'
import ProtectedRouter from './pages/ProtectedRouter.tsx'

import {ServerMessageContext} from './contexts/ServerMessageContext.tsx'
import {SlidePageProvider} from './contexts/SlidePageContext.tsx'

import CreateItemPageV2 from './Components/Item_Components/CreateItemPageV2.tsx'

import useFetch from './hooks/useFetch.tsx'
import {useSlidePageTouch} from './hooks/useSlidePageTouch.tsx'

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';


import { useRegisterSW } from 'virtual:pwa-register/react';

  


function App() {
  const location = useLocation()
  const hideNavOnRoutes = ['/login','/items/create_item','/items/create_dealer']
  const shouldHideNav = hideNavOnRoutes.includes(location.pathname)
  const navigate = useNavigate()
  const {showMessage} = useContext(ServerMessageContext)
  const {apiFetch} = useFetch()
  const firstLoad = useRef(false)
  const appRef = useRef<HTMLDivElement>(null)
  const [currentPageIndex,setCurrentPageIndex] = useState(0)
 
  useRegisterSW({
    onRegisteredSW(swUrl,registration){
      console.log('new service worker registered',swUrl)
      setInterval(()=>{
        if(registration){
          registration.update()
        }
        
      },60*60*1000)
    },
    onNeedRefresh(){
      console.log('new version available!')
      showMessage({
        message:'New version available!',
        complementMessage:'Fully close the app and open again to see changes.',
        status:100
      })
    },
    onOfflineReady(){
       showMessage({
        message:'New Version installed!',
        status:200
      })
    }
  })
 
  useEffect(()=>{
    const notifyOffline = ()=>{
      showMessage({
        message:'You are offline.',
        complementMessage:'To push changes to the server connect to an internet connection',
        status:100
      })
      
    }
    const notifyOnline = ()=>{
        showMessage({
        message:'Back Online!',
        complementMessage:"Don't forget to chec offline items to push changes.",
        status:200
      })
      
    }

    if(!firstLoad.current){
      window.addEventListener('online',notifyOnline)
      window.addEventListener('offline',notifyOffline)
    }


    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const checkSession = async ()=>{
      
      try{
          await apiFetch({
              endpoint:'/api',
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({}),
              credentials:'include'
          })
          .then(res => {
            if(res && !res.ok){
              throw(res.status)
            }
          })
          
        } catch(error){

          if(!user.username){

            localStorage.removeItem('user')
            navigate('/login')
            showMessage({
              message:'Login required.',
              complementMessage:String(error),
              status:400
            })
            
          }else{
            showMessage({
              message:'Server is down for online activities.',
              complementMessage:String(error),
              status:500
            })
          }
        }
        
    }
    
    if(navigator.onLine ){

      if(location.pathname !== '/login'){
        checkSession()
      }
      
    }else{
      
      if(!user.username){
        showMessage({
          message:'You are offline!',
          complementMessage:'To use the application in offline behavior, you must first login being online!',
          status:100
        })
        navigate('/login')
        
      }else{
        showMessage({
          message:'You are offline!',
          complementMessage:'rememeber to push your changes when online',
          status:100
        })
      }
    }
      

    },[navigate])

  const {handleTouchStart,handleTouchMove,handleTouchEnd,slidePageTo}= useSlidePageTouch({
          parentRef:appRef,
          currentPageIndex:currentPageIndex,
          setCurrentPageIndex:setCurrentPageIndex
        
        })
    
  return (
    <div className='App smooth-slide' 
      ref={appRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      {!shouldHideNav && <NavBar />}
      
      <SlidePageProvider value={{slidePageTo,currentPageIndex}}>
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
          <Route path="/Menu" 
          element={<ProtectedRouter><MenuPage/></ProtectedRouter>} 
          />
        </Routes>
      </SlidePageProvider>
       {/* <Analytics />
       <SpeedInsights /> */}
    </div>
  )
}

export default App
