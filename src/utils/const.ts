

export const BASE_URL= "http://localhost:8080/api"


export type AppError ={

    location:string,
    message:string

}


export type ServerResponse<T> ={
    data:T,
    errors:AppError[]
}


export type UserRole ={
    id:number, 
    name:string
}

export type User = {

   id: number, 
   name: string, 
   lastname: string, 
   username: string, 
   email: string, 
   farms: unknown,

   role: UserRole
   
   
}