export interface ItemPart{
    part:string
    count:number
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

export const ItemCategory:ItemType[] = [
    {'component':'CheckBox','property':'category','displayName':'For Resting','icon':'icon'},
    {'component':'CheckBox','property':'category','displayName':'For Placing','icon':'icon'},
    {'component':'CheckBox','property':'category','displayName':'For Storaging','icon':'icon'}
]
export const ForResting:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Dining Chair','icon':'icon', 'next':['Chair Structure','Set Of']},
    {'component':'CheckBox','property':'type','displayName':'Arm Chair','icon':'icon','next':['Set Of']},
    {'component':'CheckBox','property':'type','displayName':'Sofa','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Stol','icon':'icon'}
]

export const ForPlacing:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Dining Table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Sofa table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Bedside Table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Other Table','icon':'icon'}
]

export const ForStoraging:ItemType[] = [
    {'component':'CheckBox','property':'type','displayName':'Sideboard','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Highboard','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Book shelf','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Byro','icon':'icon'}
]

export const ChairStructure:ItemType[]= [
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Bold','icon':'icon','parts':[]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat','icon':'icon','parts':[{'part':'Seat','count':1}]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat Uph back','icon':'icon','parts':[{'part':'Seat','count':1},{'part':'Back Rest','count':1}]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Arm rest','icon':'icon','parts':[{'part':'Seat','count':1},{'part':'Back Rest','count':1}]}
]
export const SetOf:ItemType[] = [
    {'component':'NumKeyBoard','majorProperty':'properties','property':'Set Of'}
]


export const ItemTypeMap:ItemTypeMap = {
    'category': ItemCategory,
    'For Resting': ForResting,
    'Chair Structure': ChairStructure,
    'Set Of' :SetOf,

    'For Placing':ForPlacing,

    'For Storaging':ForStoraging,

}