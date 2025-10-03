import {useState,memo} from 'react'
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'
import {DynamicBoxesV2} from './DynamicBoxesV2.tsx'
import {useData} from '../../contexts/DataContext.tsx'

interface PropertySelectionProps {
    inputValue:string | number
    propName:string
    propDisplay: string
    propValue:string
    handleItemProps:(returnDict:object,handleClose:()=>void)=>void
    objectMap: object[] | string
    addedClassStyle?:string
}

const PropertySelection = ({
    inputValue,
    propName,
    propDisplay,
    propValue,
    handleItemProps,
    objectMap,
    addedClassStyle='padding-15'
}:PropertySelectionProps) => {

    const [toggleDynamicBox,setToggleDynamicBox] = useState('')
   
    return ( 
        <button className={`flex-column no-select gap-05 ${addedClassStyle}`}
        id={propName}
        onClick={()=>{setToggleDynamicBox(propName)}}
        >   
            {toggleDynamicBox && 
                <SecondaryPage 
                    BodyComponent={DynamicBoxesV2} 
                    bodyProps ={{
                        objectMap: objectMap,
                        uponCompletion:handleItemProps,
                        inputValue:inputValue
                    }}
                    handleClose={()=>setToggleDynamicBox('')}
                   
                    pageId={`propertySelection-${propName.replace(' ','-')}`}
                    header={{order:0,display:`Select ${propName}`,class:'color-light-titles'}}
                />
            }
            
            <span className="color-lower-titles text-9" style={{textWrap:'nowrap'}}>{propDisplay}</span>
            <span style={{fontSize:'10px',textWrap:'nowrap'}}>
                {inputValue ?? propValue}
            </span>
        </button> 
    );
}
 
export default memo(PropertySelection);