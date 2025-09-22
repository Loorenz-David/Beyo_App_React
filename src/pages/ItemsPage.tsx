import {useNavigate} from 'react-router-dom'
import React from 'react'
import {useRef,useState,useEffect,useContext} from 'react'

import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

import AddSquareIcon from '../assets/icons/AddSquareIcon.svg?react'
import DealerIcon from '../assets/icons/DealerIcon.svg?react'
import SearchIcon from '../assets/icons/SearchIcon.svg?react'
import ScanIcon from '../assets/icons/ScanIcon.svg?react'
import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import CheckBoxIcon from '../assets/icons/CheckBoxIcon.svg?react'
import FilterIcon from '../assets/icons/FilterIcon.svg?react'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'

import {ItemTypeMap} from '../maps/mapItemTypeV2.tsx'

import useFetch from '../hooks/useFetch.tsx'
import {useLongPressAction} from '../hooks/useLongPressActions.tsx'
import useInfiniteScroll from '../hooks/useInfinityScroll.tsx'

import SecondaryPage from '../components/secondary-page.tsx'
import ItemScanner from '../components/ItemScanner.tsx'
import SelectPopupV2 from '../componentsV2/SelectPopupV2.tsx'
import {ItemEdit,ItemPropsComp} from '../componentsV2/ItemEdit.tsx'
import BatchPrintBtn from '../componentsV2/BatchPrintBtn.tsx'
import BatchEditBtn from '../componentsV2/BatchEditBtn.tsx'
import CreateDealer from '../componentsV2/CreateDealer.tsx'
import {MemorizedNoteSearchBtn} from '../componentsV2/ItemNoteSearch.tsx'
import OfflineItemsPage from '../componentsV2/OfflineItemsPage.tsx'
import {ItemsPreviewList,ItemPreviewContainer} from '../componentsV2/ItemsPreviewList.tsx'
import SelectionModeComponent from '../componentsV2/SelectionModeComponent.tsx'



