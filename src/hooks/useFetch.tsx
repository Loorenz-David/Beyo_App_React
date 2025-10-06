import {useState,useContext} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

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

    const apiFetch = async ({endpoint,method,headers,body,credentials}:apiFetchProps)=>{
        const token = localStorage.getItem('token') ?? ''
        const fetchDict:fetchDictProps = {
            method:method,
            headers:{...headers, ...(token !== '' ? {"Authorization": `Bearer ${token}`} : {})},
            body:body,
            credentials:'include'
        }
       
        
        const result = await fetch(`${API_URL}${endpoint}`,fetchDict)
        
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
                setData(result.body)
                if(setAssignData){
                    setAssignData(prev =>({...prev,...result.body[0]}))
                }
            }
            if(!res.ok){
                throw Error('server return bad request.')
    
            }
            
            
        }catch(error){
            setError(error)
            setData([])


            console.log(error)
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