import {useState,useRef,useEffect,useCallback,memo,useContext} from 'react'
import {createPortal} from 'react-dom'

import useFetch from '../hooks/useFetch.tsx'
import usePrintLabelWiFi from '../hooks/usePrintLabelWiFi.tsx'
import {useSaveItemsV2} from '../hooks/useSaveItemsV2.tsx'
import {handleFocus} from '../hooks/scrollWhenFocus.tsx'
import LoaderDots from '../components/LoaderDots.tsx'

import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'



import PropertySelection from './PropertySelection.tsx'
import {MemorizedItemIssuesBtn} from './ItemIssues.tsx'
import {MemorizedItemDimensionsBtn} from './ItemDimensions.tsx'
import {MemorizedDealerSelectionBtn} from './DealerSelection.tsx'
import {MemorizedItemHistoryBtn} from './ItemHistory.tsx'
import{ItemNoteBtn} from './ItemNotesV3.tsx'
import SelectPopupV2 from './SelectPopupV2.tsx'
import {CameraBtn} from './CameraBtn.tsx'

import {ItemTypeMap} from '../maps/mapItemTypeV2.tsx'
import {ItemsStatesMap} from '../maps/mapItemState.tsx'

import MinusCircleIcon from '../assets/icons/MinusCircleIcon.svg?react'



const CurrencyInputsEditItem = memo(({setItemData,purchased_price,valuation,sold_price,handleFocusScroll})=>{
    

    return(
        <div className="flex-row">
            <div className="flex-column gap-05 padding-10 width100">
                <span className="color-lower-titles text-9">
                    Purchased price:
                </span>
                <input type="number" 
                    style={{width:'100%',fontSize:'13px'}}
                    value={purchased_price ?? ""}
                    onFocus={(e)=>{handleFocusScroll(e)}}
                    onChange={e => setItemData(prev => (
                        { ...prev, 'purchased_price':e.target.value ? parseInt(e.target.value):null}
                    ))}
                />
            </div>
            <div className="vertical-line"></div>
            <div className="flex-column gap-05 padding-10 width100">
                <span className="color-lower-titles text-9">
                    Valuation:
                </span>
                <input type="number"  
                    style={{width:'100%',fontSize:'13px'}}
                    value={valuation ?? ""}
                    onFocus={(e)=>{handleFocusScroll(e)}}
                    onChange={e => setItemData(prev => (
                        { ...prev, 'valuation':e.target.value ? parseInt(e.target.value):null}
                    ))}
                />
            </div>
            <div className="vertical-line"></div>
            <div className="flex-column gap-05 padding-10 width100">
                <span className="color-lower-titles text-9">
                    Sold Price:
                </span>
                <input type="number"  
                    style={{width:'100%',fontSize:'13px'}}
                    value={sold_price ?? ""}
                    onFocus={(e)=>{handleFocusScroll(e)}}
                    onChange={e => setItemData(prev => (
                        { ...prev, 'sold_price':e.target.value ? parseInt(e.target.value):null}
                    ))}
                />
            </div>
            
        </div>
    )
})


