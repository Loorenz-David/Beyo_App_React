// Modernized item type map for furniture categories and properties
// Structure follows the same pattern as mapItemTypeV2

// Icon imports from mapItemTypeV2
import DiningTableIcon from '../../assets/icons/furniture_icons/DiningTableIcon.svg?react'
import DiningChairIcon from '../../assets/icons/furniture_icons/DiningChairIcon.svg?react'
import ByroIcon from '../../assets/icons/furniture_icons/ByroIcon.svg?react'
import LampCeiling from '../../assets/icons/furniture_icons/LampCeiling.svg?react'
import PosterIcon from '../../assets/icons/furniture_icons/PosterIcon.svg?react'
import ArmChairIcon from '../../assets/icons/furniture_icons/ArmChairIcon.svg?react'
import SofaIcon from '../../assets/icons/furniture_icons/SofaIcon.svg?react'
import StolIcon from '../../assets/icons/furniture_icons/StolIcon.svg?react'
import BoldChairIcon from '../../assets/icons/furniture_icons/BoldChairIcon.svg?react'
import SeatBackRestIcon from '../../assets/icons/furniture_icons/SeatBackRestIcon.svg?react'
import SeatIcon from '../../assets/icons/furniture_icons/SeatIcon.svg?react'
import ArmRestChair from '../../assets/icons/furniture_icons/ArmRestChair.svg?react'
import SofaTableIcon from '../../assets/icons/furniture_icons/SofaTableIcon.svg?react'
import BedsideTableIcon from '../../assets/icons/furniture_icons/BedsideTableIcon.svg?react'
import NestOfTablesIcon from '../../assets/icons/furniture_icons/NestOfTablesIcon.svg?react'
import SquareTypeIcon from '../../assets/icons/furniture_icons/SquareTypeIcon.svg?react'
import CircleTypeIcon from '../../assets/icons/furniture_icons/CircleTypeIcon.svg?react'
import OvalTypeIcon from '../../assets/icons/furniture_icons/OvalTypeIcon.svg?react'
import RectangleTypeIcon from '../../assets/icons/furniture_icons/RectangleTypeIcon.svg?react'
import TwoLegsIcon from '../../assets/icons/furniture_icons/TwoLegsIcon.svg?react'
import ExtentionsOutsideIcon from '../../assets/icons/furniture_icons/ExtentionsOutsideIcon.svg?react'
import ExtentionsInsideIcon from '../../assets/icons/furniture_icons/ExtentionsInsideIcon.svg?react'

// Placeholders for new icons to be created
// import DrawerIcon from '../../assets/icons/furniture_icons/DrawerIcon.svg?react'
// import ShelfIcon from '../../assets/icons/furniture_icons/ShelfIcon.svg?react'
// import GlassIcon from '../../assets/icons/furniture_icons/GlassIcon.svg?react'
// import PartsIcon from '../../assets/icons/furniture_icons/PartsIcon.svg?react'
// import AdjustableIcon from '../../assets/icons/furniture_icons/AdjustableIcon.svg?react'
// import MetalIcon from '../../assets/icons/furniture_icons/MetalIcon.svg?react'
// import FabricIcon from '../../assets/icons/furniture_icons/FabricIcon.svg?react'

export interface ItemPart{
    part:string
    count:number | 'same_count'
}
export enum ComponentsEnum {
    CheckBox = "CheckBox",
    NumKeyBoard = "NumKeyBoard"
}
export interface ItemType{
    component: ComponentsEnum.CheckBox | ComponentsEnum.NumKeyBoard
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



export const SeatingTypes: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Dining Chair', next: ['Upholstery','SetOf'], icon: <DiningChairIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Easy Chair', next: ['Upholstery', 'Armrest','SetOf'], icon: <ArmChairIcon width={45} height={45} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Armchair', next: ['Upholstery', 'Armrest','SetOf'], icon: <ArmChairIcon width={45} height={45} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Sofa', next: ['Upholstery', 'Armrest', 'Cushion', 'Seater'], icon: <SofaIcon width={65} height={65} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Stool', next: ['Shape','SetOf'], icon: <StolIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Other Seating', next: ['SetOf'], icon:"Icon" },
]

export const Upholstery: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'upholstery', displayName: 'No upholstery up and down', icon: <SeatIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'upholstery', displayName: 'Upholstery only up', icon: <SeatIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'upholstery', displayName: 'Upholstery only down', icon: <SeatBackRestIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'upholstery', displayName: 'Upholstery up and down', icon: <SeatBackRestIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'upholstery', displayName: 'Other', icon:"Icon" },
]

export const Armrest: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'armrest', displayName: 'With armrest', icon: <ArmRestChair width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'armrest', displayName: 'Without armrest', icon: <BoldChairIcon width={40} height={40} /> },
]

export const Cushion: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'cushion', displayName: 'Separated cushion', icon: <SofaIcon width={65} height={65} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'cushion', displayName: 'In-build cushion', icon: <SofaIcon width={65} height={65} /> },
]

