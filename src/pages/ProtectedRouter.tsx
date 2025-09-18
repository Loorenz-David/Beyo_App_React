import {Navigate} from 'react-router-dom'

interface Props{
    children:JSX.Element;
}

const ProtectedRouter = ({children}:Props) => {
    const user = JSON.parse(localStorage.getItem('user') || null)
    if(!user){
        return <Navigate to='/login' replace />
    }


    return children;
}
 
export default ProtectedRouter;