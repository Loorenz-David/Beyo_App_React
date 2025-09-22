import {useState,useContext} from 'react'

import {useUploadImage} from '../hooks/useUploadImage.tsx'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'
import {saveFailedItem,clearFailedItem,updateFailedItem} from './useIndexDB.tsx'
import useFetch from './useFetch.tsx'

const compareListOfImages = (curVal,baseVal=null)=>{
    
    const curValSet = new Set(curVal)
    let addedImgs =[]
    let removeImgs = []
    let originalImages =[]
    for(const val of curVal){
        if(typeof val !== 'string' ){
            addedImgs.push(val)
        }else{
            originalImages.push(val)
        }
    }
    if(baseVal){
        const baseValSet = new Set(baseVal)
        removeImgs = [...baseValSet].filter(val => !curValSet.has(val))

    }
  
    return {addedImgs,removeImgs,originalImages}
}

const getChangedFields =  (currentItemData,baseLine)=>{
    const changes: Record<string,any> = {}

    for(const key in currentItemData){
        const curVal = currentItemData[key]
        const baseVal = baseLine[key]

        if(typeof curVal === 'object' && curVal !== null){
            if(JSON.stringify(curVal) !== JSON.stringify(baseVal)){
                changes[key] = curVal
            }
        }else{
            if(curVal !== baseVal){
                changes[key] = curVal
            }
        }
    }
    return changes
}

