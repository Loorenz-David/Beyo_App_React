import {useState,useEffect,useRef,useContext} from 'react'


import SelectPopupV2 from '../componentsV2/SelectPopupV2.tsx'
import LoaderDots from './LoaderDots.tsx'

import useFetch from '../hooks/useFetch.tsx'
import useDebounce from '../hooks/useDebounce.tsx'




import{ServerMessageContext} from '../contexts/ServerMessageContext.tsx'



const NotesSubjectSelection = ({inputSubjectRef,data,setToggleSubject,loading})=>{
    const containerRef = useRef(null)
    

    useEffect(()=>{
        
        const handleBoxSelection = (e)=>{
            const target = e.target.closest('[data-select]')
            if(target){
                const attr = target.getAttribute('data-select')
                inputSubjectRef.current.value = attr
                setToggleSubject(false)


            }
        }

        const container = containerRef?.current
        if(container){
            container.addEventListener('click',handleBoxSelection)
        }
       
        return()=>{
            container?.removeEventListener('click',handleBoxSelection)
           
        }

    },[])
    
  
    return (
        <div ref={containerRef} className="flex-column" style={{width:`${inputSubjectRef.current.offsetWidth}px`}}  >
            {loading ? (
                <div >
                    <div data-select="Undefined" className="flex-row gap-1 items-center padding-10 border-bottom">
                        Undefined
                    </div>
                    <div className="flex-row  width100 items-center content-center padding-10 color-lower-titles" >
                        Loading 
                        <LoaderDots dotStyle={{dimensions:'squareWidth-05',bgColor:"bg-lower-titles"}}/>
                    </div>
                </div>
            )  
            :
            
            data? (
                    data.map((obj,index)=>{
                        return (
                            <div data-select={obj.subject} key={`noteSubject_${index}`} className="flex-row gap-1 items-center padding-10 border-bottom">
                                
                                {obj.subject}
                            </div>
                        )
                    })
                )
                :
                (
                    <div >
                            <div data-select="Undefined" className="flex-row gap-1 items-center padding-10 border-bottom">
                                Undefined
                            </div>
                        <div className="flex-row width100 items-center content-center padding-10 color-lower-titles">No matches found</div>
                    </div>
                )
                
            }
            
        </div>
    )
}

const CreateSingleNote = ({setItemData,note}) => {
    
    const {showMessage} = useContext(ServerMessageContext)
   
    const [toggleSubject,setToggleSubject] = useState(false)
    const inputSubjectRef = useRef(null)
    const subjectDict = useRef({})
    const noteContentRef = useRef(null)
    
    const {data,loading ,setLoading,doFetch} = useFetch() 

    useEffect(()=>{
       const inputSubject = inputSubjectRef.current
       const noteContent = noteContentRef.current
       

        return () =>{

            
            if(!('id' in subjectDict.current)){
                subjectDict.current = {'subject':inputSubject.value}
            }

            if(noteContent.value != ''){
                if(inputSubject.value === ""){
                    showMessage({
                        message:"note must have a subject",
                        status:400,
                        complementMessage:"When typing in the subject input, existing subjects will appear, if no option is selected a new subject will be created."
                    })
                }else{
                    setItemData(prev => ({...prev,
                        'notes':
                            {
                                'note_content':noteContent.value,
                                'subject':subjectDict.current
                            }
                    }))
                }

            }else{
                setItemData(prev =>{
                    const {notes,...current} = prev
                    return current
                })
            }
        }
       
    },[])

    const handleSubjectSelection = (subObj)=>{
        subjectDict.current = {'subject':subObj.displayName,'id':subObj.id} 
        inputSubjectRef.current.value = subObj.displayName
        setToggleSubject(false)
    }

    const handleSubjectQuery = (value)=>{
            
            subjectDict.current = {}
            if(value !== ''){
                
                const rules ={'loadData':true}
                const fetchDict = {
                                model_name:'Item_Notes_Subject',
                                requested_data:['subject'],
                                query_filters:{'subject':{'operation':'ilike','value':`%${value}%`}}
                                }
                 doFetch({
                    url:'/api/schemes/get_items',
                    method:'POST',
                    body:fetchDict,
                    setRules:rules})
                

            }

           
        }

    const debouncedFetch = useDebounce(handleSubjectQuery,500)

    return ( 
    <div className="flex-column" style={{minHeight:'100dvh'}}>
        <div className="flex-column gap-1 padding-20">
            <span className="color-lower-titles">Subject</span>
            <div className="flex-column " id="subjectSelectConatiner" style={{position:'relative'}}>
                <input defaultValue={note && note.subject && note.subject.subject}  ref={inputSubjectRef} className="bg-light-container padding-10  content-start " place-holder="Select a subject..."
                onClick={(e)=>{ setToggleSubject(true) }}
                onInput={(e)=>{
                    const targetValue = e.currentTarget.value
                    
                    if(targetValue !== ''){
                        debouncedFetch(targetValue); 
                        setLoading(true)
                        if(!toggleSubject){
                            setToggleSubject(true)
                        }
                        
                    }else{
                        if(toggleSubject){
                            setToggleSubject(false)
                        }
                        subjectDict.current = {}
                    }
                    

                    }}
                > 
                </input>
                {toggleSubject && 
                    <SelectPopupV2 
                        setTogglePopup={setToggleSubject}
                        listOfValues={
                            data.map((subObj)=>{
                                return {'displayName':subObj.subject,'subjectId':subObj.id}
                            })
                        }
                        onSelect={handleSubjectSelection}
                        zIndex={2}
                        loading={loading}
                        parentWidth={inputSubjectRef.current.offsetWidth}

                    />
                }
            </div>
            
        </div>
        <div className="flex-column gap-1 padding-20">
                <span className="color-lower-titles">Content</span>
                <div className="bg-containers width100 padding-10" style={{height:'200px',borderRadius:'10px'}}>
                    <textarea defaultValue={note && note.note_content} ref={noteContentRef} className="width100 height100"  style={{whiteSpace:'pre-wrap',overflowWrap:'break-word'}}
                   
                    >
                        
                    </textarea>
                </div>
        </div>
    </div> 
    );
}
 
export default CreateSingleNote;