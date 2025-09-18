import {useState }from 'react'

import ArrowBold from '../assets/icons/ArrowBold.svg?react'


const SelectionModeComponent = ({props}) => {
    const{
        setSelectionMode,
        selectedItemsLength,
        setSelectedItems,
        componentsListPreview,
        componentOptionsToSelect,

    }  = props

    const [toggleSelectedItemList,setToggleSelectedItemList] = useState(false)


   
    return ( 
        <div className="flex-column width100">
                <div className="flex-column width100 gap-2 padding-top-20   border-bottom ">
                    <div className="flex-row gap-2 padding-left-10 padding-right-10 ">
                        <div className="flex-row gap-1 items-center">
                            <span className="color-lower-titles text-15">Selected:</span>
                            <span className="text-15">{selectedItemsLength}</span>
                        </div>

                        <div className="flex-column content-center btn"
                            onClick={(e)=>{setToggleSelectedItemList(prev => !prev); e.currentTarget.querySelector('.svg-20').classList.toggle('openArrow') }}
                        >
                            <div className="svg-20 " style={{transform:'rotate(-90deg)',transition:'transform 0.3s ease'}}>
                                <ArrowBold/>
                            </div>
                        </div>
                        <div className="flex-row push-right gap-1">
                            {componentOptionsToSelect}
                            <div className="flex-row item-center   padding-10"
                                onClick={()=>{setSelectionMode(false);setSelectedItems({});setToggleSelectedItemList(false)}}
                            >
                                <div className=" flex-row content-center items-center  plus-btn " style={{width:'15px',height:'15px',transform:'rotate(45deg)'}}>
                                    <div className="plus-vertical bg-secondary"></div>
                                    <div className="plus-horizontal bg-secondary"></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex-column width100" style={{backgroundColor:'rgba(115, 115, 115, 0.26)'}}>
                        {toggleSelectedItemList && 
                            componentsListPreview
                        }
                    </div>
                    
                </div>
            
        </div>
     );

}
 
export default SelectionModeComponent;{}