export const ItemPropsComp = ({setItemData,itemData,CurrencyInputsComponent,pageSetUp,zIndex=2})=>{

    const itemPropTypeDict = useRef([])
    const propsUpdated = useRef(false)

    const handleItemProps = useCallback((returnDict,handleClose)=>{
        
        let result = returnDict.result
        const property = returnDict.property
      
        if(returnDict.parts){
            setItemData(prev =>({...prev,'parts':returnDict.parts}))
        }

        if(property.includes('.')){
            const split = property.split('.')
            setItemData(prev =>({
                ...prev,
                [split[1]]:{ ...prev[split[1]],
                    ...result[split[1]]
                }
            }))
        }else{

            if(property == 'category'){
                propsUpdated.current = false
                itemPropTypeDict.current = []
                setItemData(prev => {
                    const {type, properties,issues,parts,...rest} = prev
                    return {
                            ...rest,...result,
                            // type:'',properties:'',issues:'',parts:''
                        }
                })
            }else if(property == 'type'){
                propsUpdated.current = false
                itemPropTypeDict.current = []
                setItemData(prev =>{
                    const {properties,issues,parts,...rest} = prev
                    return {  
                            ...rest,...result,
                            // properties:'',issues:'',parts:''

                    }
                })
            }else{
                 setItemData(prev => ({...prev,...returnDict.result}))
            }
           
        }

        handleClose()
       
    },[])


    if('type' in itemData && 'category' in itemData && !propsUpdated.current){
        const targetMapTypeDict = ItemTypeMap[itemData['category']].find(obj => obj.displayName == itemData.type)
    
        if( targetMapTypeDict && 'next' in targetMapTypeDict){
            targetMapTypeDict.next.forEach(dictName =>{
                const nextDict = ItemTypeMap[dictName]
                itemPropTypeDict.current.push( nextDict )
            })

            propsUpdated.current = true
        }
        
    }

    
    return (
        <div className="flex-column width100  ">
            {!pageSetUp.has('noImages') && 
                <div className="flex-row content-center  " style={{padding:'2px 10px'}}>
                   
                    <CameraBtn props={{
                        listOfImages: 'images' in itemData && itemData.images ? itemData.images : [],
                        zIndex:zIndex,
                        setData:setItemData
                    }}
                    />
                </div>
            }
             

            <div className="flex-row space-around border-bottom  X-thin-scrollbar bg-scroll-bar"
                style={{overflowX:'auto'}}
            >

                <PropertySelection propName={'state'}
                    propDisplay={'state '}
                    propValue={'select...'}
                    handleItemProps={handleItemProps}
                    objectMap={ItemsStatesMap['state']}
                    inputValue = {'state' in itemData ? itemData.state : null}
                />
                <PropertySelection propName={'location'}
                    propDisplay={'location'}
                    propValue={'select...'}
                    handleItemProps={handleItemProps}
                    objectMap={ItemsStatesMap['location']} 
                    inputValue = {'location' in itemData ? itemData.location : null}
                    />

                {!pageSetUp.has('noCategory')&& 
                    <PropertySelection propName={'category'}
                        propDisplay={'category'}
                        propValue={'select...'}
                        handleItemProps={handleItemProps}
                        objectMap={ ItemTypeMap['category'] }
                        inputValue = {'category' in itemData ? itemData.category : null}
                    />
                }
                 {!pageSetUp.has('noType')&& 
                    <PropertySelection propName={'type'}
                        propDisplay={'type'}
                        propValue={'select...'}
                        handleItemProps={handleItemProps}
                        objectMap={'category' in itemData? ItemTypeMap[itemData['category']] : 'Missing to select category'}
                        inputValue = {'type' in itemData ? itemData.type : null}
                    />
                 }
                
            </div>
            <div className={`expandable-row  border-bottom ${itemPropTypeDict.current.length > 0 ? 'open': ''}`}
                
                >
                    
                    <div className="flex-row space-around X-thin-scrollbar bg-scroll-bar"
                        id='ItemProperties'
                        style={{overflowX:'auto'}}
                       
                    >
                        {itemPropTypeDict.current.map((nextListDict,i) =>{
                            const propName = nextListDict[0].property
                            return (
                                <PropertySelection key={`itemProperty_${i}`}  propName={propName}
                                    propDisplay={propName}
                                    propValue={'select...'}
                                    handleItemProps={handleItemProps}
                                    objectMap={nextListDict}
                                    inputValue={'properties' in itemData && itemData.properties &&  propName in itemData.properties? itemData.properties[propName] : null}
                                />
                            )
                        })}
                    </div> 
                
            </div>

            <div className="flex-row space-around   border-bottom" style={{padding:'20px 0'}}>

                    {!pageSetUp.has('noHistory') && 
                        <MemorizedItemHistoryBtn
                        creationTime = {itemData.created_at ?? null}
                        creationUser = {itemData.created_by ?? null}
                        itemId = {itemData.id ?? null}
                        zIndex ={zIndex}

                        />
                    }
                    
                    {!pageSetUp.has('noIssues') && 
                         <MemorizedItemIssuesBtn 
                            issues = {'issues' in itemData && itemData.issues !== null && itemData.issues}
                            type = {itemData.type ?? null}
                            setItemData={setItemData}
                            zIndex={zIndex}
                        />
                    }
                   
                    
                    <MemorizedItemDimensionsBtn 
                        
                        dimensions = {'dimensions' in itemData && itemData.dimensions !== null && itemData.dimensions }
                        setItemData={setItemData}
                    />
                    <MemorizedDealerSelectionBtn
                        dealer = {'dealer' in itemData && itemData.dealer !== null && itemData.dealer}
                        setItemData={setItemData}
                        zIndex={zIndex }
                    />
            </div>
            
            <div className="flex-row border-bottom">
                    <CurrencyInputsComponent
                        setItemData={setItemData}
                        purchased_price={itemData?.purchased_price ?? null}
                        valuation={itemData?.valuation ?? null}
                        sold_price={itemData?.sold_price ?? null}
                        handleFocusScroll={handleFocus}
                    />
            </div>
            <div className="flex-row border-bottom width100 padding-10">
                    <div className="flex-column gap-05 width100">
                        <span className="text-9 color-lower-titles">Reference_number</span>
                        <input type="text" 
                            className="width100"
                            value={itemData.reference_number ?? ""}
                            onFocus={(e)=>{handleFocus(e)}}
                            onChange={(e)=>{
                                const val = e.target.value; 
                                setItemData(prev =>({...prev,'reference_number':val}) )
                            }}
                        />
                    </div>
            </div>

            {!pageSetUp.has('noNotes') &&
                <div className="flex-row border-bottom" style={{padding:'5px 0'}}>
                    {/* <ItemNoteDisplayBtn text={'Notes...'} itemsId={Array.isArray(itemData.article_number) ? itemData.article_number : [itemData.article_number]} zIndex={zIndex + 1}/> */}
                    <ItemNoteBtn  
                        itemNotes={'notes' in itemData && itemData.notes !== null && itemData.notes}
                        setItemData ={setItemData}
                        itemArticleNumbers= {'article_number' in itemData && itemData.article_number}
                        zIndex ={zIndex + 1}
                        displayText={'Notes...'}
                        notesSetUp={pageSetUp}

                    />
                </div>
            }
            
        </div>

    )
}


