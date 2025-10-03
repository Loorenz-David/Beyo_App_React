
import {useState,useRef,useEffect,memo} from 'react'

import useFetch from '../../hooks/useFetch.tsx'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'
import {useData} from '../../contexts/DataContext.tsx'
import {SlidePage} from '../Page_Components/SwapToSlidePage.tsx'

import LoaderDots from '../Loader_Components/LoaderDots.tsx'
import CreateDealer from './CreateDealer.tsx'
import SelectPopupV2 from './SelectPopupV2.tsx'

import FilterIcon from '../../assets/icons/General_Icons/FilterIcon.svg?react'
import DealerIcon from '../../assets/icons/General_Icons/DealerIcon.svg?react'



interface DealerDisplayDict{
    dealer_name:string
    purchased_count:number
    dealer_type:string
}

const filterVals = [
    {'displayName':'Name','column':'dealer_name','operation':'ilike'},
    {'displayName':'Email','column':'email','operation':'ilike'},
    {'displayName':'Phone','column':'phone','operation':'ilike'},
    {'displayName':'Type','column':'dealer_type','operation':'ilike'},
    {'displayName':'Address','column':'raw_address','operation':'ilike'},
    {'displayName':'Gender','column':'gender','operation':'ilike'},
    {'displayName':'Purchase Count >','column':'purchased_count','operation':'>='},
    {'displayName':'Purchase Count <','column':'purchased_count','operation':'<='},
    {'displayName':'Purchase Count =','column':'purchased_count','operation':'=='},
]

