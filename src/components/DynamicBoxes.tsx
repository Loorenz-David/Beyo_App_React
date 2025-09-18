
import {useState,useEffect,useRef} from 'react'
import '../css/selection-box.css'
import '../css/key-boards.css'

import BackSpaceIcon from '../assets/icons/BackSpaceIcon.svg?react'

const CheckBox = ({index,name,icon,component,property})=>{
    return(
         <div className=" btn flex-column gap-05 items-center content-center border-blue selection-box component-selection "
        data-reference={`${component}_${index}_${property}`}
        >
            <div className="svg-20">
                {icon}
            </div>
            <span className="text-10">{name}</span>
        </div>
    )
}

export const NumKeyBoard = ({component,index,property,inputValue=0}) =>{
    const keyBoardRef = useRef(null)
    const resultRef = useRef(null)
    const btnOkRef = useRef(null)
    
    useEffect(()=>{
        
        const handleKeyBoardClick = (e) =>{
            const resultContainer = resultRef.current
            const btnOk = btnOkRef.current
            const target = e.target.closest('[data-key]')
            if(target){
                const value = target.getAttribute('data-key')
                const currentValue = resultContainer.textContent
                if(value == 'backSpace'){
                    if(!currentValue || currentValue =='0'){
                        return
                    }
                    let newVal = currentValue.slice(0,-1)
                    if(!newVal){
                        newVal = '0'
                    }

                    resultContainer.textContent = newVal
                    btnOk.setAttribute('data-result',newVal)
                    return
                }
                if(!currentValue || currentValue == '0'){
                    resultContainer.textContent = value
                }else{
                    resultContainer.textContent = currentValue + value
                }
                btnOk.setAttribute('data-result',resultContainer.textContent)
                
            }
            
        }

        const keyBoard = keyBoardRef.current
        if(keyBoard){
            keyBoard.addEventListener('click',handleKeyBoardClick)
        }

        return () =>{
            keyBoard.removeEventListener('click',handleKeyBoardClick)
        }
    },[])

    return(
        
        <div className="flex-row gap-2  space-around width100 padding-20" style={{flexWrap:'wrap'}}
        ref={keyBoardRef}
        >
            <div className="flex-column  items-center content-center">
                <div className="flex-row bold-600  border-bottom  text-45 result-container"
                ref={resultRef}
                >
                    {inputValue}
                </div>
            </div>
            <div className="numerical-keyboard">
                <div className="flex-row gap-2">
                    <button data-key="1" className=" btn num-key border-blue bg-containers">
                        1
                    </button>
                    <button data-key="2" className=" btn num-key border-blue bg-containers">
                        2
                    </button>
                    <button data-key="3" className=" btn num-key border-blue bg-containers">
                        3
                    </button>
                </div>
                <div className="flex-row gap-2">
                    <button data-key="4" className=" btn num-key border-blue bg-containers">
                        4
                    </button>
                    <button data-key="5" className=" btn num-key border-blue bg-containers">
                        5
                    </button>
                    <button data-key="6" className=" btn num-key border-blue bg-containers">
                        6
                    </button>
                </div>
                <div className="flex-row gap-2">
                    <button data-key="7" className=" btn num-key border-blue bg-containers">
                        7
                    </button>
                    <button data-key="8" className=" btn num-key border-blue bg-containers">
                        8
                    </button>
                    <button data-key="9" className=" btn num-key border-blue bg-containers">
                        9
                    </button>
                </div>
                <div className="flex-row gap-2">
                    <button data-key="backSpace" className="btn num-key svg-45" style={{borderRadius:'10px'}}>
                        <BackSpaceIcon />
                    </button>
                    <button data-key="0" className="btn num-key border-blue bg-containers">
                        0
                    </button>
                    <button  className="btn num-key bg-secondary color-primary component-selection" style={{borderRadius:'10px'}}
                    data-reference={`${component}_${index}_${property}`}
                    ref={btnOkRef}
                    data-result={inputValue}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
        
          
    )
}

const componentsMap ={CheckBox,NumKeyBoard}


