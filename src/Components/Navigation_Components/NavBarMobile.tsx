import '../../css/nav_bar.css'
import {NavLink} from 'react-router-dom'
import HomeIcon from '../../assets/icons/General_Icons/HomeIcon.svg?react'
import ItemsIcon from '../../assets/icons/General_Icons/ItemsIcon.svg?react'
import ScheduleIcon from '../../assets/icons/General_Icons/ScheduleIcon.svg?react'
import MenuIcon from '../../assets/icons/General_Icons/MenuIcon.svg?react'

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

const NavBarMobile = () => {
    
    return ( 
        <div className="nav-bar items-center ">
           <PageButton icon={<HomeIcon  />} pageName='Home' link="/" />
           <PageButton icon={<ItemsIcon/>} pageName="Items" link="/items" />
           <PageButton icon={<ScheduleIcon/>}  pageName="Schedule" link="/schedule" />
           <PageButton icon={<MenuIcon/>}  pageName="Menu" link="/Menu" />
        </div>
     );
}
 
export default NavBarMobile;