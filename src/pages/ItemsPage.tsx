
import React from 'react'
import {useRef,useState,useEffect,useContext} from 'react'

import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'
import {useSetNextPage,SetNextPageContext} from '../contexts/SlidePageContext.tsx'
import {useSlidePage} from '../contexts/SlidePageContext.tsx'
import {DataContext} from '../contexts/DataContext.tsx'

import AddSquareIcon from '../assets/icons/General_Icons/AddSquareIcon.svg?react'
import DealerIcon from '../assets/icons/General_Icons/DealerIcon.svg?react'
import SearchIcon from '../assets/icons/General_Icons/SearchIcon.svg?react'
import ScanIcon from '../assets/icons/General_Icons/ScanIcon.svg?react'
import ThreeDotMenu from '../assets/icons/General_Icons/ThreeDotMenu.svg?react'
import CheckBoxIcon from '../assets/icons/General_Icons/CheckBoxIcon.svg?react'
import FilterIcon from '../assets/icons/General_Icons/FilterIcon.svg?react'

import {ItemTypeMapV3, type ItemType} from '../maps/Item_Maps/mapItemTypeV3.tsx'

import useFetch from '../hooks/useFetch.tsx'
import {useLongPressAction} from '../hooks/useLongPressActions.tsx'
import useInfiniteScroll from '../hooks/useInfinityScroll.tsx'




import ItemScanner from '../Components/Item_Components/ItemScanner.tsx'
import SelectPopupV2 from '../Components/Item_Components/SelectPopupV2.tsx'
import {ItemEdit,ItemPropsComp} from '../Components/Item_Components/ItemEdit.tsx'
import BatchPrintBtn from '../Components/Item_Components/BatchPrintBtn.tsx'
import BatchEditBtn from '../Components/Item_Components/BatchEditBtn.tsx'
import CreateDealer from '../Components/Item_Components/CreateDealer.tsx'
import {MemorizedNoteSearchBtn} from '../Components/Item_Components/ItemNoteSearch.tsx'
import OfflineItemsPage from '../Components/Item_Components/OfflineItemsPage.tsx'
import {ItemsPreviewList,ItemPreviewContainer} from '../Components/Item_Components/ItemsPreviewList.tsx'
import SelectionModeComponent from '../Components/Item_Components/SelectionModeComponent.tsx'
import CreateItemPageV2 from '../Components/Item_Components/CreateItemPageV2.tsx'

import {SlidePage} from '../Components/Page_Components/SwapToSlidePage.tsx'


import type {GetFetchDictProps} from '../types/fetchTypes.ts'
import type {ItemDict, ItemPriceFields} from '../types/ItemDict.ts'





interface NavigationBtnProps {
    forceRenderParent?:React.Dispatch<React.SetStateAction<boolean>> | null
}


