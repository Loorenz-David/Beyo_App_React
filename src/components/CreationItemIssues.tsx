import BrokenItemIcon from '../assets/icons/BrokenItemIcon.svg?react'
import MinusCircleIcon from '../assets/icons/MinusCircleIcon.svg?react'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'

import {ItemIssuesMap} from '../maps/mapSelectItemIssues.tsx'
import {useItemCreation} from '../contexts/ItemCreationContext.tsx'
import SecondaryPage from '../components/secondary-page.tsx'
import {DynamicBoxes} from '../components/DynamicBoxes.tsx'

import {useState,useRef,useEffect} from 'react'


const  CreationItemIssues= ({handleClose}) => {
    const {itemData,updateItemData} = useItemCreation()
    const [toggleIssues,setToggleIssues] = useState(false)

    useEffect(()=>{
        if( !('item_issues' in itemData)){
            setToggleIssues(true)
        }

    },[])

    const handlePushItemIssue = (issueDict) =>{
        if(!('item_issues' in itemData)){
            updateItemData({'item_issues':[issueDict]})
        }else{
            let itemIssueList = itemData['item_issues']
            itemIssueList.push(issueDict)
            updateItemData({'item_issues':itemIssueList})
        }

    }
    const handleRemovalItemIssue = (index)=>{
        let itemIssueList = itemData['item_issues']
        itemIssueList.splice(index,1)
        if(itemIssueList.length == 0){
            let replacement = itemData
            delete replacement['item_issues']
            updateItemData(replacement)
        }else{
            updateItemData({'item_issues':itemIssueList})
        }
    }

   

    
    return ( 
        <div className="flex-column gap-4" style={{minHeight:'400px'}}>
            {toggleIssues &&
            <SecondaryPage BodyComponent={DynamicBoxes} 
                bodyProps={{map:ItemIssuesMap[itemData['item_properties']['category']],savingKey:'item_issues',initialLocationMap:{key:'initialMap',property:'category'},uponCompletion: handlePushItemIssue}} 
                handleClose={()=>{setToggleIssues(false)}} 
                interactiveBtn={{iconClass:'push-left',icon:<ArrowIcon />}} 
                
            />}
            <div className="flex-column padding-top-20">
                { itemData['item_issues'] && 
                    itemData['item_issues'].map((obj,index) =>{
                        return (
                                <div key={`issue_${index}`} className="flex-row border-bottom items-center" >
                                    {Object.keys(obj).map((key,i)=>{
                                        return(
                                                <div key={`issue_property_${i}`} className="flex-row" style={{flexWrap:'wrap',width:'100px'}} >
                                                    <div className="flex-column gap-05 padding-10">
                                                        <span className="color-lower-titles">{key}</span>
                                                        <span className="">{obj[key]}</span>
                                                    </div>
                                                </div>
                                        )
                                    })}
                                    <div className="btn flex-column content-center height100 push-right padding-right-10 padding-left-05"
                                    onClick={()=>{handleRemovalItemIssue(index)}}
                                    >
                                        <div className=" svg-18">
                                            <MinusCircleIcon/>
                                        </div>
                                    </div>
                                    
                                </div>
                        )
                    })
                }
                
            </div>

            <div className="flex-row content-center padding-10 ">
                <div className="flex-row svg-25 bg-containers border-blue padding-10 btn gap-1" 
                onClick={()=>{setToggleIssues(true)}}
                >
                    <BrokenItemIcon/>
                    <span className="text-15">Add Issue</span>
                </div>
            </div>
        </div>
     );
}
 
export default CreationItemIssues;