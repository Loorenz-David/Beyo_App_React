import {useRef,useEffect,useState} from 'react'

import SelectPopup from './SelectPopup.tsx'


const loadGoogleMaps = (apiKey:string)=>{
    console.log(apiKey,'api?')
    return new Promise<void>((resolve,reject)=>{
        if(window.google?.maps){
            resolve()
            return
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script)
        console.log(script)


    })
}


async function loadGoogleScript (){
            await loadGoogleMaps("AIzaSyCD3DRK01s36AtGDIGoKnjy370u_WR5brw")
}

const handleInput = async ( query:string,setSuggestionList,setSelectPopup,setAddressObj) =>{
            if(query === ''){
                setSuggestionList([])
                setSelectPopup(false)
                setAddressObj({})
                return
            }
            const {AutocompleteSuggestion,AutocompleteSessionToken} = await google.maps.importLibrary("places")
            const token = new AutocompleteSessionToken()
            const {suggestions} = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input:query,
                sessionToken:token,
                includedRegionCodes:['SE'],
                includedPrimaryTypes:['street_address', 'premise', 'subpremise', 'plus_code']

            })
            setSuggestionList(suggestions)
            setSelectPopup(true)
            
        }

const getPlaceDetails = async (suggestion,setAddressObj) =>{
    const place = suggestion.placePrediction.toPlace()
    const details = await place.fetchFields({
        fields:['formattedAddress','location']
    })
    setAddressObj({
                    'raw_address':details.place.formattedAddress,
                    'coordinates':{
                        lat:details.place.location.lat(),
                        lng:details.place.location.lng()
                    }
    })
    
}

const SelectOptions = ({suggestionList,inputRef,spanRef,setAddressObj}) =>{
    const parentWidth = inputRef.current.offsetWidth
    
    const handleSelectionAddress = (obj)=>{
        inputRef.current.value = obj.placePrediction.mainText.text
        spanRef.current.textContent = obj.placePrediction.secondaryText.text
        getPlaceDetails(obj,setAddressObj)
    }

    return(
       <div className="flex-column " style={{width:`${parentWidth}px`}}>
        {suggestionList.map((obj,i)=>{
            return (
                <div key={`autoFill_${i}`} className="flex-column width100 border-bottom padding-10 gap-05"
                onClick={()=>{handleSelectionAddress(obj)}}
                >
                    <span>{obj.placePrediction.mainText.text}</span>
                    <span className="color-lower-titles">{obj.placePrediction.secondaryText.text}</span>
                    
                </div>
            )
        })}
       </div>

    )
}

export const AddressAutocomplete = ({setAddressObj,inputAddress}) => {
    const inputRef = useRef<HTMLDivElement>(null)
    const spanRef = useRef(null)
   
    const [suggestionList,setSuggestionList] = useState([])
    const [selectPopup,setSelectPopup] = useState(false)
    
    
    useEffect(()=>{
        if(!window.google?.maps){
            loadGoogleScript()
        }
        
        if(inputRef.current && 'raw_address' in inputAddress){
            const [street,rest] = inputAddress.raw_address.split(/,(.+)/)
            inputRef.current.value = street
            spanRef.current.textContent = rest
        }
        
        

    },[inputAddress])

    
   
    

    return ( 
            <div className="flex-column width100" style={{position:'relative'}}>
                <input type="text" id="inputAddress" className="width100"
                ref={inputRef}
                onInput={(e)=>{handleInput(e.currentTarget.value,setSuggestionList,setSelectPopup,setAddressObj);spanRef.current.textContent = ''}}
                
                />
                <span className="color-lower-titles"
                ref={spanRef}
                >
                </span>
                {selectPopup && suggestionList.length > 0 &&
                    <SelectPopup BodyComponent={SelectOptions} bodyProps={{suggestionList,inputRef,spanRef,setAddressObj}} setSelectPopup={setSelectPopup} selectValue={selectPopup} exception={'#inputAddress'} boxStyle={{right:'0',top:'110%'}} />
                }
               
            </div>
    );
}

export const getAddressFromCoordinates = async(lat:number,lng:number)=>{
    if(!window.google?.maps){
        console.log('google maps not loaded')
        return null
    }

    const geocoder = new window.google.maps.Geocoder()
    return new Promise<string>((resolve,reject)=>{
        geocoder.geocode({location:{lat,lng}}, (result, status) =>{
            if(status === 'OK' && result && result[0]){
                resolve(result[0].formatted_address)
            }else{
                reject(status)
            }
        })
    })

}
