import {useEffect,useState,useRef,useContext} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import '../css/scanner-styles.css'
import LensIcon from '../assets/icons/LensIcon.svg?react'
import FlashIcon from '../assets/icons/FlashIcon.svg?react'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'
import EditIcon from '../assets/icons/EditIcon.svg?react'
import MinusCircleIcon from '../assets/icons/MinusCircleIcon.svg?react'
import OpenFolderIcon from '../assets/icons/OpenFolderIcon.svg?react'
import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'

import SecondaryPage from '../components/secondary-page.tsx'
import {ItemPropsComp} from '../componentsV2/ItemEdit.tsx'
import {CurrencyInputsPurchase} from '../componentsV2/CurrencyInputs.tsx'
import {ItemEdit} from '../componentsV2/ItemEdit.tsx'

import{ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

import {useSaveItemsV2} from '../hooks/useSaveItemsV2.tsx'



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
        console.log(state,'state in hadnle camera')
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


const AddScannerActionOptions = ({handleClose,listOfOptions,setListOfOptions,editActionIndex,zIndex})=>{

    const [addingOption,setAddingOption] = useState(editActionIndex.current !== null ? listOfOptions[editActionIndex.current]:{})


    const handleAddActionToScanner = ()=>{
        console.log(addingOption,'option to be added to actions')

        if(editActionIndex.current !== null) {

            setListOfOptions(prev=>{
                const newList = [...prev]
                newList[editActionIndex.current] = addingOption
               
                return newList
            })


        }else{
             setListOfOptions(prev=>([...prev,addingOption]))
        }

        localStorage.setItem('ScannerActions',JSON.stringify([...listOfOptions,addingOption]))

        handleClose()
    }

    return(
        <div className="flex-column" style={{height:'100dvh'}}>
            <ItemPropsComp
                itemData={addingOption}
                setItemData={setAddingOption}
                pageSetUp={new Set(['noHistory','noImages','noFetchNotes'])}
                CurrencyInputsComponent={CurrencyInputsPurchase}
                zIndex={zIndex + 1}

            />

            <div className="flex-row width100 push-bottom padding-bottom-30 padding-10">
                <div role='button' className="btn width100 bg-containers padding-10 border-blue"
                    onClick={()=>{handleAddActionToScanner()}}
                >
                    <span className="text-15">Add Action</span>
                </div>
            </div>
        </div>
    )
}


const ItemScanner = ({handleDelitionItems,setForceRenderParent}) =>{

    const sliderRef = useRef<HTMLElement | null>(null)
    const [listOfOptions,setListOfOptions] = useState([])
    const selectedOption = useRef({})
    const selectedElement = useRef<HTMLElement | null >(null)
    const editActionIndex = useRef(null)
    const [toggleAddScannerAction,setToggleAddScannerAction] = useState(false)
    const [toggleOpenItem,setToggleOpenItem] = useState(false)
    const [scannedItem,setScannedItem] = useState('')
    const {uploadItem,itemUploading,setUploading} = useSaveItemsV2()
    const {showMessage} = useContext(ServerMessageContext)
    const animationActive = useRef(false)
    const firstLoad = useRef(false)
    const [forceScannerPause,setForceScannerPause] = useState(false)
    
    const handelFirstLoad = async() =>{
        const saveActions = localStorage.getItem('ScannerActions')
            if(saveActions){
                setListOfOptions(JSON.parse(saveActions))
            }
        firstLoad.current = true
    }

    const handleActionAnimation = (state,forceElement=null)=>{
        setTimeout(()=>{
                let targetElement = forceElement ? forceElement : selectedElement.current
               
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
        },state ? 300 : 10)

            animationActive.current = state
    }
    

    useEffect(()=>{

        if(!firstLoad.current){
            handelFirstLoad()
        }


        const children = Array.from(sliderRef.current.children) as HTMLElement[]
        const observer = new IntersectionObserver(
            (entries)=>{

                entries.forEach((entry)=>{
                    const entryTarget = entry.target
                    if(animationActive.current){
                            console.log('should close animation')
                            const forceElement = selectedElement.current
                            handleActionAnimation(false,forceElement)

                        }
                    
                    if(entry.isIntersecting){
                        entryTarget.style.transform = 'scale(1)'
                        entryTarget.style.opacity = '1'
                        const selectedIndex = entryTarget.getAttribute('data-index')
                        if(selectedIndex !== null){
                            selectedOption.current = listOfOptions[Number(selectedIndex)]
                            selectedElement.current = entryTarget
                        }else{
                            selectedOption.current = {}
                            selectedElement.current = entryTarget
                        }
                       

                    }else{
                        entryTarget.style.transform = 'scale(0.8)'
                        entryTarget.style.opacity = '0.6'
                    }
                })


            },
            {
                root:sliderRef.current,
                threshold:0.7
            }
        )


        children.forEach((child)=>observer.observe(child))

        if(listOfOptions.length === 0){
            selectedOption.current = {}
            selectedElement.current = null
        }

        if(editActionIndex.current !== null){
            editActionIndex.current = null
        }else{
             sliderRef.current.scrollTo({
                left:sliderRef.current.scrollWidth,
                behavior:"smooth"
            })
        }



        return ()=>{
            children.forEach(child => observer.unobserve(child))
        }

    },[listOfOptions])

    useEffect(()=>{
        if(scannedItem === '') {
            if(animationActive.current){
                handleActionAnimation(false)
            }
            return
        }

        const handleItemUpdate = async() =>{

            const upload = await uploadItem({
                itemData:{...selectedOption.current,'article_number':scannedItem},
                type:'update',
                showServerMessage:false,
                createOfflineItemIfFail:false
            })
            console.log(upload)
            if(!upload.success){
                showMessage({status:400,message:'Something went wrong on update'})
            }

        }
        console.log(selectedOption.current)
        if(Object.keys(selectedOption.current).length > 0){
            
            handleItemUpdate()
            handleActionAnimation(true)

        }


    },[scannedItem])

    return (
        <div className="flex-column" style={{height:"100dvh"}}>

            {toggleAddScannerAction &&
                <SecondaryPage BodyComponent={AddScannerActionOptions}
                    bodyProps={{setListOfOptions,listOfOptions,editActionIndex:editActionIndex}}

                    zIndex={5}
                    handleClose={()=>{setToggleAddScannerAction(false);setForceScannerPause(false)}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 flex-1 content-start',order:0}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}

                />
            }

            {toggleOpenItem && scannedItem !== '' &&
                 <SecondaryPage BodyComponent={ItemEdit}
                    bodyProps={{
                                preRenderInfo:{'article_number':scannedItem},
                                handleDelitionItems,
                                setForceRenderParent,
                                fetchWhenOpen:true,
                            }}
                    handleClose={()=>{setScannedItem('')}}
                    zIndex={5}
                    interactiveBtn ={{iconClass:'svg-15 padding-05 position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
                    header={{'display': scannedItem, class:'flex-1 content-center',order:2}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}

                    />

            }


            <ScannerComponent setScannedItem={setScannedItem} showMessage={showMessage} forceActions={{forceScannerPause,setForceScannerPause}} zIndex={3}/>

            <div className="flex-row width100  items-center content-center padding-top-10" style={{overflow:'hidden'}} >
                <div className="hide-scrollbar"
                style={{
                    display:'grid',gridAutoFlow:'column',gridAutoColumns:'250px',gap:'10px',overflowX:'auto',scrollSnapType:'x mandatory',scrollBehavior:'smooth', paddingLeft:'calc(50% - 125px)',paddingRight:'calc(50% - 125px)',
                    scrollbarWidth:'none',msOverflowStyle:'none'

                }}
                ref={sliderRef}
                >

                    <div  className="  "
                        style={{ height:'300px',overflowY:'auto',overflowX:'hidden',borderRadius:'10px', scrollSnapAlign:'center' ,transform:'scale(0.8)',opacity:'0.6',transition:'transform 0.4s ease,opacity 0.4s ease',overflow:'hidden'}}>
                            <div className="flex-column width100 height100 items-center content-center">
                                <span className="text-15">No Action</span>
                            </div>
                    </div>
                    {listOfOptions.map((obj,i)=>{
                        
                        return (
                            <div key={`scannerOption_${i}`} className=" border-blue "
                                data-index={i}
                                style={{ height:'300px',overflowY:'auto',overflowX:'hidden',borderRadius:'10px', scrollSnapAlign:'center' ,transform:'scale(0.8)',opacity:'0.6',transition:'transform 0.4s ease,opacity 0.4s ease',overflow:'hidden'}}>
                                    <div className="flex-column width100 height100 items-center contentOfAction"
                                        style={{transition:'transform 0.5s ease-in',overflowY:'auto'}}
                                    >
                                        <div className="flex-row gap-2 padding-bottom-20 padding-10 space-between width100">
                                            <div className="flex-column btn items-center content-center svg-15"
                                                onClick={()=>{
                                                    editActionIndex.current = i
                                                    setToggleAddScannerAction(true)
                                                    setForceScannerPause(true)
                                                }}
                                            >
                                                <EditIcon/>
                                            </div>
                                             <div className="flex-column items-center content-center svg-15 btn"
                                                onClick={()=>{setListOfOptions(prev => { 
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
                                            else if(typeof obj[prop] === 'object' ){
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
                                    style={{transition:'transform 0.5s ease, opacity 0.5s ease',opacity:'0'}}
                                    >
                                        <span className="text-20">Changes Send.</span>
                                    </div>
                            </div>

                        )
                    })}


                </div>

            </div>

            <div className="flex-row content-end with100  push-bottom btn" style={{bottom:'20px',right:'20px', position:'absolute'}}>
                     <div className="flex-row items-center content-center bg-secondary padding-10 " style={{borderRadius:'50%',zIndex:'1',}}
                        onClick={()=>{setToggleAddScannerAction(true);setForceScannerPause(true)}}
                         >
                            <div className=" flex-row content-center  plus-btn " style={{width:'20px',height:'20px',}}>
                                <div className="plus-vertical bg-primary" ></div>
                                <div className="plus-horizontal bg-primary"></div>
                            </div>
                        </div>
            </div>
            <div className="flex-row content-end with100  push-bottom btn" style={{bottom:'20px',left:'20px', position:'absolute'}}>
                     <div className="flex-row items-center content-center padding-10 "
                        style={{borderRadius:'50%',zIndex:'1',
                                backgroundColor: toggleOpenItem?'rgba(86, 216, 225, 1)':'transparent',border:toggleOpenItem ? 'none': '1px solid white',
                        }}

                        onClick={()=>{setToggleOpenItem(prev => !prev)}}
                         >
                            <div className="flex-column svg-20">
                                <OpenFolderIcon/>
                            </div>
                        </div>
            </div>

        </div>
    )
}

export default ItemScanner;