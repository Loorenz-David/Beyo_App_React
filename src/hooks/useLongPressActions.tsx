import { useRef,useEffect} from 'react'




export const useLongPressAction = ({selectionMode,setSelectionMode,handleActionWhenPress,handleDefaultActionWhenClick})=>{

    const touchStart = useRef(0)
    const currentSelectedObj = useRef(null)
    const pressTimeoutRef = useRef<Node.JS.Timeout | null>(null)
    const isScrolling = useRef(false)
    const skipFirst = useRef(false)

    useEffect(()=>{

        return()=>{
            if(pressTimeoutRef.current){
                clearTimeout(pressTimeoutRef.current)
            }
        }
    },[])


    const handlePressStart = (e,itemObj)=>{
        
        const target = e.currentTarget.closest('[observing-obj-for-selection]')
        if(!target)return;
        

        touchStart.current = e.touches[0].clientY
        
        if(!selectionMode){
            pressTimeoutRef.current = setTimeout(()=>{
                if(isScrolling.current){
                    return
                }
                skipFirst.current = true
                e.stopPropagation()
                handleActionWhenPress(target,itemObj)
                setSelectionMode(true)

                
            },500)
        }

    }

    const handlePressEnd = (e,itemObj)=>{
       
        if(isScrolling.current){
            isScrolling.current = false
            return
        }
        e.stopPropagation()
        if(pressTimeoutRef.current && !selectionMode){
            clearTimeout(pressTimeoutRef.current)
            pressTimeoutRef.current = null
            currentSelectedObj.current = itemObj
            handleDefaultActionWhenClick()
        }else{
            if(skipFirst.current){
                
                e.preventDefault()
                skipFirst.current = false
                return
            }
            if(selectionMode){
                
                const target = e.currentTarget.closest('[observing-obj-for-selection]')
                handleActionWhenPress(target,itemObj)

            }
            
            
        }
        
    }

     const handleTouchMove = (e)=>{
       
        const didMove = Math.abs(e.touches[0].clientY - touchStart.current)
        console.log(didMove)
        if(didMove > 10){
            clearTimeout(pressTimeoutRef.current)
            pressTimeoutRef.current = null
            isScrolling.current = true
        }

    }

    return {
        handlePressStart,
        handlePressEnd,
        handleTouchMove,
        currentSelectedObj
    }
}