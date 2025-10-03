import {useEffect,useRef} from 'react'
import CheckMarkIcon from '../../assets/icons/General_Icons/CheckMarkIcon.svg?react'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'

const SelectPopupV2 = ({top='100%',right='0',setTogglePopup,listOfValues,onSelect,zIndex=1,selectedOption=new Set<string>(),loading=false,parentWidth=null}) => {
    const insideRef = useRef(null)
    const ignoreFirstClick = useRef(true)

    useEffect(()=>{
        
        const handleClickOutside = (e)=>{
            
            if(ignoreFirstClick.current){
                ignoreFirstClick.current = false
                return
            }
            
            if(insideRef.current && !insideRef.current.contains(e.target as Node)){
                setTogglePopup(false)
            }    
        }

        window.addEventListener('click',handleClickOutside)

        return ()=>{
            window.removeEventListener('click',handleClickOutside)
           
            
        }
    },[])

    
    return ( 
        <div className="flex-column bg-primary " 
        ref={insideRef}
        id="selectPopupV2"
        style={{position:'absolute', top:top, right:right, zIndex:zIndex,
                borderRadius:'5px', maxWidth:'400px', boxShadow:'0 0 10px rgba(0, 0, 0, 0.54)',minWidth:parentWidth ? parentWidth + 'px':'150px',
                
            }}
        >
            {loading ? 
                <div className="flex-row items-center content-center padding-10">
                    <LoaderDots />
                </div>
                
            :
                listOfValues.map((obj,i)=>{
                    let isSelected = false 
                    if(selectedOption && selectedOption.has(obj.displayName)){
                        isSelected = true
                    }
                    
                
                    return (
                        <button key={`selectOption_${i}`} className="flex-row  border-bottom padding-10 "
                       
                        onClick={()=>{onSelect(obj)}}
                        >   
                            <div className="flex-row items-center btn gap-05" style={{padding:'0'}}>
                                {selectedOption !== '' &&
                                <div className="svg-12 flex-row items-center" style={{width:'15px',height:'15px'}}>
                                    {isSelected && 
                                        <CheckMarkIcon/>
                                    }
                                </div>
                                }
                                
                                { obj['icon'] && 
                                    <div className="flex-row items-center svg-18 padding-right-10" style={{width:'20px',height:'20px'}}>
                                        {obj.icon}
                                    </div>
                                }
                                
                                <span style={{textWrap:'nowrap'}}>{obj.displayName}</span>
                            </div>
                            
                        </button>
                    )
                })

            }
            
        </div>
     );
}
 
export default SelectPopupV2;