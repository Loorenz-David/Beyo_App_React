
import DiningTableIcon from '../assets/icons/furniture_icons/DiningTableIcon.svg?react'
import DiningChairIcon from '../assets/icons/furniture_icons/DiningChairIcon.svg?react'
import ByroIcon from '../assets/icons/furniture_icons/ByroIcon.svg?react'
import LampCeiling from '../assets/icons/furniture_icons/LampCeiling.svg?react'
import PosterIcon from '../assets/icons/furniture_icons/PosterIcon.svg?react'
import ArmChairIcon from '../assets/icons/furniture_icons/ArmChairIcon.svg?react'
import SofaIcon from '../assets/icons/furniture_icons/SofaIcon.svg?react'
import StolIcon from '../assets/icons/furniture_icons/StolIcon.svg?react'

import BoldChairIcon from '../assets/icons/furniture_icons/BoldChairIcon.svg?react'
import SeatBackRestIcon from '../assets/icons/furniture_icons/SeatBackRestIcon.svg?react'
import SeatIcon from '../assets/icons/furniture_icons/SeatIcon.svg?react'
import ArmRestChair from '../assets/icons/furniture_icons/ArmRestChair.svg?react'

export interface ItemPart{
    part:string
    count:number | 'same_count'
}

export interface ItemType{
    component: 'CheckBox' | 'NumKeyBoard'
    property: string
    displayName?: string
    icon?: any
    next?:string[]
    parts?:ItemPart[]
    majorProperty?:string
}
export interface ItemTypeMap{
    [key:string]:ItemType[]
}

//  --------------------------------------------------------------------------------------------------------------------------------
// CATEGORY MAPS


export const ItemCategory:ItemType[] = [
    {'component':'CheckBox','property':'category','displayName':'For Resting','icon':<DiningChairIcon width={45} height={45} />},
    {'component':'CheckBox','property':'category','displayName':'For Placing','icon':<DiningTableIcon width={45} height={45} />},
    {'component':'CheckBox','property':'category','displayName':'For Storaging','icon':<ByroIcon width={45} height={45} />},
    {'component':'CheckBox','property':'category','displayName':'For Iluminating','icon':<LampCeiling width={55} height={55} />},
    {'component':'CheckBox','property':'category','displayName':'For Decoration','icon':<PosterIcon width={45} height={45} />},
]
export const ForResting:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Dining Chair', 'next':['Chair Structure','Set Of'],'icon':<DiningChairIcon width={40} height={40} />,},
    {'component':'CheckBox','property':'type','displayName':'Arm Chair','next':['Arm Chair Structure','Set Of'],'icon':<ArmChairIcon width={45} height={45} />},
    {'component':'CheckBox','property':'type','displayName':'Sofa', 'next':['Sofa Structure','Set Of'],'icon':<SofaIcon width={65} height={65} />,},
    {'component':'CheckBox','property':'type','displayName':'Stol', 'next':['Stol Structure','Set Of'],'icon':<StolIcon width={40} height={40} />,}
]

export const ForPlacing:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Dining Table','icon':'icon','next':['Table Shape','Legs Type','Wood Type','Extentions Type','Extentions Set' ]},
    {'component':'CheckBox','property':'type','displayName':'Sofa Table','icon':'icon','next':['Table Shape','Legs Type','Wood Type']},
    {'component':'CheckBox','property':'type','displayName':'Bedside Table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Other Table','icon':'icon'}
]

export const ForStoraging:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Sideboard','icon':'icon','next':['Handle Style','Wood Type', 'Legs Style']},
    {'component':'CheckBox','property':'type','displayName':'Highboard','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Bookshelf','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Byro','icon':'icon'}
]

