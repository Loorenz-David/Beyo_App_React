import {useState,useEffect,useRef,useContext} from 'react'
import {createPortal} from 'react-dom'
import useFetch from '../hooks/useFetch.tsx'
import FilterIcon from '../assets/icons/FilterIcon.svg?react'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'
import SelectPopupV2 from './SelectPopupV2'
import LoaderDots from '../components/LoaderDots.tsx'
import SecondaryPage from '../components/secondary-page.tsx'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import MinusCircleIcon from '../assets/icons/MinusCircleIcon.svg?react'



const noteSettingsList = [
    {'displayName':'Print','property':'print','icon':'p'},
    
    {'displayName':'Delete','property':'delete','icon':<MinusCircleIcon/>},

]
const handleNoteDeletion = async (noteList,doFetch,showMessage=null)=>{

    const user = JSON.parse(localStorage.getItem('user')|| '{}')
    let userName = ''
    if('username' in user){
        userName = user.username
    }

    const concurrency = 3
    let index = 0
    let notesDeleted = 0
    
    let failToDelete:any[] = []
    const worker = async()=>{
        while(index < noteList.length){
            const currentIndex = index++
            const note = noteList[currentIndex]
            try{
                 const fetchDict = {
                    model_name:'Item_Note',
                    reference:'note',
                    object_values:{
                        'query_filters':{'id':note.id},
                        'delition_type':'delete_first',
                        'also_do':{
                            'items':{
                                'action':'create_through_rel',
                                'values':{
                                    'item_history':{
                                        'action':'create',
                                        'sub_model_name':'Item_History',
                                        'append':true,
                                        'values':{
                                            'column_name':'Note',
                                            'type':'Deleted',
                                            'from_value':{'subject':note.subject.subject,'content':note.note_content} ,
                                            'recorded_time':new Date(),
                                            'user_name':userName
                                        }
                                    }
                                }
                            }
                        }
                    },
                }

                console.log(fetchDict,'notes that will be deleted')
                const res = await doFetch({
                    url:'/api/schemes/delete_items',
                    method:'POST',
                    body:fetchDict})
                if(!res.status){
                    throw new Error('Fail to Delete note status from response is not ok')
                }
                notesDeleted ++

            }catch (err){
                console.log('delition of note fail for:' ,note,err)
                failToDelete.push(note.subject)
                
            }
        }
    }
    await Promise.all(Array.from({length:concurrency},worker))

    if(showMessage){
        if(failToDelete.length > 0 ){
            showMessage({
                message:`Deleted ${notesDeleted}.But Fail to delete ${failToDelete.length}`,
                status:400,
                complementaryMessage:`Fail on the following subject: ${failToDelete}`
            })
        }else{
            showMessage({
                message:`Deleted ${notesDeleted}`,
                status:201
            })
        }
    }
    
   
   
   
}

const checkForChanges = (originalNoteDict,contentString,subjectString)=>{

    const originalSubject = originalNoteDict.subject.subject
    const originalContent = originalNoteDict.note_content

    const changedValues = {}
    const fromValues = {}

    if(originalSubject !== subjectString){
        changedValues['subject'] = subjectString
        fromValues['subject'] = originalSubject
        
    }
    if(originalContent !== contentString){
        changedValues['content'] = contentString
        fromValues['content'] = originalContent
    }

    return {fromValues,changedValues}

}

