import {useRef} from 'react'

import BackSpaceIcon from '../assets/icons/BackSpaceIcon.svg?react'

export const CheckBox = ({itemObj,handleClick,inputValue=null,handleClose})=>{
    return (
        <div className={`no-select flex-column padding-10 gap-05 bg-containers border-blue items-center content-center btn ${inputValue && itemObj.displayName == inputValue? 'active-ck' : ''}`}
        style={{width:'100px'}}
        role="button"
        onClick={()=>{
            let buildDict = {}
            let property;
            if('majorProperty' in itemObj){
                buildDict[itemObj['majorProperty']] = {[itemObj.property]:itemObj.displayName}
                property = itemObj.property  + '.' + itemObj['majorProperty']
            }else{
                buildDict[itemObj.property] = itemObj.displayName
                property= itemObj.property
            }
            console.log(itemObj,'in check box')

            

            let next = itemObj.next ? itemObj.next : null
            
            const returnDict = {result:buildDict,next:next,property:property}

            if(itemObj.parts){
                returnDict['parts'] = itemObj.parts
            }

            handleClick(returnDict,handleClose)
        }}
        >
            {itemObj.icon}
            <span style={{textAlign:'center'}}>{itemObj.displayName}</span>
        </div>
    )
}

export const NumKeyBoard = ({itemObj,handleClick,inputValue=0,handleClose,label=''})=>{
    const numKeys = [1,2,3,4,5,6,7,8,9,'delete',0,'ok']
    
    const spanRef = useRef(null)


    const handleKeyPress =  (key) =>{
        const currentValue = spanRef.current.textContent 
        let newValue;
        if(currentValue == '0'){
            newValue = key
        }else{
            newValue = currentValue + key
        }
        
        spanRef.current.textContent = newValue
    }

    const handleKeyDelete = ()=>{
        const currentValue = spanRef.current.textContent
        let newValue = currentValue.slice(0,-1)
        
        if(!newValue){
            newValue = '0'
        }
        spanRef.current.textContent = newValue
        
    }
    const handleKeyOk = () =>{
        const currentValue = parseInt(spanRef.current.textContent,10)
        

        let buildDict = {}
        let property;
        if('majorProperty' in itemObj){
            buildDict[itemObj['majorProperty']] = {[itemObj.property]:currentValue}
            property = itemObj.property  + '.' + itemObj['majorProperty']
        }else{
            buildDict[itemObj.property] = currentValue
            property= itemObj.property
        }
        let next = itemObj.next ? itemObj.next : null
        
        handleClick({result:buildDict,next:next,property:property},handleClose)
        
    }

    return(
        <div className="flex-row items-center space-around width100">
            <div className="flex-column">
                <div className="flex-row content-center border-bottom border-bottom padding-10"
                style={{width:'90px',overflowX:'auto'}}
                >
                    <span className="text-25"
                    ref={spanRef}
                    >
                        {inputValue === null ? 0:inputValue }
                    </span>
                </div>
                {label !== '' && 
                    <div className="flex-row width100 content-center padding-top-10">
                        <span className="color-lower-titles">{label}</span>
                    </div>
                }
                
            </div>
            <div 
            style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)',gap:'18px',maxWidth:'200px'}}
            >
                {numKeys.map((key,i)=>{

                    if(key === 'delete'){
                        return(
                            <div role='button' key={`numKey_${i}`} className="btn svg-45"
                            style={{padding:'0'}}
                            onClick={()=>{handleKeyDelete()}}
                            >
                                <BackSpaceIcon />
                            </div>
                        )
                    }else if(key === 'ok'){
                        return(
                            <div role='button' key={`numKey_${i}`} className="btn bg-secondary"
                            style={{padding:'0',borderRadius:'50%'}}
                            onClick={()=>{handleKeyOk()}}
                            >
                                <span className="text-20 color-primary">Ok</span>
                            </div>
                        )
                    }else{
                        return (
                            <div role='button' className="bg-containers border-blue btn flex-column items-center content-center"
                            style={{width:'45px',height:'45px',borderRadius:'50%', padding:'0'}} 
                            key={`numKey_${i}`}
                            onClick={()=>{handleKeyPress(key)}}
                            >
                                <span className="text-20">{key}</span>
                            </div>
                        )
                    }
                    
                })}
            </div>
        </div>
    )
}


const boxMap = {
    'CheckBox': CheckBox,
    'NumKeyBoard':NumKeyBoard,
}

export const DynamicBoxesV2 = ({objectMap,uponCompletion,inputValue,handleClose})=>{
    
    let isObjectMap = true

    let cols = 3
    if(objectMap.length < 2){
        cols = 1
    }

    if(!Array.isArray(objectMap)){
        isObjectMap = false
        cols = 1
    }

    return (
        <div className="flex-column width100 padding-top-30 padding-bottom-30 padding-15" style={{minHeight:'400px'}}>
            <div className=" width100"
            style={{display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`,gap:'18px'}}
            >
                { isObjectMap ? 
                
                objectMap.map((itemObj,i)=>{
                const Component = boxMap[itemObj.component]
                

                return Component ? (
                    <Component key={i} itemObj={itemObj} handleClick={uponCompletion} inputValue={inputValue} handleClose={handleClose}/>
                ) : null
                })

                :
                <div className="flex-row items-center content-center">
                         <span className="text-15">{objectMap}</span>
                </div>
               
                
                }
            </div>
        </div>
    )

}