export const DealerSelection = () => {
    const {doFetch,data:fetchData,setData,loading,setLoading} = useFetch()
    const setRules = {'loadData':true}
    const [filterBy,setFilterBy] = useState('dealer_name')  
    const operation = useRef('ilike')
    const selectedFilterRef = useRef<Set<string>>(new Set([]))
    const [toggleFilterQuery,setToggleFilterQuery] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const timeOutRef = useRef<number>(null)
    

    const {slidePageTo} = useSlidePage()
    const {data:itemData,setData:setItemData} = useData()
    const [NextPageChild,setNextPageChild] = useState<React.ReactNode>(null)

    useEffect(()=>{
        handleFetch()
        return ()=>{
            if(timeOutRef.current){
                clearTimeout(timeOutRef.current)
            }
        }
    },[])

   
    
    const handleQuery =  (val:string, filterOn='')=>{
        if(!inputRef.current) return

        if(!filterOn){
            filterOn = filterBy 
        }
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
            timeOutRef.current = null
        }

       

        if(filterOn == 'purchased_count'){
            if(!isNaN(Number(val))){
                val = Number(val)
            }else{
                inputRef.current.value = ''
                return
            }
        }else{
            val = `%${val}%`
        }
        
        setLoading(true) 
        
        timeOutRef.current = setTimeout(async ()=>{

           await handleFetch({[filterOn]:{'operation':operation.current,'value':val}})
            
        },500)
        
    }

    const handleFetch = async(filters:object | null=null)=>{

        const fetchDict = {
            model_name:'Dealer',
            per_page: 9,
            query_filters : {},
            requested_data:['id','dealer_name','dealer_type','purchased_count'],
            
        }
        if(filters){
            fetchDict['query_filters'] = filters
         }

        await doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:fetchDict,
            setRules:setRules},
            
        )
    }

    const handleFilterSelection = (obj)=>{
        const input = inputRef.current.value
        
        selectedFilterRef.current = new Set([obj.displayName])

        if(obj.column == 'purchased_count'){
            
            if(isNaN(Number(input))){
                
                inputRef.current.value = ''
            }
        }
        operation.current = obj.operation
        

        setToggleFilterQuery(false)
        setFilterBy(obj.column)
        if(input !== ''){
             handleQuery(input,obj.column)
        }
       
        
    }

    const handleDealerSelection = (obj)=>{
       
        const copy = {id:obj.id,dealer_name:obj.dealer_name}
        setItemData(prev =>({ ...prev, dealer:copy }))
        
        slidePageTo({addNumber:-1})
    }

    return (
        <div   style={{height:'100vh',overflowY:'auto',}}>
            {NextPageChild && 
                <SlidePage BodyComponent={NextPageChild} />
            }

            <div className="flex-row padding-15 width100 bg-primary" style={{position:'fixed',top:'0',left:'0'}}>
                <div className="flex-row bg-containers width100" style={{borderRadius:'5px'}}>
                    <div className="flex-column width100 padding-10"
                    
                    >
                        <input type="text" className="width100" style={{fontSize:'15px'}} 
                        ref={inputRef}
                        onInput={(e)=>{handleQuery(e.currentTarget.value)}}
                        />
                    </div>
                    <div className="flex-column content-center"
                    
                    style={{position:'relative'}}
                    >   
                    {toggleFilterQuery && 
                        <SelectPopupV2 
                            setTogglePopup={setToggleFilterQuery}
                            listOfValues ={filterVals}
                            onSelect={handleFilterSelection}
                            right={'80%'}
                            top={'90%'}
                            selectedOption = {selectedFilterRef.current}
                        />
                    }
                        
                        <button className="svg-15 btn"
                        onClick={()=>{setToggleFilterQuery(true)}}
                        >
                            <FilterIcon/>
                        </button>
                    </div>
                </div>
            </div>
            <div  className="flex-column"style={{paddingTop:'80px', paddingBottom:'40px'}} >
                {loading && 
                    <div className="no-select flex-row content-center items-center">
                            <LoaderDots />
                    </div>
                }
                {fetchData && fetchData.length > 0 ?
                    (fetchData as DealerDisplayDict[]).map((obj,i)=>{
                        return(
                            <div key={`dealerQuery_${i}`} className="flex-row width100 items-center space-between  padding-20 border-bottom "
                            onClick={()=>{handleDealerSelection(obj)}}
                            >
                                <span className="text-15">{obj.dealer_name}</span>
                                <span className="color-lower-titles text-15">{obj.dealer_type}</span>
                                <span >{obj.purchased_count? obj.purchased_count : 0} kr</span>
                            </div>
                        )
                    })
                :
                   <>
                    
                   </>
                    
                }

                <div className="no-select flex-row width100 items-center space-between   padding-20 border-bottom "
                    onClick={()=>{handleDealerSelection({'dealer_name':'Offline Dealer','id':null})}}
                >

                    <span className="text-15">Offline Dealer</span>
                    
                </div>

                <div className="flex-row content-center padding-top-30">
                    <button className="flex-column gap-1 content-center btn  padding-10 border-blue bg-containers"
                        onClick={()=>{
                            slidePageTo({addNumber:1})
                            setNextPageChild(
                                <CreateDealer 
                                    setData={setItemData}
                                />
                            )

                        }}
                    >
                            <div className="svg-25 flex-column items-center content-center">
                                <DealerIcon />
                            </div>
                            <span>Add Dealer</span>
                    </button>
                </div>
            </div>
            
        </div>
      );
}

const DealerSelectionBtn = () =>{
    

    const {slidePageTo} = useSlidePage()
    const {data:itemData,setNextPage} = useData()
   
    let isOffline = ''
    if(itemData.dealer &&  itemData.dealer.dealer_name == 'Offline Dealer'){
        isOffline = 'offline-item'
    }


    return (
        <div className="flex-row">
            <button className={`flex-column items-center content-center gap-05 btn ${isOffline} `} style={{padding:'0'}}
                onClick={()=>{
                    if(setNextPage){
                        setNextPage(
                            <DealerSelection/>
                        )
                        slidePageTo({addNumber:1})
                    }
                }}
                id="dealer"
                >
                <div className="flex-column items-center content-center  svg-25 ">
                    <DealerIcon/>
                </div>
                <span   className="text-9">{itemData.dealer ? itemData.dealer.dealer_name : 'Dealer'}</span>
            </button>
        </div>
        

    )
}
 
export const MemorizedDealerSelectionBtn = memo(DealerSelectionBtn);