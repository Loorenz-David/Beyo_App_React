import {useState,useEffect,useContext,useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import {ServerMessageContext} from '../../../contexts/ServerMessageContext.tsx'
import {useSlidePage} from '../../../contexts/SlidePageContext.tsx'
import {DataContext} from '../../../contexts/DataContext.tsx'

import UserIcon from '../../../assets/icons/General_Icons/UserIcon.svg?react'
import ThreeDotMenu from '../../../assets/icons/General_Icons/ThreeDotMenu.svg?react'

import {LiveCamera,ImagePreviewSlider,makeImageUrl} from '../../Item_Components/CameraBtn.tsx'
import {SlidePage} from '../../Page_Components/SwapToSlidePage.tsx'

import LoaderDots from '../../Loader_Components/LoaderDots.tsx'


import {useUploadImage} from '../../../hooks/useUploadImage.tsx'
import useFetch from '../../../hooks/useFetch.tsx'

import type {PictureDict} from '../../../types/PictureDict.ts'
import type {UserDict} from '../../../types/UserDict.ts'




type ExtendedUserForm = Partial<UserDict> &{
    images:PictureDict[] | string[]
    password?:string
}

interface UserProfileProps{
    userDict:UserDict
}

const UserProfileSettings = ()=>{
    console.log('in setting of user')
    return(
        <div className=" flex-column width100 items-center content-center" style={{height:'100vh'}}>
            Comming Soon!
        </div>
    )
}


const UserProfile = ({userDict}:UserProfileProps) => {
    
    const {showMessage} = useContext(ServerMessageContext)
    const {slidePageTo,currentPageIndex} = useSlidePage()
    const navigate = useNavigate()
    console.log(currentPageIndex,'in user profile')

    const [user,setUserData] = useState<UserDict>(userDict)
    const [loadingUserPage,setLoadingUserPage] = useState(false)

    const imageBlobs = useRef<string[]>([])
    const userHadImageUpload = useRef<string[]>(userDict.profile_picture && userDict.profile_picture !== '' ? [userDict.profile_picture] : [])

    const {deleteImageS3,UploadImage} = useUploadImage()
    const {doFetch} = useFetch()
    const [formData, setFormData] = useState<ExtendedUserForm>({'images':userDict.profile_picture && userDict.profile_picture !== '' ? [userDict.profile_picture] : []})
    const [NextPage,setNextPage] = useState<React.ReactNode>()
    
    
    
    useEffect(()=>{
       
        setLoadingUserPage(true)

        doFetch({
            url:'/api',
            method:'POST',
            body:{'requested_data':['email','phone']}
        })
        .then( res =>{
           
            if(res && res.status < 400 && res.body.length > 0){
                
                setUserData(prev =>({...prev,...res.body[0]}))

               
            }else{
                showMessage({
                    message:'Unable to load data',
                    complementMessage:'Unable to load user data, server could be down, or you are missing internet connection.',
                    status:400

                })
            }
            setLoadingUserPage(false)
        })
        
        return ()=>{
            if(imageBlobs.current.length > 0){
                imageBlobs.current.forEach((blob) => URL.revokeObjectURL(blob))
            }
        }
    },[])


    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target
        
        setFormData(prev => ({...prev, [name]:value}))
        
    }

    const handleFormSubmition = async () =>{
        
        setLoadingUserPage(true)

        const dataToBeUpload:{
            images?:PictureDict[] | string[]
            profile_picture?:string
            username?:string
            password?:string
            
        } = {...formData}

        if( dataToBeUpload.images && dataToBeUpload.images.length > 0 && typeof dataToBeUpload.images[0] == 'object'){
            
            
            if(userHadImageUpload.current.length > 0){
                
                await deleteImageS3(userHadImageUpload.current)
            }
            const imagesToUpload:PictureDict[] | string[] = dataToBeUpload.images
            await UploadImage(imagesToUpload,'profiles_pictures')
            
            if(!(typeof imagesToUpload[0] == 'string')){
                 if(imagesToUpload[0].isUpload){
                    dataToBeUpload['profile_picture'] = imagesToUpload[0].url
                    
                }
            }
           

        }
        console.log(dataToBeUpload,'the data that will be uploaded')
        delete dataToBeUpload['images']
        
        if(Object.keys(dataToBeUpload).length == 0){
            showMessage({
                message:'No changes detected',
                status:400
            })
            setLoadingUserPage(false)
            return
        }
        let fetchBody = { 
            'model_name':'User',
            'query_filters':{'id':user.id},
            'update_type':'first_match',
            'object_values':dataToBeUpload,
            'reference':'user' }
        const setRules = {'loadServerMessage':true}
        
        doFetch({
            url:'/api/schemes/update_items',
            method:'POST',
            body:fetchBody,
            setRules:setRules}).then(res =>{
                if(res.status == 201){
                    const updateLocalDict:{username?:string,profile_picture?:string} = {}
                    if(dataToBeUpload.username){
                        updateLocalDict['username'] = dataToBeUpload.username
                    }
                    if(dataToBeUpload.profile_picture){
                        updateLocalDict['profile_picture'] = dataToBeUpload.profile_picture
                    }
                    console.log('the dict that will be updated in local',updateLocalDict)
                    localStorage.setItem('user',JSON.stringify({...userDict,...updateLocalDict}))
                }
            })
        setLoadingUserPage(false)

    }
    
    const handleLogOut = async() =>{
        const setRules = {'loadServerMessage':true}
        
        doFetch({
            url:'/api/logout',
            method:'POST',
            body:{},
            setRules:setRules
        })
        .then((res) => {
           
            if(res.status == 200){
                slidePageTo({directPage:0})

                localStorage.removeItem('user')
                navigate('/login')
                
                
               
            }
        })
        
        
        
    }
    
    console.log(formData,'the form data ')
    
    return ( 
        <DataContext.Provider value={{data:formData,setData:setFormData}}>
            <div className="page items-center ">
                
                {loadingUserPage  && 
                    <div className="flex-column gap-1 items-center content-center" style={{position:'fixed',top:'0',left:'0',height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)',zIndex:10}}>
                        
                            <span className="text-15">Loading </span>
                            <LoaderDots mainBg={''}/>
                        
                        
                    </div>
                }

            

                {NextPage && 
                    <SlidePage
                        BodyComponent={NextPage}
                    />
                }
            
                <div className="flex-row width100 padding-05 padding-top-10">
                    <div 
                        className='btn push-right svg-18'
                        onClick={()=>{
                            setNextPage(<UserProfileSettings/>)
                            
                            slidePageTo({addNumber:1})
                            
                        }}
                    >
                        <ThreeDotMenu />
                    </div>
                </div>


                <div className="flex-column items-center width100 gap-2">
                    <div 
                    className="circular-picture-container"
                    onClick={()=>{
                        let TargetComp:React.ReactNode;
                        let listOfImages:ExtendedUserForm['images'] = formData.images;
                        
                        const slidePageProps:any = {addNumber:1}
                        

                        if(listOfImages.length > 0){
                            TargetComp = <ImagePreviewSlider props={{allowOnePicture:true}}/>
                            
                        }else{
                            TargetComp = <LiveCamera props={{allowOnePicture:true}}/>
                            slidePageProps['setClosePage'] = setNextPage
                        }

                        setNextPage( 
                            TargetComp
                        )
                        slidePageTo(slidePageProps)

                    }}
                    >
                        {'images' in formData && formData.images && formData.images.length > 0 ? 
                        <img src={makeImageUrl(formData.images[0],imageBlobs)}  /> 
                        :
                        <div  className="svg-40 flex-row width100 height100 flex-1 content-center items-center" >
                            <UserIcon />
                        </div>
                        
                        }
                        
                    </div>
                    <div className="flex-row gap-1 border-bottom padding-05">
                        <input  type="text" name="username" className="text-25 text-center width-150"
                                defaultValue={user?.username ||  ''}
                                onChange={handleChange} />
                    </div>

                    <div className="flex-column width100 padding-top-10">

                        <div className="flex-row  border-bottom border-top">
                            <div className="flex-column width100   gap-05 padding-10 ">
                                <span className="color-lower-titles">Email:</span>
                            
                                    <input type="text" name='email'  className='width100'
                                        defaultValue={user?.email || ''}
                                        onChange={handleChange}/>
                                
                                
                            </div>
                            <div className="vertical-line "></div>
                            <div className="flex-column  width100 gap-05 padding-10">
                                <span className="color-lower-titles">Phone:</span>
                                <input type="text" name='phone'  className='width100'
                                        defaultValue={user?.phone || ''}
                                        onChange={handleChange}/>
                            </div>
                        </div>

                        <div className="flex-row border-bottom  padding-15">
                            <div className="flex-column gap-05">
                                <span className="color-lower-titles">Password:</span>
                                <input type="password" name='password'  defaultValue='dummy-password'
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div className='flex-column padding-10 width100'>
                        <span className="color-lower-titles text-15">Roles:</span>
                        <div className='flex-row  padding-10'>
                            {user.roles && user?.roles.map((r,i)=>{
                                return (
                                        <div key={`${r}_${i}`} className='static-info-border padding-10'>
                                            {r.role}
                                        </div>
                                )
                            }) || ''}
                        
                        </div>
                    </div>

                </div>
                <div className="flex-column gap-2 push-bottom width100">
                
                <div className="flex-row padding-10 padding-left-20 padding-right-20 content-center">
                        <div className="btn width100 bg-containers border-blue  padding-top-10 padding-bottom-10"
                            onClick={handleFormSubmition}   >
                                    Save
                        </div>
                    </div>
                    
                    <div className="flex-row content-center">
                        <div className="btn " style={{color:'rgba(231, 66, 66, 1)',}}
                            onClick={()=>{handleLogOut()}}
                        >
                            Log out
                        </div>
                    </div>
                </div>
                
             
            </div> 
        </DataContext.Provider>
    )
}
 
export default UserProfile;