import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import '../css/containers.css'
import useFetch from '../hooks/useFetch.tsx'

import UserIcon from '../assets/icons/UserIcon.svg?react'
import {useState,useEffect,useContext,useRef} from 'react'

import SecondaryPage from '../components/secondary-page.tsx'
import LoaderDots from '../components/LoaderDots.tsx'

import UserSettingsSlide from '../components/user-settings.tsx'
import {useNavigate} from 'react-router-dom'
import {ServerMessageContext} from '../contexts/ServerMessageContext.tsx'
import {LiveCamera,ImagePreviewSlider,makeImageUrl} from '../componentsV2/CameraBtn.tsx'
import {useUploadImage} from '../hooks/useUploadImage.tsx'

const AccountPage = () => {
    const navigate = useNavigate()
    const {doFetch} = useFetch()
    const [formData, setFormData] = useState({})
   
    const [imagePage,setImagePage] = useState(false)
    const [settingsPage,setSettingsPage] = useState(false)
    const [user,setUserData] = useState({})
   
    const {showMessage} = useContext(ServerMessageContext)
    const imageBlobs = useRef([])
    const userHadImageUpload = useRef([])
    const [loadingUserPage,setLoadingUserPage] = useState(false)
    const {deleteImageS3,UploadImage} = useUploadImage()
    

    
    useEffect(()=>{
       
        setLoadingUserPage(true)

        doFetch({
            url:'/api',
            method:'POST',
            body:{'requested_data':['username','email','phone','profile_picture','id',{'roles':['role']}]}
        })
        .then( res =>{
           
            if(res && res.status < 400 && res.body.length > 0){
                
                setUserData(res.body[0])
                let addingFetchImage = []
                if(res.body[0].profile_picture && res.body[0].profile_picture !== '' ){
                    addingFetchImage = [res.body[0].profile_picture]
                    userHadImageUpload.current = addingFetchImage
                }
                setFormData({'images':addingFetchImage})
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
            if(imageBlobs.current.lenght > 0){
                imageBlobs.forEach(blob => URL.revokeObjectURL(blob))
            }
        }
    },[])

    const handleChange = (e) =>{
        const {name,value} = e.target
        
        
        setFormData(prev => ({...prev, [name]:value}))
        
    }

    const handleFormSubmition = async (e) =>{
        setLoadingUserPage(true)
        const dataToBeUpload = {...formData}
        if(formData.images.length > 0 && typeof formData.images[0] == 'object'){
            
            console.log(formData,'in if')
            if(userHadImageUpload.current.length > 0){
                
                await deleteImageS3(userHadImageUpload.current)
            }
            const imagesToUpload = formData.images
            await UploadImage(imagesToUpload,'profiles_pictures')
            console.log(imagesToUpload)
            if(imagesToUpload[0].isUpload){
                dataToBeUpload['profile_picture'] = imagesToUpload[0].url
                
            }

        }
        
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
            setRules:setRules})
        setLoadingUserPage(false)
    }
    const handlePictureClosing = ()=>{
      
        setImagePage(false)

    }
    const handleLogOut = async() =>{
        const setRules = {'loadServerMessage':true}
        
        doFetch({
            url:'/api/logout',
            method:'POST',
            body:{},
            setRules:setRules}).then(res => {
           
            localStorage.removeItem('user')
            navigate('/login')
            
        })
        
        
        
    }
    
    
    
    return ( 
    <div className="page items-center ">
        {loadingUserPage  && 
            <div className="flex-column gap-1 items-center content-center" style={{position:'fixed',top:'0',left:'0',height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)',zIndex:10}}>
                
                    <span className="text-15">Loading </span>
                    <LoaderDots mainBg={''}/>
                
                
            </div>
        }

        { imagePage && 
            <SecondaryPage 
                BodyComponent={user.images && user.images.length > 0 ? ImagePreviewSlider : LiveCamera}
                bodyProps={{props:{
                    listOfImages: user.images && Array.isArray(user.images) ? user.images : [],
                    setData:setFormData,
                    allowOnlyOnePicture:true
                }}}
                handleClose={()=>{handlePictureClosing()}}
            />
            }


        { settingsPage && <SecondaryPage
                            BodyComponent={UserSettingsSlide}
                            bodyProps={{}}
                            handleClose={()=>{setSettingsPage(false)}}
                            />}
        <div className="flex-row width100 padding-05 padding-top-10">
            <div 
                className='btn push-right svg-18'
                onClick={()=>{setSettingsPage(true)}}
            >
                <ThreeDotMenu />
            </div>
        </div>


        <div className="flex-column items-center width100 gap-2">
            <div 
            className="circular-picture-container"
            onClick={()=>{setImagePage(true)}}
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
        

    </div> );
}
 
export default AccountPage;