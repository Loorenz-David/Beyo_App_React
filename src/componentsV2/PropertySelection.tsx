import {useState,memo} from 'react'
import SecondaryPage from '../components/secondary-page.tsx'
import {DynamicBoxesV2} from './DynamicBoxesV2.tsx'


const PropertySelection = ({propName,propDisplay,propValue,handleItemProps,objectMap,inputValue=null,addedClassStyle='padding-15',zIndex=2}) => {
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
                        inputValue: inputValue ? inputValue : null
                    }}
                    handleClose={()=>setToggleDynamicBox('')}
                    zIndex={zIndex + 1}
                    pageId={`propertySelection-${propName.replace(' ','-')}`}
                    header={{order:0,display:`Select ${propName}`,class:'color-light-titles'}}
                />
            }
            
            <span className="color-lower-titles text-9" style={{textWrap:'nowrap'}}>{propDisplay}</span>
            <span style={{fontSize:'10px',textWrap:'nowrap'}}>{inputValue ? inputValue : propValue }</span>
        </button> 
    );
}
 
export default memo(PropertySelection);