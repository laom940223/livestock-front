import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router-dom"




export const  TOKEN_KEY = "_token"

 export const getAuthQuery =()=>{

    return localStorage.getItem(TOKEN_KEY)

}



export const ProtectedRoute = ()=>{

    
    const location = useLocation()


    const { data, isLoading  } = useQuery(["auth"], getAuthQuery)

    if(isLoading) return <>loading</>

    

    if(!data)  return <Navigate to={"/login"} state={{ from: location }} />

    return <Outlet/>


}