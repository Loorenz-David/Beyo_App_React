import UserIcon from '../../../assets/icons/General_Icons/UserIcon.svg?react'

interface ProfilePictureProps {
    profilePicture:string | null
    height:number
    width:number
}

export const UserProfilePicture = ({props}:{props:ProfilePictureProps})=>{

    return(
         <div className="flex-column items-center content-center"
                style={{overflow:'hidden', height:`${props.height}px`,width:`${props.width}px`,borderRadius:'50%'}}
            >
                {props.profilePicture && props.profilePicture !== '' ? 
                    <img src= {props.profilePicture} className="width100 height100" style={{objectFit:'cover'}}  />
                :
                    <div className="flex-column items-center content-center width100 height100" style={{border:'0.5px solid white',borderRadius:'50%'}}>
                        <UserIcon width={Math.floor(props.height / 2.5)} height={Math.floor(props.width / 2.5)} />
                    </div>
                }
            </div>
    )
}