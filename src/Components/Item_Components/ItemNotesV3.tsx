
import {useState,memo,useEffect,useContext,useRef} from 'react'

import {ServerMessageContext} from '../../contexts/ServerMessageContext.tsx'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'
import {useData} from '../../contexts/DataContext.tsx'

import useFetch from '../../hooks/useFetch.tsx'
import {useLongPressAction}  from '../../hooks/useLongPressActions.tsx'
import useInfiniteScroll from '../../hooks/useInfinityScroll.tsx'

import SelectPopupV2 from './SelectPopupV2'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'
import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'
import {HeaderSlidePage} from '../Navigation_Components/HeaderSlidePage.tsx'

import SelectionModeComponent from './SelectionModeComponent.tsx'


import EditIcon from '../../assets/icons/General_Icons/EditIcon.svg?react'
import FilterIcon from '../../assets/icons/General_Icons/FilterIcon.svg?react'
import MinusCircleIcon from '../../assets/icons/General_Icons/MinusCircleIcon.svg?react'
import CheckMarkIcon from '../../assets/icons/General_Icons/CheckMarkIcon.svg?react'
import ThreeDotMenu from '../../assets/icons/General_Icons/ThreeDotMenu.svg?react'


import DeleteIcon from '../../assets/icons/General_Icons/DeleteIcon.svg?react'

import type {GetFetchDictProps} from '../../types/fetchTypes.ts'


interface SubjectDict{
        id:number
        subject:string
    }
interface NoteDict{
    id:number
    note_content:string
    creation_time:string
    subject: SubjectDict
}

interface SettingProps {
    displayName:string
    property:string
    icon:string | React.ReactNode
}

const noteSettingsListStatic:SettingProps[] = [
    {'displayName':'Print','property':'print','icon':'p'},
    {'displayName':'Delete','property':'delete','icon':<MinusCircleIcon/>},

]
const buildSaveNote = ({noteObj,action,batchAction=false,showMessage,selectedSubject,inputRef,contentRef})=>{

        const noteDict:any = {}
        if(noteObj&& typeof noteObj.index == 'number'){
            noteDict['index'] = noteObj.index
            
        }
        
        if(!noteObj || !noteObj.id){
            noteDict['action'] = 'Created'
            noteDict['creation_time'] = new Date()
        }else if(noteObj){
            
            noteDict['action'] = 'Updated'
            
            if(noteObj.id){
                noteDict['id'] = noteObj.id
                if(!noteObj.recordedOriginal){
                    noteDict['recordedOriginal'] = true
                    noteDict['original_note'] = {'note_content':noteObj.note_content,'subject':noteObj.subject}
                }else{
                    noteDict['original_note'] = noteObj.original_note
                    noteDict['recordedOriginal'] = true
                }
            }
        }

        if(action == 'delete'){
            noteDict['action'] = 'Deleted'
            
            return noteDict
        }
        
        if(inputRef.current.value == ''){
            if(batchAction){
                noteDict['subject'] = noteObj.subject
            }else{
                showMessage({status:400,message:'Missing Subject'})
                return
            }
           
        }else{
            if(selectedSubject.id){
                noteDict['subject'] = {...selectedSubject}
            }else{
                noteDict['subject'] = {'subject':inputRef.current.value}
            }
        }
        
        if(contentRef.current.value == ''){
            if(batchAction){
                noteDict['note_content'] = noteObj.note_content
            }else{
                showMessage({status:400,message:'Missing Content'})
                return
            }
            
        }else{
            noteDict['note_content'] = contentRef.current.value
        }


        return noteDict
    }


