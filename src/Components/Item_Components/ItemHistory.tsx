
import {useState,memo,useEffect,useRef} from 'react'

import useFetch from '../../hooks/useFetch.tsx'
import useInfiniteScroll from '../../hooks/useInfinityScroll.tsx'

import LoaderDots from '../Loader_Components/LoaderDots.tsx'

import ArrowIcon from '../../assets/icons/General_Icons/ArrowIcon.svg?react'
import HistoryIcon from '../../assets/icons/General_Icons/HistoryIcon.svg?react'

import {useData} from '../../contexts/DataContext.tsx'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'

interface ItemHistoryDict {
    id:number
    column_name:string
    from_value:object
    to_value:object
    recorded_time:string
    user_name:string
    type:string
}

const propHelper = (key:string,val:any,identifier:string) =>{
    return(
        <div key={`propKey_${identifier}`} className="flex-column gap-05" >
            <span className="text-9 color-lower-titles">{key}</span>
            <span>{val}</span>
        </div>
    )
}

const objRawHelper = (objProp:any,key:string) =>{
    return ( 
         <div key={`objProp_${key}`} className="flex-row gap-1 " style={{border:'0.5px solid grey',padding:'5px 10px'}}>
                {Object.keys(objProp).map((objKey,j)=>{
                    const propEl = propHelper(objKey,objProp[objKey],`${key}_${j}_${objKey}`)
                    return propEl
                })}
        </div>
    )
}

const objListHelper = (obj:object[],key='l')=>{
    return(
        <div className="flex-column" key={`listProp_${key}`}>
            {obj.map((objProp,i)=>{
                const propContent = objRawHelper(objProp,`${key}_${i}`)
                return propContent
            })}
        </div>
    )
}


