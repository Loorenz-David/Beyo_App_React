import {useState,useRef,useEffect,memo} from 'react'

import PictureIcon from '../assets/icons/PictureIcon.svg?react'
import DeleteIcon from '../assets/icons/DeleteIcon.svg?react'
import SecondaryPage from '../components/secondary-page.tsx'
import OpenFolderIcon from '../assets/icons/OpenFolderIcon.svg?react'
import FlashIcon from '../assets/icons/FlashIcon.svg?react'







const SliderComponent = ({listOfElements,listOfImages,currentImageIndex,setCurrentImageIndex,imagePreviewSlider,parentComp='',holdScrollElement=null})=>{
    const sliderRef = useRef<HTMLElement | null>(null)
    const markersList = useRef(null)
    const interval = useRef(null)
    const timeOut = useRef(null)
    const touchStart = useRef(0)
    const hasSlided = useRef(false)
    
    
    const scrollToIndexElement = (index)=>{
        const element = sliderRef.current?.querySelector(`[data-index="${index}"]`)
     
        if(element){

            sliderRef.current.scrollTo({left:element.offsetLeft,behavior:'smooth'})
        }
    }   
    const setIntervalSlider = (sec)=>{
        
        if(imagePreviewSlider){
            if(interval.current){
                clearInterval(interval.current)
                interval.current = null
            }
            if(timeOut.current){
                clearTimeout(timeOut.current)
                timeOut.current = null
            }
            return null
        }else{
            
            return setInterval(()=>{
               
                
               
                setCurrentImageIndex(prev => {
                    const newIndex =  (prev + 1 )% listOfElements.length

                    scrollToIndexElement(newIndex)

                    return newIndex
                })
               
                
            },sec)
        }
        
    }
    const handleCheckMoveSlider = (e)=>{
        
        console.log(e.touches[0].clientX)
        if(Math.abs(e.touches[0].clientX - touchStart.current) > 10){
          
           
            hasSlided.current = true

            if(timeOut.current){
                clearTimeout(timeOut.current)
            }

            if(interval.current){
                clearInterval(interval.current)
            }
            
        }

        timeOut.current = setTimeout(()=>{
            hasSlided.current = false
            interval.current = setIntervalSlider(5000)
        },10000)
    }

    const changeStyleMarker = (targetElement,scale,opacity)=>{
        if(targetElement){
            targetElement.style.transform = `scale(${scale})`
            targetElement.style.opacity = opacity
        }
        
    }

    useEffect(()=>{
       
        if(!listOfElements || listOfElements.length == 0) return

        
        
        const children = Array.from(sliderRef.current.children) as HTMLElement[]
        
        
        const observer = new IntersectionObserver(
                (entries)=>{
                    entries.forEach((entry=>{
                        
                        const entryTarget = entry.target as HTMLElement
                        const newIndex = Number(entryTarget.dataset.index)
                        
                        if(entry.isIntersecting ){
                            
                            setCurrentImageIndex(newIndex)

                            const markerTarget = markersList.current.querySelector(`[data-marker="${newIndex}_${parentComp}"]`)
                            
                            if(markerTarget){
                                const prevSibling = markerTarget.previousElementSibling as HTMLElement | null
                                const nextSibling = markerTarget.nextElementSibling as HTMLElement | null
                                
                                changeStyleMarker(markerTarget,1.3,1)
                                changeStyleMarker(prevSibling,0.8,0.6)
                                changeStyleMarker(nextSibling,0.8,0.6)
                            }
                            

                        }
                       
                    }))
                },
                {
                    root:sliderRef.current,
                    threshold:0.3
                }
            )

       

        

        children.forEach((child=>observer.observe(child)))
        return ()=>{
            if(children){
                children.forEach(child=>observer.unobserve(child))
            }
        }

        
    },[listOfImages])

    useEffect(()=>{
        
        if(holdScrollElement){
           holdScrollElement.current = sliderRef.current 
        }

        scrollToIndexElement(currentImageIndex)
        
        interval.current = setIntervalSlider(3000)
        
       return()=>{
            if(interval.current){
                clearInterval(interval.current)
            }
            if(timeOut.current){
                clearTimeout(timeOut.current)
            }
       }

    },[imagePreviewSlider])

   
    

    return( 
            <div  className=" flex-column width100 height100 items-center content-center" style={{position:'relative'}}>
                <div className="hide-scrollbar remove-scrollbar-momentum width100 height100"
                onTouchStart={(e)=>{
                    
                    touchStart.current = e.touches[0].clientX
                }}
                onTouchMove={(e)=>{handleCheckMoveSlider(e)}}
                ref={sliderRef}
                style={{
                        display:'grid', gridAutoFlow:'column',gridAutoColumns:'100%', 
                        overflowX:'auto',scrollSnapType:'x mandatory', scrollBehavior:'smooth',
                        scrollbarWidth:'none',msOverflowStyle:'none'
                }}
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
                
            {listOfElements.length > 0 &&
                <div 
                    ref={markersList}
                    className="flex-row items-center content-center gap-1"
                    style={{position:'absolute',bottom:'4%',left:'50%',transform:'translateX(-50%)',borderRadius:'5px', padding:'5px 10px',backgroundColor:'rgba(255, 255, 255, 0.51)', opacity:'0.6'}}
                    >
                    {listOfElements.map((_,i)=>{
                        return(
                            <div key={`imageIndicato_${i}_${parentComp}`} data-marker={`${i}_${parentComp}`} className="bg-primary" style={{borderRadius:'50%',height:'5px',width:'5px',opacity:'0.6',transform:'scale(0.8)'}}>
                            </div>
                        )
                    })}
                </div>
                    
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

export const ImagePreviewSlider = ({props,zIndex,holdScrollElement})=>{
    const {listOfImages,setData,currentImageIndex,setCurrentImageIndex,imagePreviewSlider} = props
    const imageBlobs = useRef([])
    const [openLiveCamera,setOpenLiveCamera] = useState(false)
    

    useEffect(()=>{
        
        return ()=>{
            if(imageBlobs.current.length > 0){
                imageBlobs.current.forEach(blob => URL.revokeObjectURL(blob))
            }
        }
    },[])

    const handleImageRemoval = ()=>{
        let newList =[]
        if(setCurrentImageIndex){
            newList = listOfImages.filter((_,i)=> i !== currentImageIndex)
        }else{
            newList = []
        }
        setData(prev => ({...prev,'images':newList}))
    }
    
    return(
        <div className="width100 flex-column" style={{height:'100dvh'}}>
            {openLiveCamera && 
                <SecondaryPage BodyComponent={LiveCamera}
                    bodyProps={{props:{
                        listOfImages,
                        setData,
                        setCurrentImageIndex,
                    }}}
                    zIndex={zIndex + 1}
                    pageId={'imagePreviewSlider'}
                    handleClose={()=>{setOpenLiveCamera(false)}}
                
                />
            }
            <div className="width100 height100 flex-row items-center content-center " style={{overflow:'hidden',borderRadius:'10px'}}>
                {setCurrentImageIndex ? 
                    <SliderComponent 
                        imagePreviewSlider={imagePreviewSlider}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        parentComp={'slider'}
                        holdScrollElement={holdScrollElement}
                        listOfImages={listOfImages}
                        listOfElements={listOfImages.map((img,i)=>{
                            const imgSrc = makeImageUrl(img,imageBlobs)


                            return(
                                <div key={`imageInPreview_${i}`} className="flex-column" data-index={i} style={{overflow:'hidden',scrollSnapAlign:'start',position:'relative'}}>
                                
                                    <img src={imgSrc} className="width100 height100" style={{objectFit:'cover'}} />
                                
                                </div>
                            )
                        })}

                    />
                :
                    <div  className="flex-column"  style={{overflow:'hidden',scrollSnapAlign:'start',position:'relative'}}>
                                
                        <img src={makeImageUrl(listOfImages[0],imageBlobs)} className="width100 height100" style={{objectFit:'cover'}} />
                    
                    </div>
                }
                
               <div className="flex-row space-between width100 " style={{position:'absolute',bottom:'30px',padding:'0 20px'}}>
                   
                    <div role={'button'} className="flex-row btn svg-25 svg-bg-container items-center content-center bg-secondary"  
                        style={{padding:'5px 8px'}}
                        onClick={()=>{handleImageRemoval()}}
                    > 
                        <DeleteIcon/>   
                    </div>
                    
                     <div className="flex-row items-center content-center bg-secondary padding-10 " style={{borderRadius:'50%',zIndex:'1',transition:'transform 0.2s ease-out'}}
                        onClick={()=>{setOpenLiveCamera(true)}}
                        >
                        <div className=" flex-row content-center  plus-btn " style={{width:'20px',height:'20px',}}>
                            <div className="plus-vertical bg-primary" ></div>
                            <div className="plus-horizontal bg-primary"></div>
                        </div>
                    </div>
               </div>
               
            </div>
            
        </div>
    )
}

export const LiveCamera = ({props,handleClose})=>{
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const {setData,listOfImages,setCurrentImageIndex,allowOnlyOnePicture=false} = props
    const canvasRef = useRef(null)
    const blobsUrl = useRef([])
    const previewRefBtn = useRef(null)
    const fileInputRef = useRef(null)
    const imageToPreview = useRef('')
    const [selectedCamera,setSelectedCamera] = useState(localStorage.getItem('cameraId') ?? '')
    const [cameraOptions,setCameraOptions] = useState([])
    const startingCamera= useRef(false) 
    const torchOn = useRef(false)
    const torchRef = useRef(null)
   


    const startCamera = async (deviceIdC=null)=>{
            
            try{
                if(startingCamera.current ) return
                startingCamera.current = true
                if(videoRef.current && videoRef.current.srcObject){
                    const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                    tracks.forEach(track => track.stop())
                    handleTorch(false)
                }

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
                if(videoRef.current){
                    videoRef.current.srcObject = stream
                }
            }catch(err){
                console.log("Error accessing to camera: ",err)
            }
            startingCamera.current = false

    }
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
        startCamera(selectedCamera)

       

        return ()=>{
            
            if(streamRef.current){
                
                const tracks = (streamRef.current as MediaStream).getTracks()
                
                tracks.forEach(track => track.stop())
                videoRef.current = null
            }
            if(blobsUrl.current.length > 0){
               
                blobsUrl.current.forEach(blob => URL.revokeObjectURL(blob))
            }
            
        }
    },[])

    
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
                        setCurrentImageIndex(listOfImages.length)
                        setData(prev =>{
                            return {...prev, 'images':[...(prev.images && Array.isArray(prev.images) ? prev.images : []), imgDict]}
                            
                        } )
                    }   else{
                        setData(prev =>{
                            return{...prev,'images':[imgDict]}
                        })
                    }
                    
                    
                    
                   

                    if(listOfImages.length == 0){
                        handleClose()
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
        const lastImg = listOfImages[listOfImages.length - 1]
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
                            return(
                                <button key={`cameraLense_${i}`} className="flex-column items-center content-center " style={{width:'18px',height:'18px',borderRadius:'5px',backgroundColor:selectedCamera === deviceId ? 'white':''}}
                                    onClick={(e)=>{if(selectedCamera == deviceId)return; setSelectedCamera(deviceId); startCamera(deviceId); 
                                                   
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
                        onClick={()=>{handleClose()}}
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

export const CameraBtn =  memo(({props})=>{
    const {listOfImages,setData,zIndex} = props
    const imageBlobs = useRef([])
    
    const [currentImageIndex,setCurrentImageIndex] = useState(listOfImages && listOfImages.length > 0 ? 0 : -1)
    const isMoving = useRef(false)
    const touchStart = useRef(0)
    const [imagePreviewSlider,setImagePreviewSlider] = useState(false)

    useEffect(()=>{

        return ()=>{
            if(imageBlobs.current.length > 0){
                imageBlobs.current.forEach(blob=> URL.revokeObjectURL(blob))
            }
            
        }
    },[])

    const handelTouchStart = (e)=>{
        touchStart.current = e.touches[0].clientX
    }
    const handelTouchEnd = (e)=>{
        if(isMoving.current){
            isMoving.current = false
            return
        }
        setImagePreviewSlider(true)
        
    }
    const handelTouchMove = (e)=>{
        if(isMoving.current) return
        const touchDifference = Math.abs(e.touches[0].clientX - touchStart.current)
        if(touchDifference > 10){
            isMoving.current = true
        }
        
    }
    
    return(
        <div className="flex-column width100" style={{height:'150px',}}
            id={'images'}
            onTouchStart={(e)=>{handelTouchStart(e)}}
            onTouchMove={(e)=>{handelTouchMove(e)}}
            onTouchEnd={(e)=>{handelTouchEnd(e)}}
        >
            {imagePreviewSlider && 
                <SecondaryPage BodyComponent={listOfImages.length > 0 ? ImagePreviewSlider : LiveCamera}
                    bodyProps={{ props:{
                        listOfImages,
                        setData,
                        currentImageIndex,
                        setCurrentImageIndex,
                        imagePreviewSlider,
                    }}}
                    handleClose={()=>{setImagePreviewSlider(false)}}
                    zIndex={zIndex + 1}
                    pageId={'cameraBtn'}

                />
            }
            <div className="width100 height100 flex-row items-center content-center  border-blue" style={{overflow:'hidden',borderRadius:'10px'}}>
                   <SliderComponent
                        imagePreviewSlider={imagePreviewSlider}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        parentComp={'btnMain'}
                        listOfImages={listOfImages}
                        listOfElements={ listOfImages.map((img,i)=>{
                            const imgSrc = makeImageUrl(img,imageBlobs)
                            return(
                                <div key={`itemImg_${i}`} data-index={i}  className="flex-row width100 height100 items-center content-center" style={{overflow:'hidden',scrollSnapAlign:'start'}}>
                                        <img src={imgSrc} className="width100 height100" style={{objectFit:'cover'}} />
                                </div>
                                
                            )})
                        }
                   />
            </div>
            

        </div>
    )
})