const CreateNote = ({note=null,handleNoteAction}:{note:NoteDict | null, handleNoteAction:()=>void})=>{
    const {showMessage} = useContext(ServerMessageContext)
    const queryTimeoutRef = useRef(null)
    const {doFetch,loading,data,setLoading} = useFetch()
    const [togglePopupSubject,setTogglePopupSubject] = useState(false)
    const [toggleInteractiveSettings,setToggleInteractiveSettings] = useState(false)
    const [selectedSubject,setSelectedSubject]= useState<Partial<SubjectDict>>({})
    const inputRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLInputElement>(null)
    const [noteSettingsList,setNoteSettingsList] = useState<SettingProps[]>(noteSettingsListStatic)
    const {slidePageTo} = useSlidePage()
   
   
    useEffect(()=>{
        
        

        if(note && note.subject){
            if(inputRef.current){
                inputRef.current.value = note.subject.subject
            }
            if(contentRef.current){
                contentRef.current.value = note.note_content
            }
            setSelectedSubject({...note.subject})
            setNoteSettingsList([...noteSettingsListStatic])
        }else{
            if(inputRef.current){
                inputRef.current.value = ''
            }
            if(contentRef.current){
                contentRef.current.value = ''
            }
            setSelectedSubject({})
            setNoteSettingsList([...noteSettingsListStatic.slice(0,-1)])
        }
        
       
        return ()=>{
            if(queryTimeoutRef.current){
                clearTimeout(queryTimeoutRef.current)
            }
            
          
        }
    },[note])

    const handleSettingSelected = async (objSetting)=>{
        setToggleInteractiveSettings(false)

        if(objSetting.property == 'delete' && note ){
          handleSaveNote('delete')
        }
        
    }

    const handleSelectSubject = (obj)=>{
        setSelectedSubject({'id':obj.id,'subject':obj.subject})
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

        setSelectedSubject({})
    }

    

    const handleSaveNote = (action='update/create')=>{
        let noteList: any[] = []
        
        if(Array.isArray(note)){
            note.forEach(noteObj =>{
                noteList.push(buildSaveNote({noteObj,action,batchAction:true,showMessage,selectedSubject,inputRef,contentRef}))
            })
        }else{
            noteList.push(buildSaveNote({noteObj:note,action,batchAction:false,showMessage,selectedSubject,inputRef,contentRef}))
        }
        
        handleNoteAction(noteList)
        slidePageTo({addNumber:-1})

    }
    console.log('before return in create Note',note)
    return (
            <div className="flex-column" style={{height:'100dvh'}}>
                
                <HeaderSlidePage 
                    middleElement={
                        <div className="flex-row flex-1">

                         </div>
                    }
                    rightElement={
                          <div className="flex-row  content-end"
                            style={{position:'relative',zIndex:1}}
                        >
                            
                            <div className=" btn svg-18"
                                onClick={()=>{
                                    setToggleInteractiveSettings(true)
                                }}
                            >
                                <ThreeDotMenu/>
                            </div>
                            {toggleInteractiveSettings && 
                                <SelectPopupV2 setTogglePopup={setToggleInteractiveSettings}
                                    listOfValues={noteSettingsList}
                                    onSelect={handleSettingSelected}
                                    zIndex={2}
                                    right={'100%'}
                                />
                            }
                         
                        </div>
                    }
                />
             

                <div className="flex-column width100 gap-05 padding-10 padding-top-20">
                    <span className="color-lower-titles">Subject</span>
                    <div className="flex-row width100 bg-containers " style={{borderRadius:'5px',position:'relative'}} >
                        <input type="text" className="width100"  place-holder="Search note" 
                            style={{fontSize:'17px',padding:'8px 10px'}}
                            ref={inputRef}
                            defaultValue={note && !Array.isArray(note) ? note.subject.subject : ''}
                            onInput={(e)=>{handleInputQuery(e.target.value)}}
                            onClick={()=>{setTogglePopupSubject(true)}}
                        />
                        {togglePopupSubject && 
                            <SelectPopupV2 setTogglePopup={setTogglePopupSubject}
                             listOfValues={data.map((obj)=> ({...obj,displayName:obj.subject}) )}
                             onSelect={handleSelectSubject}
                             zIndex={4}
                             selectedOption={'subject' in selectedSubject ? new Set([selectedSubject.subject ]): null}
                             loading={loading}
                             parentWidth={inputRef.current.offsetWidth}
                            />
                        }
                    </div>
                </div>
                <div className="flex-column height100 width100 padding-10" style={{maxHeight:'400px',}}>
                    <div className="flex-row height100  bg-containers padding-10" style={{borderRadius:'5px'}}>
                        <textarea ref={contentRef} className="width100 height100" defaultValue={note && !Array.isArray(note) ? note.note_content : ''}></textarea>
                    </div>
                    
                </div>
                <div className="flex-row padding-10 content-center padding-top-20">
                        <div role="button" className="flex-row btn bg-secondary padding-10 content-center no-select"
                            onClick={()=>{handleSaveNote()}}
                        >
                            <span className="text-15 color-primary">Save Note</span>
                        </div>
                </div>
            </div>

    )
} 

