import {useRef,useState} from 'react'

import {useSlidePage} from '../contexts/SlidePageContext.tsx'

import UserIcon from '../assets/icons/General_Icons/UserIcon.svg?react'
import ArrowBold from  '../assets/icons/General_Icons/ArrowBold.svg?react'

import type {UserDict} from '../types/UserDict.ts'
import React from 'react'


import {SlidePage} from '../Components/Page_Components/SwapToSlidePage.tsx'

import UserProfile from '../Components/Menu_Components/Users/UserProfile.tsx'
import {ManageUsers} from '../Components/Menu_Components/Users/ManageUsers.tsx'



const MenuPage = () => {
    const user = useRef<UserDict>(JSON.parse(localStorage.getItem('user') || '{}'))
    const menuPageRef = useRef<HTMLDivElement | null>(null)
    const [NextPageComponent,setNextPageComponent] = useState<React.ReactNode>(null)
    const {slidePageTo} = useSlidePage()
    

    return ( 
        
            <div className="flex-column width100 " style={{minHeight:'100vh'}}
                ref={menuPageRef}
                
            >
                {NextPageComponent && 
                    <SlidePage
                        BodyComponent={NextPageComponent}
                    />
                }
                
                <div className="flex-row  items-center content-center padding-20 ">
                    <div className="flex-row bg-containers  content-center width100 btn" style={{borderRadius:'10px', padding:'0'}}
                        onClick={(e)=>{
                            e.stopPropagation()
                            setNextPageComponent(<UserProfile userDict={user.current}/>)
                            slidePageTo({addNumber:1})
                        }}
                    >
                        <div className="flex-column padding-20 items-center content-center">
                            <div className="flex-row items-center content-center "
                                style={{borderRadius:'50%',height:'80px',width:'80px',overflow:'hidden'}}
                            >
                                {typeof user.current.profile_picture === 'string' && user.current.profile_picture !== '' ?
                                    <img src={user.current.profile_picture }  
                                        style={{objectFit:'cover'}}
                                        className="width100 height100"
                                    />
                                :
                                    <div className="flex-column items-center content-center svg-30 width100 height100" style={{border:'0.5px solid white',borderRadius:'50%'}}>
                                        <UserIcon  />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex-column flex-1 padding-20 height100 gap-1">
                            <div className="flex-row">
                                <span className="text-25 bold-600">
                                    {user.current.username &&
                                    user.current.username.charAt(0).toUpperCase() + user.current.username.slice(1)
                                    }
                                </span>
                            </div>
                            <div className="flex-row">
                                <div className="flex-row items-center content-center  " 
                                    style={{borderRadius:'20px', minWidth:'50px',padding:'5px 8px'}}
                                >
                                    <span className="text-9">Admin</span>
                                </div>
                                {user.current.roles && user.current.roles.map((role)=>{

                                    return(
                                        <div className="flex-row items-center content-center">
                                        <span className="text-9"> {role.role}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* user settings */}
                <div className="flex-row items-center content-center padding-20">
                    <div className="flex-column width100 bg-containers" style={{borderRadius:'10px'}}>
                        <div className="flex-row border-bottom padding-10 gap-2"
                            onClick={()=>{
                                setNextPageComponent(<ManageUsers/>)
                                slidePageTo({directPage:1})
                            }}
                        >
                            <div className="flex-row items-center content-center svg-20">
                                <UserIcon/>
                            </div>
                            <span className="text-15">Manage Users</span>
                            <div className="flex-row push-right svg-20"
                                style={{transform:'rotate(-90deg)'}}
                            >
                                <ArrowBold  />
                            </div>
                            
                        </div>
                        <div className="flex-row  padding-10 gap-2">
                            <div className="flex-row items-center content-center svg-20">
                                <UserIcon/>
                            </div>
                            <span className="text-15">Manage Roles</span>
                            <div className="flex-row push-right svg-20"
                                style={{transform:'rotate(-90deg)'}}
                            >
                                <ArrowBold  />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats settings */}
                 <div className="flex-row items-center content-center padding-20">
                    <div className="flex-column width100 bg-containers" style={{borderRadius:'10px'}}>
                        <div className="flex-row border-bottom padding-10 gap-2">
                            <div className="flex-row items-center content-center svg-20">
                                <UserIcon/>
                            </div>
                            <span className="text-15">Coming soon</span>
                            <div className="flex-row push-right svg-20"
                                style={{transform:'rotate(-90deg)'}}
                            >
                                <ArrowBold  />
                            </div>
                            
                        </div>
                        <div className="flex-row  padding-10 gap-2">
                            <div className="flex-row items-center content-center svg-20">
                                <UserIcon/>
                            </div>
                            <span className="text-15">Coming soon</span>
                            <div className="flex-row push-right svg-20"
                                style={{transform:'rotate(-90deg)'}}
                            >
                                <ArrowBold  />
                            </div>
                        </div>
                        <div className="flex-row  padding-10 gap-2">
                            <div className="flex-row items-center content-center svg-20">
                                <UserIcon/>
                            </div>
                            <span className="text-15">Coming soon</span>
                            <div className="flex-row push-right svg-20"
                                style={{transform:'rotate(-90deg)'}}
                            >
                                <ArrowBold  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       
     );
}
 
export default MenuPage;