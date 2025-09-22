export const handleFocus = (e)=>{
        const inputTarget = e.target
        if(inputTarget){
            setTimeout(()=>{
                inputTarget.scrollIntoView({behavior:'smooth',block:'center'})
            },300)
        }
        
    }