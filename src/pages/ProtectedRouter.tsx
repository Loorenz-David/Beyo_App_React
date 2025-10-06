import {Navigate} from 'react-router-dom'
import React from 'react'

interface Props{
    children:React.ReactNode;
}

const ProtectedRouter = ({children}:Props) => {
    // const user = JSON.parse(localStorage.getItem('user') || '{}')
    // if(!('username' in user)){
    //     return <Navigate to='/login' replace />
    // }


    return children;
}
 
export default ProtectedRouter;