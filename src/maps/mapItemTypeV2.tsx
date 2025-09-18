export const ItemCategory = [
    {'component':'CheckBox','property':'category','displayName':'For Resting','icon':'icon','next':'ForResting'},
    {'component':'CheckBox','property':'category','displayName':'For Placing','icon':'icon'},
    {'component':'CheckBox','property':'category','displayName':'For Storaging','icon':'icon'}
]
export const ForResting = [
    {'component':'CheckBox','property':'type','displayName':'Dining Chair','icon':'icon', 'next':['Chair Structure','Set Of']},
    {'component':'CheckBox','property':'type','displayName':'Arm Chair','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Sofa','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Stol','icon':'icon'}
]

export const ForPlacing = [
    {'component':'CheckBox','property':'type','displayName':'Dining Table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Sofa table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Bedside Table','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Other Table','icon':'icon'}
]

export const ChairStructure = [
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Bold','icon':'icon','parts':[]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat','icon':'icon','parts':[{'part':'Seat','count':1}]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Uph seat Uph back','icon':'icon','parts':[{'part':'Seat','count':1},{'part':'Back Rest','count':1}]},
    {'component':'CheckBox','majorProperty':'properties','property':'Chair Structure','displayName':'Arm rest','icon':'icon','parts':[{'part':'Seat','count':1},{'part':'Back Rest','count':1}]}
]
export const SetOf = [
    {'component':'NumKeyBoard','majorProperty':'properties','property':'Set Of'}
]


export const ItemTypeMap = {
    'category': ItemCategory,
    'For Resting': ForResting,
    'Chair Structure': ChairStructure,
    'Set Of' :SetOf,

    'For Placing':ForPlacing

}