const NoteContainer = ({props})=>{
    const {note,key,handleTouchMove,handlePressStart,handlePressEnd,isSelected} = props
    const contentPreview = note.note_content ? note.note_content.slice(0,40) : ''
    const date = note.creation_time instanceof Date ? note.creation_time : new Date(note.creation_time)
    const noteTime = date.getDate() + ' ' + date.toLocaleString('en-US',{month:'short'})
    
    return(
        <div observing-obj-for-selection = {key}
           
            className="flex-row border-bottom items-center  padding-15"
            onContextMenu={(e)=>{e.preventDefault()}}
            onTouchMove={(e)=>{handleTouchMove(e)}}
            onTouchStart ={(e)=>{handlePressStart(e,note)}}
            onTouchEnd ={(e)=>{handlePressEnd && handlePressEnd(e,note)}}
           
        >   
            <div className={`flex-column padding-right-20 selection-icon ${isSelected ? '':'hide'}`}>
                <div className="flex-column items-center content-center" style={{borderRadius:'50%',width:'25px',height:'25px',backgroundColor:'rgba(62, 85, 236, 1)'}}>
                    <div className="svg-15 flex-column items-center content-center">
                        <CheckMarkIcon/>
                    </div>
                </div>
                
            </div>
            <div className="flex-column gap-1">
                <span className="text-15" style={{textWrap:'wrap'}}>{note.subject.subject}</span>
                <span className="color-light-titles">{contentPreview}</span>
            </div>
            <div className="flex-colum push-right">
                <span className="text-12">{noteTime}</span>
            </div>
        </div>
    )
}

const NoteListContainer = ({fetchDataList,itemNotesData,handlePressStart,handlePressEnd,handleTouchMove,selectedNotes})=>{

    const listOfNoteElements = []

    for(let i = 0; i < fetchDataList.length; i++ ){
        let isSelected = false
        const foundModification = itemNotesData.find(obj => obj.id === fetchDataList[i].id)
        const key = `fetchNotes_${i}`
        if(key in selectedNotes){
            isSelected = true
        }

        if(foundModification){
            if(foundModification.action == 'Updated'){
               
                foundModification['index'] = i
                foundModification['selectionKey'] = key
                foundModification['creation_time'] = fetchDataList[i].creation_time
                listOfNoteElements.push( 
                <NoteContainer key={key}
                    props={{
                        note:foundModification,
                        key:key,
                        handlePressStart:handlePressStart,
                        handleTouchMove:handleTouchMove,
                        handlePressEnd:handlePressEnd,
                        isSelected:isSelected
                    }} 
                /> )

                continue
            }else if(foundModification.action == 'Deleted'){
                continue
            }
        }
        fetchDataList[i]['index'] = i
        fetchDataList[i]['selectionKey'] = key
        listOfNoteElements.push(
             <NoteContainer key={key}
                    props={{
                        note:fetchDataList[i],
                        key:key,
                        handlePressStart:handlePressStart,
                        handleTouchMove:handleTouchMove,
                        handlePressEnd:handlePressEnd,
                        isSelected:isSelected
                    }}
                /> 
            )

    }
    
    const currentNoteList = []
    
    for(let i= 0; i< itemNotesData.length;i++){
        if(!itemNotesData[i].id){
            let isSelected = false
            const key = `currentNote_${i}`
            if(key in selectedNotes){
                isSelected = true
            }
            itemNotesData[i]['selectionKey'] = key
            
            itemNotesData[i]['index'] = i
           
            currentNoteList.push(
                 <NoteContainer key={key}
                    props={{
                        note:itemNotesData[i],
                        key:key,
                        handlePressStart:handlePressStart,
                        handleTouchMove:handleTouchMove,
                        handlePressEnd:handlePressEnd,
                        isSelected:isSelected
                    }}
                /> 
            )
        }
    }


    return ( 
    <>
        {currentNoteList}
        {listOfNoteElements}
    </>
    )
    
}



