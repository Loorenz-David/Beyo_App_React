
import {useRef,useState,useEffect } from 'react'

import {ItemEdit} from './ItemEdit.tsx'
import SecondaryPage from '../components/secondary-page.tsx'

import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'
import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import CheckMarkIcon from  '../assets/icons/CheckMarkIcon.svg?react'
import PictureIcon from  '../assets/icons/PictureIcon.svg?react'

import LoaderDots from '../components/LoaderDots.tsx'

import {useLongPressAction} from '../hooks/useLongPressActions.tsx'
import {readArticleNumber} from '../hooks/useReadableArticleNumber.tsx'


interface ItemVals{
    images:(string | {file:Blob})[] | null | undefined
    properties:Record<string,any>
    type:string
    article_number:string
}
interface propsItemPreview {
    itemObj:ItemVals 
    imgBlobs:string[]
    handlePressStart:(e:React.TouchEvent<HTMLDivElement>,item:ItemVals) =>void
    handlePressEnd?:(e:React.TouchEvent<HTMLElement>,item:ItemVals)=>void | null
    handleTouchMove?:(e:React.TouchEvent<HTMLElement>)=>void | null
    isSelected?:boolean
    containerHeight?:string

    
}
interface propsPreviewList{
    data: ItemVals[]
   
    setForceRenderParent: React.Dispatch<React.SetStateAction<boolean>>
    fetchWhenOpen:boolean
    setSelectionMode:React.Dispatch<React.SetStateAction<boolean>>
    selectionMode: boolean
    selectedItems:any
    setSelectedItems:any
    containerHeight?:string
    handleDelitionItems:()=>void |null
}





export  const ItemPreviewContainer: React.FC<propsItemPreview> = ({itemObj,imgBlobs,handlePressStart,handlePressEnd=null,handleTouchMove,isSelected=false,containerHeight='90px'}) => {
    
    let firstImg:string | null = null 
    if(itemObj.images && itemObj.images.length > 0 ){
        const targetImg = itemObj.images[0]
        
        if(typeof targetImg !== 'string'){
            const tempBlob:string = URL.createObjectURL(targetImg.file)
            imgBlobs.push(tempBlob)
            firstImg = tempBlob
        }else{
            firstImg = targetImg
        }


    }

    let offlineDealer = false

    if(itemObj.dealer && itemObj.dealer.dealer_name == 'Offline Dealer'){
        offlineDealer = true
    }
    
    return ( 
        <div observing-obj-for-selection = {itemObj.article_number}
            className="flex-row padding-20 items-center gap-2 border-bottom no-select"
            style={{minHeight:containerHeight,maxHeight:containerHeight}}
            onContextMenu={(e)=>{e.preventDefault()}}
            onTouchStart={(e)=>{handlePressStart && handlePressStart(e,itemObj)}}
            onTouchEnd={(e)=>{handlePressEnd && handlePressEnd(e,itemObj)}}
            onTouchMove={(e)=>{handleTouchMove && handleTouchMove(e)}}
           
            
        >
            
            <div className="flex-column height100 items-center content-center"
                style={{position:'relative'}}
            >
                <div className={` selectedItem flex-row items-center content-center ${isSelected ? '' : 'hidden'}` }style={{
                    position:'absolute',backgroundColor:'rgba(142, 138, 253, 0.48)',
                    width:'45px',height:'45px'
                    }}>
                    <div className="svg-25">
                        <CheckMarkIcon/>
                    </div>
                </div>
                {firstImg ? 
                    <img src={firstImg}   style={{width:'45px', height:'45px',objectFit:'cover'}} />
                :
                    <div className="flex-column svg-45 items-center content-center" style={{opacity:'0.4'}}>
                        <PictureIcon/>
                    </div>
                }
                
            </div>
            <div className="flex-column height100 content-center"
                
            >
                <div className="flex-row gap-2 ">
                    <span>{itemObj.type}</span>
                    <span className="countSpace">{readArticleNumber(itemObj.article_number)}</span>
                    
                </div>
                <div className="flex-row gap-2 width100" style={{paddingTop:'5px' ,overflow:'hidden'}}>
                    {itemObj['properties']? 
                    Object.keys(itemObj['properties']).map((key,j)=>{
                        return (
                            <div key={`property_${j}`} className="flex-column gap-05">
                                <span className="color-lower-titles text-9">{key}</span>
                                <span className="text-9">{itemObj['properties'][key]}</span>
                            </div>
                        )
                    
                    })
                    :
                    <div className="color-lower-titles ">
                        No properties
                    </div>
                    }
                </div>
            </div>
            <div className="flex-column push-right gap-1 items-center content-start height100">
                

                {offlineDealer && 
                    <div className="flex-row  offline-item" style={{maxWidth:'50px'}}>
                        <span className="text-9" style={{textAlign:'center'}}>Offline Dealer</span>
                    </div>
                }

                {'fetchType' in itemObj &&
                    <div className="flex-row bg-containers  padding-05" style={{borderRadius:'5px'}}>
                        <span className="">{itemObj.fetchType}</span>
                    </div>
                }
                
            </div>
        </div>
     );
}




