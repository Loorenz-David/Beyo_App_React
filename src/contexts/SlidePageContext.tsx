import {createContext, useContext} from 'react'
import type {SlidePageToProps} from '../hooks/useSlidePageTouch.tsx'


interface SlidePageContextType{
    slidePageTo:(props:SlidePageToProps) => void
    currentPageIndex?:React.RefObject<number>
}

const SlidePageContext = createContext<SlidePageContextType | null>(null)

export const useSlidePage = () =>{
    const ctx = useContext(SlidePageContext);
    if(!ctx){
        throw new Error("useSlidePage must be used inside a SlidePageContainer")
    }

    return ctx
}

export const SlidePageProvider = SlidePageContext.Provider

// ------------------------------------------------

interface SetNextPageContextType {
    setNextPage:(Component:React.ReactNode)=> void
}
export const SetNextPageContext = createContext<SetNextPageContextType | null>(null)

export const useSetNextPage = ()=>{
    const ctx = useContext(SetNextPageContext);
    if(!ctx){
        throw new Error("useSlidePage must be used inside a SlidePageContainer")
    }
    return ctx
}


