import {useState,useRef,useEffect,memo} from 'react'

import PictureIcon from '../../assets/icons/General_Icons/PictureIcon.svg?react'
import DeleteIcon from '../../assets/icons/General_Icons/DeleteIcon.svg?react'

import OpenFolderIcon from '../../assets/icons/General_Icons/OpenFolderIcon.svg?react'
import FlashIcon from '../../assets/icons/General_Icons/FlashIcon.svg?react'



import {useData} from '../../contexts/DataContext.tsx'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'

import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'

import {useSlidePageTouch} from '../../hooks/useSlidePageTouch.tsx'

import type{PictureDict} from '../../types/PictureDict'


interface SliderComponentProps{
    listOfElements: React.JSX.Element[]
    listOfImages:PictureDict[]
    currentImageIndex:number
    setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
    imagePreviewSlider:boolean
    parentComp:string

}

const SliderComponent = ({
    listOfElements,
    
    currentImageIndex,
    setCurrentImageIndex,
    imagePreviewSlider,
    parentComp='',

}: SliderComponentProps)=>{
    const sliderRef = useRef<HTMLDivElement>(null)
    const touchStart = useRef(0)
    const currentPageIndex = useRef(0)
    const movingInSlider = useRef(false)
    const {data} = useData()
    const listOfImages =  data.images ?? [] as PictureDict[] | string []
    const [currentPageIndexImg,setCurrentPageIndexImg] = useState(0)
    const {handleTouchStart,handleTouchMove,handleTouchEnd,slidePageTo} = useSlidePageTouch({
        parentRef:sliderRef,
        currentPageIndex:currentPageIndexImg,
        setCurrentPageIndex:setCurrentPageIndexImg
    }) 
    
    
   
    useEffect(()=>{
        
      if(listOfImages.length > 0 &&  currentPageIndexImg > listOfImages.length - 1){
        setCurrentPageIndexImg( listOfImages.length - 1)
        slidePageTo({directPage:listOfImages.length - 1})
      }
    },[listOfImages])

    const changeStyleMarker = (targetElement,scale,opacity)=>{
        if(targetElement){
            targetElement.style.transform = `scale(${scale})`
            targetElement.style.opacity = opacity
        }
        
    }

   
    const handleSliderStartTouch = (e:React.TouchEvent<HTMLDivElement>)=>{
        touchStart.current = e.touches[0].clientX
        handleTouchStart(e)
    }

    const handleSliderMoveTouch = (e:React.TouchEvent<HTMLDivElement>)=>{

        if(currentPageIndexImg !== 0 && e.touches[0].clientX > touchStart.current){
            e.stopPropagation()
            movingInSlider.current = true
            handleTouchMove(e)
        }else if(currentPageIndexImg< listOfElements.length - 1  && e.touches[0].clientX < touchStart.current){
            e.stopPropagation()
            movingInSlider.current = true
            handleTouchMove(e)
        }
 
    }

    const handleSliderMoveEnd = (e:React.TouchEvent<HTMLDivElement>)=>{
        if(movingInSlider.current){
            e.stopPropagation()
            handleTouchEnd(e)
        }

        movingInSlider.current = false
        
    }
    
    

    return( 
           
            <div className=" width100 height100 smooth-slide" 
                onTouchStart={handleSliderStartTouch}
                onTouchMove={handleSliderMoveTouch}
                onTouchEnd={handleSliderMoveEnd}
                ref={sliderRef}
                style={{position:'relative'}}
            >
                
              
                {listOfElements.length > 0 ? 
                    
                    listOfElements
                    
                :
                    
                    <button className="flex-column gap-1 items-center content-center width100 height100">
                        <div className="flex-column items-center content-center svg-45" style={{opacity:'0.5'}}>
                            <PictureIcon/>
                        </div>
                        <span className="text-15 color-lower-titles bold-600">Take picure</span>
                    </button>
                }
                
            </div>
                
           
            
         
    )
}

export const makeImageUrl = (img,imageBlobs)=>{
    let imgSrc = ''
     if(typeof img == 'string'){
        imgSrc = img
    }else{
        const tempBlob = URL.createObjectURL(img.file)
        imageBlobs.current.push(tempBlob)
        imgSrc = tempBlob
    }
    return imgSrc
}
interface StartCameraProps{
    deviceIdC?:string | null
    startingCamera: React.RefObject<boolean>
    videoRef?: React.RefObject<HTMLVideoElement | null>
    streamRef: React.RefObject<MediaStream | null>
    setSelectedCamera?:React.Dispatch<React.SetStateAction<string>>
    selectedCamera?:string
     activeFastSlider?:boolean
}
interface ImageProps{
    allowOnePicture?:boolean
    imagePreviewSlider?: boolean
    setCurrentImageIndex?:React.Dispatch<React.SetStateAction<number>>
}

