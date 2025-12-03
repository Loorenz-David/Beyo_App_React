import {useEffect,useState,useRef,useContext} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import '../../css/scanner-styles.css'

import {useSlidePage} from '../../contexts/SlidePageContext.tsx'
import {DataContext} from '../../contexts/DataContext.tsx'

import LensIcon from '../../assets/icons/General_Icons/LensIcon.svg?react'
import FlashIcon from '../../assets/icons/General_Icons/FlashIcon.svg?react'
import EditIcon from '../../assets/icons/General_Icons/EditIcon.svg?react'
import MinusCircleIcon from '../../assets/icons/General_Icons/MinusCircleIcon.svg?react'
import OpenFolderIcon from '../../assets/icons/General_Icons/OpenFolderIcon.svg?react'
import ThreeDotMenu from '../../assets/icons/General_Icons/ThreeDotMenu.svg?react'

import {ItemPropsComp} from './ItemEdit.tsx'
import {CurrencyInputsPurchase} from './CurrencyInputs.tsx'
import {ItemEdit} from './ItemEdit.tsx'
import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'
import {HeaderSlidePage} from '../Navigation_Components/HeaderSlidePage.tsx'

import{ServerMessageContext} from '../../contexts/ServerMessageContext.tsx'

import {useSaveItemsV2} from '../../hooks/useSaveItemsV2.tsx'
import {readArticleNumber} from '../../hooks/useReadableArticleNumber.tsx'
import {useSlidePageTouch} from '../../hooks/useSlidePageTouch.tsx'

import type {ItemDict} from '../../types/ItemDict.ts'




