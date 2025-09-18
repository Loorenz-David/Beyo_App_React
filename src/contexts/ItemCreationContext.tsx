import {createContext,useContext,useState,ReactNode} from 'react'

type ItemData = Record<string,any>

interface ItemCreationContextType{
    itemData:ItemData
    setItemData:(data:ItemData) => void
    updateItemData:(updates:Partial<ItemData>) => void
}
const ItemCreationContext = createContext<ItemCreationContextType | undefined>(undefined)

export const useItemCreation = () =>{
    const context = useContext(ItemCreationContext)
    if(!context){
        throw new Error('UseItemCreation must be used within an ItemCreationProvider')
    }
    return context
}

export const  ItemCreationProvider = ({children}:{children:ReactNode}) =>{
    const [itemData,setItemData] = useState<ItemData>({})

    const updateItemData = (updates: Partial<ItemData>) =>{
        setItemData(prev => ({...prev, ...updates}))
    }
    return (
        <ItemCreationContext.Provider value={{itemData,setItemData,updateItemData}} >
            {children}
        </ItemCreationContext.Provider>
    )

}