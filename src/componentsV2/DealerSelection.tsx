
import {useState,useRef,useEffect,memo} from 'react'

import useFetch from '../hooks/useFetch.tsx'


import LoaderDots from '../components/LoaderDots.tsx'
import SecondaryPage from '../components/secondary-page.tsx'
import CreateDealer from './CreateDealer.tsx'
import SelectPopupV2 from './SelectPopupV2.tsx'

import FilterIcon from '../assets/icons/FilterIcon.svg?react'
import DealerIcon from '../assets/icons/DealerIcon.svg?react'
import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'



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

export const DealerSelection = ({dealerDict,handleClose,holdScrollElement,zIndex}) => {
    const {doFetch,data,setData,loading,setLoading} = useFetch()
    const setRules = {'loadData':true}
    const [filterBy,setFilterBy] = useState('dealer_name')  
    const operation = useRef('ilike')
    const selectedFilterRef = useRef<Set<string>>(new Set([]))
    const [toggleFilterQuery,setToggleFilterQuery] = useState(false)
    const inputRef = useRef(null)
    const timeOutRef = useRef(null)
    const [toggleCreateDealer, setToggleCreateDealer] = useState(false)

    useEffect(()=>{
        
        return ()=>{
            if(timeOutRef.current){
                clearTimeout(timeOutRef.current)
            }
        }
    },[])

   
    
    const handleQuery =  (val,filterOn='')=>{
        if(!filterOn){
            filterOn = filterBy 
        }
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
            timeOutRef.current = null
        }

        if(val === ''){
            setData(null)
            if(loading){
                setLoading(false)
            }
            return 
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
        
        const fetchDict = {
            model_name:'Dealer',
            per_page: 50,
            query_filters : {[filterOn]:{'operation':operation.current,'value':val}},
            requested_data:['id','dealer_name','dealer_type','purchased_count']
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
        dealerDict.current = copy
        handleClose()
    }

    return (
        <div className="" style={{height:'100dvh'}}>
            {toggleCreateDealer && 
                 <SecondaryPage BodyComponent={CreateDealer}
                    bodyProps={{dealerDict,handleCloseUponSave:handleClose}}
                    zIndex={zIndex + 1}
                    pageId={'createDealerPage'}
                    handleClose={()=>{setToggleCreateDealer(false)}}
                    closeBtn = {{'icon':<ArrowIcon/>,class:'padding-05 content-start',order:0}}
                    header={{'display': 'Create Dealer', class:'flex-1 content-center',order:2}}
                    startAnimation={'slideLeft'}
                    endAnimation ={'slideRight'}
                />
            }
            <div className="flex-row padding-15 ">
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
            <div ref={holdScrollElement} className="flex-column " style={{overflowY:'auto'}}>
                {loading && 
                    <div className="no-select flex-row content-center items-center">
                            <LoaderDots />
                    </div>
                }
                {data && data.length > 0 ?
                    data.map((obj,i)=>{
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
                    <div className="no-select flex-row width100 items-center space-between  padding-20 border-bottom "
                    onClick={()=>{handleDealerSelection({'dealer_name':'Offline Dealer','id':null})}}
                    >
                        <span className="text-15">Offline Dealer</span>
                        
                    </div>

                    <div className="flex-row content-center padding-top-30">
                        <button className="flex-column gap-1 content-center btn  padding-10 border-blue bg-containers"
                            onClick={()=>{setToggleCreateDealer(true)}}
                        >
                                <div className="svg-25 flex-column items-center content-center">
                                    <DealerIcon />
                                </div>
                                <span>Add Dealer</span>
                        </button>
                    </div>
                   </>
                    
                }

                
                
                
            </div>
            
        </div>
      );
}

const DealerSelectionBtn = ({dealer,setItemData,zIndex}) =>{
    const [toggleDealerSelection,setDealerSelection] = useState(false)
    const dealerDict = useRef({})
   
    const handleClose = ()=>{
        
        if('id' in dealerDict.current){
            setItemData(prev =>({
                ...prev,
                dealer:{...dealerDict.current}
            })
            )  
        }
        setDealerSelection(false)

    }
    let isOffline = ''
    if(dealer.dealer_name && dealer.dealer_name == 'Offline Dealer'){
        isOffline = 'offline-item'
    }


    return (
        <div className="flex-row">
            {toggleDealerSelection && 
                <SecondaryPage BodyComponent = {DealerSelection}
                    zIndex={zIndex + 1}
                    pageId={'dealerSelection'}
                    bodyProps={{
                        dealerDict:dealerDict
                    }}
                    handleClose = {handleClose}
                    header={{order:0,display:'Select Dealer',class:'color-light-titles'}}
                /> 
            }

            <button className={`flex-column items-center content-center gap-05 btn ${isOffline} `} style={{padding:'0'}}
                onClick={()=>{setDealerSelection(true)}}
                id="dealer"
                >
                <div className="flex-column items-center content-center  svg-25 ">
                    <DealerIcon/>
                </div>
                <span   className="text-9">{dealer ? dealer.dealer_name : 'Dealer'}</span>
            </button>

        </div>
        

    )
}
 
export const MemorizedDealerSelectionBtn = memo(DealerSelectionBtn);