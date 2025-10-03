import {useRef,useState,useEffect,memo} from 'react'


export const CurrencyInputsPurchase =  memo(({setItemData,purchased_price,valuation,handleFocusScroll})=>{
    
    const [currencySelected,setCurrencySelected] = useState('SEK')
    const purchasedInputRef = useRef(null)
    const valuationRef = useRef(null)
    
    const currencyConvertion = {
                'SEK':{'val':1,'next':'DKK'},
                'DKK':{'val':1.5,'next':'EUR'},
                'EUR':{'val':11.2,'next':'SEK'},
                
            }

    
    useEffect(()=>{

        
            const fetchCurrencyConvertion = async()=>{
                const keys = Object.keys(currencyConvertion)
                const results = await Promise.all(
                    keys.map(async(key)=>{
                        try{
                            if(key === 'SEK'){
                                return {key, rate:1}
                            }
                            const res = await fetch(`https://api.frankfurter.app/latest?from=${key}&to=SEK`)
                            if(!res.ok) return null;
                            const data = await res.json()
                            
                            return {key, rate:Number(data.rates['SEK'])}
                        }catch(err){
                            console.log(`fail to fetch ${key} to currency api`)
                            return null
                        }
                    
                    })

                )
                results.forEach((result)=>{
                    if(result)currencyConvertion[result.key]['val'] = result.rate
                })
            
            }

            fetchCurrencyConvertion()

           
            
            

            // setForceRender(prev=>!prev)

    },[])

    if(!purchased_price && purchasedInputRef.current){
            purchasedInputRef.current.value = ''
            console.log(purchasedInputRef.current)
            }
    if(!valuation && valuationRef.current){
        valuationRef.current.value = ''
    }

    const handleCurrencySelection = ()=>{

        const nextName = currencyConvertion[currencySelected].next
        const nextCurr = currencyConvertion[nextName]

        const currentVal = purchasedInputRef.current.value
        const valuationVal = valuationRef.current.value

        if(currentVal !== ''){
            const newVal = Math.round(Number(currentVal) * nextCurr.val)

            if(valuationVal !== ''){
                setItemData(prev =>({...prev, 'purchased_price': newVal,'valuation':newVal * 4 }))
                valuationRef.current.value = currentVal * 4
            }else{
                setItemData(prev =>({...prev,'purchased_price':newVal,'valuation':null}))
            } 
            
        }
        setCurrencySelected(nextName)

    }

    const handleInputChange = (value,targetProp)=>{

        let val = null 
        if(value !== ''){
            val = Math.round(Number(value) * currencyConvertion[currencySelected].val)
            
        }

        if(targetProp == 'purchased_price' ){
            let valuationVal = null

            if(val){
                valuationVal = val * 4
            }
            valuationRef.current.value = purchasedInputRef.current.value * 4

            setItemData(prev =>({...prev,
                [targetProp]:val,
                'valuation':valuationVal
            }))
        }else{
            setItemData(prev => ({...prev,[targetProp]:val}))
        }   
    }

    return (
        <div className="flex-row width100">
            <div className="flex-row width100">
                <div className="flex-column gap-05 padding-10 width100">
                    <span className="color-lower-titles text-9">
                        Purchased price:
                    </span>
                    <input type="number" 
                        id='purchased_price'
                        ref={purchasedInputRef}
                        style={{width:'100%',fontSize:'13px'}}
                        defaultValue={purchased_price ?? ""}
                        onFocus={(e)=>{handleFocusScroll(e)}}
                        onChange={(e) =>{handleInputChange(e.currentTarget.value,'purchased_price')} }
                    />
                </div>
                <div className="flex-column content-center items-center gap-05 padding-right-10">
                    {purchased_price && 
                        <span className="text-9" >{purchased_price} SEK</span>
                    }
                    
                    <button className="btn bg-containers border-blue "
                    onClick={()=>{handleCurrencySelection()}}
                    >
                        <span>{currencySelected}</span>
                    </button>

                </div>
            </div>
            
            <div className="vertical-line"></div>
            <div className="flex-column gap-05 padding-10 width100">
                <span className="color-lower-titles text-9">
                    Valuation in <span className="color-light-titles" style={{paddingLeft:'5px',fontSize:'10px'}}>{currencySelected}</span> :
                </span>
                <input type="number"  
                    style={{width:'100%',fontSize:'13px'}}
                    ref={valuationRef}
                    defaultValue={valuation ?? ""}
                    onFocus={(e)=>{handleFocusScroll(e)}}
                    onChange={(e) =>{handleInputChange(e.currentTarget.value,'valuation')} }
                />
            </div>
            
        </div>
    )
})