interface ImagePreviewSliderProps{
    props: ImageProps & StartCameraProps
}

export const ImagePreviewSlider = ({props}:ImagePreviewSliderProps)=>{
    const {slidePageTo} = useSlidePage()
    const {data,setData} = useData()
    const listOfImages = data.images ?? [] as PictureDict[] | string[]

    const {
        imagePreviewSlider,
        allowOnePicture=false,
        streamRef,
        selectedCamera,
        startingCamera,
        activeFastSlider = false

    } = props ?? {}
    
    const [currentImageIndex,setCurrentImageIndex] = useState(0)
    const liveCameraProps = {setCurrentImageIndex}
    
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)

    
    

    const imageBlobs = useRef([])

    useEffect(()=>{
       
        return ()=>{
            if(imageBlobs.current.length > 0){
                imageBlobs.current.forEach(blob => URL.revokeObjectURL(blob))
            }
        }
    },[])

    
    const handleImageRemoval = ()=>{
       
        let newList = []
        if(listOfImages.length > 1){
            newList = listOfImages.filter((_,i)=> i !== currentImageIndex)
        }
        
        
        setData(prev => ({...prev,'images':newList}))
    }

    useEffect (()=>{
        if(listOfImages.length == 0){
            setNextPage( 
                <LiveCamera props={
                   { imagePreviewSlider,
                    streamRef,
                    activeFastSlider}
                }/> 
            )
            slidePageTo({addNumber:1,setClosePage:setNextPage})
        }
        
    },[listOfImages])
    
    
    
    return(
        <div className="width100 flex-column" style={{height:'100dvh'}}>
           
            {NextPage && 
                <SlidePage BodyComponent={NextPage} />
            }
            <div className="width100 height100 flex-row items-center content-center " style={{overflow:'hidden',borderRadius:'10px'}}>
                {!allowOnePicture ? 
                    <SliderComponent 
                        imagePreviewSlider={imagePreviewSlider}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        parentComp={'slider'}
                        listOfImages={listOfImages}
                        listOfElements={listOfImages.map((img,i)=>{
                            const imgSrc = makeImageUrl(img,imageBlobs)

                            let isFirst = false

                            if(i == 0){
                                isFirst = true
                            }

                            return(
                                <div key={`imageInPreview_${i}`} 
                                    className="width100 height100 flex-column"
                                    style={{
                                            position:'absolute',top:'0',left:'0',
                                            transform: isFirst ? 'translateX(0)' : `translateX(${100 * i}%)`
                                            
                                    }}
                                >
                                
                                    <img src={imgSrc} className="width100 height100" style={{objectFit:'cover'}} />
                                
                                </div>
                            )
                        })}

                    />
                :
                    <div  className="flex-column items-center content-center height100"  style={{overflow:'hidden',scrollSnapAlign:'start',position:'relative'}}
                        onClick={()=>{
                                
                                setNextPage( <LiveCamera props={liveCameraProps}/> )
                                slidePageTo({addNumber:1,setClosePage:setNextPage})
                            }}
                    >
                        {listOfImages.length > 0?
                             <img src={ makeImageUrl(listOfImages[0],imageBlobs)} className="width100 height100" style={{objectFit:'cover'}} />
                        :
                            <span className="text-20 ">
                                Add Image
                            </span>
                        }
                    </div>
                }
                
               <div className="flex-row space-between width100 " style={{position:'absolute',bottom:'30px',padding:'0 20px'}}>
                   
                   {listOfImages.length > 0 ?
                    <div role={'button'} className="flex-row btn svg-25 svg-bg-container items-center content-center bg-secondary"  
                        style={{padding:'5px 8px'}}
                        onClick={()=>{handleImageRemoval()}}
                    > 
                        <DeleteIcon/>   
                    </div>
                    :
                    <div className="flex-row" style={{width:'25px',height:'25px'}}>

                    </div>
                   }
                    
                    
                    {!allowOnePicture && 
                        <div className="flex-row items-center content-center bg-secondary padding-10 " style={{borderRadius:'50%',zIndex:'1',transition:'transform 0.2s ease-out'}}
                            onClick={()=>{
                                
                                setNextPage( <LiveCamera props={liveCameraProps}/> )
                                slidePageTo({addNumber:1,setClosePage:setNextPage})
                            }}
                            >
                                
                            <div className=" flex-row content-center  plus-btn " style={{width:'20px',height:'20px',}}>
                                <div className="plus-vertical bg-primary" ></div>
                                <div className="plus-horizontal bg-primary"></div>
                            </div>
                        </div>
                    }
                     
               </div>
               
            </div>
            
        </div>
    )
}



