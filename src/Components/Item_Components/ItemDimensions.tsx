import {NumKeyBoard} from './DynamicBoxesV2.tsx'
import {useState,memo,useRef,useEffect} from 'react'
import RulerIcon from '../../assets/icons/General_Icons/RulerIcon.svg?react'
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'



const optionsList = ['height','width','depth']

export const ItemDimensions = ({dimensionsDict, handleClose}) => {
    const [toggleNumKey,setToggleNumKey] = useState('')
    // const dimensionsDict = useRef(dimensions ? dimensions : {})

    const handleInputDimensions = (resultDict)=>{
        const property = resultDict.property
        const value = resultDict.result[property]
        
        
        if(value === 0 && property in dimensionsDict.current){
            delete dimensionsDict.current[property]
            
        }else{
            dimensionsDict.current[property] = value
        }

        
        if(toggleNumKey === 'height'){
            setToggleNumKey('width')
        }else if(toggleNumKey === 'width'){
            setToggleNumKey('depth')
        }else{
            handleClose()
        }
           
        
    }
    console.log(toggleNumKey,'in dimensions')
    
    return ( 
        <button className="flex-column padding-top-20 padding-bottom-20" style={{minHeight:'500px'}}>
            {optionsList.map((option,i)=>{

                return(
                        <div key={`dimensionsOptions_${i}`} className="flex-row padding-15 border-bottom">
                            {toggleNumKey == option ? 
                                <div className="flex-column width100">
                                    <NumKeyBoard 
                                        itemObj={{property: option}}
                                        inputValue={option in dimensionsDict.current? dimensionsDict.current[option] : 0}
                                        handleClick={handleInputDimensions}
                                        label={option}
                                    />
                                </div>
                               
                            :
                            <div className="flex-column width100 gap-1"
                            onClick={()=>{setToggleNumKey(option)}}
                            >
                                <span className="color-lower-titles">{option}</span>
                                <span>{ option in dimensionsDict.current? dimensionsDict.current[option] : 'select...'}</span>
                            </div>
                            }
                        </div>

                )
            })}
            
        </button>
     );
}

export const ItemDimensionsBtn = ({dimensions,setItemData}) => {
    const [toggleDimensionsPage, setToggleDimensionsPage] = useState(false)
    const dimensionsDict = useRef( dimensions ? {...dimensions}: {})
    
    const handleClose = ()=>{
       
        setItemData(prev => ({...prev, 'dimensions':Object.keys(dimensionsDict.current).length > 0 ? dimensionsDict.current : null }))
        setToggleDimensionsPage(false)
    }
    useEffect(()=>{
       if(dimensions){
            dimensionsDict.current = {...dimensions}
       }  
    },[dimensions])

    console.log()
    
    return (
        <div className="flex-row items-center content-center">
             {toggleDimensionsPage && 
                <SecondaryPage BodyComponent={ItemDimensions} 
                bodyProps={{
                    dimensionsDict,
                }}
                pageId={'itemDimensions'}
                handleClose={handleClose} 
                header={{order:0,display:'Dimensions',class:'color-light-titles'}}
                />
            }
            <button className="flex-column items-center content-center gap-05 btn " style={{padding:'0',position:'relative'}}
                onClick={()=>{setToggleDimensionsPage(true)}}
                
                >  
                <div className="flex-column items-center content-center  svg-25">
                    <RulerIcon />
                </div>
                {dimensions &&
                    Object.keys(dimensions).map((dimenKey,i)=>{
                        let top = '0'
                        let right = '0'
                        if(dimenKey == 'height'){
                            right = '85%'
                            top = '8px'
                        }else if(dimenKey == 'width'){
                            top = '65%'
                            right = '10px'
                            
                        } else if(dimenKey == 'depth'){
                            right = '-10px'
                            top = '-2px'
                            
                        }

                        return (
                            <div key={`dimensionInpu_${i}`} className="flex-row gap-05" style={{position:'absolute',top,right}}>
                                <span className="text-9"> {dimensions[dimenKey]}</span>
                                <span className="text-9">cm</span>
                            </div>
                        )
                    })
                
                }
                <span className="text-9" style={{visibility: dimensions && Object.keys(dimensions).length > 0 ? 'hidden' :  'visible'}}>Dimensions</span>
                
            </button>
        </div>
    )
}
 

export const MemorizedItemDimensionsBtn = memo(ItemDimensionsBtn)