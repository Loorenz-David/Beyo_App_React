import {useState,useEffect,useRef,useContext} from 'react'

import {ServerMessageContext} from '../../contexts/ServerMessageContext.tsx'
import {DataContext} from '../../contexts/DataContext.tsx'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'

import ThreeDotMenu from '../../assets/icons/General_Icons/ThreeDotMenu.svg?react'
import FastSliderIcon from '../../assets/icons/General_Icons/FastSliderIcon.svg?react'

import {CurrencyInputsPurchase} from './CurrencyInputs.tsx'
import {ItemPropsComp} from './ItemEdit.tsx'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'
import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'
import {HeaderSlidePage} from '../Navigation_Components/HeaderSlidePage.tsx'

import {useSaveItemsV2} from '../../hooks/useSaveItemsV2.tsx'
import {readArticleNumber} from '../../hooks/useReadableArticleNumber.tsx'
import SelectPopupV2 from './SelectPopupV2.tsx'
import usePrintLabelWiFi from  '../../hooks/usePrintLabelWiFi.tsx'


import type {ItemDict} from '../../types/ItemDict.ts'


interface SettingsDict{
    displayName:string
    property:string
    icon?:any
}

let settingsList:SettingsDict[] =[
    {'displayName':'some setting', 'property':'some property'}
]

interface SliderOrder{
        id:string
        action:(element:HTMLElement)=>void
    }


// useHook - CreateItemPageV2.CreateItemPageV2 - 
const generateArticleNumber = () =>{
    const now = new Date()
    const year =  now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2,'0')
    const date =  String(now.getDate()).padStart(2,'0')
    const hour =  String(now.getHours()).padStart(2,'0')
    const minute =  String(now.getMinutes()).padStart(2,'0')
    const second = String(now.getSeconds()).padStart(2,'0')
    

    const articleNumber = year + month + date + hour + minute + second
   return articleNumber
}
// --------------------------------------------------------------------------------------------------------------

interface CreateItemPageProp {
    forceRenderParent?: React.Dispatch<React.SetStateAction<boolean>> | null
}

