import {useItemCreation} from '../contexts/ItemCreationContext.tsx'
import {useEffect,useState,useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import useFetch from '../hooks/useFetch.tsx'
import ServerMessage from './server-message.tsx'
import SelectPopup from './SelectPopup.tsx'

import DealerIcon from '../assets/icons/DealerIcon.svg?react'
import FilterIcon from '../assets/icons/FilterIcon.svg?react'
import CheckMarkIcon from '../assets/icons/CheckMarkIcon.svg?react'



// user can select column to search on address, phone, etc
// user will be redirected to add dealer page
// user can select a dealer this will be added to the item data dict
// 

const FilterSelectOptions = ({searchColumn,setSearchColumn})=>{
    const columns = [{label:'Dealer name',value:'dealer_name'},{label:'Dealer Address',value:'raw_address'},
                    {label:'Dealer email',value:'email'},{label:'Dealer type',value:'dealer_type'},]

    const selectContainerRef = useRef(null)

    const handleColumnSelection = (e) =>{
        const target = e.target.closest('[data-column]')
        if(target){
            const selected = target.getAttribute('data-column')
            if(selectContainerRef.current){
                const activeSelections = selectContainerRef.current.querySelectorAll('.select:not(.hide)')
                activeSelections.forEach(c => c.classList.add('hide'))

                target.querySelector('.select').classList.remove('hide')
                setSearchColumn(selected)
            }  
        }
    }
   

    return (
        <div className="flex-column height100" style={{minWidth:'150px'}}
        onClick={(e)=>{handleColumnSelection(e)}}
        ref={selectContainerRef}
        >
            {columns.map((row,index)=>{
                return(
                    <div key={`column_${index}`}
                    data-column={row.value}
                    className="flex-row gap-1 items-center border-bottom padding-10">
                        <div style={{width:'15px',height:'15px'}}>
                            <div className={`svg-15 select ${row.value === searchColumn ? '': 'hide'}`} >
                                <CheckMarkIcon />
                            </div>
                        </div>
                        <span className="">{row.label}</span>
                    </div>
                )
            })
            }
           
           
        </div>
    )
}


const CreationItemSelectDealer = ({handleClose}) => {
    const {itemData,updateItemData} = useItemCreation()
    const {data,loading,serverMessageDict,error,setData,setLoading,setServerMessageDict,doFetch} = useFetch()
    const [dealersFound,setDealersFound] = useState(null)
    const [searchTerm,setSearchTerm] = useState('')
    const [searchColumn,setSearchColumn] = useState('dealer_name')
    const [filtersPopup, setFiltersPopup] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        const delayDeBounce = setTimeout(()=>{
            if(searchTerm.trim() !== ''){
                const setRules = {'loadData':true}
                const queryFilters ={
                                    'model_name':'Dealer',
                                    'requested_data':['id','dealer_name','purchased_count','item_count','dealer_type'],
                                    'query_filters':{
                                                        [searchColumn]:{'operation':'ilike','value':`%${searchTerm}%`}
                                                    }
                                    }
               
                
                doFetch({
                    url:'/api/schemes/get_items',
                    method:'POST',
                    body:queryFilters,
                    setRules:setRules})
                    .then((e)=>{
                        if(e && 'body' in e){
                            let body = e.body
                            if(body.length === 0){
                                setDealersFound(null)
                            }else{
                                setDealersFound(e.body)
                            }
                            
                        }
                        
                    })
                
            }else{
                setDealersFound(null)
            }
           
        },400)
        
        return () =>{
                clearTimeout(delayDeBounce);
                
        }
    },[searchTerm,searchColumn])

   
   const handleSelectedDealer = (e) =>{
    const target = e.target.closest('.dealer-in-query')
    if(target && dealersFound){
        let targetId = Number(target.getAttribute('data-id'))
        const targetDealer = dealersFound.find(obj => obj.id == targetId)
        updateItemData({'dealer':{'id':targetDealer.id,'name':targetDealer.dealer_name}})
        handleClose()
    }
   }

    return ( 
        <div className='flex-column width100 gap-2' style={{minHeight:'100dvh'}}>
            {serverMessageDict && 
            <ServerMessage messageDict={serverMessageDict} onDismiss={()=>{setServerMessageDict(null)}}/>  }
            <div className="flex-row padding-20 " style={{position:'relative'}}>
                <input type="text" name="searchDealer" className="main-input width100" placeholder="Search for dealer..."
                style={{borderRadius:'5px 0 0 5px'}}
                onInput={(e)=>{setSearchTerm(e.target.value)}}
                />
                <div className="flex-column content-center items-center bg-light-container "
                style={{borderRadius:'0 5px 5px 0',position:'relative'}} 
                id='FiltersPopupBtn'
                >
                    <div className="btn svg-15 padding-left-20 padding-right-20"
                    
                    onClick={(e)=>{let isOpen = !filtersPopup; setFiltersPopup(isOpen)}}
                    >
                        <FilterIcon/>
                    </div>
                    {filtersPopup && 
                    <SelectPopup BodyComponent={FilterSelectOptions} bodyProps={{searchColumn,setSearchColumn}} setSelectPopup={setFiltersPopup} selectValue={filtersPopup} exception={'#FiltersPopupBtn'} />
                    }
                </div>
            </div>
            <div className='flex-column' 
            onClick={(e)=>{handleSelectedDealer(e)}}
            >
                {dealersFound ? dealersFound.map((dealer,i) =>{

                    return (
                        <div key={`dealerFound_${i}`} data-id={dealer.id} className="flex-row width100 space-between items-center  padding-20 border-bottom dealer-in-query">
                            <span className="text-15">{dealer.dealer_name}</span>
                            <span className="text-15 color-lower-titles">{dealer.dealer_type} </span>
                            <span className="text-12 ">{dealer.purchased_count}kr</span>
                        </div>
                    )
                }) 
                : 
                <div className="flex-column width100 items-center padding-20 gap-3">
                    <span className="text-15 color-lower-titles">No Dealers found.</span>
                    <div className=" btn bg-containers border-blue padding-15 flex-column gap-05"
                    onClick={()=>{navigate('/items/create_dealer')}}>
                        <div className="svg-30">
                             <DealerIcon/>
                        </div>
                        <span>Add Dealer</span>
                    </div>
                </div>
                }

            </div>
        </div>
     );
}
 
export default CreationItemSelectDealer;