const DeleteBatchNotes = ({props})=>{
    const {handleNoteAction,selectedNotes,setSelectedNotes} = props
    
    return(
        <div className="flex-column item-center content-center btn svg-18 no-select"
            role="button"
            onClick={()=>{
                const buildNotesToDelete = []
                Object.values(selectedNotes).forEach(noteObj=>buildNotesToDelete.push(buildSaveNote({noteObj,action:'delete',batchAction:true})))
                handleNoteAction(buildNotesToDelete)
                setSelectedNotes({})
            }}
        >
            <DeleteIcon/>
        </div>
    )
}



const filterMap = [
    {'displayName':'Subject','column':'subject.subject'},
    {'displayName':'Content','column':'note_content'}
]
const ItemNoteDisplay = ({handleNoteAction,fetchNotes})=>{

    const {loading,doFetch,setLoading} = useFetch()
    const [dataList,setDataList] = useState<NoteDict[]>([])
    const [toggleSelectFilter,setToggleSelectFilter] = useState(false)
    const [forceRender,setForceRender] = useState(false)
    const [selectionMode,setSelectionMode] = useState(false)
    const [selectedNotes, setSelectedNotes] = useState({})

    const filterSelection = useRef(['subject.subject','Subject'])
    const inputRef = useRef<HTMLInputElement>(null)
    const queryTimeout = useRef(null)
    const lastLoad = useRef(false)

    const {data:itemData} = useData()
    const itemNotes = itemData.notes ?? []
    const itemArticleNumbers = itemData.article_number
    const {slidePageTo} = useSlidePage()
    const [NextPageChild,setNextPageChild] = useState<React.ReactNode>(null)

    useEffect(()=>{
        
        if(fetchNotes){
             handleFetch()
        }
       

        return ()=>{
            if(queryTimeout.current){
                clearTimeout(queryTimeout.current)
            }
        }
    },[forceRender,itemData])
 
    const toggleComposePage = ()=>{
        slidePageTo({addNumber:1})
        setNextPageChild(
            <CreateNote
                note={currentSelectedObj.current}
                setForceRender={setForceRender}
                handleNoteAction={handleNoteAction}
            />
        )
    }

    const handleActionWhenPress = (targetElement,selectedNote)=>{
        // const targetSelectionElement = targetElement.querySelector('.selection-icon')
        // targetSelectionElement.classList.toggle('hide')
        const attrName = targetElement.getAttribute('observing-obj-for-selection')
        if(attrName in selectedNotes){
            setSelectedNotes(prev => {
                const {[attrName]:_,...current} = prev

                return current
            })
        }else{
            setSelectedNotes(prev =>({
                ...prev,
                [attrName]:selectedNote
            }))
        }
    }
   
    const {handlePressStart,handlePressEnd,handleTouchMove,currentSelectedObj} = useLongPressAction({selectionMode,setSelectionMode,handleActionWhenPress,handleDefaultActionWhenClick:toggleComposePage})

   const handleFetch = async(scrolling:string='',fetchPerPage:number=180,itemsListId:number[]=[])=>{

        let queryFilterAdaptation = {}
        if(itemArticleNumbers){
            queryFilterAdaptation = {'items.article_number':{'operation':'in','value':itemArticleNumbers}}
            
        }
        
        
        const fetchDict:GetFetchDictProps = {
            model_name:'Item_Note',
            requested_data :['id','note_content','creation_time',{'subject':['subject','id']}],
            per_page: fetchPerPage,
            query_filters: queryFilterAdaptation
        }

        if(inputRef.current && inputRef.current.value !== ''){
            fetchDict['query_filters'][filterSelection.current[0]] = {'operation':'ilike','value':`%${inputRef.current.value}%`}
        }
        
        if(scrolling == 'down' && dataList.length > 0){
            const lastItem:NoteDict = dataList[dataList.length -1]
            fetchDict['cursor'] = lastItem.id

        }else if(scrolling == 'up' && dataList.length > 0){
            const newFilters = {...fetchDict['query_filters'], 'id':{'operation':'in','value':itemsListId}}
            fetchDict['query_filters'] = newFilters
        }   
        
        const res = await doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:fetchDict})


        if(!res || !res.body || !Array.isArray(res.body)) return false

        if(dataList.length == 0 || res.body.length == 0 || scrolling === ''){
            setDataList(res.body)
        }

        if(lastLoad.current){
            lastLoad.current = false
        }

        return res.body


    }
   
    const handleInputQuery = (value) =>{
        setLoading(true)
        if(queryTimeout.current){
            clearTimeout(queryTimeout.current)
        }
        queryTimeout.current = setTimeout(()=>{
            handleFetch()
        },500)
    }
    const handleFilterSelection = (filterObj)=>{
        filterSelection.current = [filterObj.column,filterObj.displayName]
    
        setToggleSelectFilter(false)
        handleFetch()

    }

    const {handleScroll,ScrollUp_Loading,ScrollDown_Loading} = useInfiniteScroll({
        itemHeight:74.5,
        thressholdItems:120,
        nextBatchItems:60,
        lastLoad:lastLoad,
        handleFetch:handleFetch,
        dataList:dataList,
        setDataList:setDataList
    })

    
    
   
    return (
        <div className="flex-column width100" style={{height:'100dvh',overflowY:'hidden'}}>
            {/* {toggleNoteCreation &&
                <SecondaryPage BodyComponent={CreateNote}
                    bodyProps={{
                        note:currentSelectedObj.current,
                        setForceRender:setForceRender,
                        handleNoteAction
                    }}
                    handleClose={()=>{currentSelectedObj.current = null; setToggleNoteCreation(false); selectionMode && setSelectionMode(false); setSelectedNotes({})}}
                    zIndex={zIndex + 1}
                    pageId={'createNote'}
                    interactiveBtn ={{iconClass:'svg-15 padding-10  position-relative content-end', order:3,icon:<ThreeDotMenu/>}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 flex-1 content-start',order:0}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}
                />
            } */}
            {NextPageChild &&
                <SlidePage BodyComponent={NextPageChild}/>
            }


            {fetchNotes && 
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
                                    selectedOption={new Set([filterSelection.current[1]])}
                                    
                                />
                            }
                        </div>
                    </div>
                </div>
            }
            <div className="flex-column" style={{overflow:'hidden'}}>

            
                {selectionMode && 
                    <SelectionModeComponent 
                        zIndex={2}
                        props={{
                                setSelectionMode:setSelectionMode,
                                selectedItemsLength:Object.keys(selectedNotes).length,
                                setSelectedItems:setSelectedNotes,
                                componentsListPreview:Object.keys(selectedNotes).map((dictKey,i)=> 
                                    <NoteContainer key={`batchSelect_${i}`} props={{
                                        note:selectedNotes[dictKey],
                                        key:dictKey,
                                        handlePressStart:handlePressStart,
                                        handlePressEnd:handlePressEnd,
                                        handleTouchMove:handleTouchMove
                                    }}/>
                                    ),
                                componentOptionsToSelect:[
                                    <DeleteBatchNotes key={'deleteBatchNotes'}
                                        props={{
                                            selectedNotes,
                                            handleNoteAction,
                                            setSelectedNotes

                                        }}
                                    />
                                ]
                            }}
                    />
                }

                <div className="flex-column " style={{overflowY:'scroll',marginTop: '20px' }}
                    onScroll={handleScroll}
                >   
                
                    <div className="flex-column gap-1 items-center content-center padding-top-20"
                            style={{height:'74.5px'}}
                        >
                    {ScrollUp_Loading &&
                            <>
                            <span className="color-secondary text-15">Loading Notes</span>
                            <LoaderDots/>
                            </>
                    
                    }
                    </div>

                    <NoteListContainer 
                        fetchDataList={dataList} 
                        itemNotesData={itemNotes}
                        selectedNotes={selectedNotes}
                        handleTouchMove={handleTouchMove}
                        handlePressStart = {handlePressStart}
                        handlePressEnd = {handlePressEnd}
                    />

                    {ScrollDown_Loading || loading ?
                        <div className="flex-column gap-1 items-center content-center padding-top-20 padding-bottom-20">
                            <span className="color-secondary text-15">Loading Notes</span>
                            <LoaderDots/>
                        </div>
                        :
                        <></>
                    
                    }

                </div>
            </div>

            <div className="flex-row" style={{position:'absolute',bottom:'30px',right:'30px'}}>
                <div className="flex-row gap-1 bg-containers border-blue no-select  btn"style={{padding:'10px 12px'}} 
                onClick={()=>{
                    currentSelectedObj.current = null
                    console.log(currentSelectedObj.current,'the current selected note:::')
                    toggleComposePage()
                }}
                role="button"
                >
                    <div className="flex-column svg-18 item-center content-center">
                        <EditIcon/>
                    </div>
                    
                    <span className="text-15">Compose</span>
                </div>
            </div>
        </div>
    )

}


