
import {NumKeyBoard} from './DynamicBoxes.tsx'
import {useState,useEffect,useRef} from 'react'
import {useItemCreation} from '../contexts/ItemCreationContext.tsx'
import ArrowBold from '../assets/icons/ArrowBold.svg?react'

const dictKey = 'dimensions'

const CreationItemDimensions = ({handleClose}) => {

    const [toggleKeyBoard,setToggleKeyBoard] = useState('none')
    const {itemData,updateItemData} = useItemCreation()
    const loadedDimensions = useRef({height:0,width:0,depth:0})
    const [updatedDimensions, setUpdatedDimensions] = useState(false)
    const containerRef = useRef(null)
    const componentHasLoad = useRef(false)
    

    useEffect(()=>{

        if(dictKey in itemData){
           
            loadedDimensions.current = itemData[dictKey]
            setUpdatedDimensions(true)
            
        }

        

        const handleKeyBoard = (e)=>{
            const target = e.target
            
            if(target && target.classList.contains('component-selection')){
                const result = target.getAttribute('data-result')
                const attrName = target.getAttribute('data-reference').split('_')
                const property = attrName[2]
                if(result){
                    loadedDimensions.current = {...loadedDimensions.current, [property]:Number(result)}
                    
                }
                if(property == 'height'){
                    setToggleKeyBoard('width')
                }else if (property == 'width'){
                    setToggleKeyBoard('depth')
                }else {
                    handleClose()
                }
            }
        }

        const container = containerRef.current
        if(container && !componentHasLoad.current){
            container.addEventListener('click',handleKeyBoard)
            componentHasLoad.current = true
        }

        return () =>{
            container.removeEventListener('click',handleKeyBoard)
            console.log(loadedDimensions.current)
            updateItemData({[dictKey]:loadedDimensions.current})
        }

    },[])

   

    

    return ( 
        <div className="flex-column padding-top-20 padding-bottom-20" style={{minHeight:'400px'}}
        ref={containerRef}
        >
            <div className="flex-row border-bottom border-top padding-15"
                onClick={()=>{setToggleKeyBoard('height')}}
            >
                <div className="flex-column gap-05 ">
                    <span className="color-lower-titles">Height</span>
                   
                    
                    {toggleKeyBoard === 'height' ?
                            <div className="flex-row ">
                                <NumKeyBoard component={'dimensions'} index={'1'} property={'height'} inputValue={loadedDimensions.current.height}/>
                            </div>
                    :
                            <div className="flex-row gap-05 ">
                                <span className="text-15">{loadedDimensions.current['height']? loadedDimensions.current['height'] : 0}</span>
                                <span className="text-15">cm</span>
                                
                            </div>
                    }
                </div>
                
            </div>
            <div className="flex-row border-bottom border-top padding-15"
            onClick={()=>{setToggleKeyBoard('width')}}
            >
                <div className="flex-column gap-05">
                    <span className="color-lower-titles">Width</span>
                    {toggleKeyBoard === 'width' ?
                            <div className="flex-row ">
                                <NumKeyBoard component={'dimensions'} index={'1'} property={'width'} inputValue={loadedDimensions.current.width}/>
                            </div>
                    :
                            <div className="flex-row gap-05">
                                <span className="text-15">{loadedDimensions.current['width']? loadedDimensions.current['width'] : 0}</span>
                                <span className="text-15">cm</span>
                                
                            </div>
                    }
                    
                </div>
            </div>
            <div className="flex-row border-bottom border-top padding-15"
            onClick={()=>{setToggleKeyBoard('depth')}}
            >
                <div className="flex-column gap-05">
                    <span className="color-lower-titles">Depth</span>
                     {toggleKeyBoard === 'depth' ?
                            <div className="flex-row ">
                                <NumKeyBoard component={'dimensions'} index={'1'} property={'depth'} inputValue={loadedDimensions.current.depth}/>
                            </div>
                    :
                            <div className="flex-row gap-05">
                                <span className="text-15">{loadedDimensions.current['depth']? loadedDimensions.current['depth'] : 0}</span>
                                <span className="text-15">cm</span>
                                
                            </div>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default CreationItemDimensions;