const ScannerComponent = ({setScannedItem,showMessage,forceActions,zIndex}) => {

    const scannerRef = useRef<HTMLElement | null>(null)
    const frozenFrameRef = useRef<HTMLElement | null>(null)



    const Html5QrCode = useRef<any>(null)

    const  [cameraId,setCameraId] = useState(localStorage.getItem('cameraId') ?? "")
    const [cameraLenses,setCameraLenses] = useState([])
    const [toggleLenses,setToggleLenses] = useState(false)
    const [torchOn,setTorchOn] =  useState(false)

    const config = {
            fps:10
        }

    const toggleFrozenFrame = ()=>{
        scannerRef.current?.classList.toggle('hide')
        frozenFrameRef.current?.classList.toggle('hide')
    }
    const drawImageFromScanner = ()=>{
        if(!scannerRef.current) return

        const frozenElement = frozenFrameRef.current?.querySelector('img')
        const videoElement = scannerRef.current?.querySelector('#qr-reader video')
        if(videoElement && frozenElement){
            const canvas = document.createElement('canvas')
            canvas.width = videoElement.videoWidth
            canvas.height = videoElement.videoHeight

            const ctx = canvas.getContext("2d")
            if(ctx){
                ctx.drawImage(videoElement,0,0,canvas.width,canvas.height)
                const frameDataUrl = canvas.toDataURL("image/png")
                frozenElement.src = frameDataUrl
            }
        }

    }
    const bounceScanner = ()=>{
        const scannerRow = scannerRef.current.closest('.scannerRow')
        scannerRow.classList.toggle('bounce-animation')
    }

    const handleResummeScanner = (withAnimations=true)=>{
        if(!Html5QrCode.current) return

        const status = Html5QrCode.current.getState()
        if(status === 3){
            if(withAnimations){
                toggleFrozenFrame()
                bounceScanner()
                setScannedItem('')
            }
            // if(forceActions.forceScannerPause){
            //     forceActions.setForceScannerPause(false)
            // }
           
            Html5QrCode.current.resume()
        }
    }
    
    const handlePauseScanner = (withAnimation=true)=>{
         if(!Html5QrCode.current) return

        const status = Html5QrCode.current.getState()
        if(status === 2){
            Html5QrCode.current.pause()
            Html5QrCode.current.hidePausedState()

            if(withAnimation){
                drawImageFromScanner()
                toggleFrozenFrame()
                bounceScanner()
            }
        }
    }

    const onScann = (decodedText)=>{

        navigator.vibrate(100)
        

        handlePauseScanner()

        if(!decodedText.includes('Art:')){
            showMessage({status:400,message:`Invalid Qr code.`,complementMessage:`qr code should contain "Art:" and "article_number". Example: Art:01202030321`})
            return
        }
        const extractedArt = decodedText.replace('Art:','')
        setScannedItem(extractedArt)



    }

    const stopScanner = async ()=>{
          const state = Html5QrCode.current.getState();

            if( state === 2 ) {
                await Html5QrCode.current.stop();
            }
    }

    const startScanner = async (passCameraId='')=>{
        if(!Html5QrCode.current ) return
        try{ 

            await Html5QrCode.current.start(
                passCameraId !== '' ? passCameraId: {facingMode:'environment'},
                config,
                onScann,
                (errorMessage)=>{console.log('error starting scanner',errorMessage)}
            )
            if (torchOn){
                setTorchOn(false)
            }
           

        }catch(err){
            console.log(err)
        }







    }
    useEffect(()=>{

        if(!scannerRef.current) return
        if(!Html5QrCode.current) Html5QrCode.current = new Html5Qrcode("qr-reader");

        if(cameraLenses.length == 0){
            Html5Qrcode.getCameras()
            .then(cameras=> {
                setCameraLenses(cameras)

                
            })
            .then(_=>{
                startScanner(cameraId)
            })
        }

        return()=>{
            if(Html5QrCode.current){
                Html5QrCode.current.stop().catch(err => console.log('Error stopping scanner on unmount:', err));
            }

        }

    },[])


    useEffect(()=>{
        if(forceActions.forceScannerPause ){
            handlePauseScanner(false)
        }else{
            handleResummeScanner(false)
        }
    },[forceActions.forceScannerPause])


    const handleCameraLense = async(lenseOpt)=>{

        const state = Html5QrCode.current.getState();
        
        if( state !== 2 ) {
               return
        }
 
        setCameraId(lenseOpt.id)
        localStorage.setItem('cameraId',lenseOpt.id)
        
        await new Promise(res => setTimeout(res,100))

        await stopScanner()
        await startScanner(lenseOpt.id)
 
        
    }

    return (
        <div className="width100 items-center content-center  flex-row padding-20 scannerRow" style={{position:'relative'}}
        >
                <div className="flex-row gap-1 " style={{position:'absolute',top:'30px',left:'35px',backgroundColor:'rgba(43, 43, 43, 0.53)',borderRadius:'50px',zIndex: zIndex + 1}}>
                    <div className=" svg-12 padding-05 items-center content-center flex-column"
                        onClick={()=>{setToggleLenses(prev =>!prev)}}
                    >
                        <LensIcon/>
                    </div>
                    {toggleLenses &&
                        <div className="flex-row gap-1 padding-right-10"  >
                            {cameraLenses.map((lenseOpt,i) =>{

                                let isLenseSelected = ''
                                if(lenseOpt.id == cameraId){
                                    isLenseSelected = 'bg-green-ocean'
                                }

                                return(
                                        <div key={`lense_${i}`} role='button' className={`flex-column items-center content-center ${isLenseSelected}`} style={{padding:'5px 10px',borderRadius:'5px'}}
                                            onClick={(e)=>{handleCameraLense(lenseOpt,e)}}
                                        >
                                            <span style={{fontSize:'10px'}}>{i}</span>
                                        </div>
                                )
                            })}


                        </div>
                    }

                </div>
                <div className="flex-row" style={{position:'absolute',top:'30px',right:'35px',borderRadius:'50px',zIndex:zIndex + 1 ,overflow:'hidden'}}>
                    <div className={`flex-column items-center content-center padding-05 svg-12`} style={{backgroundColor:torchOn ? 'rgba(86, 216, 225, 1)' : 'rgba(43, 43, 43, 0.53)'}}
                        onClick={async()=>{

                            if(!Html5QrCode.current) return
                            try{

                                await Html5QrCode.current.applyVideoConstraints(

                                    {advanced:[{torch:!torchOn}]}
                                )
                                setTorchOn(prev => !prev)
                            }catch(err){
                                console.log(err)
                            }
                        }}
                    >
                            <FlashIcon />
                    </div>
                </div>

                <div className="width100  scanner  hide"  ref={frozenFrameRef}
                    style={{border:'1px solid rgba(74, 172, 95, 1)',boxShadow:'0 0 10px rgba(74, 172, 95, 0.84)',zIndex:zIndex + 1}}
                    onClick={()=>{handleResummeScanner()}}
                >
                        <img src="none"  className="width100 height100" style={{objectFit:'cover'}}/>
                </div>
                <div className="width100  scanner" id="qr-reader" ref={scannerRef} style={{backgroundColor:'rgba(175, 175, 175, 1)'}}>

                </div>
        </div>
     );
}


