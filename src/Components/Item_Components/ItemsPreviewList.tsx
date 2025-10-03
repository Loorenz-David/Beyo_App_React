
import {useRef,useEffect ,useState} from 'react'

import {useSlidePage} from '../../contexts/SlidePageContext.tsx'
import {useSetNextPage} from '../../contexts/SlidePageContext.tsx'

import {ItemEdit} from './ItemEdit.tsx'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'

import CheckMarkIcon from  '../../assets/icons/General_Icons/CheckMarkIcon.svg?react'
import PictureIcon from  '../../assets/icons/General_Icons/PictureIcon.svg?react'


import {useLongPressAction} from '../../hooks/useLongPressActions.tsx'
import {readArticleNumber} from '../../hooks/useReadableArticleNumber.tsx'

import type {ItemDict} from '../../types/ItemDict.ts'

interface propsItemPreview {
    itemObj:ItemDict
    imgBlobs:string[]
    handlePressStart:(e:React.TouchEvent<HTMLDivElement>,item:ItemDict) =>void
    handlePressEnd?:((e:React.TouchEvent<HTMLElement>,item:ItemDict)=>void) | null
    handleTouchMove?:(e:React.TouchEvent<HTMLElement>)=>void | null
    isSelected?:boolean
    containerHeight?:string

    
}
interface propsPreviewList{
    data: ItemDict[]
    setForceRenderParent: React.Dispatch<React.SetStateAction<boolean>>
    fetchWhenOpen:boolean
    setSelectionMode:React.Dispatch<React.SetStateAction<boolean>>
    selectionMode: boolean
    selectedItems:any
    setSelectedItems:any
    containerHeight?:string
    handleDelitionItems:(art:string[])=>void 
    selectionTargetKey:keyof ItemDict
    handleScroll:(e:React.TouchEvent<HTMLDivElement>)=>void
    loaders?:{[key:string]:boolean}
    zIndex?:number
    holdScrollElement?: React.RefObject<HTMLDivElement>
    useChildPageSetter?:React.Dispatch<React.SetStateAction<React.ReactNode>> | null
}





