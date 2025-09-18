import {useContext,useState,useRef} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'


import {DealerTypeMap} from '../maps/mapDealerType.tsx'


import SecondaryPage from '../components/secondary-page.tsx'
import LoaderDots from '../components/LoaderDots.tsx'
import {AddressAutocomplete,getAddressFromCoordinates} from '../components/AddressAutocomplete.tsx'
import{DynamicBoxesV2} from './DynamicBoxesV2.tsx'

import useFetch from '../hooks/useFetch.tsx'



import LocationIcon from '../assets/icons/LocationIcon.svg?react'





const getCurrentLocation = async (setAddressObj,setLocationLoading)=>{
    if(!navigator.geolocation){
        console.log('Geolocation is not suported by device')
        return
    }
    

    navigator.geolocation.getCurrentPosition(
        async (position)=>{
            let currentCoordinates = {
                lat:position.coords.latitude,
                lng:position.coords.longitude
            }

            // missing to use google api for getting the address

            // setAddressObj({'coordinates':currentCoordinates})
            try{
                const address = await getAddressFromCoordinates(currentCoordinates.lat,currentCoordinates.lng)
                setAddressObj({
                    coordinates:currentCoordinates,
                    raw_address:address
                })
            }catch{
                console.log('failed to reverse geocode')
                setAddressObj({
                    coordinates:currentCoordinates,
                })
            }
            setLocationLoading(false)
        },
        (err) =>{console.log(err.message)},
        {enableHighAccuracy:true}
        
    )

    
}


const CreateDealer = ({zIndex,dealerDict,handleClose,handleCloseUponSave}) => {
    const {showMessage} = useContext(ServerMessageContext)
    const [togglePage,setTogglePage] = useState<PageKey | '' >('')
    const [addressObj,setAddressObj] = useState({})
    const [locationLoading,setLocationLoading] = useState(false)
    const [dealerType, setDealerType] = useState(null)
    const selectedPlaceRef = useRef({})
    const {loading,doFetch} = useFetch()


    

    const handleDealerType = (resultDict,handleClose) =>{
        
        setDealerType(resultDict.result.dealer_type)
        handleClose()
    }

  
    
   const required_keys = ['dealer_name','dealer_type','raw_address']
    const handleSave = async (e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        console.log(form)
        const formData = new FormData(form)
        
        let dealerData = Object.fromEntries(
            Array.from(formData.entries()).filter(([key,value])=> value!== "" && value !== null)
        )

        if(addressObj?.raw_address){
            dealerData.raw_address = addressObj.raw_address
        }
        if(addressObj?.coordinates){
            dealerData.coordinates = addressObj.coordinates
        }
        if(dealerType && dealerType !== ''){
            dealerData.dealer_type = dealerType
        }
        if('age' in dealerData){
            dealerData.age = parseInt(dealerData.age)
        }
        
        const dictKeys = Object.keys(dealerData)
        for(let key of required_keys){
            if(!dictKeys.includes(key)){
                if(key.includes('_')){
                    key = key.split('_')[1]
                }

                showMessage({message:`missing ${key}`,status:400})
                return
            }
        }

        const fetchDict = {
            'model_name':'Dealer',
            'requested_data':['id'],
            'object_values':dealerData,
            'reference':'Dealer ' + dealerData.dealer_name
        }

        try{
            const setRules = {'loadServerMessage':true}
            const response = await doFetch('/api/schemes/create_items','POST',fetchDict,setRules)
            if(response && response.status < 400){
                const responseData = response.body[0]
                if(dealerDict && dealerDict.current){
                    dealerDict.current = {
                        id:responseData.id,
                        delaer_type:dealerType,
                        dealer_name:dealerData.dealer_name,
                        purchased_count:0,
                    }
                    
                }
            }
            if(handleCloseUponSave){
                handleCloseUponSave()
                return
            }else if(handleClose){
                handleClose()
                return
            }
            

        }catch(err){
            console.log(err)
            
        }
        
        
    }

    return (
    <div className="flex-column height100dvh" style={{zIndex:zIndex,overflow:'hidden'}}>
        {togglePage !== '' && 
            <SecondaryPage BodyComponent={DynamicBoxesV2} 
                bodyProps={{
                    objectMap:DealerTypeMap.dealerType,
                    uponCompletion:handleDealerType,
                    inputValue:dealerType,
                }} 
                zIndex={zIndex + 1}
                pageId={'dealerType'}
                handleClose={()=>{setTogglePage('')}} 
            />
        }

      

        <form >
        {/* page content */}
            <div className="flex-column width100 padding-top-40">
                
                    <div className="flex-column gap-05 width100 padding-10 border-bottom">
                        <span className="color-lower-titles">Dealer name</span>
                        <input name="dealer_name" type="text" style={{fontSize:"30px"}}/>
                    </div>
                    <div className="flex-column gap-05 width100 padding-10 border-bottom">
                        <span className="color-lower-titles">Address</span>
                        <div className="flex-row  ">

                            <AddressAutocomplete setAddressObj={setAddressObj} inputAddress={addressObj}/>


                            {locationLoading ? 

                            <div className="flex-column" >
                                <LoaderDots dotStyle={{dimensions:'squareWidth-05',bgColor:'bg-secondary'}}/>
                            </div>
                            :
                            <div className="flex-column btn items-center content-center bg-containers border-blue"style={{borderRadius:'50%',width:'37px',height:'35px',padding:'0'}}
                            onClick={()=>{getCurrentLocation(setAddressObj,setLocationLoading);setLocationLoading(true)}}
                            >
                                <div className=" flex-column items-center content-center svg-15 " >
                                    <LocationIcon/>
                                </div>
                            </div>
                            }
                        
                        </div>
                        
                    </div>
                    <div className="flex-column gap-05 width100 padding-10 border-bottom"
                    onClick={()=>{setTogglePage('DealerType')}}
                    >
                        <span className="color-lower-titles">Dealer Type</span>

                        <span className="text-15">{dealerType ? dealerType: 'select ...'}</span>
                    </div>
                    
                    
                    
                    <div className="flex-row width100  border-bottom">
                         <div className="flex-column gap-05  padding-10">
                            <span className="lower-titles">
                                Email
                            </span>
                            <input  type="text" className="width100"  name="email"/>
                        </div>
                        <div className="vertical-line"></div>
                        <div className="flex-column gap-05 padding-10">
                            <span className="lower-titles">
                                Phone
                            </span>
                            <input type="number" className="width100" name="phone"/>
                        </div>
                    </div>
                    <div className="flex-row width100 border-bottom">
                        <div className="flex-column gap-05 padding-10">
                            <span className="lower-titles">
                                Gender
                            </span>
                            <input type="text" name="gender" className="width100" />
                        </div>
                        <div className="vertical-line"></div>
                        <div className="flex-column gap-05 padding-10">
                            <span className="lower-titles">
                                Age
                            </span>
                            <input type="number" name="age" className="width100" />
                        </div>
                    </div>
                
            </div>
            <div className="flex-row padding-10 width100 padding-bottom-20 padding-top-20" style={{position:'absolute',bottom:'0',left:'0'}}>
                <div role="button" className="flex-row btn bg-containers border-blue width100 items-center content-center padding-10"
                onClick={handleSave}
                >
                        <span className="text-15">Add Delaer</span>
                </div>
            </div>
        </form>

    </div>  
    );
}
 
export default CreateDealer;