const itemSettingsList = [
    {'displayName':'Print','icon':'p'},
    {'displayName':'Delete','icon':<MinusCircleIcon/>,'property':'delete'}
] 



export const ItemEdit = ({preRenderInfo={},interactiveRef=null,handleDelitionItems,handleClose,setForceRenderParent,fetchWhenOpen,pageSetUp=new Set(),zIndex=2,holdScrollElement}) => {
   
    const {doFetch,loading,data} = useFetch()
    const [itemData,setItemData] = useState({...preRenderInfo})
    const {printLabel,isPrinterConnected} = usePrintLabelWiFi({itemData:itemData})
   
    const [toggleEditSettings,setToggleEditSettings] = useState(false)
    const {uploadItem,itemUploading,setUploading} = useSaveItemsV2()

    const {showMessage} = useContext(ServerMessageContext)
 
    
    useEffect(()=>{

        const setRules = {'loadData':true}

        const fetchDict = {
            model_name: 'Item',
            requested_data: ['category','properties','dimensions','issues','parts','missing_parts','state','location','created_at','sold_price','valuation','purchased_price','created_by',{'dealer':['dealer_name','id']}],
            query_filters:{'id':preRenderInfo.id} ,
            per_page:1,
        }
        const handleFirstFetch = async() =>{
            
            const fetch = await doFetch({
                url:'/api/schemes/get_items',
                method:'POST',
                body:fetchDict,
                setRules:setRules,
                setAssignData:setItemData 
            })
                    .then(
                        response => {
                            if(response.body.length == 0){
                                showMessage({
                                    message:'Article number not found.',
                                    complementMessage:'No article number was found in data base, thus, no infromation will be loaded, and save button will be disabled.',
                                    status:400
                                })
                                setTimeout(()=>{handleClose()},2000)
                                
                            }
                        }
                    )  
        }

        if(fetchWhenOpen){
            if(Object.keys(preRenderInfo).length <= 3){
                fetchDict['requested_data'] = [...fetchDict['requested_data'], 'id','type','article_number','reference_number','images']

            }
            if(!('id' in preRenderInfo) && 'article_number' in preRenderInfo){
                fetchDict['query_filters']={'article_number':preRenderInfo.article_number}
            }
            handleFirstFetch()
        }   
        

        let interactiveBtn = null
        if(interactiveRef && interactiveRef.current){
            interactiveBtn = interactiveRef.current
            interactiveBtn.addEventListener('click',handleToggleEditSettings) 
        }
        return()=>{
            if(interactiveBtn){
                interactiveBtn.removeEventListener('click',handleToggleEditSettings)
            }
        }
        
    }
    ,[])
    
    const handleEditItemSetting = async(objSetting)=>{
        if(objSetting.property == 'delete'){
            let idToDelete; 
            if('offlineIndexKey' in preRenderInfo){
                
                idToDelete = Array.isArray(preRenderInfo.offlineIndexKey)? preRenderInfo.offlineIndexKey : [preRenderInfo.offlineIndexKey]
                
                

            }else if ('article_number' in preRenderInfo){
                
                idToDelete = Array.isArray(preRenderInfo.article_number) ? preRenderInfo.article_number :  [preRenderInfo.article_number]
                

            }
            await handleDelitionItems(idToDelete,handleClose)
            
        }
    }

    const handleToggleEditSettings = ()=>{
        setToggleEditSettings(true)
    }


    const handleSaveItem = async ()=>{
        if(itemUploading){
            return
        }
        
        if(fetchWhenOpen && data.length == 0){
            showMessage({
                            message:'Article number not found.',
                            complementMessage:'No article number was found in data base, thus, no infromation will be loaded and, save button will be disabled.',
                            status:400
                        })
            return
        }

        let baseLineDict = null

        if('handleBatchOfflineUpload' in preRenderInfo){
            const {handleBatchOfflineUpload,...rest} = itemData
            await preRenderInfo['handleBatchOfflineUpload'](rest)
            
            handleClose()
            return 
        }
        
        if(data.length > 0 ){
            baseLineDict = {...preRenderInfo,...(data.length > 0 && data[0])}
        }else if(preRenderInfo.article_number && Array.isArray(preRenderInfo.article_number)){
            baseLineDict = {...preRenderInfo}
        }

        let type = 'update'
        if('fetchType' in itemData){
            type = itemData.fetchType
        }
        const upload = await uploadItem({
            itemData,type,baseLineDict,allowArticleChange:true
        })
        setUploading(false)
        if(upload.success || 'fetchType' in preRenderInfo){
            setForceRenderParent(prev => !prev)
            handleClose()
        }
        
        
    }


    return ( 
        <div ref={holdScrollElement} className="flex-column" style={{height:'100vh',overflowY:'auto'}}>
            {toggleEditSettings && interactiveRef && interactiveRef.current && 
                createPortal(
                    <SelectPopupV2  setTogglePopup={setToggleEditSettings}
                        listOfValues={itemSettingsList}
                        onSelect={handleEditItemSetting}
                        zIndex={zIndex + 4}
                        right={'100%'}
                    />,
                    interactiveRef.current
                )
            }

            <ItemPropsComp itemData={itemData} setItemData={setItemData} 
                CurrencyInputsComponent={CurrencyInputsEditItem}
                pageSetUp={pageSetUp}
                zIndex={zIndex + 1}

            />
           

            <div className="flex-column width100 gap-2 padding-15 padding-top-30">
                <button className={`btn bg-containers ${isPrinterConnected} flex-row content-center padding-10 items-center`}
                    id='printLabel'
                    onClick={ ()=>{try{printLabel()}catch(err){console.log(err)}} }
                >
                        <span className=" text-15">Print label</span>
                </button>
                
                
                <button className="btn bg-secondary flex-row content-center padding-10 items-center"
                    onClick={()=>{handleSaveItem()}}

                >       
                        {itemUploading ? 
                        
                            <LoaderDots
                                dotStyle={{dimensions:'squareWidth-07',bgColor:'bg-primary'}}
                                mainBg={'white'}
                            />
                        :
                            <span className="color-primary text-15">Save Changes</span>
                        }
                        
                </button>
            </div>
           
        </div>
     );
}


 
