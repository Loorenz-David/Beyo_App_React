import {useState,useContext} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'
import {useNavigate} from 'react-router-dom'
import {useSlidePage} from '../contexts/SlidePageContext.tsx'
interface fetchDictProps{
    method: "GET" | "POST" | "PUT" | "DELETE"
    headers: HeadersInit
    credentials?: "include" | "omit" | "same-origin"
    body:any
}

interface apiFetchProps extends fetchDictProps{
    endpoint:  string
}

interface doFetchProps {
    url:string
    method:"GET" | "POST" | "PUT" | "DELETE"
    body:any
    setRules?:any
    setAssignData?: React.Dispatch<React.SetStateAction<any>> | null
}

function useFetch() {
    const {showMessage} = useContext(ServerMessageContext)
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [serverMessageDict,setServerMessageDict] = useState(null)
    const API_URL = import.meta.env.VITE_API_URL ?? ''
    const navigate = useNavigate()
    

    // generic fetch function with token handling

    const apiFetch = async ({endpoint,method,headers,body,credentials}:apiFetchProps)=>{
        const token = localStorage.getItem('token') ?? ''
        const fetchDict:fetchDictProps = {
            method:method,
            headers:{...headers, ...(token !== '' ? {"Authorization": `Bearer ${token}`} : {})},
            body:body,
            credentials:'include'
        }
       
        
        const result = await fetch(`${API_URL}${endpoint}`,fetchDict)
        if(result.status == 403){
            
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            (document.querySelector('.App') as HTMLElement).style.transform = 'translateX(0px)';
            navigate('/login');
            showMessage({
              message:'Session expired.',
              complementMessage:'Please login again.',
              status:400
            })
            
        }

        return result
    }

    const doFetch = async ({url='/api',method='POST',body={},setRules={},setAssignData}:doFetchProps) =>{

       
        
        let response = null

        if(!loading){
            setLoading(true)
        }
        

        try{
            const token = localStorage.getItem('token') ?? ''
            const res = await apiFetch({
                method:method,
                endpoint:url,
                body:JSON.stringify(body),
                headers:{'Content-Type':'application/json', "Authorization": `Bearer ${token}`},
                credentials:'include'

            })
            if(!res.ok){
                throw Error('server return bad request.')
            }

            const result = await res.json()
            response = result

            
           
            if('loadServerMessage' in setRules && setRules.loadServerMessage){
                showMessage({
                            message:result.message,
                            complementMessage:result.server_message,
                            status:result.status,
                            })
                                          
            }
            
            
            if('loadData' in setRules && setRules.loadData){
                if(result.body && Array.isArray(result.body)){
                    setData(result.body)
                }else{
                    setData([])
                }
                if(setAssignData){
                    setAssignData(prev =>({...prev,...result.body[0]}))
                }
            }
                
            
            
            
            
        }catch(error){
           setData([])
        } finally{
            setLoading(false)
           
        }
        return response
        
    } // func end



    
    return {serverMessageDict,data,loading,error,doFetch,setLoading,setData,
            setServerMessageDict, apiFetch
    };
}
 
export default useFetch;