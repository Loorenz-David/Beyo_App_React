
const scratchSeverity = [
    {'component':'CheckBox','property':'severity','displayName':'Soft','icon':'icon'},
    {'component':'CheckBox','property':'severity','displayName':'Half way','icon':'icon'},
    {'component':'CheckBox','property':'severity','displayName':'Deep','icon':'icon'}
]


const restingLocation = [
    {'component':'CheckBox','property':'location','displayName':'Lower frame','icon':'icon','next':'scratchSeverity'},
    {'component':'CheckBox','property':'location','displayName':'Middle frame','icon':'icon','next':'scratchSeverity'},
    {'component':'CheckBox','property':'location','displayName':'Upper frame','icon':'icon','next':'scratchSeverity'}
]


const DiningChairIssueMap = [
    {'component':'CheckBox','property':'type','displayName':'Scratch','icon':'icon','next':'restingLocation'},
    {'component':'CheckBox','property':'type','displayName':'Indent','icon':'icon'},
    {'component':'CheckBox','property':'type','displayName':'Missing part','icon':'icon'}
]


export const ItemIssuesMap = {
    'Dining Chair': DiningChairIssueMap,
    restingLocation,
    scratchSeverity

}