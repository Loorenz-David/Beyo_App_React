
import useFetch from './useFetch.tsx'


export function useUploadImage(){
    const {apiFetch} = useFetch()

    async function generatePresignedUrl(listOfImages){
    
    
    const resUrls = await apiFetch({
        endpoint:'/api/generate-presigned-url',
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(listOfImages),
        credentials:'include'
        })
    const urlResponse =  await resUrls.json()
    
    return urlResponse
    }

    async function uploadImagesS3(listOfImages){
    
        
        for (let i=0; i < listOfImages.length ;i++){
            let targetDict = listOfImages[i]

            if(targetDict.isUpload) {
                
                continue
            }

            const upload = await fetch(targetDict.url,{
                
                method:'PUT',
                headers:{'Content-Type':'image/webp'},
                body:targetDict.file
            })
            
            listOfImages[i]['isUpload'] = upload.ok
            listOfImages[i]['url'] = targetDict['url'].split('?')[0]
    
        }
        return listOfImages
    
    

    }

    async function deleteImageS3(listOfUrls){


        try{
            const fetchDict = {'urls':listOfUrls}

            const response =  await apiFetch({
                endpoint:'/api/delete-image-url',
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(fetchDict),
                credentials:'include'
            })
            
            const result = await response.json()
            
            
            return result
            
                

        }catch(err){
            console.log('error deleting images from s3 cloud')
            console.log(err)
            return {status:400,body:[]}
        }
        
    }

    async function UploadImage(listOfImages,filePath,attempt=1){
        
        if(attempt == 4){
            return listOfImages
        }

        let buildListForSignature = []

        for(const obj of listOfImages){
            if(!obj.isUpload){
                buildListForSignature.push({'fileName': obj.file.name, 'filePath':filePath, 'fileType':obj.file.type})
            }
        }
    

        if(buildListForSignature.length == 0){
            return listOfImages
        }

        const presignedUrls = await generatePresignedUrl(buildListForSignature)

        if(!presignedUrls || presignedUrls.status == 400){
            return 'error'
        }

        listOfImages.forEach(obj =>{
            if(!obj.isUpload){
                const targetDict = presignedUrls.body.filter(objURL=> objURL.fileName === obj.file.name)
                obj['url'] = targetDict[0].url
            }
        })


        await uploadImagesS3(listOfImages)

        
        
        return listOfImages
        
        

    }

    return {deleteImageS3,UploadImage}
}
