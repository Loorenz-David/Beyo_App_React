const forRestingScratchIntensity= [
    {'icon':'icon','component':'CheckBox','property':'intensity','name':'Superficial'},
    {'icon':'icon','component':'CheckBox','property':'intensity','name':'Half way'},
    {'icon':'icon','component':'CheckBox','property':'intensity','name':'Deep'}, 
]

const forRestingScratchLocation= [
    {'icon':'icon','component':'CheckBox','property':'location','name':'legs','next':'forRestingScratchIntensity'},
    {'icon':'icon','component':'CheckBox','property':'location','name':'Middle frame','next':'forRestingScratchIntensity'},
    {'icon':'icon','component':'CheckBox','property':'location','name':'Upper frame','next':'forRestingScratchIntensity'}, 
]


const forRestingIssues = [
    {'icon':'icon','component':'CheckBox','property':'category','name':'Scratch','next':'forRestingScratchLocation'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'Indent'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'Missing parts'}, 
]

const forRestingIssuesMap = {
    'initialMap':forRestingIssues,
    forRestingScratchLocation,
    forRestingScratchIntensity
}
// ------------------------------------ ------------------------------------

const forPlacingIssues = [
    {'icon':'icon','component':'CheckBox','property':'category','name':'For resting','next':'forResting'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For placing'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For storaging'}, 
]

const forPlacingIssuesMap = {
    'initialMap':forPlacingIssues
}
// ------------------------------------ ------------------------------------

const forStoragingIssues = [
    {'icon':'icon','component':'CheckBox','property':'category','name':'For resting','next':'forResting'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For placing'},
    {'icon':'icon','component':'CheckBox','property':'category','name':'For storaging'}, 
]

const forStoragingIssuesMap = {
    'initialMap':forStoragingIssues
}
// ------------------------------------ ------------------------------------

export const ItemIssuesMap = {
    'For resting': forRestingIssuesMap,
    'For placing': forPlacingIssuesMap,
    'For storaging': forStoragingIssuesMap
}

