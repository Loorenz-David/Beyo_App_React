import PrintIcon from '../../assets/icons/General_Icons/PrintIcon.svg?react'
import LoaderDots from '../Loader_Components/LoaderDots.tsx'
import usePrintLableWiFi from '../../hooks/usePrintLabelWiFi.tsx'

const PrintBatchBtn = ({selectedItems})=>{
    if(Object.keys(selectedItems).length == 0) return
    const {printLabel,isPrinterConnected} = usePrintLableWiFi({})
    const handleBatchPrint = async()=>{
        const poolLimit = 5
        let counter = 1
        const executing:any[]= []
        let responses:any[] = []
        


        for(let art in selectedItems){
            
            const targetObj = selectedItems[art]
            

            if(counter == 1 ){
                const firstCall = await printLabel(targetObj,true)
                console.log(firstCall)
                if(!firstCall.success){
                    
                    break
                }
            }else{
                let p = printLabel(targetObj,false).then((result)=>{
                    console.log('job finished.')
                    executing.splice(executing.indexOf(p),1)
                    responses.push(result)
                })
                executing.push(p)
            }
            
            

             
            if(executing.length >= poolLimit){
                console.log('hit pool limit, waiting for freeing space')
                await Promise.race(executing)
            }
            
            counter ++
        }
        
        await Promise.all(executing)
        console.log(responses,'responses')
        
    }
    return(
         <div className="flex-column content-center " >
            {isPrinterConnected == 'connecting'? 
                    <LoaderDots dotStyle={{dimensions:'squareWidth-05',bgColor:'bg-secondary'}}/>
                :
                    <div className=" btn svg-18" 
                        onClick={()=>{handleBatchPrint()}}
                    >
                        <PrintIcon/>
                    </div>
                }
                
            </div>
    )
}

export default PrintBatchBtn