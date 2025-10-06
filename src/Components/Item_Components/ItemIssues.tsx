
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'
import {DynamicBoxesV2} from './DynamicBoxesV2.tsx' 
import BrokenItemIcon from '../../assets/icons/General_Icons/BrokenItemIcon.svg?react'
import MinusCircleIcon from '../../assets/icons/General_Icons/MinusCircleIcon.svg?react'
import {useState,useRef,memo,useEffect,useContext} from 'react'

import {ServerMessageContext} from '../../contexts/ServerMessageContext.tsx'

import {ItemIssuesMap } from '../../maps/Item_Maps/mapItemIssuesV3.tsx'

import type {MapDictionary } from '../../maps/Item_Maps/mapItemIssuesV3.tsx'
import type {ItemDict,IssueDict} from '../../types/ItemDict.ts'
import {useData} from '../../contexts/DataContext.tsx'


interface ItemIssuesProps {
    setItemData:React.Dispatch<React.SetStateAction<any>>
    type?:string
    issues:IssueDict[]
    zIndex:number
    mandatoryIssueLocations:React.RefObject<string[]>
    savedIssueLocations:React.RefObject<string[]>
}
interface BuildIssueRef {
    location?:string
    issue?:string
}

// building ItemIssues Secondary page. it should handle the next behaviour
export const ItemIssues = ({setItemData,type,issues,zIndex,mandatoryIssueLocations,savedIssueLocations}:ItemIssuesProps) => {

    const buildIssueRef = useRef<Partial<BuildIssueRef>>({})
    
  
    const isMap = useRef(false)
    const message = useRef('')
    const targetDict = useRef<MapDictionary[]>([])
   

    useEffect(() =>{

        if(issues && issues.length > 0){
            issues.forEach((issue:BuildIssueRef) => {
            if(issue.location){
                if(mandatoryIssueLocations.current.includes(issue.location)){
                    savedIssueLocations.current.push(issue.location)
                }
            }
            })
            
        }

    },[])

    


    if(type){
        if(type in ItemIssuesMap){
            targetDict.current = ItemIssuesMap[type]
            mandatoryIssueLocations.current = targetDict.current.map(item => item.displayName)
            isMap.current = true
            
        }else{
            message.current = 'There is no issues Boxes for this type of item.'
        }
        
    }else{
        message.current = 'missing to select item Type.'
    }

    const [issueMap, setIssueMap] = useState(targetDict.current)

    const [toggleItemIssue,setToggleItemIssue] = useState(!issues  && isMap.current? true : false)
  
    const handleBoxSelection = (result) =>{
      
        const resultData = result.result
        const nextDict = result.next

        buildIssueRef.current = {...buildIssueRef.current, ...resultData} as {location:string,issue:string}

        if(nextDict){
            setIssueMap(ItemIssuesMap[nextDict])
        }else{
            
             setItemData((prev:ItemDict) => (
                {   
                    ...prev,
                    issues:[...(prev.issues || []), buildIssueRef.current]
                }
            ))
           
            if(buildIssueRef.current.location){
                const location = buildIssueRef.current['location']
                console.log(location,'location')
                savedIssueLocations.current.push(location)
                console.log(savedIssueLocations.current,'savedIssueLocations')
                
            }
            const missingLocationIssues:string[] = mandatoryIssueLocations.current.filter(l => !savedIssueLocations.current.includes(l))

            if( missingLocationIssues.length > 0){
                    console.log(missingLocationIssues,'missingLocationIssues')
                    setIssueMap(targetDict.current)
                    buildIssueRef.current = {}
                    return
            }
            
            setIssueMap(targetDict.current)
            setToggleItemIssue(false)
            buildIssueRef.current = {}
        }
    }

    const handleDelitionIssue = (index)=>{
      
        setItemData( (prev:ItemDict) =>{
            const newIssues: IssueDict[] = []
            prev.issues.forEach((obj:IssueDict,i:number)=> {
                if(i == index){
                    const issue = prev.issues[i] as IssueDict
                    if(issue.location){
                        const loc = issue.location
                        savedIssueLocations.current = savedIssueLocations.current.filter(l => l !== loc)
                    }
                }else{
                        newIssues.push(obj)
                    }
                
            })

            const update:ItemDict = {...prev}
            if(newIssues.length > 0){
                update.issues = newIssues
            }else{
                update.issues = []
            }

            return update
        })



        // setForceRender(!forceRender)
    }

    return ( 
        <div className="flex-column items-center   " style={{height:'400px',overflowY:'auto'}}>
            {toggleItemIssue && 
                <SecondaryPage BodyComponent={DynamicBoxesV2} 
                bodyProps={{
                    objectMap: issueMap,
                    uponCompletion:handleBoxSelection,
                    inputValue:savedIssueLocations.current.length > 0 ? savedIssueLocations.current : null,
                    assignClass:'active-ck bounceBox',
                }} 
                pageId={'itemIssues'}
                handleClose={()=>{setToggleItemIssue(false)}}
                zIndex={zIndex + 1}
                header={{order:0,display:'Select Issues',class:'color-light-titles'}}
                />
            }

            <div className="flex-column width100 padding-top-20">
                {issues && issues.length > 0 &&
                    issues.map((obj,i)=>{
                        return (
                            <div key={`issueObj_${i}`} className="flex-row width100  gap-4 padding-15 border-bottom items-center">
                                {Object.keys(obj).map((objKey,j)=>{
                                    return (
                                        <div key={`issueProp_${j}`} className="flex-column gap-05  content-start">
                                            <span className="color-lower-titles text-9">{objKey}</span>
                                            <span className="">{obj[objKey]}</span>
                                        </div>
                                    )
                                })}
                                 <div className=" push-right"
                                 onClick={()=>{handleDelitionIssue(i)}}
                                 >
                                    <button className="flex-column items-center content-center svg-20">
                                        <MinusCircleIcon />
                                    </button>
                                </div>  
                            </div>
                        )
                    })
                }
            </div>
            {isMap.current ? 
                <div className="flex-row  padding-top-40 padding-bottom-40 ">
                    <button role="button" className="flex-column gap-05 items-center content-center btn bg-containers border-blue padding-10"
                    onClick={()=>{setToggleItemIssue(true)}}
                    >
                        <div className="svg-25">
                            <BrokenItemIcon />
                        </div>
                        <span>Add issue</span>
                    </button>
                </div>
            :
                <div className="flex-row items-center content-center">
                    <span className="text-15">{message.current}</span>
                </div>
        
            }
            
        </div>
     );
}