interface ItemNoteBtnProps{
    displayText:string
    notesSetUp: Set<string>
}
export const ItemNoteBtn = memo(({displayText,notesSetUp}:ItemNoteBtnProps) => {
    const fetchNotes = notesSetUp.has('noFetchNotes') ? false : true

    const {setNextPage,setData:setItemData,data} = useData()
    const {slidePageTo} = useSlidePage()

    const itemNotes = data.notes ?? []
    const itemArticleNumbers = data.article_number

   
  
    const buildNoteDictForSave = (noteDict,itemNotesCopy)=>{
        
        const noteAction = noteDict.action
        let newList = []
        if(noteAction !== 'Created'){
            if(noteDict.id){
                let found = false
                
                for(let i = 0; i < itemNotesCopy.length; i++){
                
                    if(itemNotesCopy[i].id && itemNotesCopy[i].id === noteDict.id){
                        newList.push(noteDict)
                        found = true
                    }else{
                        
                        newList.push(itemNotesCopy[i])
                    }

                }
               
                if(!found){
                    newList.push(noteDict)
                }
                
            }else{
                if(noteAction == 'Deleted'){
                   newList = itemNotesCopy.filter((_,i)=> i !== noteDict.index)

                }else if(noteAction == 'Updated'){
                    newList = itemNotesCopy.map((obj,i)=> i == noteDict.index ? noteDict : obj )
                }  
            }
        }else if(noteAction == 'Created'){
            
            if('index' in noteDict){
               
                newList = itemNotesCopy.filter((_,i)=> i !== noteDict.index)
                newList.push(noteDict)
                
            }else{
                 
                itemNotesCopy.push(noteDict)
                newList = itemNotesCopy
            }
        }
        
        return newList
    }
    const handleNoteAction = (noteList)=>{
        
        let itemNotesCopy = [...itemNotes]
        
        noteList.forEach(noteDict =>{
                itemNotesCopy = buildNoteDictForSave(noteDict,itemNotesCopy)
            })  
        
        setItemData(prev => ({...prev,'notes':itemNotesCopy}))

    }

   

    return (
            <button className="flex-row padding-10 width100"
            
            onClick={()=>{
                if(!setNextPage) return
                slidePageTo({addNumber:1})
                setNextPage(
                    <ItemNoteDisplay
                        handleNoteAction={handleNoteAction}
                        fetchNotes={fetchNotes}
                    />
                )
            }}
            >
                {/* {toggleNoteDisplay && 
                    <SecondaryPage BodyComponent={ItemNoteDisplay}
                        bodyProps={{handleNoteAction,fetchNotes}}
                        zIndex={zIndex + 1}
                        handleClose ={()=>{setToggleNoteDisplay(false)}}
                        pageId={'itemNoteDisplay'}
                        header={{order:0,display:'Item Notes',class:'color-light-titles'}}
                    />
                } */}
                
                <span className="text-15">{displayText}</span>
            </button>
    )
})
 
