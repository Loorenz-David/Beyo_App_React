import CloseIcon from '../assets/icons/CloseIcon.svg?react'

import {useEffect,useRef} from 'react'


interface closeBtnVal{
    icon:React.ReactElement
    class:string
    order:number
}
interface headerVal{
    class:string
    order:number
    display:string
}
interface interactiveBtnVal{
    icon:React.ReactElement
    iconClass:string
    order:number
}

interface SecondaryPageProps{
    BodyComponent:React.FC<any>;
    bodyProps?:Record<string,any>
    handleClose: ()=>void;
    zIndex:number;
    pageId?:string;
    closeBtn:closeBtnVal
    startAnimation:string
    endAnimation:string
    interactiveBtn:interactiveBtnVal | null
    header:headerVal | null
}
const defaultCloseBtn = {'icon':<CloseIcon/>,'class':'flex-1 content-end padding-05','order':1}
const defaultStartAnimation = 'expandFromZero'
const defaultEndAnimation = 'shrinkToZero'


class PageManager {
    private pageStack: string[] = []

    open(pageId:string){
        this.pageStack.push(pageId)
    }
    close(pageId:string){
        this.pageStack = this.pageStack.filter(id=> id!== pageId)
    }
    isTop(pageId:string){
        return this.pageStack[this.pageStack.length -1] === pageId
    }
    getTop(){
        return this.pageStack[this.pageStack.length - 1]
    }
}

const pageManager = new PageManager()

const SecondaryPage = ({BodyComponent,bodyProps,handleClose,zIndex=1,pageId=null,closeBtn=defaultCloseBtn,startAnimation=defaultStartAnimation,endAnimation=defaultEndAnimation,interactiveBtn=null,header=null} : SecondaryPageProps) => {
    const secondaryPageRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const closeTimeoutRef = useRef<number | null>(null)
    const interactiveRef = useRef(null)
    const startYRef = useRef<number |null> (null)
    const holdScrollElement = useRef(null)
   
    
   
    
    const closeSecondaryPage = ()=>{
        secondaryPageRef.current.classList.remove(startAnimation)
        secondaryPageRef.current?.classList.add(endAnimation)

       closeTimeoutRef.current = setTimeout(()=>{
        
         handleClose()
       },300)
       
    }

   

    const handleClickOutside = (e)=>{
        const target = e.target as HTMLElement
        if(secondaryPageRef.current && !secondaryPageRef.current.contains(target)){
            closeSecondaryPage()
        }
        
    }

    const handleTouchMove = (e)=>{
        
        if(!pageManager.isTop(pageId)) return
        if(startYRef.current == null) return

        const currentMove = e.touches[0].clientY
        const deltaY = currentMove - startYRef.current

        const scrollElement = holdScrollElement.current
        const isAtTop = scrollElement && scrollElement.scrollTop === 0
        if(deltaY > 50 ){
           
            e.stopPropagation()
            e.preventDefault()
            if(!scrollElement || isAtTop){
                
                closeSecondaryPage()
                startYRef.current = null
            }
        }

        if(deltaY > 0 &&  (!scrollElement || isAtTop)){
           e.preventDefault()
           secondaryPageRef.current.style.transform = `translateY(${deltaY}px)`
        }

        


    }

    const handleTouchEnd = (e)=>{
        startYRef.current = null
        secondaryPageRef.current.style.transform= `translateY(0)`
    }
    

    useEffect(()=>{
            
            const node = secondaryPageRef.current 
            if(!node ) return;
            pageManager.open(pageId)

            node.addEventListener('touchmove',handleTouchMove,{passive:false})
           

             document.addEventListener('touchstart',handleClickOutside)
        
       



        return () =>{
            if(closeTimeoutRef.current){
                clearTimeout(closeTimeoutRef.current)
            }
            if(pageId){
                document.removeEventListener('touchstart',handleClickOutside)
            }
            node.removeEventListener('touchmove',handleTouchMove)
            pageManager.close(pageId)

            interactiveRef.current = null
            bodyRef.current = null
            secondaryPageRef.current = null
            closeTimeoutRef.current = null
            
        }
    },[])
    

    return ( 
    <div id={pageId ?? undefined}  className={`secondary-page bg-primary ${startAnimation} ${pageId}`} ref={secondaryPageRef} style={{zIndex:`${zIndex}`}}
      
       onTouchEnd={(e)=>{handleTouchEnd(e)}}
       onTouchStart={(e)=>{startYRef.current=e.touches[0].clientY}}
    >
       <div className="page-header" style={{zIndex:`${zIndex +1 }`}}>
            
            {interactiveBtn && 
                <div ref={interactiveRef} className={` flex-row items-center ${interactiveBtn.iconClass}`}
                    style={{order:'order' in interactiveBtn ? interactiveBtn.order : 0}}
                >
                    {interactiveBtn.icon}
                    
                </div>
            }
            

            <div className={`svg-18  flex-row items-center ${closeBtn.class} `}
            style={{order:closeBtn.order,padding:'0',}}
            onClick={closeSecondaryPage}
            >
                {closeBtn.icon}
            </div>

            {header && 
                 <div className={`flex-row ${header.class}`}
                    style={{order:header.order}}
                 >
                    <span>{header.display}</span>
                </div>
            }
           

            

            
        </div>
        
      
        <BodyComponent ref={bodyRef} {...bodyProps} handleClose={closeSecondaryPage} interactiveRef={interactiveRef} zIndex={zIndex} holdScrollElement={holdScrollElement} />
        
    </div> 
    );
}
 
export default SecondaryPage;