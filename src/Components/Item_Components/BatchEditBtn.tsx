import EditIcon from  '../../assets/icons/General_Icons/EditIcon.svg?react'

interface propsBatchEditBtn{
    setToggleBatchEdit: React.Dispatch<React.SetStateAction<boolean>>
    selectedItems: Record<string,any>
    alsoDo?: ()=>void |null
    setNextPage: ()=>void 
}

const BatchEditBtn: React.FC<propsBatchEditBtn> =({setToggleBatchEdit,selectedItems,alsoDo=null,setNextPage})=>{
    if(Object.keys(selectedItems).length == 0) return
    return(
         <div  className="flex-column content-center ">
                <div className=" btn svg-18" 
                    onClick={()=>{setToggleBatchEdit(true); setNextPage();alsoDo && alsoDo()}}
                >
                    <EditIcon/>
                </div>
            </div>
    )
}

export default BatchEditBtn