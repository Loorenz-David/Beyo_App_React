import {useState,useEffect,useContext,useRef} from 'react'

import {ServerMessageContext} from '../../contexts/ServerMessageContext.tsx'
import {DataContext} from '../../contexts/DataContext.tsx'
import {useSlidePage} from  '../../contexts/SlidePageContext.tsx'

import ArrowIcon from '../../assets/icons/General_Icons/ArrowIcon.svg?react'
import ThreeDotMenu from '../../assets/icons/General_Icons/ThreeDotMenu.svg?react'
import CheckBoxIcon from '../../assets/icons/General_Icons/CheckBoxIcon.svg?react'


import {ItemsPreviewList,ItemPreviewContainer} from './ItemsPreviewList.tsx'
import {ItemEdit} from './ItemEdit.tsx'
import SelectionModeComponent from './SelectionModeComponent.tsx'
import BatchPrintBtn from './BatchPrintBtn.tsx'
import BatchEditBtn from './BatchEditBtn.tsx'
import {HeaderSlidePage} from '../Navigation_Components/HeaderSlidePage.tsx'


import SecondaryPage from '../Page_Components/SecondaryPage.tsx'
import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'





import {getFailedItems,clearFailedItem} from '../../hooks/useIndexDB.tsx'
import {useSaveItemsV2} from '../../hooks/useSaveItemsV2.tsx'
import {useLongPressAction} from '../../hooks/useLongPressActions.tsx'




const SelectAllBtn = ({props})=>{
    const {dataList,setSelectedItems,key} = props
    const selectingAll = useRef(false)

    const handleSelectAll = ()=>{
        if(selectingAll.current){
            setSelectedItems({})
            selectingAll.current = false
        }else{
             setSelectedItems(prev =>{
                const newDict = {}
                dataList.forEach(itemObj=>{
                    newDict[itemObj[key]] = itemObj
                })
                return newDict
            })
            selectingAll.current = true
        }
       
    }

    return(
        <div className="flex-column btn svg-18"
            onClick={()=>{handleSelectAll()}}
        >
            <CheckBoxIcon/>
        </div>
    )
}