interface ItemIssueBtnProps {
    issues?:object[]
    type?:string
    setItemData:React.Dispatch<React.SetStateAction<any>>
    zIndex:number
}
export const ItemIssueBtn = ({issues=[],type,setItemData,zIndex}:ItemIssueBtnProps) =>{
    const [toggleItemIssuePage,setToggleItemIssuePage] = useState(false)
    const mandatoryIssueLocations = useRef<string []>([])
    const savedIssueLocations = useRef<string[]>([])
    const {showMessage} =  useContext(ServerMessageContext)
    const {forceRenderChildren} = useData()

    useEffect(() =>{
        savedIssueLocations.current = []
    },[forceRenderChildren])

    const handleClose = () =>{
        setToggleItemIssuePage(false)
        const missingToSelect = mandatoryIssueLocations.current.filter(l => !savedIssueLocations.current.includes(l))
        if(missingToSelect.length > 0){
            showMessage({
                message:`You are missing to select issue`,
                complementMessage:`for locations: ${missingToSelect.join(', ')}`,
                status:400
        })
            return
        }
    }
    return (
        <div className="flex-row items-center content-center">
             {toggleItemIssuePage && 
                <SecondaryPage BodyComponent={ItemIssues} 
                    bodyProps={{
                        mandatoryIssueLocations:mandatoryIssueLocations,
                        savedIssueLocations:savedIssueLocations,
                        issues:issues,
                        type:type,
                        setItemData:setItemData
                    }}
                    zIndex={zIndex + 1}
                    pageId={'itemIssues'}
                    // fixing the error message if a location issue is not selected
                    handleClose={handleClose} 
                    header={{order:0,display:'Manage Issues',class:'color-light-titles'}}
                />
            }

            <button  className="flex-column items-center content-center gap-05 btn " style={{padding:'0',position:'relative'}}
                onClick={()=>{ setToggleItemIssuePage(true)}}
                id="issues"
                >

                {issues && issues.length > 0 &&
                    <div className="" style={{position:'absolute', bottom:'88%',left:'78%'}}>
                        <div className="flex-column bg-secondary items-center content-center" style={{width:'14px',height:'14px',borderRadius:'50%'}}>
                            <span className="color-primary text-9 bold-600">{issues.length}</span>
                        </div>
                    </div>
                }
                <div className="flex-column items-center content-center  svg-25">
                    <BrokenItemIcon />
                </div>
                    <span className="text-9">Issues</span>
            </button>
        </div>
    )
}
 
export const MemorizedItemIssuesBtn = memo(ItemIssueBtn)