export const ForIluminating:ItemType[]=[
    {'component':'CheckBox','property':'type','displayName':'Hanging Lamp','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Table Lamp','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Clip Lamp','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Floor Lamp','icon':'icon'},
]
export const ForDecoration:ItemType[]=[
    {'component':'CheckBox','property':'type','displayName':'Vase','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Mirror','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Poster','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Carpet','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Electronics','icon':'icon'},
    
]

//  --------------------------------------------------------------------------------------------------------------------------------
// FOR RESTING MAPS

export const ChairStructure:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Bold','icon':<BoldChairIcon width={40} height={40} />},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat','icon':<SeatIcon width={40} height={40} />},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat Uph back','icon':<SeatBackRestIcon width={40} height={40} />},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Arm rest','icon':<ArmRestChair width={40} height={40} />}
]
export const SetOf:ItemType[] = [
    {'component':'NumKeyBoard','majorProperty':'properties','property':'Set Of'}
]

export const SofaStructure:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Sofa Structure','displayName':'Bold','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Sofa Structure','displayName':'Uph seat','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Sofa Structure','displayName':'Uph seat Uph back','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Sofa Structure','displayName':'Arm rest','icon':'icon'}
]

export const StolStructure:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Stol Structure','displayName':'Bold','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Stol Structure','displayName':'Uph seat','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Stol Structure','displayName':'Uph seat Uph back','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Stol Structure','displayName':'Arm rest','icon':'icon'}
]

export const ArmChairStructure:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Arm Chair Structure','displayName':'Bold','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Arm Chair Structure','displayName':'Uph seat','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Arm Chair Structure','displayName':'Uph seat Uph back','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Arm Chair Structure','displayName':'Arm rest','icon':'icon'}
]

//  --------------------------------------------------------------------------------------------------------------------------------
// FOR PLACING MAPS


export const TableShape:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Table Shape','displayName':'Round','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Table Shape','displayName':'Oval','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Table Shape','displayName':'Square','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Table Shape','displayName':'Rectangle','icon':'icon'}
]
export const LegsType:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Type','displayName':'Four Cornerns','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Type','displayName':'Two Midle','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Type','displayName':'One Midle','icon':'icon'},
]

export const WoodType:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Wood Type','displayName':'Teak','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Wood Type','displayName':'Rose','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Wood Type','displayName':'Yakaranda','icon':'icon'},
]
export const ExtentionsType:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Extentions Type','displayName':'Inside','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Extentions Type','displayName':'Outside','icon':'icon'},
]

export const ExtentionsSet:ItemType[]= [
    {'component':'NumKeyBoard','majorProperty':'properties','property':'Extentions Set'}
]


//  --------------------------------------------------------------------------------------------------------------------------------
// FOR STORAGING MAPS

export const HandleStyle:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Handle Style','displayName':'Line','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Handle Style','displayName':'Scandic','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Handle Style','displayName':'Circular','icon':'icon'},
]
export const LegsStyle:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Style','displayName':'Circular','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Style','displayName':'Square','icon':'icon'},
    {'component':'CheckBox','majorProperty':'properties','property':'Legs Style','displayName':'Connected','icon':'icon'},
]


//  --------------------------------------------------------------------------------------------------------------------------------
// Directory Map
//  --------------------------------------------------------------------------------------------------------------------------------

export const ItemTypeMap:ItemTypeMap = {
    'category': ItemCategory,

    'For Resting': ForResting,
    'Chair Structure': ChairStructure,
    'Set Of' :SetOf,
    'Sofa Structure':SofaStructure,
    'Stol Structure':StolStructure,
    'Arm Chair Structure':ArmChairStructure,

    'For Placing':ForPlacing,
    'Table Shape':TableShape,
    'Legs Type':LegsType,
    'Wood Type':WoodType,
    'Extentions Type':ExtentionsType,
    'Extentions Set':ExtentionsSet, 


    'For Storaging':ForStoraging,
    'Handle Style':HandleStyle,
    'Legs Style':LegsStyle,

    'For Iluminating':ForIluminating,


    'For Decoration':ForDecoration

}