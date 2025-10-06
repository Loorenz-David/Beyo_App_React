import {useState,useRef,useEffect,useContext } from 'react'

import SearchIcon from '../../../assets/icons/General_Icons/SearchIcon.svg?react'
import FilterIcon from '../../../assets/icons/General_Icons/FilterIcon.svg?react'
import AddUserIcon from '../../../assets/icons/General_Icons/AddUserIcon.svg?react'


import {useSlidePage} from '../../../contexts/SlidePageContext.tsx'
import {useData,DataContext} from '../../../contexts/DataContext.tsx'

import {SlidePage} from '../../Page_Components/SwapToSlidePage.tsx'
import {UserProfilePicture} from './UserProfilePicture.tsx'
import UserProfile from './UserProfile.tsx'

import type {UserDict} from '../../../types/UserDict.ts'

import useFetch from '../../../hooks/useFetch.tsx'
import { ServerMessageContext } from '../../../contexts/ServerMessageContext.tsx'

const UserFiltersPage = ()=>{
    return(
        <div className="flex-column width100" >
            coming ...
        </div>
    )
}

const HeaderSearch = ({
    setNextPageMain,
    setForceRender
}:{
    setNextPageMain: React.Dispatch<React.SetStateAction<React.ReactNode>>,
    setForceRender: React.Dispatch<React.SetStateAction<boolean>>
})=>{

    const [ activeInputSearch, setActiveInputSearch ] = useState(false)
    

    const {slidePageTo} = useSlidePage()

     


    return(
        <div className="flex-row width100 bg-primary" 
            style={{padding:'5px 10px',position:'fixed',top:'0',left:'0', boxShadow:'0 0 10px rgba(0,0,0,0.2)',zIndex:2}} 
        >
           
            

            <div className={`flex-row width100 bg-primary ${activeInputSearch && 'bg-containers'}`}
                style={{borderRadius:'5px'}}
            >
                <div className="flex-row width100 " style={{padding:'0 15px'}}>
                    <input type="text" 
                        className="width100"
                        style={{display: activeInputSearch ? 'block' : 'none',}}
                    />
                </div>
                <div className="flex-row ">
                    <div className="flex-column svg-18 btn" style={{padding:'10px'}}
                        onClick={()=>{setActiveInputSearch(prev => !prev)}}
                    >
                        <SearchIcon/>
                    </div>
                    <div className="flex-column svg-15 btn" style={{padding:'10px'}}
                        onClick={()=>{
                            setNextPageMain(<UserFiltersPage/>)
                            slidePageTo({addNumber:1})
                        }}
                    >
                        <FilterIcon/>
                    </div>

                     <div className="flex-column svg-18 btn"
                        onClick={()=>{

                                const emptyUser:UserDict = {   
                                    username: '',
                                    email: '',
                                    phone: '',
                                    roles: [],
                                    profile_picture: '',
                                    password: ''
                                };
                            setNextPageMain( 
                            <UserProfile key={new Date().getTime()}
                                            userDict={emptyUser}
                                            isCreateMode={'create-new'}
                                            setForceRender={setForceRender}
                                            setNextPageMain={setNextPageMain}
                                        />
                            )
                            slidePageTo({addNumber:1})
                        }}
                    >
                        
                        <AddUserIcon/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}


const UserPill = ({
    user,
    setNextPage
}:{
        user:UserDict, 
        setNextPage:(user:UserDict) => void
    }
) =>{
    

    return(
        <div className="flex-row width100 items-center gap-2 border-bottom" style={{padding:'15px '}}
            onClick={()=>{setNextPage(user)}}
        >
           <UserProfilePicture props={{
                profilePicture:user.profile_picture,
                height:50,
                width:50
           }}
           />

            <div className="flex-row">
                <span className="text-15">
                    {user.username}
                </span>
            </div>
        </div>
    )
}

const ManageRoles = ({selectedRoles})=>{
    
    return(
        <div className="flex-column widht100" style={{height:'100vh'}}>
            in roles
        </div>
    )
}

const EditUsers = ({user}:{user:UserDict}) =>{
    const [NextPage,setNextPage] = useState<React.ReactNode>(null)
    const {slidePageTo} = useSlidePage()
    const [userData,setUserData] = useState<Partial<UserDict>>({})

    const handleInputField = (e:React.ChangeEvent<HTMLInputElement>,propName:string) =>{
        const value = e.target.value
        if(value !== ''){
            setUserData(prev =>({...prev,[propName]:value}))
        }

    }

    return(
        <div className="width100 flex-column gap-4" style={{height:'100vh'}}>
            {NextPage &&
                <SlidePage BodyComponent={NextPage}/>
            }

            <div className="flex-row padding- width100 padding-10" >
                <div className="flex-row width100 gap-2 items-center bg-containers " style={{borderRadius:'10px',padding:'15px 10px'}}>
                    <UserProfilePicture props={{
                        profilePicture:user.profile_picture,
                        height:80,
                        width:80
                    }}/>
                    <div className="flex-row" >
                        <input style={{maxWidth:'200px'}} className="text-25 bold-600" type="text" defaultValue={user.username}
                            onChange={(e)=>{handleInputField(e,'username')}}
                        />
                    </div>
                    
                </div>
            </div>

            <div className="flex-column">
                <div className="flex-row border-bottom border-top">
                    <div className="flex-column gap-1 padding-10">
                        <span className=" color-lower-titles">
                         Email:
                        </span>
                        <input type="text" 
                            defaultValue={user.email}
                            onChange={(e)=>{ handleInputField(e,'email') }}
                        />
                    </div>
                    <div className="vertical-line"></div>
                    <div className="flex-column gap-1 padding-10">
                        <span className=" color-lower-titles">
                         Phone:
                        </span>
                        <input type="text" 
                            defaultValue={user.phone}
                            onChange={(e)=>{ handleInputField(e,'phone') }}
                        />
                    </div>
                </div>
                 <div className="flex-row border-bottom">
                    <div className="flex-column gap-1 padding-10">
                        <span className=" color-lower-titles">
                         Password:
                        </span>
                        <input type="password" 
                            defaultValue={'dummy password'}
                            onChange={(e)=>{ handleInputField(e,'password') }}
                        />
                    </div>
                </div>
                <div className="flex-column width100 padding-top-40 gap-2 padding-10"
                    onClick={()=>{
                        setNextPage(<ManageRoles selectedRoles={user.roles}/>) 
                        slidePageTo({addNumber:1})
                    }}
                >
                    <span className=" text-15">Roles:</span>
                    <div className="width100"
                        style={{display:'grid',gap:'40px', gridTemplateColumns:'repeat(4,1fr)',justifyContent:'space-between'}}
                    >
                        {user.roles.map((role,i)=>{
                            return(
                                <div key={`${role.id}_${i}`} className="flex-row bg-containers  content-center"
                                    style={{borderRadius:'10px',padding:'10px 15px'}}
                                >
                                    <span className="text-15">{role.role}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex-column push-bottom gap-1 padding-bottom-30">
                <div className="flex-row width100 padding-10">
                    <button className="btn bg-secondary width100 padding-15">
                        <span className="text-15 color-primary">Save Changes</span>
                    </button>
                </div>
                <div className="flex-row width100 padding-10">
                    <button className="btn  width100 padding-15" style={{border:'0.5px solid rgba(202, 97, 97, 1)'}}>
                        <span className="text-15 " style={{color:'rgba(202, 97, 97, 1)'}}>Delete user</span>
                    </button>
                </div>
            </div>
        </div>
    )
}





const UsersList = ({
    setNextPageMain,
    setForceRender
}:{
    setNextPageMain: React.Dispatch<React.SetStateAction<React.ReactNode>>,
    setForceRender: React.Dispatch<React.SetStateAction<boolean>>
}
)=>{
    const {data} = useData()
    const {slidePageTo} = useSlidePage()
    const [usersRoleCluster,setUsersRoleCluster] = useState<Record<string,React.JSX.Element[]>>({})
    
    // useEffect(()=>{
    //     if(user){

    //     }
    // },[])
    
    const handleUserSelection = (user:UserDict)=>{
        
        setNextPageMain(
        <UserProfile 
            key={new Date().getTime()}
            userDict={user}
            setForceRender={setForceRender}
            isCreateMode={'update-existing'}
            setNextPageMain={setNextPageMain}
        />

        )
        slidePageTo({addNumber:1})
    }

    const handleListConstructor = ()=>{
        const usersRoleClusterBuild: Record<string, React.JSX.Element[]> = {} 
        
        for(let i = 0; i < data.length ; i++ ){
            const user:UserDict = data[i]
            if(!user.roles || user.roles.length === 0){
                if(!('No Role' in usersRoleClusterBuild)){
                    usersRoleClusterBuild['No Role'] = []
                }
                usersRoleClusterBuild['No Role'].push(<UserPill key={`${user.id}_NoRole_${i}`} user={user} setNextPage={handleUserSelection} />)
                continue
            }
            user.roles?.forEach((role,j)=>{
                const roleName = role.role
                if(!(roleName in usersRoleClusterBuild)){
                    usersRoleClusterBuild[roleName] = []
                }
                usersRoleClusterBuild[roleName].push(<UserPill key={`${user.id}_${roleName}_${j}_${i}`} user={user} setNextPage={handleUserSelection} />)
            })
        }
        setUsersRoleCluster(usersRoleClusterBuild)
        
    }

    useEffect(()=>{
        
        handleListConstructor()
    },[data])

    return(
        <div className="flex-column gap-2 width100 Y-thin-scrollbar bg-scroll-bar" style={{overflowY:'auto',paddingTop:'70px',position:'relative'}}>
            

            {Object.keys(usersRoleCluster).map((roleName,i)=>{
                return(
                    <div key={`clusterRoles_${roleName}_${i}`} className="flex-column gap-1 padding-20">
                        <span className="text-15">{roleName}</span>
                        <div className="flex-column bg-containers " style={{borderRadius:'10px'}} >
                            {usersRoleCluster[roleName]}
                        </div>
                    </div>
                )
            })}

            <div className="flex-column items-center content-center " style={{position:'fixed',bottom:'20px',left:'20px'}}>
                
            </div>

        </div>
    )
}



const testData:UserDict[] = []
const testRoles = ['Admin', 'Worker', 'Photographer']

for(let i = 0; i<= 10 ; i++ ){
    testData.push({
        username:'David' + i,
        roles:[{role:testRoles[i % testRoles.length]},{role:testRoles[i+1 % testRoles.length]}],
        profile_picture:'https://beyoappv5.s3.amazonaws.com/profiles_pictures/snapshot_1758998977553.webp',
        phone:'+46929292',
        email:'someEmail@test.com',
        id:i
    })
}


export const ManageUsers = ()=>{
    const [usersData,setUsersData] = useState<UserDict[]>([])
    const {doFetch} = useFetch()
    const {showMessage} = useContext(ServerMessageContext)
    const [NextPage,setNextPageMain] = useState<React.ReactNode>(null)
    const [forceRender,setForceRender] = useState(false)
    useEffect(()=>{
       handleFetchUsers()
    },[forceRender])

    const handleFetchUsers = async () =>{
         doFetch({
            url:'/api/schemes/get_items',
            method:'POST',
            body:{
                'model_name':'User',
                'requested_data':['id','username','email','phone',{'roles':['role']},'profile_picture'],
                'query_filters':{}
            }
        }).then(res =>{
            if(res && res.status < 400 && res.body.length > 0){
                setUsersData(res.body)
            }else{
                showMessage({
                    message:'Unable to load data',
                    complementMessage:'Unable to load user data, server could be down, or you are missing internet connection.',
                    status:400
                })
            }
        })
    }

    return (
        <DataContext.Provider value={{data:usersData, setData:setUsersData}}>
            <div className="flex-column width100" style={{height:'100vh'}}>
                {NextPage && 
                    <SlidePage BodyComponent={NextPage}/>
                }
                <HeaderSearch setNextPageMain={setNextPageMain} setForceRender={setForceRender}/>

                <UsersList setNextPageMain={setNextPageMain} setForceRender={setForceRender}/>

            </div>
        </DataContext.Provider>
    )
}