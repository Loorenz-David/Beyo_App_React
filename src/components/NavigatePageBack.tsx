import ArrowIcon from '../assets/icons/ArrowIcon.svg?react'
import {useNavigate} from 'react-router-dom'

const NavigatePageBack = () => {
    const navigate = useNavigate()

    return (
        <div className="btn svg-25" style={{padding:'0'}}
        onClick={()=>{navigate(-1)}}>
            <ArrowIcon/>
        </div>
      )
}
 
export default NavigatePageBack;