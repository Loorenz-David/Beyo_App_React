

export interface ItemDimensions{
    length:number
    width:number
    height:number
}

export interface ItemNoteSubject{
    id:number
    subject:string
}
export interface ItemNotes{
    id:number
    note_content:string
    subject: ItemNoteSubject
}


export interface ItemPriceFields{
    purchased_price:number | null
    valuation:number | null
    sold_price:number | null
}

export interface DealerDict{
    id:number
    dealer_type:string
    dealer_name:string
    purchased_cost:number
}
export interface Dealer{
    dealer:DealerDict
}

export interface IssueDict{
    location : string
    issue:string
}

export interface ItemDict 
        extends ItemPriceFields, Dealer
{
    id:number
    article_number:string | string[]
    category:string
    type:string
    length:ItemDimensions
    notes: ItemNotes[]
    images:(string | {file:Blob})[] | null | undefined
    properties:Record<string,any>
    state:string
    location:string
    issues:IssueDict[]
    
    
}