const CreateNote = ({handleClose,setForceRender,itemsId,interactiveRef,note=null})=>{
    const {showMessage} = useContext(ServerMessageContext)
    const queryTimeoutRef = useRef(null)
    const {doFetch,loading,data,setLoading} = useFetch()
    const [togglePopupSubject,setTogglePopupSubject] = useState(false)
    const [toggleInteractiveSettings,setToggleInteractiveSettings] = useState(false)
    const selectedSubjectRef = useRef(note ? {...note.subject} : {})
    const inputRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(()=>{
        
        let interactiveBtn = null

        if(interactiveRef.current){
            interactiveBtn = interactiveRef.current
            interactiveBtn.addEventListener('click',handleInteractiveBtn)
        }
       
        return ()=>{
            if(queryTimeoutRef.current){
                clearTimeout(queryTimeoutRef.current)
            }
            if(interactiveBtn){
                interactiveBtn.removeEventListener('click',handleInteractiveBtn)
            }
        }
    },[])

    const handleInteractiveBtn = ()=>{
        setToggleInteractiveSettings(true)
    }
    const handleSettingSelected = async (objSetting)=>{
        setToggleInteractiveSettings(false)

        if(objSetting.property == 'delete' && note ){
           await handleNoteDeletion([note],doFetch)
           setForceRender(prev=>!prev)
           handleClose()
        }
        
        
    }

    const handleSelectSubject = (obj)=>{
        selectedSubjectRef.current = {'id':obj.id,'subject':obj.subject}
        inputRef.current.value = obj.subject
        setTogglePopupSubject(false)
    }

    const handleInputQuery = (value='')=>{
        setLoading(true)
        if(!togglePopupSubject){
            setTogglePopupSubject(true)
        }

        if(queryTimeoutRef){
            clearTimeout(queryTimeoutRef.current)
        }
        queryTimeoutRef.current = setTimeout(async()=>{

            const fetchDict = {
                model_name:'Item_Notes_Subject',
                requested_data:['id','subject'],
                query_filters:{'subject':{'operation':'ilike','value':`%${value}%`}},
                per_page:10

            }
            const setRules = {loadData:true}
            await doFetch({
                url:'/api/schemes/get_items',
                method:'POST',
                body:fetchDict,
                setRules:setRules})
        },500)

        selectedSubjectRef.current = {}
    }

    const handleSaveNote = async ()=>{
        if(contentRef.current === ''){
            showMessage({
                message:'missing Content in note',
                status:400,
            })
            return
        }else if(inputRef.current.value === ''){
            showMessage({
                message:'missing Subject in note',
                status:400,
            })
            return
        }
        const fetchNoteDict ={'note_content':contentRef.current.value}
       

        if('id' in selectedSubjectRef.current){
            fetchNoteDict['subject'] = {
                'action':'link',
                'values':{'Item_Notes_Subject':{
                                                'query_filters':{'id':selectedSubjectRef.current.id},
                                                'link_type':'first_link'
                                                }
                }
            }
           
        }else{
            fetchNoteDict['subject'] = {
                'action':'create',
                'sub_model_name':'Item_Notes_Subject',
                'values':{
                    'subject':inputRef.current.value}
            }
            
        }

        let fetchUrl = ''

        const fetchDict:any = {
            model_name:'Item_Note',
            reference:'note', 
        }


        const user = JSON.parse(localStorage.getItem('user')|| '{}')
        let userName = ''
        if('username' in user){
            userName= user.username
        }

        if(note){
            const {fromValues,changedValues} = checkForChanges(note,contentRef.current.value,inputRef.current.value)

            fetchUrl = '/api/schemes/update_items'
            fetchDict['query_filters'] = {'id':note.id}
            fetchDict['update_type'] = 'first_match'
            fetchDict['object_values'] = {
                ...fetchNoteDict,
                'items':{
                    'action':'create_through_rel',
                    'values':{
                        'item_history':{
                            'action':'create',
                            'sub_model_name':'Item_History',
                            'append':true,
                            'values':{
                                'column_name':'Note',
                                'type':'Updated',
                                'recorded_time':new Date(),
                                'user_name':userName,
                                'from_value':fromValues,
                                'to_value':changedValues
                            }
                        }
                    }
                    
                }
            }

            
        }else{
            fetchUrl = '/api/schemes/create_items'
            fetchDict['requested_data'] = []
            fetchDict['object_values'] = {
                ...fetchNoteDict,
                'items':{
                    'action':'link',
                    'values':{
                        'Item':{
                            'query_filters':{'article_number':{'operation':'in','value':itemsId}},
                            'link_type':'all_link',
                            'also_do':{
                                            'item_history':{
                                                            'action':'create',
                                                            'append':true,
                                                            'sub_model_name':'Item_History',
                                                            'values':{
                                                                'column_name':'Note',
                                                                'recorded_time':new Date(),
                                                                'user_name':userName,
                                                                'from_value':'',
                                                                'type':'Created',
                                                                'to_value':{'subject': inputRef.current.value,'content':contentRef.current.value}
                                                            }
                                            }
                            }
                        }
                    }
                },
                
            }
        }

       
        await doFetch({
            url:fetchUrl,
            method:'POST',
            body:fetchDict})
        
        handleClose()
        setForceRender(prev => !prev)

    }

    return (
            <div className="flex-column" style={{height:'100dvh'}}>
                {toggleInteractiveSettings && interactiveRef.current && 
                    createPortal(
                        <SelectPopupV2 setTogglePopup={setToggleInteractiveSettings}
                            listOfValues={noteSettingsList}
                            onSelect={handleSettingSelected}
                            zIndex={4}
                            right={'100%'}
                        />,
                        interactiveRef.current
                    )
                }
                <div className="flex-column width100 gap-05 padding-10 padding-top-20">
                    <span className="color-lower-titles">Subject</span>
                    <div className="flex-row width100 bg-containers " style={{borderRadius:'5px',position:'relative'}} >
                        <input type="text" className="width100"  place-holder="Search note" 
                            style={{fontSize:'17px',padding:'8px 10px'}}
                            ref={inputRef}
                            defaultValue={note?note.subject.subject:''}
                            onInput={(e)=>{handleInputQuery(e.target.value)}}
                            onClick={()=>{setTogglePopupSubject(true)}}
                        />
                        {togglePopupSubject && 
                            <SelectPopupV2 setTogglePopup={setTogglePopupSubject}
                             listOfValues={data.map((obj)=> ({...obj,displayName:obj.subject}) )}
                             onSelect={handleSelectSubject}
                             zIndex={4}
                             selectedOption={'subject' in selectedSubjectRef.current ? new Set([selectedSubjectRef.current.subject]) : new Set([])}
                             loading={loading}
                             parentWidth={inputRef.current.offsetWidth}
                            />
                        }
                    </div>
                </div>
                <div className="flex-column height100 width100 padding-10" style={{maxHeight:'400px',}}>
                    <div className="flex-row height100  bg-containers padding-10" style={{borderRadius:'5px'}}>
                        <textarea ref={contentRef} className="width100 height100" defaultValue={note? note.note_content : ''}></textarea>
                    </div>
                    
                </div>
                <div className="flex-row padding-10 content-center padding-top-20">
                        <div role="button" className="flex-row btn bg-secondary padding-10 content-center"
                            onClick={()=>{handleSaveNote()}}
                        >
                            <span className="text-15 color-primary">Save Note</span>
                        </div>
                </div>
            </div>

    )
} 