const NavigationBtn = () =>{
    const dealerPageRef = useRef(null)
    const itemPageRef = useRef(null)
    const isActiveRef = useRef(false)
    const [toggleCreateDealer,setToggleCreateDealer] = useState(false)
    const navigate = useNavigate()

    const handleFirstInteraction = (e,isActiveRef)=>{
        const current = e.currentTarget
        const target = current.querySelector('.plus-btn')
        
        if(target){
            target.classList.toggle('rotateContainer')
            if(isActiveRef.current){
                dealerPageRef.current.style.bottom = '0'
                itemPageRef.current.style.right = '0'

                dealerPageRef.current.style.transform = 'scale(0.5)'
                itemPageRef.current.style.transform = 'scale(0.5)'

                isActiveRef.current = false
                current.style.transform = 'scale(1)'
            }else{
                dealerPageRef.current.style.bottom = '140%'
                itemPageRef.current.style.right = '140%'

                dealerPageRef.current.style.transform = 'scale(1.2)'
                itemPageRef.current.style.transform = 'scale(1.2)'

                isActiveRef.current = true
                current.style.transform = 'scale(0.9)'
            }
        }
    }

    return (
        <>
         {toggleCreateDealer && 
                <SecondaryPage BodyComponent={CreateDealer}
                    bodyProps={{}}
                    zIndex={5}
                    handleClose={()=>{setToggleCreateDealer(false)}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
                    header={{'display': 'Create Dealer', class:'flex-1 content-center',order:2}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}
                    pageId={'createDealerPage'}
                />
            }
             <div className="flex-row" style={{position:'fixed',bottom:'85px',right:'15px'}}>
           
                    <div className="flex-column items-center content-center " style={{position:'relative',}}>

                        <div className="flex-row items-center content-center bg-secondary padding-10" style={{borderRadius:'50%',position:'absolute', bottom:'0',transform:'scale(0.5)',transition:'bottom 0.2s ease-out,transform 0.2s ease-out'}}
                        ref={dealerPageRef}
                        onClick={()=>{setToggleCreateDealer(true)}}
                        >
                            <div className=" flex-row content-center  items-center svg-25 svg-bg-container" style={{width:'20px',height:'20px',}}>
                               <DealerIcon/>
                            </div>
                        </div>

                        <div className="flex-row items-center content-center bg-secondary padding-10" style={{borderRadius:'50%',position:'absolute',transform:'scale(0.5)', right:'0',transition:'right 0.2s ease-out,transform 0.2s ease-out'}}
                        ref={itemPageRef}
                        onClick={()=>{navigate('/items/create_item')}}
                        >
                            <div className=" flex-row content-center items-center  svg-25 svg-bg-container" style={{width:'20px',height:'20px',}}>
                                <AddSquareIcon/>
                            </div>
                        </div>

                         <div className="flex-row items-center content-center bg-secondary padding-10 " style={{borderRadius:'50%',zIndex:'1',transition:'transform 0.2s ease-out'}}
                         onClick={(e)=>{handleFirstInteraction(e,isActiveRef)}}
                         >
                            <div className=" flex-row content-center  plus-btn " style={{width:'20px',height:'20px',}}>
                                <div className="plus-vertical bg-primary" ></div>
                                <div className="plus-horizontal bg-primary"></div>
                            </div>
                        </div>

                    </div>
            </div>
        </>
       
    )
}

const operationSymbol = [{'display':'>','val':'>='},{'display':'=','val':'=='},{'display':'<','val':'<='}]
const CurrencyInputsFilters = ({setItemData,purchased_price,valuation,sold_price,handleFocusScroll})=>{

    const inputValObj = {
        'purchased_price':purchased_price,
        'valuation':valuation,
        'sold_price':sold_price
    }
    

    const handleOperationCurrency = (e,property)=>{
        const target = e.currentTarget
        const val = target.textContent.trim()
        const indx = operationSymbol.findIndex(obj => obj.display == val) 
        let nextIndex = 0
        if(indx >= 0 && indx < operationSymbol.length -1){
            nextIndex = indx + 1
        }
        const targetSymbol = operationSymbol[nextIndex]
        target.textContent = targetSymbol.display

        setItemData(prev => ({...prev, [property]: {...(prev[property] ?? {'value':null} ),'operation':targetSymbol } }))
        
        
        
    }
    return(
        <div className="flex-row  border-bottom border-top ">
            {Object.entries(inputValObj).map(([columName,columValue],i)=>{
                const labelName = columName.charAt(0).toUpperCase() + columName.slice(1).toLowerCase()
                return(
                    <React.Fragment key={`currencyInput_${i}`}>
                        <div className="flex-column gap-1 padding-10" >
                            <span className="color-lower-titles text-9"> 
                                {labelName.replace("_"," ")}
                            </span>
                            <div className="flex-row width100">
                                <input style={{fontSize:'12px'}} className="width100"  type="number" 
                                    onFocus={(e)=>{handleFocusScroll(e)}}
                                    onInput={(e)=>{setItemData(prev => ({...prev, [columName]:{'value':e.target.value? parseInt(e.target.value):null }}) )}}
                                    value={ columValue && 'value' in columValue && columValue.value ? columValue.value : '' }
                                />
                                <div className="flex-column bg-containers border-blue btn items-center content-center" style={{padding:'1px 7px'}}
                                onClick={(e)=>{handleOperationCurrency(e,columName)}}
                                >
                                        {columValue && 'operation' in columValue ? columValue.operation.display : '='} 
                                </div>
                            </div>
                        </div>
                        <div className="vertical-line" ></div>
                    </React.Fragment>
                )
            })}
        </div>
    )
}


const FilterPage = ({setFilters,handleClose,previousFilters,queryInputRef})=>{
 
    const [itemData,setItemData] = useState({...previousFilters.current})
    const itemPropTypeDict = useRef([])
    const propsUpdated = useRef(false)

    const handleClearFilters = ()=>{
        if(queryInputRef.current){
            queryInputRef.current.value = ''
        }
        previousFilters.current = {}
        setFilters({})
        handleClose(true)
    }
    
    const handleSaveFilters = () =>{
        const buildFilterDict:any = {}
        
        for(const [key,value] of Object.entries(itemData)){
            let tempKey
            if(key === 'dealer'){
                tempKey = key + '.id'
                buildFilterDict[tempKey] = value.id
            }
            else if(key === 'notes'){
                if(!value || value.length == 0) continue
                tempKey = key + '.subject' + '.id'
                buildFilterDict[tempKey] = {'operation':'in','value':value.map(obj => obj.id)}
            }
            else if(key === 'dimensions' || key === 'issues' || key === 'properties' || key === 'parts'){
                if(value == null || value.length == 0) continue
                buildFilterDict[key] = {'operation':'contains' ,'value':value}
            }
            else if(key === 'purchased_price' || key === 'valuation' || key === 'sold_price'){
                if( value.value ){
                    buildFilterDict[key] = {'operation':value.operation ? value.operation.val : '=='  , 'value':value.value}
                } 
            }else if( key == 'reference_number' && value == ''){
                continue
            }
            
            else{
                buildFilterDict[key] = value
            }  
            
        }
        previousFilters.current = {...itemData}
       
        setFilters(prev => ({...prev,...buildFilterDict}))
        handleClose()
        
        
    }

    
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
        <div className="flex-column padding-top-40 padding-bottom-20" style={{height:'100dvh'}}>
        
            <ItemPropsComp 
                itemData={itemData}
                setItemData={setItemData}
                zIndex={3}
                pageSetUp={new Set(['noHistory','noNotes','noImages'])}
                CurrencyInputsComponent={CurrencyInputsFilters}

            />

            

            {/* Notes Search Btn */}
            <div className="flex-row border-bottom "
            
            >
                <MemorizedNoteSearchBtn setItemData ={setItemData}
                    notesList={itemData.notes && itemData.notes !== null ? itemData.notes : []}
                    displayName={'Notes...'}
                    zIndex={3}
                />
                
            </div>
            
            {/* Btn Actions */}
            <div className="flex-column width100 padding-10 gap-2 push-bottom">
                <button className="btn border-blue bg-containers padding-10"
                onClick={()=>{handleClearFilters()}}
                >
                    <span className="text-15">Clear Filters</span>
                </button>
                <button className="btn bg-secondary padding-10"
                onClick={()=>{handleSaveFilters()}}
                >
                    <span className="text-15 color-primary">Save Filters</span>
                </button>
            </div>

        </div>
    )
}

