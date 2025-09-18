const SelectCurrencyOptions = ({selectedCurrencyRef,handleCostInput,inputCurrencyRef}) => {

    const handleSelection = (e)=>{
        const target = e.closest('.currency')
        if(target){
            const value = target.querySelector('span').textContent
            selectedCurrencyRef.current = value
            handleCostInput(inputCurrencyRef.current.value)
        }
    }

    return ( 
        <div className='flex-column' style={{minWidth:'100px'}}
        onClick={(e)=>{handleSelection(e.target)}}
        >
            <div className='flex-row items-center padding-10 border-bottom currency' >
                <span>SEK</span>
            </div>
            <div className='flex-row items-center padding-10 border-bottom currency' >
                <span>DKK</span>
            </div>
            <div className='flex-row items-center padding-10 border-bottom currency'>
                <span>EUR</span>
            </div>
        </div>
     );
}
 
export default SelectCurrencyOptions;