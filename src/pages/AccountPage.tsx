import ThreeDotMenu from '../assets/icons/ThreeDotMenu.svg?react'
import '../css/containers.css'
import useFetch from '../hooks/useFetch.tsx'
import LoadingPage from '../components/loading.tsx'
import UserIcon from '../assets/icons/UserIcon.svg?react'
import {useState,useEffect,useRef} from 'react'
import ServerMessage from '../components/server-message.tsx'
import SecondaryPage from '../components/secondary-page.tsx'
import {LiveVideo} from '../components/live-video.tsx'
import UserSettingsSlide from '../components/user-settings.tsx'
import {useNavigate} from 'react-router-dom'

const AccountPage = () => {
    const navigate = useNavigate()
    const {serverMessageDict,data,loading,error,doFetch,setServerMessageDict} = useFetch()
    const [formData, setFormData] = useState({})
   
    const [imagePage,setImagePage] = useState(false)
    const [settingsPage,setSettingsPage] = useState(false)
    const user = data?.[0]
    const onDismiss = () => setServerMessageDict(null)
    const [listOfImages,setListOfImages] = useState<string[]>([])
    

   
    useEffect(()=>{
       
        const setRules = {'loadData':true}
        doFetch('/api','POST',{'requested_data':['username','email','phone','profile_picture','id',{'roles':['role']}]},setRules)
    },[])

    const handleChange = (e) =>{
        const {name,value} = e.target
        
        
        setFormData(prev => ({...prev, [name]:value}))
        
    }

    const handleFormSubmition = (e) =>{
        
        if (listOfImages.length > 0){
            formData['profile_picture'] = listOfImages[0] 
        }
        
        let fetchBody = { 
            'model_name':'User',
            'object_values':{'update_type':'first_match','values':formData,'query_filters':{'id':user?.id}},
            'reference':'user' }
        const setRules = {'loadServerMessage':true}
        doFetch('/api/schemes/update_items','POST',fetchBody,setRules)
        
    }
    const handlePictureClosing = ()=>{
        if(listOfImages.length > 0){
            user.profile_picture = listOfImages[0]
        }else{
            
            user.profile_picture = data[0].profile_picture
            
            
        }
        setImagePage(false)

    }
    const handleLogOut = async() =>{
        const setRules = {'loadServerMessage':true}
        
        doFetch('/api/logout','POST',null,setRules)
        navigate('/login')
        
    }
    
    
    
    return ( 
    <div className="page items-center gap-4">
        {loading && <LoadingPage />}
        {serverMessageDict && <ServerMessage messageDict={serverMessageDict} onDismiss={onDismiss} />}
        { imagePage && <SecondaryPage 
            BodyComponent={LiveVideo}
            bodyProps={{listOfImages,setListOfImages}}
            handleClose={()=>{handlePictureClosing()}}/>}
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
                {user?.profile_picture ? 
                <img src={user.profile_picture}  alt="" /> 
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

            <div className="flex-column width100 padding-top-40">

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
                        <input type="password" name='password'  defaultValue='dummy password'
                            onChange={handleChange}/>
                    </div>
                </div>
            </div>
            <div className='flex-column padding-10 width100'>
                <span className="color-lower-titles text-15">Roles:</span>
                 <div className='flex-row  padding-10'>
                    {user?.roles.map((r,i)=>{
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