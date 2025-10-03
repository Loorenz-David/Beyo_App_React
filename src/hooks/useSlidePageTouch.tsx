
import React from 'react'
import {useRef} from 'react'


interface UseSlidePageTouchProps{
    parentRef: React.RefObject<HTMLElement | null>
    thresshold?:number
    verticalScrollThresshold?:number
    currentPageIndex:number
    setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>
}

export interface SlidePageToProps{
    directPage?: number | null
    addNumber?: number
    removeTimeout?:boolean
    setClosePage?: React.Dispatch<React.SetStateAction<React.ReactNode | null>> | null
    

}

interface MemorizedPageToClose {
    setClosePage: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
    pageNumber: number
}


export const useSlidePageTouch = ({
    parentRef,
    thresshold=50,
    verticalScrollThresshold=10,
    currentPageIndex,
    setCurrentPageIndex 
}:UseSlidePageTouchProps)=>{

    const startXRef = useRef(0)
    const startYRef = useRef(0)
    const startTranslateX = useRef(0)
    const isScrollingVertical = useRef(false)
    // const currentPageIndex = useRef(0)
    const firstTimeLoad = useRef(true)
    
    const pageTransition = useRef(false)
    const memorizedPageToClose = useRef<MemorizedPageToClose>(null)
    

    const handleTouchStart = (e:React.TouchEvent<HTMLDivElement>)=>{
       if(pageTransition.current) return
        startXRef.current = e.touches[0].clientX
        startYRef.current = e.touches[0].clientY
        if(!parentRef.current) return
        const elementStyle = window.getComputedStyle(parentRef.current)
        const transform:string = elementStyle.transform 
        
        if(transform && transform !== 'none'){
            
            const matrix = transform.match(/matrix.*\((.+)\)/)
            if(matrix && matrix[1]){
                const matrixValue = matrix[1].split(", ")
                startTranslateX.current = parseFloat(matrixValue[4])
            }
            
        }

    }

    const handleTouchMove = (e:React.TouchEvent<HTMLDivElement>)=>{
        
        
        if( !parentRef.current || pageTransition.current) return

        const pageScrollWidth = parentRef.current.scrollWidth
        const pageOffsetWidth = parentRef.current.offsetWidth

        if (pageScrollWidth == pageOffsetWidth) return

        const currentTouchX = e.touches[0].clientX
        const currentTouchY = e.touches[0].clientY

        const deltaX = currentTouchX - startXRef.current
        const deltaY = currentTouchY - startYRef.current

        
        if(Math.abs(deltaY) > verticalScrollThresshold || Math.abs(deltaX) > verticalScrollThresshold ){
            isScrollingVertical.current = Math.abs(deltaY) > Math.abs(deltaX)
            
            if(isScrollingVertical.current){
                
                return
            }
        }
        

        const currentTranslate = startTranslateX.current + deltaX
        const rightThresshold = (pageScrollWidth - pageOffsetWidth) + 20
        
        const absoluteTranslate = Math.abs(currentTranslate)
        
        if(absoluteTranslate > rightThresshold || currentTranslate > 20 ) {
            return
        }
        
        parentRef.current.style.transform = `translate3d(${currentTranslate}px,0,0)`

    }

    const handleTouchEnd = (e:React.TouchEvent<HTMLDivElement>)=>{
        
        if( !parentRef.current || pageTransition.current  ) return 
        if(isScrollingVertical.current ){
            
            slidePageTo({addNumber:0})
            isScrollingVertical.current = false
            return 
        }

        const pageScrollWidth = parentRef.current.scrollWidth
        const pageOffsetWidth = parentRef.current.offsetWidth

        if (pageScrollWidth == pageOffsetWidth) return 
        
        const lastTouch = e.changedTouches[0].clientX - startXRef.current
        


        if(  Math.abs(lastTouch) > thresshold ){
            
            if(lastTouch < 0){ // swiping to right
                slidePageTo({addNumber:1})
                return currentPageIndex + 1
            }else{
                slidePageTo({addNumber:-1})
                return currentPageIndex - 1
            }
            
        }else{
            slidePageTo({addNumber:0})
            return 0
        }
        
    
        
    }

    const slidePageTo = ({addNumber,directPage=null,removeTimeout=false,setClosePage=null}:SlidePageToProps) =>{
       
        const callSlidePageTo = ()=>{
            let pageIndexToUpdate = currentPageIndex
            
            if(!parentRef.current) return

            if(typeof directPage == 'number' ){
                pageIndexToUpdate = directPage
            }else if (typeof addNumber == 'number'){
                
                if(addNumber < 0){

                     if(memorizedPageToClose.current){
                        if(memorizedPageToClose.current.pageNumber == pageIndexToUpdate ){
                            const setterAction = memorizedPageToClose.current.setClosePage
                            setTimeout(()=>{
                                setterAction(null)
                            },200)
                        }
                    }

                   

                }
               


                pageIndexToUpdate += addNumber
            }else{
                return
            }


            pageTransition.current = true
            
            
            const parentWidth = parentRef.current.offsetWidth
            const parentMaxScrollable = parentRef.current.scrollWidth
            let substractFromTotal =  1
            if(firstTimeLoad.current){
                substractFromTotal = 0
                firstTimeLoad.current = false
            }

            const totalPages = (parentMaxScrollable / parentWidth) - substractFromTotal
           
            if(pageIndexToUpdate > totalPages){
                pageIndexToUpdate = totalPages
            }
            if(pageIndexToUpdate < 0){
                pageIndexToUpdate = 0
            }
            
           

            const targetTranslateX = -pageIndexToUpdate * parentWidth
            
            
            parentRef.current.style.transform = `translateX(${ targetTranslateX }px)`
            startTranslateX.current = targetTranslateX

            

            if(setClosePage){
                memorizedPageToClose.current = {setClosePage:setClosePage, pageNumber:pageIndexToUpdate}
            }
           

            setTimeout(()=>{
                pageTransition.current = false
               
            },200)
           
            setCurrentPageIndex(pageIndexToUpdate)
        
        }

        if(removeTimeout){
            callSlidePageTo()
        }else{
            setTimeout(()=>{
                requestAnimationFrame(()=>{
                    callSlidePageTo()
                })
            },0)
        }

       
    }
    

    return{
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        slidePageTo

    }
}