const CreateItemPageV2 = ({
    forceRenderParent=null
}:CreateItemPageProp) => {

    // useContext - CreateItemPageV2.CreateItemPageV2 - 
    const {showMessage} = useContext(ServerMessageContext)
    const [itemData,setItemData] = useState<Partial<ItemDict>>({})
    const {currentPageIndex} = useSlidePage()

    // --------------------------------------------------------------------------------------------------------------

    // useState - CreateItemPageV2.CreateItemPageV2 - 
    const [toggleSettings,setToggleSettings] = useState(false)
    const [afterCompletion,setAfterCompletion] = useState(false)
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)
    // --------------------------------------------------------------------------------------------------------------
    
    // useHooks - CreateItemPageV2.CreateItemPageV2 - 
    const {uploadItem,itemUploading,setUploading} = useSaveItemsV2()
    const {printLabel,isPrinterConnected} = usePrintLabelWiFi({
        itemData:itemData
    })
    // --------------------------------------------------------------------------------------------------------------

    // useRef - CreateItemPageV2.CreateItemPageV2 - 
    const timeoutRef = useRef<number>(null)
    const activeSlider = useRef(JSON.parse(localStorage.getItem('activeSlider') || 'false'))
    const settingsSelectedOptions = useRef<Set<string>>(activeSlider.current ? new Set(['Fast Slider']) : new Set())
    const firstPageLoad = useRef(false)
    const sliderStep = useRef(0)
    const subPropCount = useRef(0)
    const recordedItemPage = useRef<number | null>(null)
    const hasUploadItem = useRef(false)

    const [pageSetUp,setPageSetUp] = useState(activeSlider.current ? new Set(['noHistory','fastSlider']) : new Set(['noHistory']))

    // --------------------------------------------------------------------------------------------------------------


    // helperFunctions - CreateItemPageV2.CreateItemPageV2 - 
    const activateCamera = (imageBtn:HTMLElement)=>{
        imageBtn.click()
    }
    const activateProp = (targetElement:HTMLElement)=>{
        targetElement.click()
    }
    const focusProp = (targetElement:HTMLElement)=>{
        targetElement.focus()
    }
    const sliderOrder:SliderOrder[] = [
        {'id':'dealer','action':activateProp},
        {'id':'images','action':activateCamera},
        {'id':'category','action':activateProp},
        {'id':'type','action':activateProp},
        {'id':'subprop','action':activateProp},
        {'id':'purchased_price','action':focusProp},
    ]
    
    const updateSliderStep = (
        counterToUpdate:React.RefObject<number>
    )=>{

        counterToUpdate.current ++
        
        const currentDict = sliderOrder[sliderStep.current]

        
        activeSlideShow(currentDict)

    }
    const activeSlideShow  = (currentDict:SliderOrder)=>{
        if(!currentDict){
            activeSlider.current = false
            return
        }

        if(currentDict.id == 'printLabel'){
            const target = document.getElementById('printLabel') as HTMLDivElement
            if(target){
                currentDict.action(target)
            }
            updateSliderStep(sliderStep)
        }

        if(currentDict.id == 'subprop'){
           
            const targetElement = document.getElementById('ItemProperties')
           
            if(targetElement){
                const children = Array.from(targetElement.children) as HTMLElement[]
               
                if(children.length > 0 && subPropCount.current < children.length){
                    const subPropName = children[subPropCount.current].getAttribute('id')

                    if(!subPropName) return;

                    if(!itemData.properties  || !(subPropName in itemData.properties)){
                        currentDict.action(children[subPropCount.current])
                    }else{
            
                        updateSliderStep(subPropCount)
                        return
                    }
                }else{
                    updateSliderStep(sliderStep)
                    return
                }

            }
        }
        if(currentDict && !(currentDict.id in itemData)){
            const targetElement = document.getElementById(currentDict.id)
            if(targetElement){
              currentDict.action(targetElement)
            }
        }else{
            updateSliderStep(sliderStep)
            return
        }
    }
    // --------------------------------------------------------------------------------------------------------------

    // useEffect - CreateItemPageV2.CreateItemPageV2 - 

    useEffect(()=>{
        if(!firstPageLoad.current){
            firstPageLoad.current = true
            setItemData(prev => ({...prev,
            'article_number':generateArticleNumber(),
            'state':'In-Standby',
            'location':'In-Dealer'
            }))
        }

        if(!activeSlider.current) return;

        const currentDict = sliderOrder[sliderStep.current]
        timeoutRef.current = setTimeout(()=>{ activeSlideShow(currentDict)},200)
       

       
        return ()=>{
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }
        }

    },[itemData])


    useEffect(()=>{
        if(typeof recordedItemPage.current == 'number' && typeof currentPageIndex == 'number'){
            if(hasUploadItem.current &&  currentPageIndex < recordedItemPage.current  && forceRenderParent !== null){
                
                forceRenderParent(prev => !prev)
                hasUploadItem.current = false
            }
        }

        if(recordedItemPage.current === null && typeof currentPageIndex == 'number') {
            recordedItemPage.current = currentPageIndex + 1
        }

        

    },[currentPageIndex])
    // --------------------------------------------------------------------------------------------------------------
    

    // handleFunctions - CreateItemPageV2.CreateItemPageV2 - 
    const handleSettingSelection = (settingObj:SettingsDict)=>{
        
        setToggleSettings(false)
    }

    const handleSaveItem = async (actionType:'update' | 'create' ) =>{
       
        if(itemUploading){
            showMessage({
                message:'Item is uploadin.',
                status:400
            })
            return
        }
        setUploading(true)
        const upload = await uploadItem({
            itemData,
            type:actionType,
            allowArticleChange:true
        })
        setUploading(false)
        if(upload.success || 'fetchType' in itemData){
            
            setAfterCompletion(true)
            hasUploadItem.current = true
        }
    }
    const handleResetPage = ()=>{
        const artNum = generateArticleNumber()
        setItemData(prev =>{
            const {dealer,state,location} = prev
            return{dealer,state,location,article_number:artNum}
        })
        sliderStep.current = 0
        subPropCount.current = 0
        if(JSON.parse(localStorage.getItem('activeSlider') || 'false')){
            activeSlider.current = true
        }

        setAfterCompletion(false)

    }
    // --------------------------------------------------------------------------------------------------------------
    
    return ( 
            <DataContext.Provider value={{data:itemData,setData:setItemData, setNextPage}}>
                
                <div className="flex-column width100" style={{height:'100dvh',overflow:'hidden'}}>
                  
                    {NextPage && 
                        <SlidePage BodyComponent={NextPage}/>
                    }

                    {/* header */}
                    <HeaderSlidePage 
                        middleElement={
                            <div className="flex-column flex-1 items-center content-center">
                                <span className="text-15">
                                    {itemData.article_number ? readArticleNumber(itemData.article_number): ''}
                                </span>
                            </div>
                        }
                        rightElement={
                            <div className="flex-row content-center gap-05" style={{position:'relative'}}>
                                  <div className={`svg-15 btn ${activeSlider.current ? 'svg-bg-blue': ''}`}
                                    
                                    onClick={()=>{
                                        let messageText = "Fast Slider "
                                        activeSlider.current = !activeSlider.current
                                        if( activeSlider.current){
                                            setPageSetUp(new Set(['noHistory','fastSlider']))
                                            settingsSelectedOptions.current.add('Fast Slider')
                                            localStorage.setItem('activeSlider',JSON.stringify(true))
                                            messageText += 'Activated'
                                        }else{
                                            setPageSetUp(new Set(['noHistory']))
                                            settingsSelectedOptions.current.delete('Fast Slider')
                                            localStorage.setItem('activeSlider',JSON.stringify(false))
                                            messageText += 'Deactivated'
                                        }
                                        showMessage({
                                            message:messageText,
                                            status:200
                                        })
                                    }}
                                >
                                    <FastSliderIcon/>
                                </div>
                                <div className="svg-15 btn"
                                    onClick={()=>{setToggleSettings(true)}}
                                >
                                    <ThreeDotMenu/>
                                </div>
                                {toggleSettings && 
                                    <SelectPopupV2 
                                        right={'35%'}
                                        top={'130%'}
                                        setTogglePopup={setToggleSettings}
                                        listOfValues={settingsList}
                                        onSelect={handleSettingSelection}
                                        selectedOption={settingsSelectedOptions.current}
                                        zIndex={3}
                                    />
                                }
                            </div>
                        }
                    />
                   
                    <div className="flex-column padding-top-05" style={{height:'100dvh',overflowY:'auto'}}>
                        <ItemPropsComp
                            pageSetUp={pageSetUp}
                            CurrencyInputsComponent={CurrencyInputsPurchase}
                        />
                    

                        {/* btn interactions container */}
                        <div className="flex-column gap-05  padding-top-30">
                            

                            {afterCompletion ? 
                                <div className="flex-row padding-10 gap-4">
                                    <button className="btn width100 flex-column border-blue padding-15"
                                    onClick={()=>{handleSaveItem('update')}}
                                    >
                                        <span className="text-15">Update</span>
                                    </button>
                                    <button className="btn width100 flex-column  padding-15" style={{backgroundColor:'rgb(30, 145, 78)'}}
                                    onClick={()=>{handleResetPage()}}
                                    >
                                        <span className="text-15">Next</span>
                                    </button>
                                </div>

                            :
                                <div className="flex-row   padding-10">
                                    <button className="btn width100 bg-secondary padding-10"
                                        onClick={()=>{handleSaveItem('create')}}
                                    >
                                    {itemUploading ? 
                                            <LoaderDots
                                                dotStyle={{dimensions:'squareWidth-07',bgColor:'bg-primary'}}
                                                mainBg={'white'}
                                            />
                                    :
                                        <span className="color-primary text-15">Create Item</span>
                                    }
                                    </button>
                                </div>
                            }

                            <div className="flex-row padding-10">
                                <button role="button" className={`btn width100 bg-containers  padding-10 ${isPrinterConnected}`}
                                    id='printLabel'
                                    onClick={ ()=>{try{printLabel()}catch(err){console.log(err)}}}
                                >
                                    <span className=" text-15">Print Label</span>
                                </button>
                            </div>
                            
                        
                        </div>
                    </div>
                    
                </div>
             </DataContext.Provider>
        
     );
}
 
export default CreateItemPageV2;