const startCamera = async ({
        deviceIdC=null,
        startingCamera,
        streamRef
}:StartCameraProps)=>{
            
            try{
                
                const constrain = deviceIdC ?
                {video:{
                    deviceId:{exact:deviceIdC}, 
                    width:{ideal:1920},height:{ideal:1080},
                    frameRate:{ideal:60,max:120}
                },
                audio:false}
                :
                {video:{
                    facingMode:'environment', 
                    width:{ideal:1920},height:{ideal:1080},
                    frameRate:{ideal:60,max:120}
                },
                
                audio:false }

                const stream = await navigator.mediaDevices.getUserMedia(constrain)
                
                streamRef.current  = stream
                
                localStorage.setItem('cameraId',deviceIdC ? deviceIdC : '')
               
            }catch(err){
                console.log("Error accessing to camera: ",err)
            }
            startingCamera.current = false

    }


export const LiveCamera = ({props}:LiveCameraProps )=>{
    const fallStreamRef = useRef<MediaStream | null>( null)
    const fallStartingCamera = useRef(false)

    const {
        setCurrentImageIndex,
        streamRef=fallStreamRef,
        startingCamera=fallStartingCamera,
        activeFastSlider = false
    } = props ?? {}

    const [selectedCamera,setSelectedCamera] = useState(localStorage.getItem('cameraId') ?? '')
    const canvasRef = useRef(null)
    const blobsUrl = useRef([])
    const previewRefBtn = useRef(null)
    const fileInputRef = useRef(null)
    const imageToPreview = useRef('')
    const [cameraOptions,setCameraOptions] = useState([])
    const torchOn = useRef(false)
    const torchRef = useRef(null)
    const videoRef= useRef<HTMLVideoElement | null>(null)

    const {data,setData} = useData()
    const {slidePageTo} = useSlidePage()

    const listOfImages = data.images ?? [] as PictureDict[] | string []
    
    const getCameraLenses = async ()=>{
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput').map(obj => obj.deviceId)
        setCameraOptions(videoDevices)  
    }

    const handleTorch = async (forceVal=null)=>{
        if(!videoRef.current?.srcObject)return;
        
        const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0]
        const capabilities = track.getCapabilities()
      
        if(capabilities.torch){
            
            if(forceVal === null){
                torchOn.current = !torchOn.current
            }else{
                torchOn.current = forceVal
                
            }
            
            if(torchOn.current){
                torchRef.current.style.backgroundColor = 'rgba(45, 140, 181, 1)'
            }else{
                torchRef.current.style.backgroundColor = 'rgba(21, 70, 91, 0.37)'
            }
            await track.applyConstraints({advanced:[{torch:torchOn.current}]})
        }
    }
   
    useEffect(()=>{
        getCameraLenses()
    },[])
    useEffect(()=>{
        

        if(activeFastSlider && streamRef.current && videoRef.current){
            
            if(startingCamera.current ) return
            
            if(videoRef.current){
                
                videoRef.current.srcObject = streamRef.current
                videoRef.current.play().catch(err => console.log(err))
            }
        }else{
            try{
                if(startingCamera.current ) return
                startingCamera.current = true
                if(videoRef.current && videoRef.current.srcObject){
                    const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                    tracks.forEach(track => track.stop())
                    handleTorch(false)
                }
                 startCamera({
                    deviceIdC:selectedCamera,
                    startingCamera,
                    streamRef
                })
                .then(_ =>{
                    
                    if(videoRef.current){
                       
                        videoRef.current.srcObject = streamRef.current
                    }
                })
            }catch(err){
                console.log('error starting camera', err)
            }
        }

        return ()=>{
            
            if(!activeFastSlider && streamRef.current){
                const tracks = (streamRef.current as MediaStream).getTracks()
                
                tracks.forEach(track => track.stop())
                videoRef.current = null
            }
            if(blobsUrl.current.length > 0){
               
                blobsUrl.current.forEach(blob => URL.revokeObjectURL(blob))
            }
            
        }
    },[activeFastSlider])

    const  handleTakePicture = async (img) => {
        const canvas = canvasRef.current
        const isVideo = 'videoWidth' in img
        const maxWidth = 1024
        const maxHeight = 1024

        navigator.vibrate(100)

        if(img && canvas){
        
            const objectWidth = isVideo? img.videoWidth : img.width;
            const objectHeight = isVideo? img.videoHeight : img.height

            let ratio = Math.min(maxWidth / objectWidth, maxHeight / objectHeight, 1)
            canvas.width = objectWidth * ratio
            canvas.height = objectHeight * ratio
            
            const context = canvas.getContext('2d')
            if(!context) return;

                
            context.drawImage(img,0,0,canvas.width,canvas.height);
            
            canvas.toBlob((blob) =>{
                if(!blob) return;
                const file = new File([blob],`snapshot_${Date.now()}.webp`,{
                    type:'image/webp',
                    lastModified:Date.now()
                })
                
                const imgDict ={file:file,isUpload:false}

                    
                    if(setCurrentImageIndex){
                        // setCurrentImageIndex(listOfImages.length)
                        
                        setData(prev =>{

                            return {...prev, 'images':[imgDict,...(prev.images && Array.isArray(prev.images) ? prev.images : [])]}
                            
                        } )
                    }   else{
                        setData(prev =>{
                            return{...prev,'images':[imgDict]}
                        })
                    }
                    
                    
                    
                   

                    if(listOfImages.length == 0){
                        slidePageTo({addNumber:-1})
                    }
                    
                
            },'image/webp',0.9) 
                    
        }

    }
    
    const handleFileSelect = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files
        if(!files) return;

        const imageArray = Array.from(files);
        imageArray.forEach(file =>{

            const reader = new FileReader()
            
            reader.onload = ()=>{
                const img = new Image()
                
                img.onload = () =>{
                    
                    handleTakePicture(img)
                }
                img.src = reader.result as string
                
            }
            reader.readAsDataURL(file)
        })
        e.target.value = ''
    }

    

     if(listOfImages.length > 0){
        const lastImg = listOfImages[0]
        if(typeof lastImg == 'string'){
            imageToPreview.current = lastImg
        }else{
            const tempBlob = URL.createObjectURL(lastImg.file)
            blobsUrl.current.push(tempBlob)
            imageToPreview.current = tempBlob
            
        }
    }
    return(
        <div className="width100" style={{height:'100dvh'}}>
            <div className="width100 height100" style={{position:'relative'}}>

            
            <video 
                ref={videoRef}
                autoPlay
                playsInline
                style={{width:'100%',height:'100%',objectFit:'cover'}}
            >
            </video>
            <button className="flex-row svg-18 items-center content-center btn " 
                ref={torchRef}
                style={{
                    backgroundColor:'rgba(21, 70, 91, 0.37)',
                    position:'absolute',top:'20px',right:'20px',borderRadius:'50%',padding:'6px 6px'
                }}
                onClick={()=>{handleTorch()}}
            >
                <FlashIcon/>
            </button>
            <div className="flex-row width100 space-between items-end" style={{position:'absolute',bottom:'20px',padding:'40px 30px'}}>
                <input type="file"
                        accept='image/*'
                        multiple
                        ref={fileInputRef}
                        style={{display:'none'}}
                        onChange={handleFileSelect}
                    />
                <button className="flex-column  btn svg-25"
                    style={{backgroundColor:'rgba(21, 70, 91, 0.37)',padding:'10px 10px'}}
                    onClick={()=>{fileInputRef.current?.click()}}
                >
                    <OpenFolderIcon/>
                </button>
               
                 <div className="flex-column gap-2 items-center">
                    <div className="flex-row gap-1" style={{borderRadius:'5px',padding:'2px 8px',backgroundColor:'rgba(0, 0, 0, 0.52)'}}>
                       {cameraOptions &&
                         cameraOptions.map((deviceId,i)=>{
                            
                            const isSelected = selectedCamera === deviceId 
                            const bg = isSelected ?  'bg-secondary' : ''
                            return(
                                <button key={`${deviceId}`} className={`flex-column items-center content-center ${bg} `} style={{width:'18px',height:'18px',borderRadius:'5px'}}
                                    onClick={(e)=>{
                                        if(selectedCamera == deviceId)return; 
                                        setSelectedCamera(deviceId)
                                       

                                        if(startingCamera.current ) return
                                        startingCamera.current = true
                                        if(videoRef.current && videoRef.current.srcObject){
                                            const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                                            tracks.forEach(track => track.stop())
                                            handleTorch(false)
                                        }
                                        startCamera({
                                            deviceIdC:deviceId,
                                            startingCamera,
                                            streamRef
                                        })
                                        .then(_=>{
                                            if(videoRef.current){
                                                videoRef.current.srcObject = streamRef.current
                                            }
                                        })
                                        
                                                   
                                    }}
                                >
                                    <span className="text-15" style={{color:selectedCamera === deviceId ? 'black':'white'}}>{i + 1}</span>
                                </button>
                            )
                         })
                       }

                    </div>
                    <div className="flex-column btn bg-secondary" style={{borderRadius:'50%',width:'60px',height:'60px'}}
                        onClick={()=>{handleTakePicture(videoRef.current)}}>

                    </div>
                </div>
                 <canvas ref={canvasRef} style={{display:'none'}}/>
                {imageToPreview.current !== '' ?
                    <button className="flex-column  border-blue"
                        style={{width:'40px', height:'40px', overflow:'hidden',borderRadius:'5px'}}
                        onClick={()=>{slidePageTo({addNumber:-2})}}
                        ref={previewRefBtn}
                    >  
                            <img src={imageToPreview.current} className="width100 height100" style={{objectFit:'cover'}} />
                    </button>
                :
                    <div style={{width:'25px',height:'25px'}}>

                    </div>
                }
            </div>
            
            </div>
        </div>
    )}


