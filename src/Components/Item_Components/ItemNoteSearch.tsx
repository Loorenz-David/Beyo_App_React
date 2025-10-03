import {useState,useEffect,useRef,memo} from 'react'
import useFetch from '../../hooks/useFetch.tsx'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'
import CheckMarkIcon from '../../assets/icons/General_Icons/CheckMarkIcon.svg?react'

import SecondaryPage from '../Page_Components/SecondaryPage.tsx'

const ItemNoteSearch = ({notesList,handelNoteSelection,holdScrollElement}) => {
    const {doFetch,data,loading,setLoading} = useFetch()
    const setRules = {'loadData':true}
   
    const inputRef = useRef(null)
    const timeOutRef = useRef(null)

    useEffect(()=>{
        handleQuery('')
        return ()=>{
            if(timeOutRef.current){
                clearTimeout(timeOutRef.current)
            }
        }
    },[])

   
    
    const handleQuery =  (val)=>{
       
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
            timeOutRef.current = null
        }

        const fetchDict = {
            model_name:'Item_Notes_Subject',
            per_page: 180,
            query_filters : {'subject':{'operation':'ilike','value':`%${val}%`}},
            requested_data:['id','subject','notes_counter']
        }
  
        setLoading(true)
        
        timeOutRef.current = setTimeout(async ()=>{

            await doFetch({
                url:'/api/schemes/get_items',
                method:'POST',
                body:fetchDict,
                setRules:setRules})
            
        },500)
        
    }
  
   

    return (
        <div className="" style={{height:'100dvh',overflowY:'auto'}}
            ref={holdScrollElement}
        >
            <div className="flex-row padding-15 bg-primary width100" style={{position:'fixed'}}>
                <div className="flex-row bg-containers width100" style={{borderRadius:'5px'}}>
                    <div className="flex-column width100 padding-10"
                    
                    >
                        <input type="text" className="width100" style={{fontSize:'15px'}} 
                        ref={inputRef}
                        onInput={(e)=>{handleQuery(e.currentTarget.value)}}
                        />
                    </div>
                    
                </div>
            </div>
            <div className="flex-column" style={{paddingTop:'100px'}}>
                {notesList.length > 0 && 
                    <div className="flex-column width100 padding-bottom-20">
                        {notesList.map((obj,i)=>{

                            return (
                                <div key={`NoteSelection_${obj.id}`} className="flex-row width100 items-center gap-4 padding-20 border-bottom "
                                style={{borderColor:'#BCB5FF'}}
                                onClick={()=>{handelNoteSelection(obj,'selectedNotes')}}
                                >
                                    <div className="flex-column gap-05 flex-1 " >
                                        <span className="color-lower-titles" >Subject</span>
                                        <span style={{textWrap:'wrap'}}>{obj.subject}</span>
                                    </div>
                                    <div className="flex-column gap-05 ">
                                        <span className="color-lower-titles">Notes Count</span>
                                        <span>{obj.notes_counter? obj.notes_counter : 0}</span>
                                    </div>
                                    <div className="flex-column svg-20 push-right">
                                        <CheckMarkIcon />
                                    </div>
                                
                                </div>
                            )
                        })}
                    </div>
                }
                

                {loading && 
                    <div className="flex-row content-center items-center">
                            <LoaderDots />
                    </div>
                }
                {data && data.length > 0 &&
                    data.map((obj,i)=>{
                        let isSubjectSelected = false
                        if(notesList.length > 0){
                            let querySubject = notesList.find(note => note.id === obj.id)
                            if(querySubject){
                                isSubjectSelected = true
                            }
                        }

                        if(!isSubjectSelected){
                            return(
                                <div key={`NoteQuery_${i}`} className="flex-row width100 items-center gap-4 padding-20 border-bottom "

                                onClick={()=>{handelNoteSelection(obj,'fetchNotes')}}
                                >
                                    <div className="flex-column gap-05 flex-1" >
                                        <span className="color-lower-titles" >Subject</span>
                                        <span style={{textWrap:'wrap'}}>{obj.subject}</span>
                                    </div>
                                    <div className="flex-column gap-05  ">
                                        <span className="color-lower-titles">Notes Count</span>
                                        <span>{obj.notes_counter? obj.notes_counter : 0}</span>
                                    </div>
                                
                                </div>
                            )
                        }
                        
                    })
                
                }
  
                
            </div>
            
        </div>
      );
}

const ItemNoteSearchBtn = ({setItemData,notesList,displayName,zIndex})=>{
    const [toggleNotesSearch,setToggleNotesSearch] = useState(false)
    
    const handelNoteSelection = (obj,comingFromList)=>{
        if(comingFromList == 'selectedNotes'){
            setItemData(prev =>({...prev,'notes':notesList.filter(subject => subject.id !== obj.id )}))
        }else{
            setItemData(prev =>({...prev,'notes':[...notesList,obj] }))
        }
    }
    

    return (
        <div className="flex-row width100 " >
             { toggleNotesSearch && 
                <SecondaryPage BodyComponent={ItemNoteSearch} 
                    bodyProps={{
                        notesList,
                        handelNoteSelection
                        
                    }}
                    zIndex={zIndex + 1}
                    
                    handleClose={()=>{setToggleNotesSearch(false)}} 
                    pageId={'itemNoteSearch'}
                />
            }
            <div className="flex-row gap-2 items-center content-start padding-15 width100"
            onClick={()=>(setToggleNotesSearch(true))}
            >
                <span >{displayName}</span>
                {notesList.length > 0 &&
                    <div className="flex-column bg-secondary items-center content-center" style={{width:'14px',height:'14px',borderRadius:'50%'}}>
                        <span className="color-primary text-9" style={{fontWeight:'800'}}>{notesList.length}</span>
                    </div>
                }
            </div>
            

        </div>
    )
}
 

export const MemorizedNoteSearchBtn = memo(ItemNoteSearchBtn)