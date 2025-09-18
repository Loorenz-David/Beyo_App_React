import {useState,useContext} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'


function useFetch() {
    const {showMessage} = useContext(ServerMessageContext)
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [serverMessageDict,setServerMessageDict] = useState(null)
    

    const doFetch = async (url='/api',method='POST',body={},setRules={},setAssignData=null) =>{

        let fetchDict = {
                            method:method,
                            headers:{'Content-Type':'application/json'},
                            credentials:'include'
        }
        if(Object.keys(body).length > 0){
                fetchDict['body'] = JSON.stringify(body)
        }
        let response = null

        if(!loading){
            setLoading(true)
        }
        

        try{
            const res = await fetch(url,fetchDict)
            
            

            const result = await res.json()
            response = result

            
           console.log(response,'response from useFetch hook')
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
            setServerMessageDict
    };
}
 
export default useFetch;