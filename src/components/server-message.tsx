import {useRef,useEffect} from 'react'
import AlertIcon from '../assets/icons/AlertIcon.svg?react'
import SuccessIcon from '../assets/icons/SuccessIcon.svg?react'
import ErrorIcon from '../assets/icons/ErrorIcon.svg?react'

type MessageDict = {
    message: string;
    complementMessage?:string;
    status:number;
}
type ServerMessageProps = {
    messageDict: MessageDict;
    onDismiss:()=> void;
}

function checkStatus(status:number){
    let className;
    let icon;
    if(status < 200){
        className = 'sucess-offline'
        icon = <SuccessIcon/>
    }
    else if(status < 400){
        className = 'success'
        icon = <SuccessIcon/>
    }
    else if(status < 500){
        className = 'alert'
        icon = <AlertIcon />
    }else{
        className = 'error'
        icon = <ErrorIcon />
    }
    return [className,icon]
}

const ServerMessage = ({messageDict,onDismiss}: ServerMessageProps) => {
    let maxHeaderSize = 30
    let displayMessage;
    let [statusClassName, Icon ]= checkStatus(messageDict.status)
    
    const startYRef = useRef<number |null>(null);
    const containerRef = useRef<HTMLDivElement | null >(null)
    const timeoutRef = useRef(null)

    if(messageDict.message.length >= maxHeaderSize){
        displayMessage = messageDict.message.slice(0,maxHeaderSize) + '...';
    }else{
        displayMessage = messageDict.message
    }
    const addTimeout = (time=2000)=>{
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{
            containerRef.current!.classList.add('slide-up')
            setTimeout(()=>{onDismiss()},300)
        },time)
    }

    const handleTouchStart = (e:React.TouchEvent)=>{
        e.stopPropagation()
        startYRef.current = e.touches[0].clientY
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        
    }
    const handleTouchEnd = (e:React.TouchEvent) =>{
        if(startYRef.current !== null){
            const endY = e.changedTouches[0].clientY;
            const diff = startYRef.current - endY;
            

            if(diff > 10){
                containerRef.current!.classList.add('slide-up')
                setTimeout(()=>{
                    onDismiss()
                },300)
                
            }else{
                containerRef.current!.style.top = '20px'
                addTimeout(15000)
            }
        }
    }

    
    const showMoreServerMessage = (e) =>{
        let target = e.currentTarget 
        let isActive = target.getAttribute('is-active')
        let messageBodyElement = target.querySelector('#serverMessageBody')
        let messageHeaderElement = target.querySelector('#serverMessageHeader')
        
        if(isActive == 'false'){
            messageHeaderElement.textContent = messageDict.message
           
            messageBodyElement.textContent = messageDict.complementMessage
            
            
            const scrollHeight = messageBodyElement.scrollHeight;
            let maxWidth = Math.min(scrollHeight * 1.5, window.innerWidth - 80)
            messageBodyElement.style.padding = '10px 10px'
            messageBodyElement.style.maxHeight = scrollHeight + 'px';
            messageBodyElement.style.width = maxWidth  + 'px';

            
            
            

            target.setAttribute('is-active','true')
        }else{
            messageHeaderElement.textContent = displayMessage
            messageBodyElement.style.padding = '0'
            messageBodyElement.style.maxHeight = '0';
            messageBodyElement.style.width = '0'
            
            setTimeout(()=>{
                if(messageBodyElement){
                    messageBodyElement.textContent = ''
                }
            },300)
            target.setAttribute('is-active','false')
        }
        
       
    }

     useEffect(()=>{
        const container = containerRef.current;
        
        if(!container) return;

        const handleMove = (e:TouchEvent) =>{
            e.preventDefault()
            
            let touch = e.touches[0].clientY
            
            if(touch > 55){
                return
            }
            container.style.top = `${touch - 20}px`
        }

        addTimeout()

        container.addEventListener('touchmove',handleMove,{passive:false})

        return () =>{
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }
            container.removeEventListener('touchmove',handleMove)
        }
    },[])


    return ( 
        <div 
        ref={containerRef}
        className={`server-message ${statusClassName}`}
        onTouchStart={handleTouchStart}
        onTouchEnd= {handleTouchEnd}
        onClick={(e)=>showMoreServerMessage(e)}
        is-active = 'false'
        
        >   
            <div className="flex-row gap-1 justify-start  width100">
                    {Icon}
                <span className="text-15 items-center flex-row color-secondary" id='serverMessageHeader'>
                    {displayMessage}
                </span>
            </div>
            <div className="flex-row items-center">
                <span  id="serverMessageBody" className="text-15 color-secondary">

                </span>
            </div>
        
            
        </div>
     );
}
 
export default ServerMessage;