const ItemPageSettings = [
    {'displayName':'Filters','icon':<FilterIcon/>,'property':'toggleFilters'},
    {'displayName':'Select','icon':<CheckBoxIcon/>,'property':'toggleSelectionMode'},
    {'displayName':'Offline Items','icon':'c','property':'toggleOfflineItems'}
]
const ItemPageSettingSelectionMode =[
    {'displayName':'Filters','icon':<FilterIcon/>,'property':'toggleFilters'},
    
]

const TopInteractiveMenu = ({currentFilters,setFilters,previousFilters,selectionMode,setSelectionMode,handleDelitionItems,setForceRenderParent})=>{
    const topMenuInteractionRef = useRef(null)
    const timeoutInputRef = useRef(null)
    const [toggleScanner,setToggleScanner] = useState(false)
    const [toggleSelectPopup,setToggleSelectPopup] = useState(false)
    const [toggleFilters,setToggleFilters] = useState(false)
    const [toggleOfflineItems,setToggleOfflineItems] = useState(false)
    const queryInputRef= useRef(null)
    
    const popupSettingsList = useRef([])
    if(selectionMode){
        popupSettingsList.current = ItemPageSettingSelectionMode
    }else{
        popupSettingsList.current = ItemPageSettings
    }


    const handleShowInput= ()=>{

        if(!topMenuInteractionRef.current) return;
        const idKey = 'filterSearch'

        const majorParent = topMenuInteractionRef.current
        const queryInput = majorParent.querySelector(`#${idKey}InputContainer`)
        queryInput.classList.toggle('hidden')
        majorParent.classList.toggle('bg-containers')
        majorParent.querySelector(`#${idKey}Close`).classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}Status`).classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}SearchIcon`).classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}ThreeDotIcon`).classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}CheckBoxIcon`).classList.toggle('hidden')

        
        queryInput.querySelector('input').focus()
       

    }

    const handleInputSearch = (value) =>{
        
        if(timeoutInputRef.current){
            clearTimeout(timeoutInputRef.current)
        }

        timeoutInputRef.current = setTimeout(()=>{
            setFilters(prev => (
                {...prev, 
                    'or-article_number':{'operation':'ilike','value':`%${value}%`},
                    'or-reference_number':{'operation':'ilike','value':`%${value}%`}
            }))
        },500) 
        
    }
    

   

    useEffect(()=>{

        return ()=>{
            if(timeoutInputRef.current){
                clearTimeout(timeoutInputRef.current)
            }
        }
    },[])

    

    const handleMap = {
        'toggleFilters':()=>{setToggleFilters(true)},
        'toggleOfflineItems':()=>{setToggleOfflineItems(true)},
        'toggleSelectionMode':()=>{setSelectionMode(true)},
        
        
    }
    return (
        <div className="flex-row width100 padding-10 bg-primary" style={{boxShadow:'0 0 10px rgba(0,0,0,0.3)'}}>
            {toggleScanner &&
                <SecondaryPage BodyComponent={ItemScanner} bodyProps={{handleDelitionItems,setForceRenderParent}} handleClose={()=>{setToggleScanner(false)}} zIndex={3} pageId={'itemScanner'} addCloseWhenSlide={false}/>
            }
            {toggleFilters &&
                <SecondaryPage BodyComponent={FilterPage} bodyProps={{setFilters,previousFilters,queryInputRef}} handleClose={()=>{setToggleFilters(false)}} zIndex={3} pageId={'filterPage'}/>

            }
            {toggleOfflineItems && 
                <SecondaryPage BodyComponent={OfflineItemsPage}
                    bodyProps={{}}
                    zIndex={3}
                    handleClose={()=>{setToggleOfflineItems(false);setForceRenderParent(prev => !prev)}}
                    pageId={'offlineItemsPage'}
                    
                />
            }
            

            <div className="flex-row width100 " style={{borderRadius:'5px'}}
            ref={topMenuInteractionRef}
            >
                <div className="flex-row items-center content-center btn hidden "
                id="filterSearchClose"
                onClick={()=>{handleShowInput()}}
                >
                    <div className=" flex-row content-center items-center  plus-btn " style={{width:'15px',height:'15px',transform:'rotate(45deg)'}}>
                        <div className="plus-vertical bg-secondary"></div>
                        <div className="plus-horizontal bg-secondary"></div>
                    </div>
                </div>
                <div className="flex-row  width100 items-center content-start padding-10 hidden"
                id="filterSearchInputContainer"
                >
                    <input type="text"  className="width100" 
                    ref={queryInputRef}
                    onInput={(e)=>{handleInputSearch(e.currentTarget.value)}}
                
                    autoFocus/>
                </div>

                <div className="flex-row items-center content-start width100 "
                id="filterSearchStatus"
                >
                    {Object.keys(currentFilters).length > 0 && 
                        <span className=" bold-600 padding-left-10"
                        style={{fontSize:'18px'}}
                        >
                            Filters Applying
                        </span>
                    }
                </div>
                

                <div className="flex-row items-center "
                // ref={interactiveSearchBtnRef}

                >
                    <div className="flex-column btn content-center svg-18 "
                    id="filterSearchSearchIcon"
                    onClick={()=>handleShowInput()}
                    >
                        <SearchIcon/>
                    </div>
                    

                    <div className="flex-column btn content-center svg-20"
                    id="filterSearchScanIcon"
                    onClick={()=>{setToggleScanner(true)}}
                    >
                        <ScanIcon/>
                    </div>
                    <div className="flex-column"
                    id="filterSearchThreeDotIcon"
                    style={{position:'relative'}}
                    onClick={()=>{ setToggleSelectPopup(true)}}
                    >
                        <div className="btn content-center svg-18 ">
                            <ThreeDotMenu/>
                        </div>
                        

                        {toggleSelectPopup &&
                            <SelectPopupV2  right={'75%'} top={'120%'}
                                onSelect={(obj)=>{handleMap[obj.property]()}}
                                setTogglePopup={setToggleSelectPopup}
                                listOfValues={popupSettingsList.current}  
                                zIndex={2}
                               />
                            }
                    </div>
                    <div className="flex-column btn content-center svg-18 hidden"
                    id="filterSearchCheckBoxIcon"
                    onClick={()=>{setSelectionMode(true)}}
                    >
                        <CheckBoxIcon/>
                    </div>
                </div>
            </div>
        </div>
     )
}