export const useSaveItemsV2= ()=>{
    const {showMessage} = useContext(ServerMessageContext)
    const [itemUploading,setUploading] = useState(false)
    const requiredFields = ['article_number','category','type','purchased_price','valuation','dealer']
    const {deleteImageS3,UploadImage} = useUploadImage()
    const {apiFetch} = useFetch()

    const fetchNotes = async(fetchNoteDict,serverMessage)=>{
        const promises = []
        for(let key in fetchNoteDict){
            let api = ''
            if(!(fetchNoteDict[key].length > 0)){
                continue
            }
            
            if(key == 'Updated'){
                api = '/api/schemes/update_items'
            }else if(key == 'Created'){
                api = '/api/schemes/create_items'
            }else if(key == 'Deleted'){
                api = '/api/schemes/delete_items'
            }
            
            
            const promise = apiFetch({
                endpoint:api,
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(fetchNoteDict[key]),
                credentials:'include'
            })
                .then(res => res.json())
                .then(response => {
                    if(response.status >= 400){
                        console.log(response,'response inside if of .then')
                        showMessage({
                            message:'Error Creating Note.',
                            complementMessage:response.server_message,
                            status:400
                        })
                    }else if(serverMessage){
                        showMessage(response)
                    }
                })
            .catch(err =>{
                console.log(err, 'server error on fetchNotes!! ')
                showMessage({status:500,message:`Server Error check logs ${key}`,complementMessage:String(err)})
            })
            promises.push(promise)
        }

        await Promise.all(promises)
    }

    const handleBuildNotesForFetch = (itemData,userName)=>{
        if(!Array.isArray(itemData.notes)) return {}

        const notesDict:{Created:any[],Updated:any[],Deleted:any[]} = {
            Created:[],
            Updated:[],
            Deleted:[],
        }

        const handleSubjectBuild = (subjectDict)=>{
            const tempDict = {}
            
            if(subjectDict.id){
                tempDict['action'] = 'link'
                tempDict['values'] = {'Item_Notes_Subject':{
                        'query_filters':{'id':subjectDict.id},
                        'link_type':'first_link'
                }}

            }else{
                tempDict['action'] = 'link'
                tempDict['values'] = {'Item_Notes_Subject':{
                    'query_filters':{'subject':{'operation':'ilike','value':`%${subjectDict.subject}%`}},
                    'link_type':'first_link',
                    'action_if_none':'create_entry',
                    'values_for_none_action':{'subject':subjectDict.subject}

                }}

               

            }

            return tempDict

        }
        const handleHistoryBuild = (noteProps,actionType)=>{

            const historyDict = {'item_history':{
                                        'action':'create',
                                        'append':true,
                                        'sub_model_name':'Item_History',
                                        'values':{
                                            'column_name':'Note',
                                            'recorded_time': noteProps.toNote? noteProps.toNote.creation_time : new Date(),
                                            'user_name':userName,
                                            'from_value':noteProps.fromNote ?? '',
                                            'type':actionType,
                                            'to_value':noteProps.toNote ?? ''
                                        }
                                }
            }

            return historyDict

        }

        itemData.notes.forEach((note,i)=>{

            if(note.action == 'Created'){
                const toNote = {'content':note.note_content,'subject':note.subject.subject}
                const tempDict = {
                    'note_content':note.note_content,
                    'subject': handleSubjectBuild(note.subject),
                    'items':{
                        'action':'link',
                        'values':{
                            'Item':{
                                'query_filters':{'article_number':{'operation':'in','value':itemData.article_number}},
                                'link_type':'all_link',
                                'also_do':handleHistoryBuild({toNote},note.action)
                                }
                        }
                    
                    }
                }
                const majorParent = {
                    model_name:'Item_Note',
                    object_values:tempDict,
                    reference:'Note',
                    requested_data:[]
                }
               
                notesDict['Created'].push(majorParent)
                
                
            }else if(note.action == 'Updated'){
                const tempDict ={} 
                const toNote = {}
                const fromNote = {}
                if('note_content' in note){
                    
                    tempDict['note_content'] = note.note_content

                    
                    fromNote['content'] = note.original_note.note_content
                    toNote['content'] = note.note_content

                }
                if('subject' in note){
                    tempDict['subject'] = handleSubjectBuild(note.subject)
                    
                    fromNote['subject'] = note.original_note.subject.subject
                    toNote['subject'] = note.subject.subject
                }

                tempDict['items'] = {
                    'action':'create_through_rel',
                    'values':handleHistoryBuild({fromNote,toNote},note.action)
                }

                const majorParentFetch = {
                    model_name:'Item_Note',
                    object_values:tempDict,
                    query_filters:{'id':note.id},
                    update_type:'first_match',
                    reference:'Note'
                }
                notesDict['Updated'].push(majorParentFetch)
            }else if(note.action == 'Deleted'){
                const tempDict = {}
                const fromNote = {'content':note.original_note.note_content,'subject':note.original_note.subject.subject}

                tempDict['query_filters'] = {'id':note.id}
                tempDict['delition_type'] = 'delete_first'
                tempDict['also_do'] = {
                    'items':{
                        'action':'create_through_rel',
                        'values':handleHistoryBuild({fromNote},note.action)
                    }
                }

                const majorParentFetch = {
                    model_name:'Item_Note',
                    object_values:tempDict,
                    reference:'Note'
                }

                notesDict['Deleted'].push(majorParentFetch)
            }
           

        })

        return notesDict


    }

    const handleBuildOfItemFetch = async (itemData,type,baseLineDict=null,allowArticleChange) =>{

        //validate itemData
        let isBatchUpdate = false
        if( itemData.article_number && Array.isArray(itemData.article_number)){
            isBatchUpdate = true
        }
         
        if(!isBatchUpdate && type !== 'update'){
            
             for(const requiredField of requiredFields){
                if(!itemData[requiredField]){
                    const keyMessage = 'Missing ' + requiredField
                    
                    showMessage({status:400,message:keyMessage})
                    
                    
                    return {success:false}
                }
            }
        }
        

        // check if is update...
        let fixedItemData:any = {}
        
        if(baseLineDict){
            fixedItemData = getChangedFields(itemData,baseLineDict)
            
        }else{
            fixedItemData = {...itemData}
        }

        if(Object.keys(fixedItemData).length == 0){
            showMessage({status:400,message:'No changes where detected.'})
            return {success:false}
        }
        
        // check for images to be uploaded and to be deleted
        let imagesToUpload:any[] = []
        let imagesToDelete:any[] = []
        let originalUrlImages:any[] = []

        let failImageUpload = []
        let imagesDeleted = true
        
        
        if('images' in fixedItemData){
           const {
            addedImgs=[],
            removeImgs=[],
            originalImages=[]
           } = compareListOfImages(
            fixedItemData.images,
            baseLineDict && 'images' in baseLineDict ? baseLineDict.images : null
            )
            
            imagesToUpload = addedImgs
            imagesToDelete = removeImgs
            originalUrlImages = originalImages
    
        }

        if(imagesToUpload.length > 0){
           
            imagesToUpload = await UploadImage(imagesToUpload,'PurchaseAppReact')
        
            let tempList = []
            for(const img of imagesToUpload){
                if(img.isUpload){
                    tempList.push(img.url)
                }else{
                    failImageUpload.push(img)
                }  
            }
            itemData['images'] = [...originalUrlImages,...imagesToUpload]

            fixedItemData['images'] = [...tempList,...originalUrlImages]

        }

        if(imagesToDelete.length > 0){
            const resDel = await deleteImageS3(imagesToDelete)
            
            if(resDel.status === 400){
                imagesDeleted = false
                let imagesNotDeleted:any[] = []

                if(resDel.body.length > 0){
                    for(const img of imagesToDelete){
                        if(!resDel.body.includes(img)){
                            imagesNotDeleted.push(img)
                        }
                    }
                }else{
                    imagesNotDeleted = imagesToDelete
                }
                
                itemData['images'] = [...itemData['images'], ...imagesNotDeleted]
                fixedItemData['images'] = [...fixedItemData.images, ...imagesNotDeleted]
            }
        }

        // builds the dict for upload
        const userObj =  JSON.parse(localStorage.getItem('user') || '{}')
        let userName = ''
        if('username' in userObj){
            userName = userObj.username
        }

        let notesFetchDict = {}
        const fetchDictData:any = {}
        for(const key in fixedItemData){

            
            if(key === 'dealer' ){

                fetchDictData['dealer'] = {
                    'action':'link',
                    'values':{'Dealer':{
                                        'query_filters':{'id':fixedItemData.dealer.id},
                                        'link_type':'first_link'
                                        }
                    }
                }
            }
            else if(key ===  'notes'){
                
                notesFetchDict = handleBuildNotesForFetch(itemData,userName)
                continue
                // let subjectAction = {}
                // if(!('id' in fixedItemData.notes)){
                //     subjectAction = {
                //                         'action':'create',
                //                         'sub_model_name':'Item_Notes_Subject',
                //                         'values':{
                //                             'subject':fixedItemData['notes']['subject']['subject']
                //                         }
                //     }

                // }else{
                //     subjectAction = {
                //                     'action':'link',
                //                     'values':{
                //                                 'query_filters':{'id':fixedItemData['notes']['subject']['id']},
                //                                 'link_type':'first_link',
                //                     }
                //     }
                // }

                // fetchDictData['notes'] = {
                //     'action':'create',
                //     'sub_model_name':'Item_Note',
                //     'values':{
                //         'note_content':fixedItemData['notes']['note_content'],
                //         'subject':subjectAction
                //     }
                // }
            }
            else if( key == 'fetchType' || key == 'offlineIndexKey' || key == 'created_at' || key == 'item_history' || key == 'originalId' ){
                if(key == 'item_history' && !('item_history' in fetchDictData)){
                    fetchDictData[key] = fixedItemData[key]
                }

                continue
            }
            else if(key == 'article_number' && !allowArticleChange){
                continue
            }
            else{
                fetchDictData[key] = fixedItemData[key]
            }

            
            
            if(baseLineDict ){

                
                let from ;
                let to = fixedItemData[key]

                if(isBatchUpdate){
                    from = 'Batch update'
                }else{
                     from = baseLineDict[key]
                }
                
                if(key == 'images'){
                    from = !baseLineDict.images ? 0 : baseLineDict.images.length   + ' images'
                    to = fixedItemData.images.length + ' images'
                }
                

                if(!('item_history' in fetchDictData)){
                    fetchDictData['item_history'] = {
                        'sub_model_name':'Item_History',
                        'action':'create',
                        'append':true,
                        'values':[]
                    }
                     itemData['item_history'] = {
                        'sub_model_name':'Item_History',
                        'action':'create',
                        'append':true,
                        'values':[]
                    }
                }


                
                const historyDict = {
                    'column_name':key, 
                    'from_value':from,
                    'to_value':to,
                    'recorded_time':new Date(),
                    'type':'Updated',
                    'user_name':userName

                }

                fetchDictData.item_history.values.push(historyDict)
                itemData.item_history.values.push(historyDict)
            }
        }

        if(type == 'create'){
            fetchDictData['created_by'] = userName
        }
      
       

        return {success:true, fetchDictData, failImageUpload,imagesDeleted,notesFetchDict}
    }


    const uploadItem = async (props)=>{
        const{itemData,type,baseLineDict=null,showServerMessage=true,createOfflineItemIfFail=true,allowArticleChange=false} = props
        let actionDisplay = 'Created'
        let wasOffline = false

        if('offlineIndexKey' in itemData){
            wasOffline = true
        }

        try{

            if(itemData.dealer && itemData.dealer.dealer_name == 'Offline Dealer'){
                throw Error('On Item, dealer is assign to Offline Dealer.')
            }
            
            const resultFromBuild = await handleBuildOfItemFetch(itemData,type,baseLineDict,allowArticleChange)
            
            if(!resultFromBuild.success){
                return{success:false}
            }
            const {fetchDictData,failImageUpload,imagesDeleted,notesFetchDict} = resultFromBuild
        
            const fetchDict:any = {
                model_name:'Item',
                object_values: fetchDictData,
                reference:'Item'
            }
            let api = '/api/schemes/create_items'
            if(type == 'update'){
                api = '/api/schemes/update_items'
                fetchDict['query_filters'] = {'article_number':{'operation':'in','value':itemData.article_number}}
                fetchDict['update_type'] = 'all_matches'

                actionDisplay = 'Updated'
            }else{
                fetchDict['requested_data'] = []
            }
            
            console.log('the dict that will be send to the back end')
            console.log(fetchDict)

            
            
            try{
                setUploading(true)
                let fetchNotesServerMessage= false
                if(Object.keys(fetchDictData).length > 0){
                    
                     const response = await apiFetch({
                        endpoint:api,
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify(fetchDict),
                        credentials:'include'
                    })

                    const resJSON = await response.json()
                    if(resJSON.status < 400 ){
 

                    let message = `Item ${actionDisplay}`
                    
                    if(failImageUpload.length > 0 || !imagesDeleted){
                        let complementMessage = ''
                        message = message + ' but...'
                        
                        if(failImageUpload.length > 0){
                            complementMessage =  failImageUpload.length + ' images did not upload to the cloud. '
                        }
                        if (!imagesDeleted){
                            complementMessage = complementMessage + ' Images where not deleted from the cloud' 
                        }
                        showMessage({status:400, message:message, complementMessage:complementMessage })
                    }else if(showServerMessage){
                        showMessage({status:200,message:message})
                    
                    }
                    if(wasOffline){
                        clearFailedItem(itemData.offlineIndexKey)
                    }
                    }else{
                        console.log(resJSON,'fail to upload')
                        throw new Error(resJSON.server_message || 'API request faild')
                    }
                }else{
                    fetchNotesServerMessage = true
                }
                
                await fetchNotes(notesFetchDict,fetchNotesServerMessage) 

                return {success:true}
            }catch(err){
                throw new Error(err instanceof Error ? err.message : String(err))
            }

        }catch(err){
            console.log(err,`error in ${actionDisplay} item` )
            if(Array.isArray(itemData.article_number)){
                showMessage({status:500,message:`fail to batch update, check internet connection.`})
                
            }else{
                if(createOfflineItemIfFail){
                      if(!wasOffline){
                        itemData['fetchType'] = type
                        if('id' in itemData){
                            itemData['originalId'] = itemData['id']
                            delete itemData['id']
                        }
                        
                        const offlineId = await saveFailedItem(itemData)
                        itemData['offlineIndexKey'] = offlineId
                        
                        
                        
                    }else{
                        if('id' in itemData){
                            itemData['originalId'] = itemData['id']
                            delete itemData['id']
                        }
                        updateFailedItem(itemData['offlineIndexKey'],itemData)
                    }

                    if('originalId' in itemData){
                        itemData['id'] = itemData['originalId']
                    }

                    if( showServerMessage &&itemData.dealer && itemData.dealer.dealer_name == 'Offline Dealer'){
                        showMessage({status:100,message:`Offline Item was ${actionDisplay}.` ,complementMessage:'As Item has dealer assign to Offline Dealer'})
                    }else if(showServerMessage){
                    
                        showMessage({status:400,message:`Offline Item was ${actionDisplay} as the Item was not ${actionDisplay} in the cloud.`})
                    }
                }
              
                
            }
           
            return {success:false}
        }
        
        

    }

    return {
        itemUploading,
        handleBuildOfItemFetch,
        uploadItem,
        setUploading
    
    }


}

