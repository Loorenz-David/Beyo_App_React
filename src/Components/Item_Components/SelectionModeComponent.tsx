import {useState,useRef }from 'react'

import ArrowBold from '../../assets/icons/General_Icons/ArrowBold.svg?react'
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'


const PreviewSelectedItems = ({props,holdScrollElement})=>{
    const {componentsListPreview} = props


    return(
        <div className=" flex-column padding-top-20 height100dvh" style={{overflowY:'auto'}}
            ref={holdScrollElement}
        >

            {componentsListPreview}
        </div>
    )
}

const SelectionModeComponent = ({props,zIndex=1}) => {
    const{
        setSelectionMode,
        selectedItemsLength,
        setSelectedItems,
        componentsListPreview,
        componentOptionsToSelect,

    }  = props

    const [toggleSelectedItemList,setToggleSelectedItemList] = useState(false)
    const toggleArrow = useRef<HTMLDivElement | null>(null)

   
    return ( 
      
            
            
            <div className="flex-column width100 bg-primary" style={{zIndex:zIndex}}>
                     {toggleSelectedItemList &&
                        <SecondaryPage BodyComponent={PreviewSelectedItems}
                            bodyProps={{props:{
                                componentsListPreview
                            }}}
                            pageId={'previewSelectedItems'}
                            header={{'class':'flex-1','order':0,'display':`Selecting     ${componentsListPreview.length}`}}
                            zIndex={zIndex + 1}
                            handleClose={()=>{setToggleSelectedItemList(false)}}
                            addClickOutside={false}

                        
                        />
                    }
                    <div className="flex-column width100 gap-2 padding-top-20   border-bottom ">
                        <div className="flex-row gap-2 padding-left-10 padding-right-10 ">
                            <div className="flex-row gap-1 items-center no-select">
                                <span className="color-lower-titles text-15">Selected:</span>
                                <span className="text-15">{selectedItemsLength}</span>
                            </div>
                            <div className="flex-column content-center btn"
                                onClick={(e)=>{setToggleSelectedItemList(true)}}
                            >
                                <div className="svg-20 " style={{transform:'rotate(-90deg)',transition:'transform 0.3s ease'}}
                                    ref={toggleArrow}
                                >
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
                        
                    </div>
            </div>
       
     );

}
 
export default SelectionModeComponent;{}