export const Seater: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'seater', displayName: '2 seater', icon: <SofaIcon width={65} height={65} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'seater', displayName: '3 seater', icon: <SofaIcon width={65} height={65} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'seater', displayName: '4 seater', icon: <SofaIcon width={65} height={65} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'seater', displayName: 'Other', icon: <SofaIcon width={65} height={65} /> },
]

export const Shape: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shape', displayName: 'Round', icon: <CircleTypeIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shape', displayName: 'Square', icon: <SquareTypeIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shape', displayName: 'Rectangular', icon: <RectangleTypeIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shape', displayName: 'Oval', icon: <OvalTypeIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shape', displayName: 'Other', icon:"Icon" },
]

// I will add one more component which allows user to input a text for free condition description
// this should be compose of two parts one input to specify the dislayName and another input to specify the actual value
// this will be implemented later, when we are able to make the whole file independent from the code 
export const Other: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'other', displayName: 'Other', icon:"Icon" },
]

export const SetOf: ItemType[] = [
  { component: ComponentsEnum.NumKeyBoard, property: 'set_of', majorProperty: 'properties', displayName: 'Set Of' },
]

// Tables
export const TableTypes: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Writing Desk', next: ['DrawerUnit'], icon: <ByroIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Dining Table', next: ['Shape','Extentions Type','Extentions Set'], icon: <DiningTableIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Nest of Tables', next: ['Shape', 'NestPieces'], icon: <NestOfTablesIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Bedside Table', next: ['DrawerType', 'UnitType'], icon: <BedsideTableIcon width={35} height={35} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Coffee Table', next: ['Shape', 'DrawerType'], icon: <SofaTableIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Hall Table', next: ['Shape', 'DrawerType'], icon: <DiningTableIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Side Table', next: ['Shape', 'DrawerType', 'UnitType'], icon: <SofaTableIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Other Table', icon:"Icon" },
]

export const DrawerUnit: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'drawer_unit', displayName: '0 drawer unit', icon:"Icon" }, // Replace with <DrawerIcon />
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'drawer_unit', displayName: '1 drawer unit', icon:"Icon" }, // Replace with <DrawerIcon />
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'drawer_unit', displayName: '2 drawers unit', icon:"Icon" }, // Replace with <DrawerIcon />
]


export const ExtentionsType:ItemType[]= [
  {'component':ComponentsEnum.CheckBox,'majorProperty':'properties','property':'Extentions Type','displayName':'Inside','icon':<ExtentionsInsideIcon width={60} height={60} />},
  {'component':ComponentsEnum.CheckBox,'majorProperty':'properties','property':'Extentions Type','displayName':'Outside','icon':<ExtentionsOutsideIcon width={80} height={80} />},
]
export const ExtentionsSet:ItemType[]= [
  {'component':ComponentsEnum.NumKeyBoard,'majorProperty':'properties','property':'Extentions Set','icon':<NestOfTablesIcon width={40} height={40} />}
]

export const NestPieces: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'nest_pieces', displayName: '2 pcs', icon: <NestOfTablesIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'nest_pieces', displayName: '3 pcs', icon: <NestOfTablesIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'nest_pieces', displayName: '4 pcs', icon: <NestOfTablesIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'nest_pieces', displayName: '5+ pcs', icon: <NestOfTablesIcon width={40} height={40} /> },
]

export const DrawerType: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'drawer_type', displayName: 'With drawer', icon:"Icon" }, // Replace with <DrawerIcon />
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'drawer_type', displayName: 'Without drawer', icon:"Icon" }, // Replace with <DrawerIcon />
]



export const UnitType: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'unit_type', displayName: 'Single', icon: <SquareTypeIcon width={50} height={50} /> },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'unit_type', displayName: 'Pair', icon: <TwoLegsIcon width={60} height={60} /> },
]

// Storage
export const StorageTypes: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Sideboard', next: ['DrawerType', 'GlassTop'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Highboard', next: ['DrawerType', 'GlassTop'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Bookshelf', next: ['ShelfType', 'Size', 'Parts'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Chest of Drawers', next: ['DrawerCount'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Bar Cabinet', next: ['GlassDoors', 'DrawerType'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Wardrobe', next: ['DoorCount', 'Size'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Other Storage',  icon: 'Icon' },
]


export const GlassTop: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'glass_top', displayName: 'With glass top section', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'glass_top', displayName: 'Without glass top section', icon: 'Icon' },
]

export const ShelfType: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shelf_type', displayName: 'Open shelves only', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shelf_type', displayName: 'With cabinet doors', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'shelf_type', displayName: 'With drawers', icon: 'Icon' },
]

export const Size: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size', displayName: 'Small', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size', displayName: 'Medium', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size', displayName: 'Large', icon: 'Icon' },
]

export const Parts: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'parts', displayName: '1 part', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'parts', displayName: '2 parts', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'parts', displayName: '3 parts', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'parts', displayName: '4 parts', icon: 'Icon' },
]

export const DrawerCount: ItemType[] = [
  {component: ComponentsEnum.NumKeyBoard, majorProperty: 'properties',property: 'set_of_drawers', displayName: 'Drawer Count',}
]