const NavigationBtn = ({
    forceRenderParent = null
}:NavigationBtnProps) =>{
    const dealerPageRef = useRef<HTMLDivElement>(null)
    const itemPageRef = useRef<HTMLDivElement>(null)
    const isActiveRef = useRef<boolean>(false)
    const {setNextPage} = useSetNextPage()
    const {slidePageTo} = useSlidePage()

    const handleFirstInteraction = (
        e:React.MouseEvent<HTMLDivElement>,
        isActiveRef:React.RefObject<boolean>
    )=>{
        const current = e.currentTarget
        const target = current.querySelector('.plus-btn')
        
        if(target && dealerPageRef.current && itemPageRef.current){
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
                

                <div className="flex-row" style={{position:'fixed',bottom:'85px',right:'15px'}}>
            
                        <div className="flex-column items-center content-center " style={{position:'relative',}}>

                            <div className="flex-row items-center content-center bg-secondary padding-10" 
                                style={{borderRadius:'50%',position:'absolute', bottom:'0',transform:'scale(0.5)',transition:'bottom 0.2s ease-out,transform 0.2s ease-out'}}
                                ref={dealerPageRef}
                                onClick={()=>{
                                    slidePageTo({addNumber:1})
                                    setNextPage(
                                        <CreateDealer />
                                    )
                                }}
                            >
                                <div className=" flex-row content-center  items-center svg-25 svg-bg-container" 
                                    style={{width:'20px',height:'20px',}}
                                >
                                <DealerIcon/>
                                </div>
                            </div>

                            <div className="flex-row items-center content-center bg-secondary padding-10" 
                            style={{borderRadius:'50%',position:'absolute',transform:'scale(0.5)', right:'0',transition:'right 0.2s ease-out,transform 0.2s ease-out'}}
                            ref={itemPageRef}
                            onClick={()=>{
                                slidePageTo({addNumber:1})
                                setNextPage(
                                    <CreateItemPageV2
                                        forceRenderParent={forceRenderParent}
                                    />
                                )
                            }}
                            >
                                <div className=" flex-row content-center items-center  svg-25 svg-bg-container" style={{width:'20px',height:'20px',}}>
                                    <AddSquareIcon/>
                                </div>
                            </div>

                            <div className="flex-row items-center content-center bg-secondary padding-10 " 
                                style={{borderRadius:'50%',zIndex:'1',transition:'transform 0.2s ease-out'}}
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



interface operationSymbol{
    display:'<' | '>' | '='
    val:'>=' | '<=' | '=='
}

interface PriceFilterValue{
    value: number | null
    operation:operationSymbol
}

type ItemPriceFilterFields = {
    [key in keyof ItemPriceFields]:PriceFilterValue
}

interface FilterItemDict 
    extends Omit<ItemDict, keyof ItemPriceFields>, Partial<ItemPriceFilterFields> {}

interface CurrencyInputsFilters extends ItemPriceFilterFields{
    setItemData:React.Dispatch<React.SetStateAction< FilterItemDict >>
    handleFocusScroll:(e:React.FocusEvent<HTMLInputElement>) => void
}

const operationSymbol:operationSymbol[] = [{'display':'>','val':'>='},{'display':'=','val':'=='},{'display':'<','val':'<='}]
const CurrencyInputsFilters = ({
    setItemData,
    purchased_price,
    valuation,
    sold_price,
    handleFocusScroll
}:CurrencyInputsFilters)=>{

    const inputValObj= {
        purchased_price,
        valuation,
        sold_price
    } satisfies ItemPriceFilterFields
    

    const handleOperationCurrency = (
        e:React.MouseEvent<HTMLDivElement>, 
        property: keyof ItemPriceFields
    )=>{
        const target = e.currentTarget
        const val = target.textContent.trim()
        const indx = operationSymbol.findIndex(obj => obj.display == val) 
        let nextIndex = 0
        if(indx >= 0 && indx < operationSymbol.length -1){
            nextIndex = indx + 1
        }
        const targetSymbol = operationSymbol[nextIndex]
        target.textContent = targetSymbol.display

        setItemData((prev) => {
            const currentValue = prev[property]
            let newValue:PriceFilterValue 
            let numericValue: number | null = null

            if(currentValue && typeof currentValue === 'object' && 'value' in currentValue){
                numericValue = currentValue.value
            }else if(typeof currentValue === 'number'){
                numericValue = currentValue
            }
            newValue = {'value': numericValue, 'operation':targetSymbol}
            return {...prev, [property]:newValue}
        })
        
        
        
    }
    return(
        <div className="flex-row  border-bottom border-top ">
            { (Object.entries(inputValObj) as [keyof ItemPriceFields, PriceFilterValue][])
                .map(
                    ([property,columValue],i)=>{
                        const labelName = property.charAt(0).toUpperCase() + property.slice(1).toLowerCase()
                        return(
                            <React.Fragment key={`currencyInput_${i}`}>
                                <div className="flex-column gap-1 padding-10" >
                                    <span className="color-lower-titles text-9"> 
                                        {labelName.replace("_"," ")}
                                    </span>
                                    <div className="flex-row width100">
                                        <input style={{fontSize:'12px'}} className="width100"  type="number" 
                                            onFocus={
                                                (e)=>{handleFocusScroll(e)}
                                            }
                                            onInput={
                                                (e:React.InputEvent<HTMLInputElement>)=>{
                                                    const input = e.target as HTMLInputElement;
                                                    setItemData(prev => (
                                                        {...prev, [property]:{'value':input.value ? parseInt(input.value) : null }}
                                                    ))
                                                }
                                            }
                                            value={ columValue  && 'value' in columValue && columValue.value ? columValue.value : '' }
                                        />
                                        <div className="flex-column bg-containers border-blue btn items-center content-center" style={{padding:'1px 7px'}}
                                        onClick={(e:React.MouseEvent<HTMLDivElement>)=>{handleOperationCurrency(e,property)}}
                                        >
                                                {columValue && 'operation' in columValue ? columValue.operation.display : '='} 
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-line" ></div>
                            </React.Fragment>
                        )
                    }
                )
            }
        </div>
    )
}


interface FilterPage{
    setFilters:React.Dispatch<React.SetStateAction<{}>>
    previousFilters: React.RefObject<{}>
    queryInputRef:React.RefObject<HTMLInputElement>
}
const FilterPage = ({
    setFilters,
    previousFilters,
    queryInputRef
}:FilterPage)=>{

        // useHooks - ItemPage.FilterPage - 
        
        const {slidePageTo} = useSlidePage()
        // --------------------------------------------------------------------------------------------------------------

        // useState - ItemPage.FilterPage - 
        const [itemData,setItemData] = useState<ItemDict | {}>({...previousFilters.current})
        const [NextPage,setNextPage] = useState<React.ReactNode>(null)
        // --------------------------------------------------------------------------------------------------------------


        // useRef - ItemPage.FilterPage - 
        const itemPropTypeDict = useRef<ItemType[][]>([])
        const propsUpdated = useRef(false)
        // --------------------------------------------------------------------------------------------------------------

        // handleFunctions - ItemPage.FilterPage - 
        const handleClearFilters = ()=>{
            if(queryInputRef.current){
                queryInputRef.current.value = ''
            }
            previousFilters.current = {}
            setFilters({})
            slidePageTo({addNumber:-1})
            
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
                    
                    tempKey = key + '.subject' + '.id'
                    buildFilterDict[tempKey] = {'operation':'in','value':value.map((obj:ItemDict) => obj.id)}
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
            slidePageTo({addNumber:-1})
            
            
        }
        // --------------------------------------------------------------------------------------------------------------

        // maps - ItemPage.FilterPage - 
        if('type' in itemData && 'category' in itemData && !propsUpdated.current){
            const targetMapTypeDict:ItemType | undefined = ItemTypeMap[itemData['category']].find(obj => obj.displayName == itemData.type)
            
            if( targetMapTypeDict && 'next' in targetMapTypeDict){
                targetMapTypeDict.next?.forEach(dictName =>{
                    const nextDict:ItemType[]= ItemTypeMap[dictName]
                    
                    itemPropTypeDict.current.push( nextDict )
                })

                propsUpdated.current = true
            }
            
        }
        // --------------------------------------------------------------------------------------------------------------

        
    
    return (
        <DataContext.Provider value={{data:itemData,setData:setItemData,setNextPage:setNextPage}}>
            <div className="flex-column padding-top-40 padding-bottom-20" style={{height:'100dvh'}}>

                {NextPage && 
                    <SlidePage BodyComponent={NextPage}/>
                }

                <ItemPropsComp 
                    pageSetUp={new Set(['noHistory','noNotes','noImages'])}
                    CurrencyInputsComponent={CurrencyInputsFilters}
                />

                

                {/* Notes Search Btn */}
                <div className="flex-row border-bottom "
                
                >
                    <MemorizedNoteSearchBtn setItemData ={setItemData}
                        notesList={'notes' in itemData && itemData.notes !== null ? itemData.notes : []}
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
        </DataContext.Provider>
    )
}


interface HandleMapSettings{
    toggleFilters:()=>void
    toggleOfflineItems:()=>void
    toggleSelectionMode:()=>void

}
interface ItemPageSettings{
    displayName:string
    icon:React.ReactNode
    property: keyof HandleMapSettings
}
interface TopInteractiveMenu{
    currentFilters:any,
    setFilters:React.Dispatch<React.SetStateAction<{}>>,
    previousFilters:React.RefObject<{}>,
    selectionMode:boolean,
    setSelectionMode:React.Dispatch<React.SetStateAction<boolean>>,
    handleDelitionItems:()=>void,
    setForceRenderParent:React.Dispatch<React.SetStateAction<boolean>>
}
const ItemPageSettings = [
    {'displayName':'Filters','icon':<FilterIcon/>,'property':'toggleFilters'},
    {'displayName':'Select','icon':<CheckBoxIcon/>,'property':'toggleSelectionMode'},
    {'displayName':'Offline Items','icon':'c','property':'toggleOfflineItems'}
] satisfies ItemPageSettings[]
const ItemPageSettingSelectionMode =[
    {'displayName':'Filters','icon':<FilterIcon/>,'property':'toggleFilters'},
    
]satisfies ItemPageSettings[]

const TopInteractiveMenu = ({
    currentFilters,
    setFilters,
    previousFilters,
    selectionMode,
    setSelectionMode,
    handleDelitionItems,
    setForceRenderParent
}:TopInteractiveMenu)=>{

    // useHooks - ItemPage.TopInteractiveMenu - 
    const {setNextPage} = useSetNextPage() 
    const {slidePageTo} = useSlidePage()

    // --------------------------------------------------------------------------------------------------------------

    // useState - ItemPage.TopInteractiveMenu - 
    const [toggleScanner,setToggleScanner] = useState(false)
    const [toggleSelectPopup,setToggleSelectPopup] = useState(false)
    const [toggleOfflineItems,setToggleOfflineItems] = useState(false)
    // --------------------------------------------------------------------------------------------------------------


    // useRef- ItemPage.TopInteractiveMenu - 
    const topMenuInteractionRef = useRef<HTMLDivElement>(null)
    const timeoutInputRef = useRef<number | null>(null)
    const queryInputRef= useRef<HTMLInputElement>(null!)
    const popupSettingsList = useRef<ItemPageSettings[]>([])
    // --------------------------------------------------------------------------------------------------------------


    // maps - ItemPage.TopInteractiveMenu - 
    if(selectionMode){
        popupSettingsList.current = ItemPageSettingSelectionMode
    }else{
        popupSettingsList.current = ItemPageSettings
    }

    const handleMap:HandleMapSettings = {
        'toggleFilters':()=>{
            slidePageTo({addNumber:1});
            setNextPage(
                <FilterPage setFilters={setFilters} previousFilters={previousFilters} queryInputRef={queryInputRef}/>
            )
        },
        'toggleOfflineItems':()=>{
            slidePageTo({addNumber:1})
            setNextPage(
                <OfflineItemsPage forceRenderMain={setForceRenderParent}/>
            )
        },
        'toggleSelectionMode':()=>{setSelectionMode(true)},
    }
    // --------------------------------------------------------------------------------------------------------------


    // handleFunctions - ItemPage.TopInteractiveMenu - 
    const handleShowInput= ()=>{

        if(!topMenuInteractionRef.current) return;
        const idKey = 'filterSearch'

        const majorParent = topMenuInteractionRef.current
        if(!majorParent) return;
        const queryInput = majorParent.querySelector(`#${idKey}InputContainer`)
        if(!(queryInput instanceof HTMLElement)) return;

        queryInput.classList.toggle('hidden')
        majorParent.classList.toggle('bg-containers')

        majorParent.querySelector(`#${idKey}Close`)?.classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}Status`)?.classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}SearchIcon`)?.classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}ThreeDotIcon`)?.classList.toggle('hidden')
        majorParent.querySelector(`#${idKey}CheckBoxIcon`)?.classList.toggle('hidden')
        queryInput.querySelector('input')?.focus()
    }

    const handleInputSearch = (value:string) =>{
        
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
    
    // --------------------------------------------------------------------------------------------------------------
   

    // useEffect - ItemPage.TopInteractiveMenu - 
    useEffect(()=>{

        return ()=>{
            if(timeoutInputRef.current){
                clearTimeout(timeoutInputRef.current)
            }
        }
    },[])
    // --------------------------------------------------------------------------------------------------------------

    
    return (
        <div className="flex-row width100 padding-10 bg-primary" style={{boxShadow:'0 0 10px rgba(0,0,0,0.3)'}}>
           
           
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
                    onClick={()=>{
                        slidePageTo({addNumber:1})
                        setNextPage(
                            <ItemScanner 
                                handleDelitionItems={handleDelitionItems}
                                setForceRenderParent={setForceRenderParent}
                            />
                        )
                    }}
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
                                onSelect={
                                    (obj:ItemPageSettings)=>{
                                        handleMap[obj.property]()
                                    }
                                }
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

    // useContext - ItemPage.tsx - Server message across all app
    const {showMessage} = useContext(ServerMessageContext)
    
    // --------------------------------------------------------------------------------------------------------------

    // useState  - ItemPage.tsx - 
    const [dataList,setDataList] = useState<ItemDict[]>([])
    const [filters,setFilters] = useState({})
    const [forceRender,setForceRender]= useState(false)
    const [toggleBatchEdit,setToggleBatchEdit] = useState(false)
    const [selectionMode,setSelectionMode] = useState(false)
    const [selectedItems,setSelectedItems] = useState<{[key:string]:ItemDict}>({})
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)
    // --------------------------------------------------------------------------------------------------------------

    // useRef - ItemPage.tsx - 
    const previousFilters = useRef({})
    const lastLoad = useRef(false)
    const imgBlobs = useRef([])
    // --------------------------------------------------------------------------------------------------------------
   
    // useHooks - ItemPage.tsx - 
    const {slidePageTo} = useSlidePage()
    const {doFetch,loading} = useFetch()
    const {handlePressStart,handlePressEnd,handleTouchMove} = useLongPressAction({
        selectionMode:true,
        skipFirstClick:false,
        handleActionWhenPress:(_e:React.TouchEvent<HTMLElement>,itemObj)=>{
            const objKey:string = itemObj['article_number']
            setSelectedItems(prev => {
                const {[objKey]:_,...current} = prev; 
                return current
            })
        },
    })
    // --------------------------------------------------------------------------------------------------------------
    
    // useEffect  - ItemPage.tsx - 
    useEffect(()=>{
        lastLoad.current = false
        const pageFetch = async ()=>{
            const res = await handleFetch()
            setDataList(res)
        }
        if(!loading){
            pageFetch()

        }

       return ()=>{
            if(imgBlobs.current.length > 0){
                imgBlobs.current.forEach(blob => URL.revokeObjectURL(blob))
            }

       }

    },[filters,forceRender])
    // --------------------------------------------------------------------------------------------------------------
    
    // handleFunctions - ItemPage.tsx - 
    const handleDelitionItems = async (
        articleNumbersList:string[] = [] 
    ) => {

        const fetchDict = {
            model_name:'Item',
            object_values:{
                'query_filters':{'article_number':{'operation':'in','value':articleNumbersList}},
                'delition_type':'delete_all'
            },
            reference:'Item'
        }

        const res = await doFetch({
            url:'/api/schemes/delete_items',
            method:'POST',
            body:fetchDict
        })
        
        if(res && res.status == 200){
            showMessage(res)
        }

        if(selectionMode){
            setSelectionMode(false)
            setSelectedItems({})
        }
        setForceRender(prev=> !prev)

    }

    const handleFetch = async (
        scrolling:string='',
        fetchPerPage:number=180,
        itemsListId:number[]=[]
    ) => {
            
            const getFetchDict:GetFetchDictProps = {
                model_name:'Item',
                requested_data:['id','type','article_number','reference_number','properties','images'],
                query_filters:filters,
                per_page:fetchPerPage,
            }

            if( scrolling == 'down' && dataList.length > 0){
                const lastItem:ItemDict= dataList[dataList.length - 1]
                getFetchDict['cursor'] = lastItem.id
            }else if( scrolling == 'up' && itemsListId.length > 0){
                const newFilters = {...getFetchDict['query_filters'], 'id': {'operation':'in','value':itemsListId}}
                getFetchDict.query_filters = newFilters
            }
            
            const res = await doFetch({
                url:'/api/schemes/get_items',
                method:'POST',
                body:getFetchDict
            })

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
    // --------------------------------------------------------------------------------------------------------------
    

    
    return ( 
        <SetNextPageContext.Provider value={{setNextPage}}>
            <div className="flex-column  width100" style={{height:'100vh'}}>
                {NextPage && 
                    <SlidePage BodyComponent={NextPage} />
                }

                <TopInteractiveMenu currentFilters={filters} 
                    setFilters={setFilters} 
                    previousFilters={previousFilters} 
                    selectionMode={selectionMode} 
                    setSelectionMode={setSelectionMode} 
                    handleDelitionItems={handleDelitionItems} 
                    setForceRenderParent={setForceRender} 
                />
                <div className="width100" style={{zIndex:1}}
                    
                >
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
                                }),
                                componentOptionsToSelect:[
                                    <BatchPrintBtn selectedItems={selectedItems} key={'mainPageBatchPrint'}/>,
                                    <BatchEditBtn setToggleBatchEdit={setToggleBatchEdit} selectedItems={selectedItems} key={'mainPageBatchEdit'}
                                        setNextPage={()=>{
                                            slidePageTo({addNumber:1})
                                            setNextPage(
                                                <ItemEdit 
                                                    preRenderInfo={{'article_number':Object.keys(selectedItems)}}
                                                    fetchWhenOpen={false}
                                                    setForceRenderParent={setForceRender}
                                                    handleDelitionItems={handleDelitionItems}
                                                    pageSetUp={new Set(['noHistory','noImages','noType','noCategory','noIssues'])}
                                                />
                                            )
                                        }}
                                    />
                                ]
                            }}
                        />
                    }
                   
                </div>
                
                
                    {dataList && 
                        <ItemsPreviewList 
                            data={dataList} 
                            handleDelitionItems={handleDelitionItems} 
                            setForceRenderParent={setForceRender}
                            fetchWhenOpen={true}
                            selectionMode={selectionMode}
                            setSelectionMode={setSelectionMode}
                            selectedItems={selectedItems}
                            setSelectedItems ={setSelectedItems}
                            selectionTargetKey = {'article_number'}
                            handleScroll={handleScroll}
                            containerHeight ={'70px'}   
                            loaders ={{
                                ScrollDown_Loading,
                                ScrollUp_Loading,
                                loading
                            }}
                        />
                    }
                   
                

                <NavigationBtn 
                    forceRenderParent={setForceRender}
                />
            </div>
        </SetNextPageContext.Provider>
     );
}
 
export default ItemsPage;