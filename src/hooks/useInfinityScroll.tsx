import {useState,useRef} from 'react'


interface InfiniteScrollProps{
    itemHeight:number
    thressholdItems:number
    nextBatchItems:number
    lastLoad:React.RefObject<boolean>
    handleFetch:(scrolling:'up' | 'down' | '',fetchPerPage:number,itemsListId?:number[]) => Promise<any[]|false>
    dataList:{id:number}[]
    setDataList: React.Dispatch<React.SetStateAction<{id:number}[]>>
}

const useInfiniteScroll = ({itemHeight,thressholdItems,nextBatchItems,lastLoad,handleFetch,dataList,setDataList}:InfiniteScrollProps) => {
    const [ScrollDown_Loading,setScrollDown_Loading] = useState(false)
    const [ScrollUp_Loading,setScrollUp_Loading] = useState(false)
    const lastScroll = useRef(0)
    const removedItems = useRef<number[]>([])


     const handleDataListAdjustment = (scrollType,res)=>{
     
        const newCount = res.length
        let newList:{id:number}[] = []
        if(scrollType == 'down'){
            
            removedItems.current = [...removedItems.current,...dataList.slice(0,newCount).map(obj=>obj.id)]
            newList = [...dataList.slice(newCount),...res]
        }else if(scrollType == 'up'){
            newList = [...res,...dataList.slice(0,-newCount)]
            
            removedItems.current = removedItems.current.slice(0,-newCount)
           
        }

       
        setDataList(newList)


    }
    
  
    const calculateThresshold = (items,itemHeight,clientHeight )=>{
        return (items * itemHeight) -clientHeight
    }
    
    const handleScroll = async(e)=>{

       
        

        
        const target = e.currentTarget
        const {scrollTop,clientHeight} = target

        const thressholdHeight = (thressholdItems * itemHeight) -clientHeight

       
        
       
        
        
        
        if(scrollTop > lastScroll.current ){ // scrolling down 
            if(lastLoad.current){
                return
            }
            
            if(!ScrollDown_Loading && scrollTop >= thressholdHeight){
                setScrollDown_Loading(true)
                const res = await handleFetch('down',nextBatchItems)
                if(res){
                    handleDataListAdjustment('down',res)
                    target.scrollTop = target.scrollTop - (res.length * itemHeight)   
                }else{
                    lastLoad.current = true
                }
                setScrollDown_Loading(false)
               
            }
            

        }else{ // scrolling up
           
            
            if(removedItems.current.length == 0)return;

            const upThresshHold = calculateThresshold(nextBatchItems,itemHeight,clientHeight)
           
            if(!ScrollUp_Loading && scrollTop <= upThresshHold ){
               
                setScrollUp_Loading(true)
                const res = await handleFetch('up',nextBatchItems,removedItems.current.slice(-nextBatchItems))
                if(res){
                    handleDataListAdjustment('up',res)
                    target.scrollTop = target.scrollTop + (res.length * itemHeight)
                    lastLoad.current = false
                }
                setScrollUp_Loading(false)
                
            }
            
           
        }

        lastScroll.current = scrollTop

        
       
        
    }



    return {
            removedItems,
            ScrollDown_Loading,
            ScrollUp_Loading,
            handleScroll,

    };
}
 
export default useInfiniteScroll;