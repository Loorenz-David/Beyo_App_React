import {useRef} from 'react'


interface SlidePageProps{
   BodyComponent: React.ReactNode
}

export const SlidePage = ({
    BodyComponent,
    
}:SlidePageProps) =>{

    const currentPageRef = useRef<HTMLDivElement | null>(null)
   

    
    return (
        <div className="width100 bg-primary flex-column" 
            style={{
                height:'100vh',position:'absolute',top:'0',left:'0',
                zIndex:2,isolation:'isolate',transform:'translateX(100%)'
            }}
            ref={currentPageRef}
        >
            {BodyComponent}
        </div>
    )
}