export const GlassDoors: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'glass_doors', displayName: 'With glass doors', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'glass_doors', displayName: 'Without glass doors', icon: 'Icon' },
]

export const DoorCount: ItemType[] = [
  { component: ComponentsEnum.NumKeyBoard, majorProperty: 'properties', property: 'set_of_doors', displayName: 'Door Count', },
]

// Lamps
export const LampTypes: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Floor Lamp', next: ['Arms', 'Lampshade'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Table Lamp', next: ['Lampshade', 'Adjustable'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Ceiling Lamp', next: ['Lights', 'Material'], icon: <LampCeiling width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Wall Lamp', next: ['LightCount', 'Lampshade'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Other Lamp', icon: 'Icon' },
]

export const Arms: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'arms', displayName: '1 arm', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'arms', displayName: '2 arms', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'arms', displayName: '3+ arms', icon: 'Icon' },
]

export const Lampshade: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'lampshade', displayName: 'With lampshade', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'lampshade', displayName: 'Without lampshade', icon: 'Icon' },
]

export const Adjustable: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'adjustable', displayName: 'Adjustable', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'adjustable', displayName: 'Non-adjustable', icon: 'Icon' },
]

export const Lights: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'lights', displayName: '1 light', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'lights', displayName: '2–3 lights', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'lights', displayName: '4+ lights', icon: 'Icon' },
]

export const Material: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'material', displayName: 'Glass', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'material', displayName: 'Metal', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'material', displayName: 'Fabric', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'material', displayName: 'Other material', icon: 'Icon' },
]

export const LightCount: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'light_count', displayName: 'Single light', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'light_count', displayName: 'Double light', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'light_count', displayName: 'Multiple lights', icon: 'Icon' },
]

// Decorations
export const DecorationTypes: ItemType[] = [
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Poster', next: ['Framed', 'Size'], icon: <PosterIcon width={40} height={40} /> },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Porcelain', next: ['SetSingle', 'DecorativeFunctional'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Picture', next: ['Framed', 'PictureType'], icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, property: 'type', displayName: 'Other Decoration', next: ['Other'], icon: 'Icon' },
]

export const Framed: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'framed', displayName: 'Framed', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'framed', displayName: 'Unframed', icon: 'Icon' },
]

export const SizeDeco: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size_deco', displayName: 'Small', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size_deco', displayName: 'Medium', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'size_deco', displayName: 'Large', icon: 'Icon' },
]

export const SetSingle: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'set_single', displayName: 'Set', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'set_single', displayName: 'Single piece', icon: 'Icon' },
]

export const DecorativeFunctional: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'decorative_functional', displayName: 'Decorative', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'decorative_functional', displayName: 'Functional', icon: 'Icon' },
]

export const PictureType: ItemType[] = [
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'picture_type', displayName: 'Painting', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'picture_type', displayName: 'Print', icon: 'Icon' },
  { component: ComponentsEnum.CheckBox, majorProperty: 'properties', property: 'picture_type', displayName: 'Photograph', icon: 'Icon' },
]

// Categories
export const ItemCategory:ItemType[] = [
    {'component':ComponentsEnum.CheckBox,'property':'category','displayName':'Seating','icon':'Icon'},
    {'component':ComponentsEnum.CheckBox,'property':'category','displayName':'Tables','icon':'Icon'},
    {'component':ComponentsEnum.CheckBox,'property':'category','displayName':'Storages','icon':'Icon'},
    {'component':ComponentsEnum.CheckBox,'property':'category','displayName':'Lamps','icon':'Icon'},
    {'component':ComponentsEnum.CheckBox,'property':'category','displayName':'Decorations','icon':'Icon'},
]

// Main map
export const ItemTypeMapV3: ItemTypeMap = {
  'category': ItemCategory,

  'Seating': SeatingTypes,
  'Upholstery': Upholstery,
  'Armrest': Armrest,
  'Cushion': Cushion,
  'Seater': Seater,
  'Shape': Shape,
  'Other': Other,
  'SetOf':SetOf,

  'Tables': TableTypes,
  'Extentions Type': ExtentionsType,
  'Extentions Set': ExtentionsSet,      
  'DrawerUnit': DrawerUnit,
  'NestPieces': NestPieces,
  'DrawerType': DrawerType,
  'UnitType': UnitType,
  

  'Storages': StorageTypes,
  'GlassTop': GlassTop,
  'ShelfType': ShelfType,
  'Size': Size,
  'Parts': Parts,
  'DrawerCount': DrawerCount,
  'GlassDoors': GlassDoors,
  'DoorCount': DoorCount,

  'Lamps': LampTypes,
  'Arms': Arms,
  'Lampshade': Lampshade,
  'Adjustable': Adjustable,
  'Lights': Lights,
  'Material': Material,
  'LightCount': LightCount,

  'Decorations': DecorationTypes,
  'Framed': Framed,
  'SizeDeco': SizeDeco,
  'SetSingle': SetSingle,
  'DecorativeFunctional': DecorativeFunctional,
  'PictureType': PictureType,
}
