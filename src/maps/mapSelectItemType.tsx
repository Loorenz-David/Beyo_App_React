 const chairsSetOf = [
                    {'icon':'icon','component':'NumKeyBoard','property':'set of','name':'set of'}
]

 const diningChair = [
                    {'icon':'icon','component':'CheckBox','property':'structure','name':'Bold','next':'chairsSetOf'},
                    {'icon':'icon','component':'CheckBox','property':'structure','name':'Only seat','next':'chairsSetOf','backref':{'parts':[{'part':'Seat','count':1}]}},
                    {'icon':'icon','component':'CheckBox','property':'structure','name':'Back rest & Seat','next':'chairsSetOf','backref':{'parts':[{'part':'Seat','count':1},{'part':'Back rest','count':1}]}},
                    {'icon':'icon','component':'CheckBox','property':'structure','name':'Arm rest','next':'chairsSetOf','backref':{'parts':[{'part':'Seat','count':1},{'part':'Back rest','count':1}]}},
]


 const forResting =[
                    {'icon':'icon','component':'CheckBox','property':'type','name':'Dining chair','next':'diningChair'},
                    {'icon':'icon','component':'CheckBox','property':'type','name':'Arm chair'},
                    {'icon':'icon','component':'CheckBox','property':'type','name':'Sofa'},
                    {'icon':'icon','component':'CheckBox','property':'type','name':'Stol'},

                ]

const forPlacing =[
                {'icon':'icon','component':'CheckBox','property':'type','name':'Dining table'},
                {'icon':'icon','component':'CheckBox','property':'type','name':'Sofa table'},
                {'icon':'icon','component':'CheckBox','property':'type','name':'Bedside table'},
                {'icon':'icon','component':'CheckBox','property':'type','name':'Small table'},
                
            ]

 const ItemCategory =[
    {'icon':'icon','component':'CheckBox','property':'category','name':'For resting','next':'forResting'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For placing','next':'forPlacing'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For storaging'}, 
]

export const ItemTypeMap = {
    ItemCategory,
    forResting,
    forPlacing,
    diningChair,
    chairsSetOf,

}
