
import SecondaryPage from '../Page_Components/SecondaryPage.tsx'
import {DynamicBoxesV2} from './DynamicBoxesV2.tsx' 
import BrokenItemIcon from '../../assets/icons/General_Icons/BrokenItemIcon.svg?react'
import MinusCircleIcon from '../../assets/icons/General_Icons/MinusCircleIcon.svg?react'
import {useState,useRef,memo} from 'react'

import {ItemIssuesMap} from '../../maps/Item_Maps/mapItemIssuesV2.tsx'







// building ItemIssues Secondary page. it should handle the next behaviour
export const ItemIssues = ({setItemData,type,issues,zIndex}) => {
    
    const buildIssueRef = useRef({})
    

    const isMap = useRef(false)
    const message = useRef('')
    const targetDict = useRef({})
    if(type){
        if(type in ItemIssuesMap){
            targetDict.current = ItemIssuesMap[type]
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

        buildIssueRef.current = {...buildIssueRef.current, ...resultData}

        if(nextDict){
            setIssueMap(ItemIssuesMap[nextDict])
        }else{
           
            setItemData(prev => (
                {   
                    ...prev,
                    issues:[...(prev.issues || []), buildIssueRef.current]
                }
            ))
            setIssueMap(targetDict.current)
            setToggleItemIssue(false)
            buildIssueRef.current = {}
        }
    }

    const handleDelitionIssue = (index)=>{
      
        setItemData( prev =>{
            const newIssues = prev.issues.filter((_,i)=> i !== index)
            const update = {...prev}
            if(newIssues.length > 0){
                update.issues = newIssues
            }else{
                update.issues = null
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


export const ItemIssueBtn = ({issues=[],type,setItemData,zIndex}) =>{
    const [toggleItemIssuePage,setToggleItemIssuePage] = useState(false)

    return (
        <div className="flex-row items-center content-center">
             {toggleItemIssuePage && 
                <SecondaryPage BodyComponent={ItemIssues} 
                    bodyProps={{
                       
                        issues:issues,
                        type:type,
                        setItemData:setItemData
                    }}
                    zIndex={zIndex + 1}
                    pageId={'itemIssues'}
                    handleClose={()=>{setToggleItemIssuePage(false)}} 
                    header={{order:0,display:'Manage Issues',class:'color-light-titles'}}
                />
            }

            <button  className="flex-column items-center content-center gap-05 btn " style={{padding:'0',position:'relative'}}
                onClick={()=>{ setToggleItemIssuePage(true)}}>

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