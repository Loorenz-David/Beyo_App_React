import {useState,useRef,useContext} from 'react'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'

declare const BrowserPrint: any;



const usePrintLableWiFi = ({itemData}) => {

    const {showMessage} = useContext(ServerMessageContext)
    const [isPrinterConnected,setIsPrinterConnected] = useState('')
    const printer = useRef(null)
    const zebraPrinter = useRef(null)

  
    const propertiesAllowedToPrint = {
        'set_of':'Set Of','upholstery':'Structure',
        'Legs Type':'Legs','Extentions Type':'Extentions', 'Extentions Set':'Set Of',
        
    }
    const numberOfCopiesMap = {'Dining Chair':{'propInfluence':['set_of']},'Dining Table':{'propInfluence':['Extentions Set',1]}}

    const generateLabel = (selectedItemData)=>{

        let zplStyleSpaceBetween = 120

        let zplItemProperties = ''
        
        let itemDataDict;
        if(selectedItemData){
            itemDataDict = selectedItemData
        }else{
            itemDataDict = itemData
        }


        if(itemDataDict.properties){
           
            Object.keys(itemDataDict.properties).forEach((prop)=>{
                if(!(prop in propertiesAllowedToPrint)) return
                const tempString = `
                    ^CF0,15
                    ^FO20,${zplStyleSpaceBetween}^FD${propertiesAllowedToPrint[prop]}^FS
                    ^FO100,${zplStyleSpaceBetween}^FD${itemDataDict.properties[prop]}^FS
                `
                zplItemProperties += tempString
                zplStyleSpaceBetween += 30
            })
        }

        let numOfCopies = 1
        let targetMapCounter = numberOfCopiesMap[itemDataDict.type]
       
        // if(itemDataDict.parts){
        //     itemDataDict.parts.forEach((part)=>{
        //         numOfCopies += part.count
        //     })
        // }

         if(targetMapCounter){

            let iterationList = targetMapCounter.propInfluence ?? []
            iterationList.forEach((influence)=>{
                if(typeof influence == 'string'){
                    if(itemDataDict.properties && itemDataDict.properties[influence]){
                        numOfCopies *= itemDataDict.properties[influence]
                       
                    }
                    
                }else if( typeof influence == 'number'){
                    numOfCopies += influence
                }
            })
            
        }
        numOfCopies += 1


        return `
         ^XA
            ^PW399
            ^LL203

            ^CF0,30
            ^FO20,30^FD${itemDataDict.article_number}^FS

            ^CF0,25
            ^FO20,75^FD${itemDataDict.type} ^FS

            ${zplItemProperties}
            
            ^FO240,20^BQN,2,7
            ^FDLA,Art:${itemDataDict.article_number}^FS
            ^PQ${numOfCopies}

            ^XZ
        `
    }

    const getPrinterStatus = (zebraPrinter)=>{
        return new Promise((resolve,reject)=>{
            try{
                zebraPrinter.getStatus(
                    (status:any)=> resolve(status),
                    (err:any) => reject(err)
                )
            }catch(err){
                reject(err)
            }

        })
    }

    const sendPrintJob= async (zpl,getStatus) =>{
       

         


        return new Promise ((resolve)=>{
            printer.current.sendThenRead(zpl,
                async(data)=>{
                   
                   
                    setIsPrinterConnected('connected')
                    if(getStatus){
                        
                        zebraPrinter.current = new BrowserPrint.Zebra.Printer(printer.current)
                       
                        const status = await getPrinterStatus(zebraPrinter.current)
                        
                        if(!status.isPrinterReady()){  
                            const printMessage = 'Printer not ready: ' + status.getMessage()
                            showMessage({status:400,message:printMessage})
                            setIsPrinterConnected('connected')
                            resolve(false)
                        }
                    }
                    
                   
                    resolve(true)},

                async(err)=>{
                    console.log(err,'error in plrint job')
                    setIsPrinterConnected('error')
                    printer.current = null
                    zebraPrinter.current = null
                    showMessage({status:400,message:'No printer connected.',complementMessage:'Check that the current device has bluetooth on. And that the Browser Printer app is open'})
                    
                    resolve(false)
                }

            )
        })
    }
   

    const printLabel = async (selectedItemData=null,getStatus=true)=>{
            try{
               
                if(isPrinterConnected == 'connecting'){
                    showMessage({status:400,message:'Connection is on progress..',complementMessage:'Maybe you are missing to confirm on permissions? Check device notification and search for Browser Print "Access Request" '})
                    return {success:false}
                }
                setIsPrinterConnected('connecting')
                
                if(!printer.current){
                     printer.current = await new Promise((resolve,reject)=>{
                        BrowserPrint.getDefaultDevice(
                            "printer",
                            (p:any) =>(p? resolve(p): reject('No Printer Found')),
                            (err:any)=> {
                                        showMessage({status:400,message:String(err),complementMessage:'Check that the app Browser Printer is open on the background, And click on "allow" when ask for permissions. If you selected Denied Permissions you can retry the print job and allow next time. If you selected yes for Block Domain, then you will have to enter the Browser print app and remove the block permission '})
                                        ;reject(err)
                            }
                        )
                    })
                    
                }
               
            
                
                
                const zplLabel = generateLabel(selectedItemData)

                const job = await sendPrintJob(zplLabel,getStatus)
                if(!job){
                    printer.current = null
                    zebraPrinter.current = null
                    
                    return {success:false} 
                }   

                return {success:true}
                
            }catch(err){
                printer.current = null
                console.log('catch error')
                console.log(err)
                setIsPrinterConnected('error')
                showMessage({status:400,message:'No printer connected.',complementMessage:'Check that the current device has bluetooth on. And that the Browser Printer app is open'})
                return {success:false} 

            }
     
    }


   

    return { 
        printLabel,
        isPrinterConnected,

    };
}
 
export default usePrintLableWiFi;