const AddScannerActionOptions = ({listOfOptions,setListOfOptions,currentPageIndexScanner})=>{

    const [addingOption,setAddingOption] = useState({})
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)
    const {slidePageTo,currentPageIndex} = useSlidePage()
    
    
    useEffect(()=>{
        
        if(currentPageIndexScanner !== null && currentPageIndexScanner < listOfOptions.length){
            setAddingOption(listOfOptions[currentPageIndexScanner])
            
        }else{
            setAddingOption({})
        }

    },[currentPageIndexScanner])
    
    const handleAddActionToScanner = ()=>{
        
        
        if(currentPageIndexScanner < listOfOptions.length) {
        
            setListOfOptions(prev=>{
                const newList = [...prev]
                newList[currentPageIndexScanner] = addingOption
               
                return newList
            })


        }else{
          
             setListOfOptions(prev=>([...prev,addingOption]))
        }

        localStorage.setItem('ScannerActions',JSON.stringify([...listOfOptions,addingOption]))

        slidePageTo({addNumber:-1})
    }

    return(
        <DataContext.Provider value={{data:addingOption,setData:setAddingOption,setNextPage:setNextPage}}>
            <div className="flex-column" style={{height:'100dvh'}}>
                {NextPage && 
                    <SlidePage BodyComponent= {NextPage}/>
                }
                
                
                <HeaderSlidePage 
                    middleElement={
                        <div className="flex-row content-center flex-1">
                            {currentPageIndexScanner !== null && currentPageIndexScanner < listOfOptions.length ?
                                <span className="text-15">Edit Action</span>
                            :
                                <span className="text-15"> Create Action</span>
                            }
                        </div>
                    }
                    rightElement={
                        <div style={{width:'40px'}}>

                        </div>
                    }
                />
                
                <ItemPropsComp
                    pageSetUp={new Set(['noHistory','noImages','noFetchNotes','noCategory','noType','noIssues','noDimensions','noDealer'])}
                    
                />

                <div className="flex-row width100 push-bottom padding-bottom-30 padding-10">
                    <div role='button' className="btn width100 bg-containers padding-10 border-blue"
                        onClick={()=>{handleAddActionToScanner()}}
                    >
                        <span className="text-15">Add Action</span>
                    </div>
                </div>
            </div>
        </DataContext.Provider>
    )
}