const ItemHistoryPage = ()=>{
    const {doFetch,loading} = useFetch()
    const [dataList,setDataList] = useState<ItemHistoryDict[]>([])
    const lastLoad = useRef(false)

    const {data:itemData} = useData()

    useEffect(()=>{
       handleFetchHistory()

    },[itemData.id])


    const handleFetchHistory = async(
        scrolling:string='',
        fetchPerPage:number = 120,
        itemsListId:number[]= []
    )=>{
        if(!itemData.id)return;

         const fetchDict ={
            model_name:'Item_History',
            requested_data:['recorded_time','to_value','from_value','column_name','user_name','type','id'],
            query_filters:{'item_id':itemData.id},
            per_page:fetchPerPage
        }
        

        if(scrolling == 'down' && dataList.length > 0){
            const lastItem = dataList[dataList.length - 1]
            fetchDict['cursor'] = lastItem.id 


        }else if(scrolling == 'up' && dataList.length > 0){
            const newFilters = {...fetchDict['query_filters'], 'id':{'operation':'in','value':itemsListId}}
            fetchDict['query_filters'] = newFilters
        }


        const res = await doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:fetchDict,
        })
       
        if(!res.body || !Array.isArray(res.body)){
            
            return false
        }

        if(dataList.length == 0 || res.body.length == 0){
            setDataList(res.body)
        }
        if(lastLoad.current){
            lastLoad.current = false
        }
        return res.body
            
        
    }
    const handleHistoryExpansion = (e)=>{
        const parent = e.currentTarget.parentElement
        
        const target = parent.querySelector('.expandable-row')
        if(target){
           
            parent.classList.toggle('border-bottom')
            parent.classList.toggle('border-top')
            target.classList.toggle('open')
        }
    }   
    const generateProperTime = (pyTime)=>{
        if(!pyTime) return {properDate:'not specify',properTime:'not specify'};
        const date = new Date(pyTime)

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2,"0")
        const day = String(date.getDate()).padStart(2,"0")

        const hours = String(date.getHours()).padStart(2,'0')
        const minutes = String(date.getMinutes()).padStart(2,'0')
        const seconds = String(date.getSeconds()).padStart(2,'0')

        const properDate = `${year}-${month}-${day}`
        const properTime = `${hours}:${minutes}:${seconds}`

        return {properDate,properTime}
    }
   
    const {properDate,properTime} = generateProperTime(itemData.creation_time)
   
    const {handleScroll,ScrollDown_Loading,ScrollUp_Loading} = useInfiniteScroll({
        itemHeight:69,
        thressholdItems:120,
        nextBatchItems:60,
        lastLoad:lastLoad,
        handleFetch:handleFetchHistory,
        dataList:dataList,
        setDataList:setDataList
    })

    

    

    return(
        <div className="flex-column " style={{height:'100dvh',padding:'30px 20px',overflowY:'auto'}}
            onScroll={handleScroll}
        >
            
                
                <div className="flex-column width100 items-center content-center" style={{minHeight:'50px'}}>
                    {ScrollUp_Loading && 
                        <div className="flex-column content-center gap-2">
                            <span className="text-15 ">Loading Item History</span>    <LoaderDots />
                        </div>
                        
                    } 
                </div>

                <div className=" width100 gap-1" style={{position:'relative',display:'flex', flexDirection:'column'}} >
                    <div  style={{position:'absolute',height:'100%',width:'4px',top:'0',left:'6px',backgroundColor:'rgba(104, 104, 104, 1)'}}>
                    </div>
                    {dataList.length > 0  && dataList.map((obj,i)=>{

                        const {properDate,properTime} = generateProperTime(obj.recorded_time)
                        let title:string;
                        if(obj.column_name.includes('_')){
                            title = obj.column_name.replace(/_/g, ' ')
                        }else{
                            title = obj.column_name
                        }

                        let fromValueElements = (<span>Nothing</span>)
                        let toValueElements = (<span>Nothing</span>)

                        

                        if(typeof obj.from_value == 'string' || typeof obj.from_value == 'number'){
                            fromValueElements = (
                                                <span className="text-12" >
                                                    {obj.from_value}
                                                </span>
                                                )
                           
                        }else if(typeof obj.from_value == 'object' && Array.isArray(obj.from_value) && obj.from_value !== null){
                            fromValueElements = objListHelper(obj.from_value)
                           
                        }else if(typeof obj.from_value == 'object' && obj.from_value && obj.from_value !== null){
                            fromValueElements = objRawHelper(obj.from_value,obj.column_name)
                            
                        }

                         if(typeof obj.to_value == 'string' || typeof obj.to_value == 'number'){
                           
                            toValueElements = (
                                                <span className="text-12" >
                                                    {obj.to_value}
                                                </span>
                                                )
                        }else if(typeof obj.to_value == 'object' && Array.isArray(obj.to_value) && obj.to_value !== null){
                            
                            toValueElements = objListHelper(obj.to_value)
                        }else if(typeof obj.to_value == 'object' && obj.to_value && obj.to_value !== null){
                           
                            toValueElements = objRawHelper(obj.to_value,obj.column_name)
                        }

                        
                        return(
                            <div key={`historyContainer_${i}_${obj.id}`} className="flex-row items-center " style={{zIndex:3}}>
                                <div className= {`flex-column bg-primary time-line-circle ${obj.type}`} >
                                </div>
                                <div className="flex-column  padding-20   width100 ">
                                    <div className="flex-row items-center padding-right-20 "
                                    onClick={(e)=>{handleHistoryExpansion(e)}}
                                    >
                                        <span className="text-15" data-id={obj.id}>{obj.type} {title}. {obj.id}</span>
                                        <div className="flex-row push-right">
                                            <span className="text-9 ">{properDate}</span>
                                        </div>
                                    </div>
                                    <div className=" width100 gap-2  padding-top-10 padding-left-10 expandable-row " style={{borderRadius:'5px'}}
                                        
                                    >   
                                        <div className="flex-column gap-2">
                                            <div className="flex-row gap-3 padding-top-10" style={{flexWrap:'wrap'}}>
                                                <div className="flex-column gap-05">
                                                    <span className="text-9 color-lower-titles">From</span>
                                                    {fromValueElements}
                                                </div>
                                                <div className="flex-column items-center content-center">
                                                    <div className="svg-20" style={{transform:'rotate(180deg)'}}>
                                                        <ArrowIcon/>
                                                    </div>
                                                </div>
                                                <div className="flex-column gap-05">
                                                    <span className="text-9 color-lower-titles">To</span>
                                                    {toValueElements}
                                                </div>
                                            </div>
                                            <div className="flex-row gap-4">
                                                <div className="flex-column gap-05">
                                                    <span className="text-12 color-lower-titles">By:</span>
                                                    <span className="text-12">{obj.user_name}</span>
                                                </div>
                                                <div className="flex-column gap-05">
                                                    <span className="text-12 color-lower-titles">At:</span>
                                                    <span className="text-12">{properTime}</span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                            </div>                          
                        )
                    })}
                </div>
                    

                <div  className="flex-row items-center " style={{zIndex:3}}>
                    <div className="flex-column bg-primary" style={{width:'16px',height:'16px',borderRadius:'50%',border:'2px solid rgba(211, 253, 71, 0.83)'}}>
                    </div>
                    <div className="flex-column  padding-20   width100 ">
                        <div className="flex-row items-center padding-right-20 "
                        onClick={(e)=>{handleHistoryExpansion(e)}}
                        >
                            <span className="text-15" style={{color:'rgba(211, 253, 71, 0.83)'}}>Item Created.</span>
                            <div className="flex-row push-right">
                                <span className="text-9 " style={{color:'rgba(211, 253, 71, 0.83)'}}>{properDate}</span>
                            </div>
                        </div>
                        <div className=" width100 gap-2   padding-left-10 expandable-row " style={{borderRadius:'5px'}}>   
                            <div className="flex-column gap-2 ">
                                
                                <div className="flex-row gap-4 padding-top-10">
                                    <div className="flex-column gap-05">
                                        <span className="text-12 color-lower-titles">By:</span>
                                        <span className="text-12">{itemData.creation_user ?? 'not specify'}</span>
                                    </div>
                                    <div className="flex-column gap-05">
                                        <span className="text-12 color-lower-titles">At:</span>
                                        <span className="text-12">{properTime}</span>
                                    </div>
                                    
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>  

                 {ScrollDown_Loading || loading  ?
                    <div className="flex-column width100 items-center content-center padding-top-20">
                        <span className="text-15">Loading Item History</span>
                        <LoaderDots/>
                    </div>
                :
                    <></>
                }

        </div>
    )
}

const ItemHistoryBtn = ()=>{
    const {setNextPage} = useData()
    const {slidePageTo} = useSlidePage()

    return(
        <div className="flex-row items-center content-center">
            


            <button className="flex-column gap-05 btn"
                onClick={()=>{
                    if(setNextPage){
                        slidePageTo({addNumber:1})
                        setNextPage(
                            <ItemHistoryPage/>
                        )
                    }
                }}
            >
                <div className="svg-25 flex-column items-center content-center">
                    <HistoryIcon/>
                </div>
                <span className="text-9">History</span>
            </button>
        </div>
    )
}


export const  MemorizedItemHistoryBtn = memo(ItemHistoryBtn)