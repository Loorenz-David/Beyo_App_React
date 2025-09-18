import {useEffect,useState,useRef,useContext} from 'react'
import {getFailedItems,clearFailedItem} from '../hooks/useIndexDB.tsx'
import SecondaryPage from './secondary-page.tsx'
import {useItemSaves} from '../hooks/useItemSaves.tsx'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

export const OfflineItemsStore = ({handleClose,setEditOfflineItem,setItemData}) => {
    const {showMessage } = useContext(ServerMessageContext)

    const {handleSaveItem} = useItemSaves()

    const [itemsList,setItemsList] = useState([])
    const [firstItemLoads,setFirstItemLoads] = useState(false)
    const containerRef = useRef(null)

    useEffect(()=>{
        const handleFirstLoad = async ()=>{
            const response = await getFailedItems()
            setItemsList(response)
            setFirstItemLoads(true)
        }
        if(!firstItemLoads){
            handleFirstLoad()
            
        }

       

        
        
       
    },[])

    const handleItemSelection = (targetDict,e)=>{
        
            if(e.closest('.delition-btn')){
                return
            }
           
            setItemData(targetDict)
            setEditOfflineItem(true)
            handleClose()
        }
    

    function handleDelition(id,index){
        
        clearFailedItem(id)
        setItemsList(prev => prev.filter((_,i) => i !== index))

    }
    async function handleUpload(batchSize=3){
        for ( let i =0 ; i<itemsList.length; i += batchSize){
            const batch = itemsList.slice(i,i+batchSize)
            

            await Promise.all(batch.map(item=>{
                let fetchType = 'create'
                if('fetchType' in item){
                    fetchType = item.fetchType
                }
                return handleSaveItem(item,fetchType,false,false,'offlinePage')}))
        }
        const getLeftOvers = await getFailedItems()
        
        if(getLeftOvers && getLeftOvers.length > 0){
           
            setItemsList(getLeftOvers)
            showMessage({message:`Unable to upload ${getLeftOvers.length} items`,status:500})
        }else{
            showMessage({message:`Offline items upladed! `,status:200})
            handleClose()
        }

    }
    console.log(itemsList)
    

    return ( 
        <div className="flex-column padding-top-20 padding-bottom-70" style={{height:'100dvh', position:'relative',overflowY:'scroll'}} 
        ref={containerRef}
        >
            {itemsList.length > 0 &&
                itemsList.map((obj,indx)=>{
                    return (
                        <div key={`offlineItem_${obj.offlineIndexKey}`} data-key={indx} className="flex-row gap-2 width100 padding-15 border-bottom items-center "
                        onClick={(e)=>{handleItemSelection(obj,e.target)}}
                        >
                            <div className="flex-column">
                                <img src={obj['listOfImages'] && obj.listOfImages.length > 0 ? URL.createObjectURL(obj.listOfImages[0].file): null} alt="" style={{width:'70px',height:'70px',objectFit:'cover'}}/>
                            </div>
                            <div className="flex-column gap-05">
                                <div className="flex-row ">
                                    <span>{obj.item_properties.type}</span>
                                    
                                </div>
                                <div className="flex-row gap-2">
                                    {Object.keys(obj.item_properties).map((prop,i)=>{
                                        if(prop !== 'type' ){
                                            return (
                                                <div key={`property_${i}`} className="flex-column gap-05">
                                                    <span className="color-lower-titles text-9">{prop}</span>
                                                    <span className="text-9">{obj.item_properties[prop]}</span>
                                                </div>
                                            )
                                        }
                                        
                                    })}
                                    
                                    
                                </div>
                                <div className="flex-row space-between gap-2 padding-top-10">
                                    <div className="flex-row gap-1">
                                        <span className="color-lower-titles text-9">Cost:</span>
                                        <span className="text-9">{obj['item cost']}</span>
                                    </div>
                                    <div className="flex-row gap-1">
                                        <span className="color-lower-titles text-9">Valuation:</span>
                                        <span className="text-9">{obj.valuation}</span>
                                    </div>

                                </div>
                            </div>
                            <div className="flex-column push-right gap-1 items-center">
                                    <span className="">{obj.fetchType}</span>
                                    <div className="bg-containers border-blue btn delition-btn" 
                                    onClick={()=>{handleDelition(obj.offlineIndexKey,indx)}}
                                    >
                                        <span className="">Delete</span>
                                    </div>
                            </div>
                        </div>  
                    )
                })
            }

            {itemsList.length > 0 && 
                <div className="flex-row bg-primary  content-center width100 padding-15" style={{position:'fixed', bottom:0,left:0}}>
                    <div className="btn bg-secondary width-100 padding-10"
                    onClick={()=>{handleUpload()}}
                    >
                        <span className="color-primary">Upload All</span>
                    </div>
                </div>

            }
            
        </div> 
    );
}
 




export const CreationItemSettings = ({setSelectPopup,uploadsFail,setToggleOfflineUploadsPage}) => {
 

    
    return ( 
        <div className='flex-column' style={{minWidth:'100px'}}
        
        >

          
            

            <div className='flex-row items-center padding-10 border-bottom gap-2'
            onClick={()=>{setToggleOfflineUploadsPage(true);setSelectPopup(false)}}
            >
                <span style={{textWrap:'nowrap'}}>Fail uploads</span>
                { uploadsFail !== '0' && 
                    <div className="flex-column  items-center content-center" style={{backgroundColor:'rgba(189, 58, 58, 1)',width:'20px',height:'20px',borderRadius:'50%'}}>
                        <span className="">{uploadsFail}</span>
                    </div>
                }
                 
            </div>
            <div className='flex-row items-center padding-10 border-bottom'>
                <span>some setting</span>
            </div>
        </div>
     );
}
 
