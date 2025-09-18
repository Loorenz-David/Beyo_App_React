import {useRef,useState,useEffect,forwardRef,memo} from 'react'
import PictureIcon from '../assets/icons/PictureIcon.svg?react'

import SecondaryPage  from './secondary-page.tsx'
import EditIcon from '../assets/icons/EditIcon.svg?react'

import GalleryIcon from '../assets/icons/GalleryIcon.svg?react'

const ImagePreview = forwardRef<HTMLElementDiv>(({listOfImages,setListOfImages,previewRefBtn,zIndex=3},ref) =>{
    const listLength = listOfImages.length
    const sliderRef = useRef(null)
    const startXRef = useRef<number | null> (null)
    const [currentIndex,setIndex] = useState(0)
    const initialTranslateRef = useRef<number>(0)
    const blobUrl = useRef([])
    
    const [imagesForDisplay,setImagesForDisplay] = useState([])
    
    
    const handleDeletion = ()=>{
        let newIndex = currentIndex -1
        if (newIndex < 0){
            newIndex = 0
            if(listOfImages.length - 1 <= 0){
                previewRefBtn.current.style.display = 'none'
            }
        }
        previewRefBtn.current.src = listOfImages[newIndex]

        setListOfImages(prev => {
            const updateList = prev.images.filter((_,i)=> i !== currentIndex)
            const updateObj = {...prev,images:updateList}
            return updateObj

        })
        
        setImagesForDisplay(prev =>{
            const  updateList = prev.filter((_,i) => i !== currentIndex)
            return updateList
        })
       

        sliderRef.current.style.transition = 'transform 0.5s ease'
        sliderRef.current.style.transform = `translateX(-${(newIndex) * 100 }%)`
        
        setIndex(newIndex)
        
        
    }

    const handleTouchStart = (e:React.TouchEvent) =>{
        startXRef.current = e.touches[0].clientX;
        initialTranslateRef.current = -currentIndex * 100
        
    }
    const handleTouchEnd = (e:React.TouchEvent) =>{
        if(!sliderRef.current || startXRef.current === null) return;

        const deltaX = startXRef.current - e.changedTouches[0].clientX;
        const threshold = 50;

        let newIndex = currentIndex;
        if(deltaX>threshold && currentIndex < listLength - 1){
            newIndex++;
        }else if(deltaX < -threshold && currentIndex > 0){
            newIndex--;
        }
        setIndex(newIndex);

        sliderRef.current.style.transition = 'transform 0.5s ease'
        sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`
    }

    
   useEffect(()=>{

        const slider = sliderRef.current

        
        if(listOfImages.length > 0){
            const forShow = listOfImages.map((img) =>{
                                                if(typeof img === 'string'){
                                                    return img
                                                }else{
                                                    const UrlObject = URL.createObjectURL(img.file)
                                                    blobUrl.current.push(UrlObject)
                                                    return UrlObject
                                                }
                                            })
            setImagesForDisplay(forShow)


        }
        

        const handleMove = (e:TouchEvent) =>{
            if(!startXRef.current) return;

            e.preventDefault()

        
        
            const currentX = e.touches[0].clientX
            const deltaX = currentX - startXRef.current;
            const sliderWidth = slider.getBoundingClientRect().width;
            

            const deltaPorcentage = (deltaX / sliderWidth) * 100
            const totalTranslate = initialTranslateRef.current + deltaPorcentage
            
            slider.style.transition='none';
            slider.style.transform = `translateX(${totalTranslate}%)`

        }

        slider.addEventListener('touchmove',handleMove,{passive:false})

        return ()=>{
        if(blobUrl.current.length > 0){
            blobUrl.current.forEach(url => URL.revokeObjectURL(url))
        }
        
        }
   },[])
   

    return (
        <div ref={ref}  className='image-preview-container'>
            <div 
            ref={sliderRef}
            className='flex-row image-slider' 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            
            >
                 { imagesForDisplay.length > 0 &&
                    imagesForDisplay.map((img,i) =>{
                        return(
                            <div className='image-box' key={`imgprev_${i}`} >
                                <img src={img}  />
                            </div>
                            
                        )
                        })
                }
            </div>
           
           <div className='live-video-lower-actions'>
                <div className="svg-18 bg-containers border-blue edit-container">
                    <EditIcon/>
                </div>
                <div className='image-counter'>
                    {listOfImages.map((img,i)=>{
                        return (<div key={`dot_${i}`} className={i === currentIndex ? `dot-index active` : 'dot-index'}>

                        </div>)
                    })}
                    
                </div>
                <div className="btn text-12  bg-containers border-blue"
                onClick={handleDeletion}
                >
                    Delete
                </div>
           </div>
        </div>
    )
})



async function handleTakePicture  (setListOfImages, img, canvasRef,previewRefBtn,blobsUrl) {
    const canvas = canvasRef.current
    const isVideo = 'videoWidth' in img
    const maxWidth = 1024
    const maxHeight = 1024
    
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

                if(previewRefBtn.current){
                    previewRefBtn.current.style.display = 'inline-block'
                    const tempBlob = URL.createObjectURL(file)  
                    blobsUrl.current.push(tempBlob)
                    previewRefBtn.current.src = tempBlob
                    
                    setListOfImages(prev =>{
                      
                        return {...prev, 'images':[...(prev.images && Array.isArray(prev.images) ? prev.images : []), imgDict]}
                        
                    } )
                    
                } 
            },'image/webp',0.9) 
            
    }
}


export const LiveVideo = forwardRef<HTMLDivElement>(({listOfImages,setListOfImages,streamRef=null,zIndex=3},ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const innerStreamRef = useRef<MediaStream>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const previewRefBtn = useRef<HTMLImageElement>(null)
    const [secondaryPage,setSecondaryPage] = useState(false)
    const tempUrl = useRef(null) 
    const blobsUrl = useRef([])

    let phoneCamera = false
    
    if(window.innerWidth < 500){
        phoneCamera = true
    }

    if(listOfImages.length > 0){
        if(typeof listOfImages[0] === "string"){
            tempUrl.current = listOfImages[0]
            
        }else{
            const blob = URL.createObjectURL(listOfImages[0].file)
            tempUrl.current = blob
            blobsUrl.current.push(blob)
        }
        
    }
    
    
    useEffect(()=>{
        const getCamera = async ()=>{
            
            try{
                
                let stream;
                if(streamRef && streamRef.current){
                    stream = streamRef.current
                }else{
                    stream = await navigator.mediaDevices.getUserMedia({video:true})
                    innerStreamRef.current = stream
                }
                

                if(videoRef.current){
                    videoRef.current.srcObject = stream
                }

            }catch(error){
                console.log(error)
            }
        
            
        }

        getCamera()

        return ()=>{
            innerStreamRef.current?.getTracks().forEach(track=>track.stop())
            innerStreamRef.current = null;
            if(blobsUrl.current.length > 0){
                blobsUrl.current.forEach(blob => URL.revokeObjectURL(blob))
                
            }
        }
    },[])

   


    const handleFileSelect = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files
        if(!files) return;

        const imageArray = Array.from(files);
        imageArray.forEach(file =>{

            const reader = new FileReader()
            
            reader.onload = ()=>{
                const img = new Image()
                
                img.onload = () =>{
                    
                    handleTakePicture(setListOfImages,img,canvasRef,previewRefBtn,blobsUrl)
                }
                img.src = reader.result as string
                
            }
            reader.readAsDataURL(file)
        })
        e.target.value = ''
        
    }

    

    return ( 
        <div ref={ref} className="width100" style={{height:'100dvh',position:'relative'}} >
            {secondaryPage && <SecondaryPage 
                                    BodyComponent={ImagePreview}
                                    handleClose={()=>setSecondaryPage(false)}
                                    bodyProps={{listOfImages,setListOfImages,previewRefBtn}}
                                    zIndex={zIndex + 1}
                                    closeIcon={false}
                                 />
                                 
            }
            <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="width100 height100"
                style={{objectFit: phoneCamera ? 'cover' : 'contain' }}
            >
            </video>
            <canvas ref={canvasRef} style={{display:'none'}}></canvas>
            <div className='live-video-lower-actions'>
                <input type="file"
                    accept='image/*'
                    multiple
                    ref={fileInputRef}
                    style={{display:'none'}}
                    onChange={handleFileSelect}
                 />
                <button className="camera-action-tap library-tap svg-40 "
                    onClick={()=>{fileInputRef.current?.click()}}
                >
                    <PictureIcon/>
                </button>
                <button onClick={()=>{ handleTakePicture(setListOfImages,videoRef.current,canvasRef,previewRefBtn,blobsUrl)}} className="camera-action-tap camera-tap">

                </button>
                <button  className="camera-action-tap preview-tap svg-40"
                onClick={()=>{setSecondaryPage(true)}}
                >
                    <img ref={previewRefBtn} src={tempUrl.current ? tempUrl.current : null}  style={{display:tempUrl.current ? 'inline-block' : 'none'}} />
                </button>
            </div>
        </div>
     );
})



const ItemImageBtn = ({dataListOfImages=[],setItemData,zIndex=3})=>{
    const [toggleLiveVideo,setToggleLiveVideo] = useState(false)
    const [displayImg,setDisplayImg] = useState(null)
    const imgBlobs = useRef(null)

    useEffect(()=>{

        if(imgBlobs.current){
                URL.revokeObjectURL(imgBlobs.current)
        }

        if(dataListOfImages.length > 0){
            if(typeof dataListOfImages[0] !== 'string'){
                const tempBlob = URL.createObjectURL(dataListOfImages[0].file)
                imgBlobs.current = tempBlob
                setDisplayImg(tempBlob)
            }else{
                setDisplayImg(dataListOfImages[0])
            }
        }
        
        return () =>{
            if(imgBlobs.current){
                URL.revokeObjectURL(imgBlobs.current)
            }
        }
        

    },[dataListOfImages])



    return(
        <div className="flex-row "  
            
        >
            {toggleLiveVideo &&
                <SecondaryPage BodyComponent={LiveVideo}
                    bodyProps={{
                        listOfImages:dataListOfImages,
                        setListOfImages:setItemData,
                        
                    }}
                    handleClose={()=>{setToggleLiveVideo(false)}}
                    zIndex={zIndex +1}

                />

            }
            <div className="flex-row btn bg-containers border-blue"
                style={{width:'350px',height:'130px',padding:'0',zIndex:zIndex}}
                onClick={()=>{setToggleLiveVideo(true)}}
            >
                 {dataListOfImages.length > 0 ?
                    <img src={displayImg} 
                        className="width100 height100"
                        style={{objectFit:'cover',overflow:'hidden'}} />
                :
                    <div className="flex-column gap-05 items-center content-center">
                        <div className="svg-20 flex-column items-center content-center">
                            <GalleryIcon />
                        </div>
                        <span className="text-15">Take Image</span>
                    </div>
                }
            </div>
           
        </div>
    )
}

export const MemorizedItemImagesBtn = memo(ItemImageBtn)
 
