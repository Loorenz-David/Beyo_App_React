import '../css/nav_bar.css'
import {NavLink} from 'react-router-dom'
import HomeIcon from '../assets/icons/HomeIcon.svg?react'
import ItemsIcon from '../assets/icons/ItemsIcon.svg?react'
import ScheduleIcon from '../assets/icons/ScheduleIcon.svg?react'
import UserIcon from '../assets/icons/UserIcon.svg?react'

interface PageButtonProps{
    icon: React.ReactNode;
    pageName:string;
    link:string
}

const PageButton = ({icon,pageName,link}:PageButtonProps) =>{

    return (
        <NavLink
        to={link}
        className={({isActive})=>`page-button${isActive? ' active' : ''}`}
        >
            {icon}
            <span>{pageName}</span>
        </NavLink>
        
    )
}

const NavBar = () => {
    
    return ( 
        <div className="nav-bar items-center ">
           <PageButton icon={<HomeIcon  />} pageName='Home' link="/" />
           <PageButton icon={<ItemsIcon/>} pageName="Items" link="/items" />
           <PageButton icon={<ScheduleIcon/>}  pageName="Schedule" link="/schedule" />
           <PageButton icon={<UserIcon/>}  pageName="Account" link="/account" />
        </div>
     );
}
 
export default NavBar;