import {useContext, createContext} from 'react'

interface DataProps<T> {
    data:T
    setData: React.Dispatch<React.SetStateAction<T>>
    setNextPage:React.Dispatch<React.ReactNode> | null
    setForceRenderChildren?: React.Dispatch<React.SetStateAction<boolean>> | null
    forceRenderChildren?: boolean
}

export const DataContext = createContext<DataProps<any> | null>(null)

export const useData = ()=>{
    const ctx = useContext(DataContext)
    if(!ctx){
        throw new Error("useContext must be inside <DataContextProvider>")
    }
    return ctx
}