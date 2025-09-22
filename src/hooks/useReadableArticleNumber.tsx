
export const readArticleNumber = (articleNumber:string,addSpaceCount:number=2)=>{

    if(!articleNumber) return

    

    const copy = articleNumber.trim()
    const split = copy.split('')

    const sj = (start,end,addSpace=true) =>{
        let str = split.slice(start,end).join('') 
        if(addSpace){
            str += ' '.repeat(addSpaceCount)
        }
        return str
    }
   
    const readable = sj(0,6) + sj(6,8) + sj(8,10) + sj(10,13,false) 
 
    return readable
}