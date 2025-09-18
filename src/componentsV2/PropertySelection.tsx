import {useState,memo} from 'react'
import SecondaryPage from '../components/secondary-page.tsx'
import {DynamicBoxesV2} from './DynamicBoxesV2.tsx'


const PropertySelection = ({propName,propDisplay,propValue,handleItemProps,objectMap,inputValue=null,addedClassStyle='padding-15',zIndex=2}) => {
    const [toggleDynamicBox,setToggleDynamicBox] = useState('')

    return ( 
        <div role="button" className={`flex-column gap-05 ${addedClassStyle}`}
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
                />
            }
            
            <span className="color-lower-titles text-9">{propDisplay}</span>
            <span>{inputValue ? inputValue : propValue }</span>
        </div> 
    );
}
 
export default memo(PropertySelection);