const filterMap = [
    {'displayName':'Subject','column':'subject.subject'},
    {'displayName':'Content','column':'note_content'}
]
const ItemNoteDisplay = ({itemsId})=>{

    const {data,loading,doFetch,setLoading} = useFetch()
    const [toggleSelectFilter,setToggleSelectFilter] = useState(false)
    const [toggleNoteCreation,setToggleNoteCreation] = useState(false)
    const [forceRender,setForceRender] = useState(false)
    const filterSelection = useRef(['subject.subject','Subject'])
    const inputRef = useRef(null)
    const queryTimeout = useRef(null)
    const selectedNote = useRef(null)

   
    useEffect(()=>{

        handleFetch()

        return ()=>{
            if(queryTimeout.current){
                clearTimeout(queryTimeout.current)
            }
        }
    },[forceRender])

    const handleInputQuery = (value) =>{
        setLoading(true)
        if(queryTimeout.current){
            clearTimeout(queryTimeout.current)
        }
        queryTimeout.current = setTimeout(()=>{
            handleFetch(value)
        },500)
    }

    const handleFilterSelection = (filterObj)=>{
        filterSelection.current = [filterObj.column,filterObj.displayName]
    
        setToggleSelectFilter(false)
        handleFetch(inputRef.current.value)

    }

    const handleFetch = async(value='')=>{
        const fetchDict = {
            model_name:'Item_Note',
            requested_data :['id','note_content','creation_time',{'subject':['subject','id']}],
            per_page:50,
            query_filters: itemsId.length > 0 ? {'items.article_number':{'operation':'in','value':itemsId}} : {}
        }
        if(value !== ''){
            fetchDict['query_filters'][filterSelection.current[0]] = {'operation':'ilike','value':`%${value}%`}
        }

        const setRules = {loadData:true}
        await doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:fetchDict,
            setRules:setRules})
    }

    const handleNoteSelection = (noteObj,index) =>{
        
        selectedNote.current = noteObj
        
        setToggleNoteCreation(true)

    }

    
    return (
        <div className="flex-column width100" style={{height:'100dvh',overflowY:'hidden'}}>
            {toggleNoteCreation &&
                <SecondaryPage BodyComponent={CreateNote}
                bodyProps={{note:selectedNote.current,setForceRender:setForceRender,itemsId}}
                handleClose={()=>{setToggleNoteCreation(false); selectedNote.current = null}}
                zIndex={3}
                // closeIcon={false}
                interactiveBtn ={{iconClass:'svg-15 padding-10  position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
                closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 flex-1 content-start',order:0}}
                startAnimation={'slideLeft'}
                endAnimation ={'slideRight'}
                pageId={'createNote'}
                />
            }

            <div className="flex-row padding-15">
                <div className="flex-row width100 bg-containers " style={{borderRadius:'5px'}}>
                    <input type="text" className="width100"  place-holder="Search note" 
                        style={{fontSize:'15px',padding:'8px 10px'}}
                        onInput={(e)=>{handleInputQuery(e.target.value)}}
                        ref={inputRef}
                    />
                    <div className="flex-column content-center push-right" style={{position:'relative'}}>
                        <div className="svg-15 flex-column btn items-center content-center" 
                            onClick={()=>{setToggleSelectFilter(true)}}
                        >
                            <FilterIcon />
                        </div>

                        {toggleSelectFilter && 
                            <SelectPopupV2 right={'80%'} zIndex={3}
                                setTogglePopup={setToggleSelectFilter}
                                listOfValues = {filterMap}
                                onSelect = {handleFilterSelection}
                                selectedOption={filterSelection.current[1]}
                                
                            />
                        }
                    </div>
                </div>
            </div>

            <div className="flex-column padding-top-20" style={{overflowY:'scroll'}}>
                {loading ? 
                    <div className="flex-column gap-1 items-center content-center padding-top-20">
                        <span className="color-secondary text-15">Loading Notes</span>
                        <LoaderDots/>
                    </div>
                : 
                data.map((note,i)=>{
                    const contentPreview = note.note_content.slice(0,40) 
                    const date = new Date(note.creation_time)
                    const noteTime = date.getDate() + ' ' + date.toLocaleString('en-US',{month:'short'})

                    return(
                        <div key={`noteItem_${i}`} className="flex-row border-bottom items-center  padding-15"
                            onClick={()=>{handleNoteSelection(note,i)}}
                        >
                            <div className="flex-column gap-1">
                                <span className="text-15" style={{textWrap:'wrap'}}>{note.subject.subject}</span>
                                <span className="color-light-titles">{contentPreview}</span>
                            </div>
                            <div className="flex-colum push-right">
                                <span className="text-12">{noteTime}</span>
                            </div>
                        </div>
                    )
                })
                }

                
                
            </div>
            
            <div className="flex-row" style={{position:'absolute',bottom:'30px',right:'30px'}}>
                <div className="flex-row bg-containers border-blue  btn"style={{padding:'10px 15px'}} 
                onClick={()=>{setToggleNoteCreation(true)}}
                >
                    <span className="text-15">Compose</span>
                </div>
            </div>
        </div>
    )

}

export const ItemNoteDisplayBtn = ({text,itemsId,zIndex=2}) =>{
    const [toggleNoteDisplay,setToggleNoteDisplay] = useState(false)
    
    return (
            <button className="flex-row padding-10 width100"
            
            onClick={()=>{setToggleNoteDisplay(true)}}
            >
                {toggleNoteDisplay && 
                    <SecondaryPage BodyComponent={ItemNoteDisplay}
                    bodyProps={{itemsId}}
                    zIndex={zIndex}
                    handleClose ={()=>{setToggleNoteDisplay(false)}}
                    pageId={'itemNoteDisplay'}
                   
                    />
                }
                
                <span className="text-15">{text}</span>
            </button>
    )
}

