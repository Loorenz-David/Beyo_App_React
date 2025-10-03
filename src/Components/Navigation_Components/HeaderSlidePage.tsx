
import ArrowIcon from '../../assets/icons/General_Icons/ArrowIcon.svg?react'
import {useSlidePage} from '../../contexts/SlidePageContext.tsx'



interface HeaderSlidePage{
    rightElement?: React.ReactNode
    middleElement?:React.ReactNode
}


export const HeaderSlidePage = ({
    middleElement,
    rightElement
}:HeaderSlidePage)=>{
    const {slidePageTo} = useSlidePage()
    return(
       <div className="flex-row width100 padding-10 " 
            style={{height:'40px', boxShadow:'0 0 10px rgba(0,0,0,0.3)'}}
        >
            <div className="flex-row btn  svg-20 content-start" 
                onClick={()=>{
                    slidePageTo({addNumber:-1})
                }}
            >
                <ArrowIcon/>
            </div>

            
                {middleElement}
            
            
            {rightElement}
        </div>
    )
}