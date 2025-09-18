import '../css/login-page.css'
import {useEffect} from 'react'
import ServerMessage from '../components/server-message.tsx'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const LoginPage = () => {
    const [serverMessage, setServerMessage] = useState<MessageDict |null>(null)
    const dismissMessage = () => setServerMessage(null)
    const navigate = useNavigate()

    useEffect(()=>{
            setTimeout(()=>{
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior:'smooth'
                })
            },2800)
    },[])
    console.log('rendering Login')
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) =>{
            if(serverMessage){
                dismissMessage()
            }

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
                return
            }
            

            try{
                const response = await fetch ('/api/login',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({email,password}),
                    credentials:'include'
                })
                
                console.log(response)
                const data = await response.json()
                console.log(data,'log in response')
                if(!data.ok){
                    setServerMessage({
                        message:data.message,
                        complementMessage: data.server_message,
                        status:data.status,
                    }) 
                }
                console.log(data,'response data')
                if(data.body.length > 0 && 'username' in data.body[0]){
                    localStorage.setItem('user',JSON.stringify(data.body[0]))
                    navigate('/')
                }

                
                
                
        }catch(error){
                setServerMessage({
                    message:'server error',
                    complementMessage:error,
                    status:500
                })
                console.log( error,'server error')
        }
        }
        
        

    return ( 
        <div className="login-page">
            {serverMessage && (
            <ServerMessage
             messageDict={serverMessage} 
             onDismiss={dismissMessage}
             />)}
            <div  className=" flex-column gap-1 width100 items-center content-center title-container"  >
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
     );
}
 
export default LoginPage;