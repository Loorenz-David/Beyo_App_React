import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'
import {useState,useContext} from 'react'
import {saveFailedItem,clearFailedItem,updateFailedItem} from '../hooks/useIndexDB.tsx'
import {UploadImage} from '../hooks/useUploadImage.tsx'


export function useItemSaves(){
    const {showMessage} = useContext(ServerMessageContext)
    const [itemUploadLoading,setLoading] = useState(false)
    const requiredUponSaving =['item_properties','dealer','item cost','valuation']


    const handleItemFetch = async (itemDict,originalDict,type,messageOnScreen=true,comingFrom) =>{

        let imagesUrl = []
        let failImages = []
        let wasOfflineItem = false
        
        
        
        try{

            if('offlineIndexKey'in originalDict){
                
                wasOfflineItem = true
            }
           
            if('images' in itemDict && itemDict.images.length > 0){
            let fetchImages = await UploadImage(itemDict['images'],'PurchaseAppReact')
            
            for(let i = 0; i < fetchImages.length; i++ ){
                const targetDict = fetchImages[i]
                if(targetDict.isUpload){
                    imagesUrl.push(targetDict.url)
                }else{
                    failImages.push(targetDict)
                }
            }
            
            
            }
            if(imagesUrl.length > 0){
                itemDict['images'] = imagesUrl
            }

            

            let fetchDict = {'model_name':'Item',
                            'reference':'item'
            }
            let apiUrl = '/api/schemes/create_items'
            console.log(type)
            if(type === 'update'){
                apiUrl = '/api/schemes/update_items'
                fetchDict['object_values'] = {  
                                                'query_filters':{'article_number':itemDict['article_number']},
                                                'update_type':'all_matches',
                                                'values':itemDict,
                                                

                } 
            }else{
                fetchDict['object_values'] = itemDict
                fetchDict['requested_data'] = ['id']
            }
            console.log(fetchDict,'after modifications!!!')

            const res = await fetch(apiUrl,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(fetchDict)
            })
        
            
            const resData = await res.json()
        
            if(resData.status == 201){
                if(messageOnScreen){
                    showMessage(resData)
                }
                
                if(wasOfflineItem){
                    clearFailedItem(originalDict.offlineIndexKey)

                }
                return true

            }else{
                if(messageOnScreen){
                    showMessage({message:`fail to updload ${itemDict['type']}`,status:500,complementMessage:resData.server_message})
                }
                
                if(!wasOfflineItem){
                    showMessage({message:'Offline item created',status:400})
                    originalDict['fetchType'] = type
                    saveFailedItem(originalDict)
                }else if ( wasOfflineItem && comingFrom === 'itemPage'){
                    showMessage({message:'Offline item updated',status:400})
                    updateFailedItem(originalDict['offlineIndexKey'],originalDict)
                }
                console.log(resData)
                console.log(originalDict,'raw dict')
                console.log(itemDict,'copy this was seend to fetch')
                return false
                
            }
            

            }catch(error){
                console.log(error)
                console.log(originalDict,'raw dict')
                console.log(itemDict,'copy this was seend to fetch')
                if(!wasOfflineItem){
                    showMessage({message:'Offline item created',status:400})
                    originalDict['fetchType'] = type
                    saveFailedItem(originalDict)
                }else if ( wasOfflineItem && comingFrom === 'itemPage'){
                    updateFailedItem(originalDict['offlineIndexKey'],originalDict)
                    showMessage({message:'Offline item updated',status:400})
                }
                return false
            }
        

    }


    const handleSaveItem = async (itemData,type,setToggleAfterSave,messageOnScreen=true,comingFrom='itemPage')=>{

            const missingFields = requiredUponSaving.filter(field => !itemData[field])
            // if(!itemCostSEK || !inputValuation){
            //     showMessage({message:`missing price or valuation`,status:400})
            // }
            
            if(missingFields.length > 0){
                const field = missingFields[0].replace('_', ' ')
                showMessage({message:`missing ${field}`,status:400})
                return 
            }
            
            

            let itemProperties = itemData.item_properties

            let buildItemDict = {
                'article_number':itemData.articleNumber,
                'type':itemProperties.type,
                'category':itemProperties.category,
                'purchased_price':itemData['item cost'],
                'valuation':Number(itemData['valuation']),
                'properties':{},
                'dealer':{'action':'link','values':{'Dealer':{'query_filters':{'id':itemData['dealer'].id},'link_type':'first_link'}}
                                        }
            }

            

            const ignoreList = ['category','type','backref']
            Object.keys(itemProperties).forEach(key=>{
                if(!ignoreList.includes(key)){
                    buildItemDict['properties'][key] = itemProperties[key]

                }else if ( key === 'backref'){
                     Object.keys(itemProperties[key]).forEach(secKey=>{
                        buildItemDict[secKey] = itemProperties['backref'][secKey]
                    })
                }
            })

           

            if('dimensions' in itemData){
                buildItemDict['dimensions'] = itemData['dimensions']
            }
            if('item_issues' in itemData){
                buildItemDict['issues'] = itemData['item_issues']
            }
            if('note' in itemData){
                buildItemDict['notes'] = {'sub_model_name':'Item_Note',
                                                'action':'create',
                                                'values':{
                                                            'note_content': itemData['note']['content'],
                                                            'subject':{
                                                                        'action':'link',
                                                                        'values':{ 'Item_Notes_Subject':
                                                                                    {'query_filters':{'subject': itemData['note']['subject']},
                                                                                    'link_type':'first_link'}
                                                                                }

                                                            }

                                                }
                                            }
            }
            if(itemData.listOfImages.length > 0){
                buildItemDict['images'] = itemData.listOfImages
            }
            if(setToggleAfterSave){
                 setToggleAfterSave(true)
            }
           

            if('offlineIndexKey' in itemData && 'fetchType' in itemData){
                type = itemData.fetchType
            }
            
            let fetchResponse = await handleItemFetch(buildItemDict,itemData,type,messageOnScreen,comingFrom)
            return  fetchResponse

    }

    return {
        handleSaveItem,
        handleItemFetch,
        itemUploadLoading
    }
}