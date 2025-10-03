

interface RolesDict{
    role:string
}


export interface UserDict{
    id?:number
    email?:string
    phone?:string
    roles: RolesDict[]
    username:string
    profile_picture: string 
    password?:string
}