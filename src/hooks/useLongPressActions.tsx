import { useRef,useEffect} from 'react'
interface ItemVals{
    images:(string | {file:Blob})[] | null | undefined
    properties:Record<string,any>
    type:string
    article_number:string
}
interface longPressActionProps{
    selectionMode:boolean
    setSelectionMode?:()=>void
    handleActionWhenPress:(e:React.TouchEvent<HTMLElement>,item:ItemVals)=>void
    handleDefaultActionWhenClick?: (e:React.TouchEvent<HTMLElement>,item:ItemVals)=>void
    skipFirstClick:boolean
}


export const useLongPressAction = ({selectionMode,setSelectionMode,handleActionWhenPress,handleDefaultActionWhenClick,skipFirstClick=true}:longPressActionProps)=>{

    const touchStart = useRef(0)
    const currentSelectedObj = useRef(null)
    const pressTimeoutRef = useRef<Node.JS.Timeout | null>(null)
    const isScrolling = useRef(false)
    const skipFirst = useRef(skipFirstClick)

    useEffect(()=>{

        return()=>{
            if(pressTimeoutRef.current){
                clearTimeout(pressTimeoutRef.current)
            }
        }
    },[])

    const getClientY = (e:TouchEvent | MouseEvent)=>{
        if ('touches' in e){
            return e.touches[0]?.clientY ?? 0
        }
        return e.clientY
    }

    const handlePressStart = (e,itemObj)=>{
        
        const target = e.currentTarget.closest('[observing-obj-for-selection]')
        if(!target)return;
        

        touchStart.current = getClientY(e)
        
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
            if(pressTimeoutRef.current){
                clearTimeout(pressTimeoutRef.current)
            }
            isScrolling.current = false
            return
        }
        
        if(document.activeElement?.tagName === 'INPUT'){
            document.activeElement.blur()
        }

        e.stopPropagation()
        if(pressTimeoutRef.current && !selectionMode){
            clearTimeout(pressTimeoutRef.current)
            pressTimeoutRef.current = null
            currentSelectedObj.current = itemObj
            e.preventDefault()
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
       
        const didMove = Math.abs(getClientY(e) - touchStart.current)
        
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