interface CameraBtnProps{
    pageSetUp:Set<string>
}
export const CameraBtn =  memo(({
    pageSetUp
}:CameraBtnProps)=>{
    
    const {data,setNextPage} = useData()
    const listOfImages = data.images ?? [] as PictureDict[] | string []
    const {slidePageTo} = useSlidePage()
    const activeFastSlider = useRef(false)

    const [currentImageIndex,setCurrentImageIndex] = useState(listOfImages && listOfImages.length > 0 ? 0 : -1)
    const [imagePreviewSlider,setImagePreviewSlider] = useState(false)

    
    const imageBlobs = useRef([])

    
    const startingCamera = useRef(false)
    const streamRef = useRef<MediaStream | null>(null)

    
    useEffect(()=>{

        return ()=>{
            if(imageBlobs.current.length > 0){
                imageBlobs.current.forEach(blob=> URL.revokeObjectURL(blob))
            }
            
        }
    },[])

    useEffect(()=>{
        activeFastSlider.current = pageSetUp.has('fastSlider') ? true : false

        if(activeFastSlider.current){
            const selectedCamera = localStorage.getItem('cameraId')
            startCamera({
                deviceIdC:selectedCamera,
                startingCamera,
                streamRef
            })
        }else{
            if(streamRef.current){
                const tracks = (streamRef.current as MediaStream).getTracks()
                tracks.forEach(track => track.stop())
            }
        }
        
        return ()=>{
            
            if(streamRef.current){
                const tracks = (streamRef.current as MediaStream).getTracks()
                tracks.forEach(track => track.stop())
            }

        }

    },[pageSetUp])

    

    
    const handleClick = (e:React.MouseEvent<HTMLDivElement>)=>{
        
        if(!setNextPage) return
        
        let TargetComp: React.ReactNode;
        let props = {
            imagePreviewSlider,
            streamRef,
            startingCamera,
            activeFastSlider:activeFastSlider.current
        }

        if(listOfImages.length > 0){
            
            props.imagePreviewSlider = true
            TargetComp = <ImagePreviewSlider props= {props}/>
            slidePageTo({addNumber:1})

        }else{
           
            TargetComp = <LiveCamera props= {props}/>

            slidePageTo({addNumber:1,setClosePage:setNextPage})
        }

        setNextPage(TargetComp)
        
        
    }
  
    
    return(
        <div className="flex-column width100" style={{height:'150px',}}
            id={'images'}
            onClick={handleClick}
        >
          
           
            <div className="width100 height100 flex-row items-center content-center  border-blue" style={{overflow:'hidden',borderRadius:'10px'}}>
                   <SliderComponent
                        imagePreviewSlider={imagePreviewSlider}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        parentComp={'btnMain'}
                        listOfImages={listOfImages}
                        listOfElements={ listOfImages.map((img,i)=>{
                            const imgSrc = makeImageUrl(img,imageBlobs)
                            let isFirst = false
                            if(i== 0){
                                isFirst = true
                            }
                            return(
                                <div key={`itemImg_${i}`} data-index={i}  
                                    className="width100 height100 flex-column"
                                    style={{
                                            position:'absolute',top:'0',left:'0',
                                            transform: isFirst ? 'translateX(0)' : `translateX(${100 * i}%)`
                                            
                                    }}
                                >
                                        <img src={imgSrc} className="width100 height100" style={{objectFit:'cover'}} />
                                </div>
                                
                            )})
                        }
                   />
            </div>
            

        </div>
    )
})

// missing to set up the context of data...