import {createContext, useState,useCallback,ReactNode} from 'react'
import ServerMessage from '../components/server-message.tsx'

type MessageDict ={
    message:string;
    complementMessage?:string;
    status:number;
}
type ServerMessageContextType={
    showMessage:(msg:MessageDict)=>void;
}

export const ServerMessageContext = createContext<ServerMessageContextType>({
    showMessage:()=>{},
})

export function ServerMessageProvider({children}:{children:ReactNode}){
    const [messageDict,setMessageDict] = useState<MessageDict | null>(null)

    const showMessage = useCallback((msg:MessageDict)=>{
        setMessageDict(msg)
    },[])

    const dismissMessage = ()=> setMessageDict(null)

    return (
        <ServerMessageContext.Provider value={{showMessage}}>
            {children}
            {messageDict && 
                <ServerMessage 
                    messageDict={messageDict}
                    onDismiss={dismissMessage}
                    />
            }
        </ServerMessageContext.Provider>
    )

}