const ItemsPage = () => {
    const {doFetch,data,loading} = useFetch()
    const [dataList,setDataList] = useState([])
    const [filters,setFilters] = useState({})
    const [forceRender,setForceRender]= useState(false)
    const [toggleBatchEdit,setToggleBatchEdit] = useState(false)
    
    const previousFilters = useRef({})
    const {showMessage} = useContext(ServerMessageContext)
    const [selectionMode,setSelectionMode] = useState(false)
    const [selectedItems,setSelectedItems] = useState({})
    const lastLoad = useRef(false)
    const imgBlobs = useRef([])
    const {handlePressStart,handlePressEnd,handleTouchMove} = useLongPressAction({
        selectionMode:true,
        skipFirstClick:false,
        handleActionWhenPress:(e,itemObj)=>{
            const objKey:string = itemObj['article_number']
            setSelectedItems(prev => {
                                        const {[objKey]:_,...current} = prev
                                        return current
                                    })
        },

    })
    
    useEffect(()=>{
        lastLoad.current = false
        const pageFetch = async ()=>{
            const res = await handleFetch()
            setDataList(res)
        }
       pageFetch()

       return ()=>{
        if(imgBlobs.current.length > 0){
            imgBlobs.current.forEach(blob => URL.revokeObjectURL(blob))
        }
       }

    },[filters,forceRender])
    
    const handleDelitionItems = async (itemsIdList,handleClose=null)=>{

       
        const fetchDict = {
            model_name:'Item',
            object_values:{
                'query_filters':{'article_number':{'operation':'in','value':itemsIdList}},
                'delition_type':'delete_all'
            },
            reference:'Item'
        }
        console.log(fetchDict,'the dict for delition')
        await doFetch({
            url:'/api/schemes/delete_items',
            method:'POST',
            body:fetchDict})
            .then(res => showMessage(res))
        
        if(handleClose){
            handleClose()
            if(selectionMode){
                setSelectionMode(false)
                setSelectedItems({})
            }
        }
        setForceRender(prev=> !prev)

        
    }

    const handleFetch = async (scrolling='',fetchPerPage=180,itemsListId=[])=>{


        const fetchDict = {
            model_name:'Item',
            requested_data:['id','type','article_number','reference_number','properties','images'],
            query_filters:filters,
            per_page:fetchPerPage,
            
        }

        if( scrolling == 'down' && dataList.length > 0){
            const lastItem = dataList[dataList.length - 1]
            fetchDict['cursor'] = lastItem.id
        }else if( scrolling == 'up' && itemsListId.length > 0){
            const newFilters = {...fetchDict['query_filters'], 'id': {'operation':'in','value':itemsListId}}
            fetchDict.query_filters = newFilters
        }
        

        
        const res = await doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:fetchDict})

        if(!res || !res.body || res.body.length == 0){
            lastLoad.current = true
            return false
        }

        if(dataList.length == 0 ){
            setDataList(res.body)
            
        }
        

        if(lastLoad.current){
            lastLoad.current = false
        }

        return res.body
        
    }

    
    const {handleScroll,ScrollDown_Loading,ScrollUp_Loading} = useInfiniteScroll(
        {
            itemHeight:90,
            thressholdItems:120,
            nextBatchItems:60,
            lastLoad:lastLoad,
            handleFetch:handleFetch,
            dataList:dataList,
            setDataList:setDataList


        }
    )
    

    

    return ( 
        <div className="flex-column  width100" style={{position:'relative',minHeight:'100vh'}}>
            <TopInteractiveMenu currentFilters={filters} setFilters={setFilters} previousFilters={previousFilters} selectionMode={selectionMode} setSelectionMode={setSelectionMode} handleDelitionItems={handleDelitionItems} setForceRenderParent={setForceRender} />
           
            {toggleBatchEdit && 
                <SecondaryPage BodyComponent={ItemEdit}
                    bodyProps={{
                        preRenderInfo:{'article_number':Object.keys(selectedItems)},
                        fetchWhenOpen:false,
                        setForceRenderParent:setForceRender,
                        handleDelitionItems:handleDelitionItems,
                        pageSetUp:new Set(['noHistory','noImages','noType','noCategory','noIssues'])
                    }}
                    zIndex={3}
                    interactiveBtn ={{iconClass:'svg-15 padding-05 position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
                    header={{'display': `Editing ${Object.keys(selectedItems).length} items`, class:'flex-1 content-center',order:2}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
                    
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}
                    handleClose={()=>{setToggleBatchEdit(false);setSelectionMode(false);setSelectedItems({})}}    
                    pageId={'itemsPage'}
                />
            }
            <div className="width100" style={{zIndex:1}}>
                { selectionMode && 
                    
                        <SelectionModeComponent 
                            zIndex={2}
                            props={{
                                setSelectionMode,
                                selectedItemsLength:Object.keys(selectedItems).length,
                                setSelectedItems,
                                componentsListPreview:Object.keys(selectedItems).map((objKey,i)=>{

                                        return (<ItemPreviewContainer
                                            key={`itemSelection_${i}`}
                                            itemObj={selectedItems[objKey]}
                                            imgBlobs={imgBlobs.current}
                                            handlePressStart={handlePressStart}
                                            handlePressEnd={handlePressEnd}
                                            handleTouchMove={handleTouchMove}
                                            
                                        />)
                                    }
                                ),
                                componentOptionsToSelect:[
                                    <BatchPrintBtn selectedItems={selectedItems} key={'mainPageBatchPrint'}/>,
                                    <BatchEditBtn setToggleBatchEdit={setToggleBatchEdit} selectedItems={selectedItems} key={'mainPageBatchEdit'}/>
                                ]
                            }}
                        />
                    

                }
            </div>
            
            <div className="flex-column" style={{overflow:'hidden'}}>
                {dataList && 
                    <ItemsPreviewList data={dataList} 
                        handleDelitionItems={handleDelitionItems} 
                        setForceRenderParent={setForceRender}
                        fetchWhenOpen={true}
                        selectionMode={selectionMode}
                        setSelectionMode={setSelectionMode}
                        selectedItems={selectedItems}
                        setSelectedItems ={setSelectedItems}
                        selectionTargetKey = {'article_number'}
                        handleScroll={handleScroll}
                        
                        loaders ={{ScrollDown_Loading,ScrollUp_Loading,loading}}
                        containerHeight ={'90px'}   
                    />
                }

                
                
            </div>

            

            <NavigationBtn/>
        </div>
     );
}
 
export default ItemsPage;