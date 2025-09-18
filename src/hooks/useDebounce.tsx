import {useEffect,useRef} from 'react'

const useDebounce = (callback:(...args:any[])=>void,delay:number=500) => {
    const timeoutRef = useRef<NodeJS.Timeout |null>(null)

    function debouncedFunction(...args:any[]){
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{
            callback(...args)
        },delay)
    }

    useEffect(()=>{



        return()=>{
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }
        }
    },[])

    return debouncedFunction;
}
 
export default useDebounce;