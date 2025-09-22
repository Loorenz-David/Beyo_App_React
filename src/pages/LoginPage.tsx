import '../css/login-page.css'
import {useEffect,useRef,useContext} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

import {useNavigate} from 'react-router-dom'


const LoginPage = () => {
    const navigate = useNavigate()
    const loginRef = useRef<HTMLDivElement | null>(null)
    
    const {showMessage} = useContext(ServerMessageContext)

    useEffect(()=>{
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if(!navigator.onLine ){
            showMessage({
                message:'You are Offline!',
                complementMessage:'Connect to internet to login',
                status:400
            })
            if(currentUser.username){
                navigate('/')
            }
            
        }
        if(loginRef.current){
            setTimeout(()=>{
                if(loginRef.current){
                    loginRef.current.scrollTo({
                        top: loginRef.current.scrollHeight,
                        behavior:'smooth'
                    })
                }
                
            },2800)
        }
        
    },[])
    
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) =>{
          

            event.preventDefault()
            const form = event.currentTarget
            const emailInput = form.querySelector('#email') as HTMLInputElement
            const passwordInput = form.querySelector('#password') as HTMLInputElement
            // handle validation..
            const email= emailInput.value 
            const password= passwordInput.value
            let fetchDict;
            if(email != '' && password != ''){
                fetchDict = {email:email,password:password}
            }else{
                 showMessage({
                    message:'Missing email or password',
                    status:400
                })
                return
                
            }
            
            try{
                const response = await fetch ('/api/login',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({email,password}),
                    credentials:'include'
                })
                
                
                const data = await response.json()
               
                if(!data.ok){
                    showMessage({
                        message:data.message,
                        complementMessage: data.server_message,
                        status:data.status,
                    }) 
                }
                
                if(data.body.length > 0 && 'username' in data.body[0]){
                    localStorage.setItem('user',JSON.stringify(data.body[0]))
                    navigate('/')
                }

                
                
                
        }catch(error){
                showMessage({
                    message:'server error',
                    complementMessage:String(error),
                    status:500
                })
                console.log( error,'server error')
        }
        }
        
        

    return ( 
            <div className="flex-column width100" style={{height:'100dvh',overflow:'hidden'}}>
                <div className="flex-column" style={{overflow:'hidden'}}
                    
                >
                        <div className="login-page hide-scrollbar"
                            ref={loginRef}
                        >
                            <div  className=" flex-column gap-1  width100 items-center content-center title-container"  >
                                <div className="flex-row">
                                    <span className="typing-text typing-1">Beyo Vintage</span>
                                </div>
                                <div className="flex-row">
                                    <span className="typing-text typing-2">Item Tracker</span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="login-container ">
                                    <div className="flex-column gap-05  items-start">
                                        <span className="lower-titles">Email</span>
                                        <div className="flex-row justify-center">
                                            <input
                                            id="email" 
                                            className="main-input width-300" 
                                            type="text" 
                                            name="email"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-column gap-05  items-start">
                                        <span className="lower-titles">Password</span>
                                        <div className="flex-row justify-center">
                                            <input
                                            id="password" 
                                            className="main-input width-300" 
                                            type="password" 
                                            name="password"
                                            />
                                        </div>
                                    </div>
                                    <button className="btn bg-secondary margin-top-20 color-primary padding-left-20 padding-right-20">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                </div>

            </div>
            
       
     );
}
 
export default LoginPage;