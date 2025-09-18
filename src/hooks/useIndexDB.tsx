

export function openOfflineDB(){
    return new Promise((resolve,reject) =>{
        const request = indexedDB.open('PurchasedAppOfflineDB',1)

        request.onupgradeneeded = (e) =>{
            const db = e.target.result
            if(!db.objectStoreNames.contains('failedItems')){
                db.createObjectStore("failedItems",{keyPath:"id",autoIncrement:true})
            }
        }
        request.onsuccess = (e) => resolve(e.target.result) 
        request.onerror = (e) => reject(e.target.error)

    })
}

export async function saveFailedItem(itemDict){
    const db = await openOfflineDB()
    
    return new Promise((resolve,reject)=>{
        const tx = db.transaction("failedItems","readwrite")
        const store = tx.objectStore("failedItems")
        const request = store.add(itemDict)
        
        request.onsuccess = (e) =>{
            const id = e.target.result
            resolve(id)
        }
        request.onerror = (err) =>{
            reject(err)
        }

    })
    

    

}

export async function updateFailedItem(id,itemDict){
    const db = await openOfflineDB()
    return new Promise((resolve,reject) =>{
        const tx = db.transaction('failedItems','readwrite')
        const store = tx.objectStore('failedItems')
        const putRequest = store.put({...itemDict,id})
        putRequest.onsuccess = () => resolve(true)
        putRequest.onerror = (err)=> reject(err)    
    })
    
}


export async function getFailedItems(){
    const db = await openOfflineDB()
    return new Promise((resolve)=>{
        const tx = db.transaction("failedItems","readonly")
        const store = tx.objectStore("failedItems")
        const request = store.openCursor()
        const results = []
        request.onsuccess = (e) => {
            const cursor = e.target.result
            if(cursor){
                const {id,originalId,...rest} = cursor.value
                
                results.push({ ...rest, offlineIndexKey:id, 
                    ...(originalId !== undefined ? {id:originalId} : {})
                })
                cursor.continue()
            }else{
                resolve(results)
            }
        }
    })
}

export async function clearFailedItem(id){
    const db = await openOfflineDB()
    const tx = db.transaction('failedItems','readwrite')
    tx.objectStore("failedItems").delete(id)
    return tx.complete
}

export async function getStoreCount(){
    const db = await openOfflineDB()
    const tx = db.transaction("failedItems",'readwrite')
    const store = tx.objectStore("failedItems")
    return new Promise((resolve,reject) =>{
        const countRequest = store.count()
        countRequest.onsuccess = () => resolve(countRequest.result)
        countRequest.onerror = () => reject(countRequest.error)
    })
}