export const ItemsPreviewList:React.FC<propsPreviewList> = ({data,handleDelitionItems,selectionMode,setSelectionMode,selectedItems={},setSelectedItems=null,setForceRenderParent,fetchWhenOpen,selectionTargetKey,handleScroll,loaders={},containerHeight,zIndex=2,holdScrollElement=null}) => {
    const[openItem,setOpenItem] = useState(false)
    const imgBlobs = useRef([])
   


    const handleActionWhenPress = (targetElement,selectedObj)=>{
        const checkMark = targetElement.querySelector('.selectedItem')
        checkMark.classList.toggle('hidden')

        const targetId = selectedObj[selectionTargetKey]
        console.log(targetElement)
        if(targetId in selectedItems){
            setSelectedItems(prev =>{
            const {[targetId]:_, ...current} = prev

            return current
        })
        }else{
            setSelectedItems(prev =>({...prev,[targetId]:selectedObj}))
        }

    }
    const handleDefaultActionWhenClick = ()=>{
        setOpenItem(true)
    }
    const {handlePressStart,handlePressEnd,handleTouchMove,currentSelectedObj} = useLongPressAction({selectionMode,setSelectionMode,handleActionWhenPress,handleDefaultActionWhenClick})
   

    useEffect(()=>{

        return ()=>{
            if(imgBlobs.current.length > 0){
                imgBlobs.current.forEach(url => URL.revokeObjectURL(url))
            }
        }
    },[])
   
    return (
        <div className={`flex-column  width100`} style={{overflowY:'auto', height:'100dvh',paddingBottom:'200px'}}
           ref={holdScrollElement}
        >
            {openItem && 
                <SecondaryPage BodyComponent={ItemEdit}
                    bodyProps={{preRenderInfo:currentSelectedObj.current ?? {},
                                handleDelitionItems,
                                setForceRenderParent,
                                fetchWhenOpen
                            }} 
                    handleClose={()=>{setOpenItem(false)}} 
                    zIndex={zIndex} 
                    pageId={'ItemEditPage'}
                    interactiveBtn ={{iconClass:'svg-15 padding-05 position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
                    header={{'display': currentSelectedObj.current ? readArticleNumber(currentSelectedObj.current.article_number) : '', class:'flex-1 content-center text-15',order:2}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}
                   
                    />
            }
            <div className="flex-column width100 items-center " style={{minHeight:'50px'}}>
                {loaders.ScrollUp_Loading && 
                <div className="flex-row content-center gap-2">
                    <span className="text-15 ">Loading items</span>    <LoaderDots />
                </div>
                    
                }
                
            </div>

            {data.map((itemObj,i)=>{
                let isSelected = false
                if(itemObj[selectionTargetKey] in selectedItems){
                    isSelected = true
                } 
                return (
                    <ItemPreviewContainer key={`itemPreviewCloud_${i}`} 
                        itemObj={itemObj}
                        handlePressStart = {handlePressStart}
                        handlePressEnd = {handlePressEnd}
                        handleTouchMove = {handleTouchMove}
                        imgBlobs={imgBlobs.current}
                        isSelected ={isSelected}
                        containerHeight = {containerHeight}
                    />
                )
            })}

            {loaders.ScrollDown_Loading || loaders.loading ? 
                <div className="flex-row width100 content-center items-center gap-2 padding-20">
                    <span className="text-15 ">Loading items</span>    <LoaderDots />
                </div>
            :
            <></>
            }
        </div>
    )
}