const ItemScanner = ({handleDelitionItems,setForceRenderParent}) =>{
    const sliderRef = useRef<HTMLDivElement>(null)
    const [listOfOptions,setListOfOptions] = useState<(Partial<ItemDict>| number)[]>([0])
   
    const [toggleOpenItem,setToggleOpenItem] = useState(false)
    const [scannedItem,setScannedItem] = useState('')

    const {uploadItem,itemUploading,setUploading} = useSaveItemsV2()
    const {showMessage} = useContext(ServerMessageContext)
    const activeActions = useRef(new Set())
    const firstLoad = useRef(false)
    const [forceScannerPause,setForceScannerPause] = useState(false)

    const [NextPageChild,setNextPageChild] = useState<React.ReactNode>(null)
    const {slidePageTo,currentPageIndex} = useSlidePage()
    const scannerPage = useRef<number | null>(null)
    

    const [currentPageIndexScanner,setCurrentPageIndexScanner] = useState<number>(0) 

     useEffect(()=>{    

        if(scannerPage.current === null){
            if(typeof currentPageIndex == 'number'){
                scannerPage.current = currentPageIndex + 1
            }
        }
        
        if(toggleOpenItem && scannedItem !== ''){
            
            openScannedItem()
            
        }

        if(!firstLoad.current){
            handelFirstLoad()
        }

    },[scannedItem])

    useEffect(()=>{
        if(scannerPage.current === null){
            if(typeof currentPageIndex == 'number'){
                scannerPage.current = currentPageIndex + 1
            }
        }
        if(typeof scannerPage.current === 'number' && typeof currentPageIndex === 'number'){
            if(scannerPage.current !== currentPageIndex){
                if(!forceScannerPause && scannedItem === ''){
                    console.log(currentPageIndex,'pausing as not equal')
                    setForceScannerPause(true)
                }
            }else if(forceScannerPause && scannedItem === ''){
                console.log(currentPageIndex,'resuming as equal')
                setForceScannerPause(false)
            }
        }
    },[currentPageIndex])

    
    

    
    const handelFirstLoad = async() =>{
        const saveActions = localStorage.getItem('ScannerActions')
            if(saveActions){
                setListOfOptions(JSON.parse(saveActions))
            }
        firstLoad.current = true
    }
    // i must fixed the scanner, it should stop when it is not seen....
    const handleActionAnimation = (state:boolean,page:number)=>{
        const idTarget = `optionScanner_${page}`
        
        if(!sliderRef.current) return;
            let targetElement = sliderRef.current.querySelector(`#${idTarget}`)!
        
            const contentOfAction:any = targetElement.querySelector('.contentOfAction')
            const actionNotification:any = targetElement.querySelector('.actionNotification')

        if(state){
        
            contentOfAction.style.transform =  ' translateY(-200%) '
            actionNotification.classList.toggle('hide')

            setTimeout(()=>{
                setTimeout(()=>{
                    navigator.vibrate(100)
                },100)
                
                actionNotification.style.transform = 'translateY(-700%)'
                actionNotification.style.opacity = '1'
                },10)


        }else if(!state){
                actionNotification.style.transform = 'translateY(0)'
                actionNotification.style.opacity = '0'
        
            setTimeout(()=>{
                contentOfAction.style.transform =  ' translateY(0) '
                setTimeout(()=>{
                    actionNotification.classList.add('hide')
                },300)
                

            },10)

        }
       

           
    }
    const openScannedItem = ()=>{
        setNextPageChild(
            <ItemEdit
                preRenderInfo={{'article_number':scannedItem}}
                handleDelitionItems={handleDelitionItems}
                setForceRenderParent={setForceRenderParent}
                fetchWhenOpen={true}
            />
        )
        slidePageTo({addNumber:1})
    }
    const handleSendAction = async ()=>{
        
        if(currentPageIndexScanner === 0 || scannedItem == '') return;
        const page = currentPageIndexScanner
        if(activeActions.current.has(page)){
            
            showMessage({
                message:'This action is in progress.',
                complementMessage:'Waiting for response, you can still send other actions.',
                status:400
            })
            return
        }
        

        handleActionAnimation(true,page)
        activeActions.current.add(page)
        const upload = await uploadItem({
            itemData:{...listOfOptions[currentPageIndexScanner],'article_number':scannedItem},
            type:'update',
            showServerMessage:false,
            createOfflineItemIfFail:false
        })
        
        if(!upload.success){
            showMessage({status:400,message:'Something went wrong on update'
                ,complementMessage:'It could be that the Article number was not found. Or there was no connection with the database.'
            })
        }
        
        setTimeout(()=>{
            handleActionAnimation(false,page)
            activeActions.current.delete(page)
        },500)
        
        
    }

    const handleToggleActionPage = (page:number | null=null)=>{
        const indexToPass = page !== null ? page : listOfOptions.length
        
        slidePageTo({addNumber:1})
       
        setNextPageChild(
            
            <AddScannerActionOptions 
                setListOfOptions = {setListOfOptions}
                listOfOptions = {listOfOptions}
                currentPageIndexScanner = {indexToPass}
                
            />
        )
    }

    const handleTouchStartScanner = (e:React.TouchEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        handleTouchStart(e)
    }
    const handleTouchMoveScanner = (e:React.TouchEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        handleTouchMove(e)
    }
    const handleTouchEndScanner = (e:React.TouchEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        handleTouchEnd(e)
       
    }
   
    const {handleTouchStart,handleTouchMove,handleTouchEnd} = useSlidePageTouch({
        parentRef:sliderRef,
        currentPageIndex:currentPageIndexScanner,
        setCurrentPageIndex:setCurrentPageIndexScanner
    })

    
    return (
            <div className="flex-column " style={{height:"100dvh"}}>
                {NextPageChild &&
                    <SlidePage BodyComponent={NextPageChild}/>
                }
                
                
                <HeaderSlidePage
                    middleElement={
                        <div className="flex-1 content-center items-center flex-row">
                            <span className="text-15">{scannedItem}</span>
                        </div>
                    }
                    rightElement={
                        <div className="flex-row" style={{position:'relative'}}>
                            <div className="svg-18 btn"
                                onClick={()=>{
                                    console.log('clicking settings')
                                }}
                            >
                                <ThreeDotMenu/>
                            </div>
                        </div>
                    }
                />
                <ScannerComponent setScannedItem={setScannedItem} showMessage={showMessage} forceActions={{forceScannerPause,setForceScannerPause}} zIndex={3}/>

                <div className="flex-row width100  items-center content-center padding-top-10" style={{overflow:'hidden'}} >
                    <div className="flex-row smooth-slide" style={{width:'80%',height:'300px',position:'relative'}}
                        ref={sliderRef}
                        onTouchStart={handleTouchStartScanner}
                        onTouchMove={handleTouchMoveScanner}
                        onTouchEnd={handleTouchEndScanner}
                    >
                        
                        {listOfOptions.map((obj,i)=>{
                            if(typeof obj == 'object'){
                                return(
                                <div key={`scannerAction_${i}`} id={`optionScanner_${i}`} className="flex-column width100 height100 padding-20"
                                    style={{position:'absolute', top:'0',left:'0',
                                        transform:  `translateX(${100 * (i )}%)` 
                                    }}
                                >
                                    
                                        <div className="flex-column width100 height100 items-center contentOfAction"
                                            style={{transition:'transform 0.3s ease-in-out',overflowY:'auto',borderRadius:'20px',border:'0.5px solid rgba(132, 234, 252, 0.5)',boxShadow:'0 0 10px rgba(132, 234, 252, 0.4)'}}
                                        >
                                            <div className="flex-row gap-2 padding-bottom-20 padding-10 space-between width100">
                                                <div className="flex-column btn items-center content-center svg-15"
                                                    onClick={()=>{
                                                        
                                                        handleToggleActionPage(i)
                                                        setForceScannerPause(true)
                                                    }}
                                                >
                                                    <EditIcon/>
                                                </div>
                                                <div className="flex-column items-center content-center svg-15 btn"
                                                    onClick={()=>{setListOfOptions(prev => { 
                                                                if(listOfOptions.length == 1){
                                                                    
                                                                    return []
                                                                }
                                                                const newList = prev.filter((_,index) => index !== i)
                                                                localStorage.setItem('ScannerActions',JSON.stringify(newList))
                                                                return newList
                                                                } 
                                                            ) 
                                                    }   }
                                                >
                                                    <MinusCircleIcon/>
                                                </div>

                                            </div>
                                            {Object.keys(obj).map((prop,j)=>{

                                                let val;
                                                if(Array.isArray(obj[prop])){
                                                    val =(
                                                        <div className="flex-row width100 gap-1 padding-10 border-bottom">
                                                            <span className="color-lower-titles text-12" style={{width:'100px',textWrap:'wrap'}}>{prop} : </span>
                                                            <div  className="flex-row gap-1">
                                                                <span>
                                                                    seleced
                                                                </span>
                                                                <div className="bg-secondary color-primary flex-column items-center content-center" style={{width:'15px',height:'15px',borderRadius:'50%'}}>
                                                                    <span>{obj[prop].length}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                )

                                                }
                                                else if(typeof obj[prop] === 'object' && obj[prop] !== null ){
                                                    val=(
                                                        <>
                                                            {Object.keys(obj[prop]).map((subProp,k)=>{
                                                                return(
                                                                    <div key={`propOfScannerAction_${i}_${j}_${k}`} className="flex-row gap-1 width100 padding-10 border-bottom">
                                                                        <span className="color-lower-titles text-12" style={{width:'100px',textWrap:'wrap'}}>{subProp} : </span>
                                                                        <span>{obj[prop][subProp]}  </span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    )
                                                }
                                                else{
                                                    val = (
                                                        <div className="flex-row width100 gap-1 padding-10 border-bottom">
                                                                <span className="color-lower-titles text-12" style={{width:'100px',textWrap:'wrap'}}>{prop} : </span>
                                                                <span>{obj[prop]}</span>
                                                        </div>
                                                    )
                                                }

                                                return(
                                                    <div key={`propOfScannerAction_${i}_${j}`} className="flex-column width100 ">
                                                        {val}
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>
                                        <div className="flex-column width100 heigh100 items-center content-center hide actionNotification"
                                        style={{transition:'transform 0.3s ease, opacity 0.3s ease',opacity:'0'}}
                                        >
                                            <span className="text-20">Action Sent !</span>
                                        </div>
                                </div>
                                    
                            )
                            }
                            else if (typeof obj == 'number'){
                                return(
                                    <div key={`scannerAction_${i}`} id={`optionScanner_${i}`} className="flex-column items-center content-center width100 height100 padding-20"
                                    style={{position:'absolute', top:'0',left:'0',
                                        transform:  `translateX(0)` 
                                    }}
                                >
                                            <span className="text-20">No Action</span>   
                                    </div>
                                )
                            }
                            
                        })}
                       


                    </div>
                    

                </div>
                
                <div className="flex-row width100 " style={{padding:'40px 20px 40px 20px'}}>

                    <div className="flex-row items-center content-center padding-10 "
                        style={{borderRadius:'50%',zIndex:'1',
                                backgroundColor: toggleOpenItem?'rgba(86, 216, 225, 1)':'transparent',border:toggleOpenItem ? 'none': '1px solid white',
                        }}

                        onClick={()=>{
                            setToggleOpenItem(prev => !prev)
                            if(!toggleOpenItem && scannedItem !== ''){
                                openScannedItem()
                            }
                        }}
                    >
                        <div className="flex-column svg-20">
                            <OpenFolderIcon/>
                        </div>
                    </div>
                    <div className="flex-row flex-1" style={{padding:'0 40px'}}>
                        <div className="flex-row btn bg-secondary width100" style={{padding:'10px',borderRadius:'50px'}}
                            onClick={()=>{
                                handleSendAction()
                            }}
                        >
                            <span className="text-15 color-primary">Send Action</span>
                        </div>
                    </div>
                    <div className="flex-row items-center content-center padding-10 " style={{borderRadius:'50%',zIndex:'1',border:'1px solid white'}}
                        onClick={()=>{handleToggleActionPage()}}
                    >
                            <div className=" flex-row content-center  plus-btn " style={{width:'20px',height:'20px',}}>
                                <div className="plus-vertical bg-secondary" ></div>
                                <div className="plus-horizontal bg-secondary"></div>
                            </div>
                    </div>
                </div>
                

            </div>
        
    )
}

export default ItemScanner;