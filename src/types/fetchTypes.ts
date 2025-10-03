export type QueryValues = any

export interface FilterOperation{
    operation:string;
    value: QueryValues
}

export interface QueryFiltersDictProps{
    [key:string]: QueryValues | FilterOperation
}
export interface GetFetchDictProps{
    model_name:string
    requested_data:string[] | {}
    query_filters: QueryFiltersDictProps 
    per_page?:number
    cursor?:number | string
}