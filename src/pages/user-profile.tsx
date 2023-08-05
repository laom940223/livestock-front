import { useQueryClient } from "@tanstack/react-query"



export const UserProfile =() =>{


    const queryClient = useQueryClient()


    console.log(queryClient.getQueryData(['me']))


    return <>User profile </>


}