interface OfflineItemProps {
    forceRenderMain:React.Dispatch<React.SetStateAction<boolean>>
}
const OfflineItemsPage = ({
    forceRenderMain
}:OfflineItemProps) => {
    
    const {showMessage} = useContext(ServerMessageContext)
    const [items,setItems] = useState([])
    const [forceRenderParent,setForceRenderParent] = useState(false)
    const {uploadItem} = useSaveItemsV2()
    const [selectionMode,setSelectionMode] = useState(false)
    const [selectedItems,setSelectedItems] = useState({})
    const [progressIndex,setProgressIndex] = useState('0%')
    const [uploadingItem,setUploadingItem] = useState(false)
    const timeoutRef = useRef(null)
    const [toggleBatchEdit,setToggleBatchEdit] = useState(false)
    const imgBlobs = useRef([])
    const {handlePressStart,handlePressEnd,handleTouchMove} = useLongPressAction({
            selectionMode:true,
            skipFirstClick:false,
            handleActionWhenPress:(e,itemObj)=>{
                const objKey:string = itemObj['offlineIndexKey']
                setSelectedItems(prev => {
                                            const {[objKey]:_,...current} = prev
                                            return current
                                        })
            },
    
            })
    
    const {slidePageTo} = useSlidePage()
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)
   
    useEffect(()=>{

        const handleItemsFetch = async ()=>{
            const result = await getFailedItems()
            setItems(result)

        }

        handleItemsFetch()

        return()=>{
            if(imgBlobs.current.length > 0){
                imgBlobs.current.forEach(blob=> URL.revokeObjectURL(blob))
            }
            if(timeoutRef.curret){
                clearTimeout(timeoutRef.current)
            }
        }

    },[forceRenderParent])

    const handleDelitionItems = async(itemsIdList)=>{
      
        console.log(itemsIdList,'in. deliting')
        itemsIdList.forEach(art => clearFailedItem(art))
        
        
        slidePageTo({addNumber:0})
        setForceRenderParent(prev=>!prev)
        setSelectionMode(false)
        
    }

    const handleUploadAll= async(itemList) =>{

        if(uploadingItem){
            showMessage({
                message:'Uploading Items',
                status:400
            })
            return
        }
        setUploadingItem(true)
        setProgressIndex('0%')
        const concurrency = 3
        let index = 0
        let completed = 0

        let success_count = 0
        let fail_count = 0

        const worker = async() =>{
            while(index < itemList.length){
                
                const currentIndex = index++

                const item = itemList[currentIndex]
                try{
                    const res = await uploadItem({
                        itemData:item,
                        type:item.fetchType,
                        showServerMessage:false,
                        allowArticleChange:true
                    })
                   
                    if(res.success  ){
                        success_count++
                    }else{
                        fail_count++
                    }
                    
                }catch(err){
                    console.log('upload fail for item:',item,err)
                    fail_count ++
                    
                }finally{
                    completed ++
                    setProgressIndex(`${Math.round((completed  / itemList.length)* 100)}%`)
                    console.log(completed)

                }
            }
        }

        if(timeoutRef.curret){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{
            setProgressIndex('10%')
        },100)

        await Promise.all(Array.from({length:concurrency},worker))
        
        if(fail_count > 0){
            showMessage({status:100,message:`Fail to upload ${fail_count} items. Successful uploads: ${success_count} items`})
        }else{
            showMessage({status:200,message:`${success_count} Items Uploaded.`})
        }


        if(timeoutRef.curret){
            clearTimeout(timeoutRef.current)
        }
        setForceRenderParent(prev =>!prev)
        forceRenderMain(prev => !prev)
        setSelectionMode(false)
        setSelectedItems({})
        
        timeoutRef.current = setTimeout(()=>{
            setUploadingItem(false)
        },400)

        
    }

    const handleBatchOfflineUpload = async(itemData)=>{

       let itemsObjList = Object.values(selectedItems).map((obj)=>{
        return {...obj,...itemData}
       })
       
       await handleUploadAll(itemsObjList)
       
        
    }
    
   
    return ( 
        
        <div className="flex-column " style={{height:'100dvh',overflow:'hidden'}}>

            {NextPage && 
                <SlidePage BodyComponent={NextPage}/>
            }
            
            <HeaderSlidePage 
                middleElement={
                    <div className="flex-row flex-1 content-center items-center"> 
                        <span className="text-15">
                             Offline Items {items.length} 
                        </span>
                    </div>
                }
                rightElement={
                    <div style={{width:'25px'}}>

                    </div>
                }
            />

            { selectionMode && 
                <SelectionModeComponent 
                    zIndex={2}
                    props={{
                        setSelectionMode,
                        selectedItemsLength:Object.keys(selectedItems).length,
                        setSelectedItems,
                        componentsListPreview:Object.keys(selectedItems).map((objKey,i)=>
                            <ItemPreviewContainer
                                key={`itemSelection_${i}`}
                                itemObj={selectedItems[objKey]}
                                imgBlobs={imgBlobs.current}
                                containerHeight={'70px'}
                                handlePressStart={handlePressStart}
                                handlePressEnd={handlePressEnd}
                                handleTouchMove={handleTouchMove}
                            />
                        ),
                        componentOptionsToSelect:[
                            <BatchPrintBtn selectedItems={selectedItems} key={'OfflinePageBatchPrint'}/>,
                            <BatchEditBtn setToggleBatchEdit={setToggleBatchEdit} selectedItems={selectedItems} key={'OfflinePageBatchEdit'}
                                setNextPage={()=>{
                                    slidePageTo({addNumber:1})
                                    setNextPage(
                                        <ItemEdit 
                                            preRenderInfo={{'handleBatchOfflineUpload':handleBatchOfflineUpload,'offlineIndexKey':Object.keys(selectedItems).map(obj=> Number(obj))}}
                                            fetchWhenOpen={false}
                                            setForceRenderParent={setForceRenderParent}
                                            handleDelitionItems={handleDelitionItems}
                                            pageSetUp={new Set(['noHistory','noImages','noType','noCategory','noIssues'])}
                                        />
                                    )
                                }}
                            />,
                            <SelectAllBtn key={'OfflinePageBatchSelectAll'} props={{dataList:items,setSelectedItems:setSelectedItems,key:'offlineIndexKey'}} />
                        ]
                    }}
                />

            }

            
            {uploadingItem && 
                <div className=" width100 height100 flex-column items-center content-center" style={{position:'absolute',backgroundColor:'rgba(0,0,0,0.5)',zIndex:5 }}>
                    <div className="flex-column items-center  bg-containers padding-20 " style={{borderRadius:'5px'}}>
                        <div className="flex-column padding-bottom-10">
                            some animation
                        </div>
                        
                        <div className="flex-row padding-10" style={{ width:'200px'}}>
                            <div style={{height:'10px',borderRadius:'20px' ,width:progressIndex ,background:'linear-gradient(270deg, #4caf50 25%,  rgba(255, 255, 255, 0.7) 50%,  #4caf50 75%',backgroundSize:'200% 100%', animation:'moveShine 2s linear infinite', transition:'width 0.4s ease-in-out'}}>

                            </div>
                        </div>
                        
                        <div className="flex-row">
                            <span  style={{color:'rgba(149, 149, 149, 1)'}}>uploading items... {progressIndex}</span>
                        </div>
                    </div>
                </div>
            }

            {items.length > 0 ?
                <div className="flex-column" style={{height:'100%'}}>
                    <ItemsPreviewList
                        data={items}
                        handleDelitionItems={handleDelitionItems}
                        setForceRenderParent = {setForceRenderParent}
                        fetchWhenOpen={false}
                        selectionMode={selectionMode}
                        setSelectionMode={setSelectionMode}
                        selectedItems={selectedItems}
                        setSelectedItems ={setSelectedItems}
                        selectionTargetKey = {'offlineIndexKey'}
                        containerHeight = {'70px'}
                        useChildPageSetter = {setNextPage}
                    />
                    <div className="flex-row items-center content-center width100 padding-20 bg-primary" style={{position:'absolute',bottom:'0',left:'0'}}>
                        <div className="btn bg-secondary padding-10"
                            onClick={()=>{handleUploadAll(items)}}
                        >
                            <span className="color-primary">Upload All</span>
                        </div>
                    </div>
                </div>
            :
                <div className="flex-column items-center content-center height100 width100">
                    <span className="text-20">No Offline items</span>
                </div>
            }
            
        </div>
        
     );
}
 
export default OfflineItemsPage;