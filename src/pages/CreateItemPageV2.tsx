import {useState,useEffect,useRef,memo} from 'react'
import {useNavigate} from 'react-router'
import {ItemPropsComp} from '../componentsV2/ItemEdit.tsx'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'
import CheckMarkIcon from '../assets/icons/CheckMarkIcon.svg?react'
import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import {useSaveItemsV2} from '../hooks/useSaveItemsV2.tsx'
import SelectPopupV2 from '../componentsV2/SelectPopupV2.tsx'

import LoaderDots from '../components/LoaderDots.tsx'
import usePrintLabelWiFi from  '../hooks/usePrintLabelWiFi.tsx'
import {CurrencyInputsPurchase} from '../componentsV2/CurrencyInputs.tsx'



let settingsList =[
    {'displayName':'Fast Slider', 'property':'toggleFastSlider','icon':''},
    {'displayName':'some setting', 'property':'some property'}
]





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


// on creation item should :
//  not be able to place sold_cost
//  double check that the required keys for item creation are getting check 
// 

const CreateItemPageV2 = () => {
    const [itemData,setItemData] = useState({})
    const [toggleSettings,setToggleSettings] = useState(false)
   
    const {uploadItem,itemUploading,setUploading} = useSaveItemsV2()
    const navigate = useNavigate()
    const [afterCompletion,setAfterCompletion] = useState(false)
    const {printLabel,isPrinterConnected} = usePrintLabelWiFi({
        itemData:itemData
    })
    const firstPageLoad = useRef(false)
    const activeSlider = useRef(JSON.parse(localStorage.getItem('activeSlider') || 'false'))
    const sliderStep = useRef(0)
    const subPropCount = useRef(0)
    const settingsSelectedOptions = useRef<Set<string>>(new Set([activeSlider.current ? 'Fast Slider': '']))
    const timeoutRef = useRef(null)

    const activateCamera = (imageBtn)=>{
        const touchObj = new Touch({
                    identifier:Date.now(),
                    target:imageBtn,
                    clientX:0,
                    clientY:0,
                })
        const touchEndEvent = new TouchEvent("touchend",{
            bubbles:true,
            cancelable:true,
            touches:[],
            targetTouches:[],
            changedTouches:[touchObj]
        })

        imageBtn.dispatchEvent(touchEndEvent)
    }
    const activateProp = (targetElement)=>{
        targetElement.click()
    }
    const focusProp = (targetElement)=>{
        targetElement.focus()
    }
    
    const sliderOrder = [
        {'id':'dealer','action':activateProp},
        {'id':'images','action':activateCamera},
        {'id':'category','action':activateProp},
        {'id':'type','action':activateProp},
        {'id':'subprop','action':activateProp},
        {'id':'printLabel','action':activateProp},
        {'id':'purchased_price','action':focusProp},
    ]
    
    const updateSliderStep = (counterToUpdate)=>{
        counterToUpdate.current ++
        
        const currentDict = sliderOrder[sliderStep.current]

       
        activeSlideShow(currentDict)
    }


    const activeSlideShow  = (currentDict)=>{
        if(!currentDict){
            activeSlider.current = false
            return
        }

        if(currentDict.id == 'printLabel'){
            const target = document.getElementById('printLabel')
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
             
                    if(!('properties' in itemData)  || !(subPropName in itemData.properties)){
                        
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
            const threshold = updateSliderStep(sliderStep)
            if(threshold){
                activeSlider.current = false
                return
            }
        }
    }

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

   


    const handleSettingSelection = (settingObj)=>{
        console.log(settingObj)
        if(settingObj.property == 'toggleFastSlider'){
            activeSlider.current = !activeSlider.current
            if( activeSlider.current){
                settingsSelectedOptions.current.add('Fast Slider')
                localStorage.setItem('activeSlider',JSON.stringify(true))
            }else{
                settingsSelectedOptions.current.delete('Fast Slider')
                localStorage.setItem('activeSlider',JSON.stringify(false))
            }
            
        }
        setToggleSettings(false)
    }

    const handleSaveItem = async () =>{
       
        if(itemUploading)return;
        const upload = await uploadItem({
            itemData,
            type:'create',
            allowArticleChange:true
        })
        setUploading(false)
        if(upload.success || 'fetchType' in itemData){
            console.log(itemData,'the data coming from upload item in if statemtment')
            setAfterCompletion(true)
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

 

   
    return ( 
        <div className="flex-column width100" style={{height:'100dvh'}}>
            
           


            {/* header */}
            <div className="flex-row padding-05 " style={{boxShadow:"0 0 10px rgba(0,0,0,0.3)"}}>
                <div className="flex-column content-center">
                    <div className="btn svg-18"
                        onClick={()=>{navigate(-1)}}
                    >
                        <ArrowIcon/>
                    </div>
                </div>
                <div className="flex-column flex-1 items-center content-center">
                    <span className="text-15">
                        {'article_number' in itemData && itemData.article_number}
                    </span>
                </div>
                <div className="flex-column content-center" style={{position:'relative'}}>
                    <div role='button' className="svg-15 btn"
                        onClick={()=>{setToggleSettings(true)}}
                    >
                        <ThreeDotMenu/>
                    </div>
                    {toggleSettings && 
                        <SelectPopupV2 
                            right={'80%'}
                            top={'130%'}
                            setTogglePopup={setToggleSettings}
                            listOfValues={settingsList}
                            onSelect={handleSettingSelection}
                            selectedOption={settingsSelectedOptions.current}
                        />
                    }
                </div>
            </div>

            <ItemPropsComp
                itemData={itemData}
                setItemData={setItemData}
                pageSetUp={new Set(['noHistory'])}
                CurrencyInputsComponent={CurrencyInputsPurchase}
            />
           

            {/* btn interactions container */}
            <div className="flex-column gap-05  push-bottom  padding-bottom-30">
                <div className="flex-row padding-10">
                    <div role="button" className={`btn width100 bg-containers  padding-10 ${isPrinterConnected}`}
                        id='printLabel'
                        onClick={ ()=>{try{printLabel()}catch(err){console.log(err)}}}
                    >
                        <span className=" text-15">Print Label</span>
                    </div>
                </div>

                {afterCompletion ? 
                    <div className="flex-row padding-10 gap-4">
                        <div role="button" className="btn width100 flex-column border-blue padding-15"
                        onClick={()=>{handleSaveItem()}}
                        >
                            <span className="text-15">Update</span>
                        </div>
                        <div role="button" className="btn width100 flex-column  padding-15" style={{backgroundColor:'rgb(30, 145, 78)'}}
                        onClick={()=>{handleResetPage()}}
                        >
                            <span className="text-15">Next</span>
                        </div>
                    </div>

                :
                    <div className="flex-row   padding-10">
                        <div role="button" className="btn width100 bg-secondary padding-10"
                            onClick={()=>{handleSaveItem()}}
                        >
                            {itemUploading ? 
                                <LoaderDots
                                    dotStyle={{dimensions:'squareWidth-07',bgColor:'bg-primary'}}
                                    mainBg={'white'}
                                />
                        :
                            <span className="color-primary text-15">Create Item</span>
                        }
                        </div>
                    </div>
                }
                
               
            </div>
        </div>
     );
}
 
export default CreateItemPageV2;