const LoadContent = ({listOfValues,updateCurrentList,isItemComplete,storeResultsRef,breadCrumbsRef,map,handBreak,keyForNextDict}) =>{

    const handleSelection = (e) =>{
        let target = e.target.closest('.component-selection')
        if(target){
            
            let componentKey = target.getAttribute('data-reference').split('_')
            const componentName = componentKey[0]
            const index = componentKey[1]
            const property = componentKey[2]
            const targetDict = listOfValues[index]
            const breadCrumbDict = {'property':property,'backref':[]}

            if(componentName == 'CheckBox'){
                storeResultsRef.current[targetDict.property] = targetDict.name
                
               
            }
            else if(componentName == 'NumKeyBoard'){
                const typeValue = Number(target.getAttribute('data-result'))
                storeResultsRef.current[targetDict.property] = typeValue
            }

            if('backref' in targetDict){
                
               storeResultsRef.current['backref'] = targetDict['backref']
               breadCrumbDict['backref'].push(...Object.keys(targetDict['backref']))
            }
            
            if(!('next' in targetDict)){isItemComplete(true)}
            else if(property === handBreak){
                isItemComplete(true);
                keyForNextDict.current = targetDict.next ? targetDict.next : ''
            }
            else{
                const nextDict = targetDict.next
                
                breadCrumbDict['key'] = nextDict
                
                breadCrumbsRef.current.push(breadCrumbDict)
                updateCurrentList(map[nextDict])
                
                
            }

        } //end if target
    }
   
    return(
        <div  className="flex-row gap-2 padding-20 content-center" style={{flexWrap:'wrap'}}
        onClick={(e)=>{handleSelection(e)}}
        >
                {listOfValues.map((obj,index) =>{
                    const ComponentToRender = componentsMap[obj.component]
                    return <ComponentToRender 
                                key={`${obj.component}_${index}`} 
                                {...obj}
                                index={index}
                                
                                />
                    
                })}
        </div>
    )
}



export const DynamicBoxes = ({handleClose,interactiveRef,map,initialLocationMap=null,uponCompletion=null,handBreak=''}) => {
    
    const [currentList,setCurrentList] = useState(initialLocationMap ? map[initialLocationMap.key] : map)
    const [isSelectionComplete,setIsSelectionComplete] = useState(false)
    const keyForNextDict = useRef('')
    
    const breadCrumbsRef= useRef([initialLocationMap && {'key':initialLocationMap.key,'property':initialLocationMap.property,'backref':[]}  ])
    const resultDictRef = useRef({})
    const interactiveAttachedRef = useRef(false)
    
    
   

    useEffect(()=>{
        let interactiveBtn;
        if(interactiveRef.current){
            interactiveBtn = interactiveRef.current
        }
        
        
        const handleBreadCrumbs = ()=>{

            let currentCrumbs = breadCrumbsRef.current
            
            if(currentCrumbs.length <= 1) return;
            const removeCrumb = currentCrumbs.pop()
            
            delete resultDictRef.current[removeCrumb.property]

            if('backref' in resultDictRef.current){
                removeCrumb.backref.forEach(key =>{
                    delete resultDictRef.current['backref'][key]
                })
                if(Object.keys(resultDictRef.current['backref']).length == 0){
                    delete resultDictRef.current['backref']
                }
            }
          
            breadCrumbsRef.current = currentCrumbs
            const lastKey = currentCrumbs[currentCrumbs.length - 1]
            
            setCurrentList(map[lastKey['key']])

        }
        
        if(isSelectionComplete){
            
            if(uponCompletion){
                
                uponCompletion(resultDictRef.current,keyForNextDict.current)
            }
            
            
            
            handleClose()
        }
        
        if(interactiveAttachedRef.current === false && interactiveRef.current){
            console.log(interactiveRef,'interactive btn..')
            interactiveBtn.addEventListener('click',handleBreadCrumbs)
            interactiveAttachedRef.current = true
            
            
        }
        
        return () =>{
            if(interactiveRef.current){
                interactiveBtn.removeEventListener('click',handleBreadCrumbs)
            }
            
        }
    },[isSelectionComplete])

    
    
    
    return ( 
        <div className="felx-column width100 " style={{minHeight:'400px'}}>

            {!isSelectionComplete && 
                <LoadContent
                listOfValues={currentList} 
                updateCurrentList={setCurrentList} 
                isItemComplete={setIsSelectionComplete} 
                storeResultsRef = {resultDictRef}
                breadCrumbsRef = {breadCrumbsRef}
                map = {map}
                handBreak={handBreak}
                keyForNextDict={keyForNextDict}
                />
            }
            

        </div>
     );
}
 