export  const ItemPreviewContainer = ({itemObj,
    imgBlobs,
    handlePressStart,
    handlePressEnd=null,
    handleTouchMove,
    isSelected=false,
    containerHeight='90px'
}:propsItemPreview ) => {
    
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
            className="flex-row  items-center gap-2 border-bottom no-select"
            style={{minHeight:containerHeight,maxHeight:containerHeight, padding:'5px 20px'}}
            onContextMenu={(e)=>{e.preventDefault()}}
            onTouchStart={(e)=>{handlePressStart && handlePressStart(e,itemObj)}}
            onTouchEnd={(e)=>{handlePressEnd && handlePressEnd(e,itemObj)}}
            onTouchMove={(e)=>{handleTouchMove && handleTouchMove(e)}}
           
            
        >
            
            <div className="flex-column height100 items-center content-center"
                style={{position:'relative',borderRadius:'10px',overflow:'hidden',width:'50px',height:'50px'}}
            >
                <div className={` selectedItem flex-row width100 height100 items-center content-center ${isSelected ? '' : 'hidden'}` }style={{
                    position:'absolute',backgroundColor:'rgba(103, 98, 248, 0.54)',
                    
                    }}>
                    <div className="svg-25">
                        <CheckMarkIcon/>
                    </div>
                </div>
                {firstImg ? 
                    <img src={firstImg}  className="width100 height100" style={{objectFit:'cover'}} />
                :
                    <div className="flex-column svg-45 items-center content-center" style={{opacity:'0.4'}}>
                        <PictureIcon/>
                    </div>
                }
                
            </div>
            <div className="flex-column height100 gap-05 content-center"
                
            >
                <div className="flex-column gap-05 ">
                    <span className="text-15 color-light-titles">{itemObj.type}</span>
                    <span className="countSpace " style={{fontSize:'13px'}}>{readArticleNumber(itemObj.article_number)}</span>
                    
                </div>
                {/* <div className="flex-row gap-2 width100" style={{paddingTop:'5px' ,overflow:'hidden'}}>
                    {itemObj['properties']? 
                        Object.keys(itemObj['properties']).slice(0,2).map((key,j)=>{
                            return (
                                <div key={`property_${j}`} className="flex-column gap-05">
                                    <span className="color-lower-titles text-9" 
                                        style={{textWrap:'nowrap'}}
                                    >
                                        {key}
                                    </span>
                                    <span className="text-9"
                                        style={{textWrap:'nowrap'}}
                                    >
                                        {itemObj['properties'][key]}
                                    </span>
                                </div>
                            )
                        
                        })
                    :
                    <div className="color-lower-titles ">
                        No properties
                    </div>
                    }
                </div> */}
            </div>
            <div className="flex-row push-right gap-2 items-center content-start height100">
                

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




export const ItemsPreviewList= ({
    data,
    handleDelitionItems,
    selectionMode,
    setSelectionMode,
    selectedItems={},
    setSelectedItems=null,
    setForceRenderParent,
    fetchWhenOpen,
    selectionTargetKey,
    handleScroll,
    loaders={},
    containerHeight,
    useChildPageSetter=null
}:propsPreviewList) => {
            
        
        const imgBlobs = useRef([])
        const {setNextPage} = useSetNextPage()
        const {slidePageTo} = useSlidePage()
        

        const handleActionWhenPress = (targetElement,selectedObj)=>{
            const checkMark = targetElement.querySelector('.selectedItem')
            checkMark.classList.toggle('hidden')

            const targetId = selectedObj[selectionTargetKey]
          
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

            console.log(currentSelectedObj.current ,' the object that was selected')
            
            slidePageTo({addNumber:1})

            if(useChildPageSetter){
                useChildPageSetter(
                    <ItemEdit
                    preRenderInfo={currentSelectedObj.current ?? {}}
                    handleDelitionItems = {handleDelitionItems}
                    setForceRenderParent = {setForceRenderParent}
                    fetchWhenOpen = {fetchWhenOpen}
                />
                )
            }else{
                setNextPage(
                    <ItemEdit
                        preRenderInfo={currentSelectedObj.current ?? {}}
                        handleDelitionItems = {handleDelitionItems}
                        setForceRenderParent = {setForceRenderParent}
                        fetchWhenOpen = {fetchWhenOpen}
                    />
                )
            }
            
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
        <div className={`flex-column  width100`} style={{overflowY:'auto',paddingBottom:'200px'}}
           onScroll={handleScroll}
        >   
           
            <div className="flex-column width100 content-end" style={{minHeight:'50px'}}>
                {(loaders.ScrollUp_Loading || loaders.loading)  &&
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

            {loaders.ScrollDown_Loading  &&
                <div className="flex-row width100 content-center items-center gap-2 padding-20">
                    <span className="text-15 ">Loading items</span>    <LoaderDots />
                </div>
            }
        </div>
    )
}


// export const ItemsPreviewList= ({
//     data,
//     handleDelitionItems,
//     selectionMode,
//     setSelectionMode,
//     selectedItems={},
//     setSelectedItems=null,
//     setForceRenderParent,
//     fetchWhenOpen,
//     selectionTargetKey,
//     handleScroll,
//     loaders={},
//     containerHeight,
//     zIndex=2,
//     holdScrollElement=null 
// }:propsPreviewList) => {
            
//         const[openItem,setOpenItem] = useState(false)
//         const imgBlobs = useRef([])
    


//         const handleActionWhenPress = (targetElement,selectedObj)=>{
//             const checkMark = targetElement.querySelector('.selectedItem')
//             checkMark.classList.toggle('hidden')

//             const targetId = selectedObj[selectionTargetKey]
//             console.log(targetElement)
//             if(targetId in selectedItems){
//                 setSelectedItems(prev =>{
//                 const {[targetId]:_, ...current} = prev

//                 return current
//             })
//             }else{
//                 setSelectedItems(prev =>({...prev,[targetId]:selectedObj}))
//             }

//         }
//         const handleDefaultActionWhenClick = ()=>{
//             setOpenItem(true)
//         }
//         const {handlePressStart,handlePressEnd,handleTouchMove,currentSelectedObj} = useLongPressAction({selectionMode,setSelectionMode,handleActionWhenPress,handleDefaultActionWhenClick})
    

//         useEffect(()=>{

//             return ()=>{
//                 if(imgBlobs.current.length > 0){
//                     imgBlobs.current.forEach(url => URL.revokeObjectURL(url))
//                 }
//             }
//         },[])
   
//     return (
//         <div className={`flex-column  width100`} style={{overflowY:'auto', height:'100dvh',paddingBottom:'200px'}}
//            ref={holdScrollElement}
//            onScroll={handleScroll}
//         >
//             {openItem && 
//                 <SecondaryPage BodyComponent={ItemEdit}
//                     bodyProps={{preRenderInfo:currentSelectedObj.current ?? {},
//                                 handleDelitionItems,
//                                 setForceRenderParent,
//                                 fetchWhenOpen
//                             }} 
//                     handleClose={()=>{setOpenItem(false)}} 
//                     zIndex={zIndex} 
//                     pageId={'ItemEditPage'}
//                     interactiveBtn ={{iconClass:'svg-15 padding-05 position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
//                     header={{'display': currentSelectedObj.current ? readArticleNumber(currentSelectedObj.current.article_number) : '', class:'flex-1 content-center text-15',order:2}}
//                     closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
//                     startAnimation={'slideLeft'}
//                     endAnimation ={'slideRight'}
                   
//                     />
//             }
//             <div className="flex-column width100 content-end" style={{minHeight:'50px'}}>
//                 {loaders.ScrollUp_Loading && 
//                 <div className="flex-row content-center gap-2">
//                     <span className="text-15 ">Loading items</span>    <LoaderDots />
//                 </div>
                    
//                 } 
                
//             </div>

//             {data.map((itemObj,i)=>{
//                 let isSelected = false
//                 if(itemObj[selectionTargetKey] in selectedItems){
//                     isSelected = true
//                 } 
//                 return (
//                     <ItemPreviewContainer key={`itemPreviewCloud_${i}`} 
//                         itemObj={itemObj}
//                         handlePressStart = {handlePressStart}
//                         handlePressEnd = {handlePressEnd}
//                         handleTouchMove = {handleTouchMove}
//                         imgBlobs={imgBlobs.current}
//                         isSelected ={isSelected}
//                         containerHeight = {containerHeight}
//                     />
//                 )
//             })}

//             {loaders.ScrollDown_Loading || loaders.loading ? 
//                 <div className="flex-row width100 content-center items-center gap-2 padding-20">
//                     <span className="text-15 ">Loading items</span>    <LoaderDots />
//                 </div>
//             :
//             <></>
//             }
//         </div>
//     )
// }