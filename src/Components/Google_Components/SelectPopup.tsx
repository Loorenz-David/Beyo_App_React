import '../../css/SelectPopup.css'
import {useEffect} from 'react'


const SelectPopup = ({BodyComponent,bodyProps,setSelectPopup,selectValue,exception,boxStyle={right:'100%',top:'100%',maxWidth:'400px'}}) => {
    
    useEffect(()=>{
        
        const handleClickOutside = (e)=>{
            
            if(!e.target.closest(`${exception}`) ){
               
                setSelectPopup(false)
                
            }
        }

        window.addEventListener('click',handleClickOutside)

        return () =>{
            window.removeEventListener('click',handleClickOutside)
        }
    },[selectValue])

    return ( 
        <div className="select-popup" style={{top:`${boxStyle.top}`,right:`${boxStyle.right}`,maxWidth:`${boxStyle.maxWidth}`}}>
                <BodyComponent {...bodyProps} setSelectPopup={setSelectPopup}/>
        </div>
     );
}
 
export default SelectPopup;