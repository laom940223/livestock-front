import { useQuery } from "@tanstack/react-query"
import {  useParams } from "react-router-dom"
import { BASE_URL, ServerResponse } from "../utils/const"
import axios from "axios"
import { getTokenString } from "../utils/token-utils"
import { Box, Grid, Typography, Button, CircularProgress as Progress } from "@mui/material"
import { AnimalsTable } from "../components/animals-table"


export type Farm = {

    id: number,
    name: string,
    address:string,
    animals: Animal[]

}

export type AnimalBreed = {

    id: number,
    name: string
    
}

export type Animal = {

    id:number,
    name:string,
    dob: string ,
    sex: "FEMALE" | "MALE",
    mother: number,
    father: number,
    breed: AnimalBreed,
    inFarm: boolean
	
}




export const FarmDetail =()=>{

    const {id} = useParams()
    

    const getFarmDetails = async (): Promise<Farm>=>{
        const {data}  = await axios.get<ServerResponse<Farm>>(BASE_URL+`/farms/${id}`, {
            headers:{
                Authorization: getTokenString()
            }
        })
       return data.data
    }


    const { data:farm, isLoading, isError} = useQuery<Farm>(["farm"], getFarmDetails)



    if(isLoading) return<Progress/>
    

    if(isError) return <>Something went wrong</>

    console.log(farm)


    return (

        <Grid container >
            <Grid xs={12} sx={{display:"flex"}}>
                <Box sx={{width:"100%", display:"flex", flexDirection:"column" }}>
                    <Typography variant="h4"> Farm Name: {farm.name} </Typography>
                    <Typography variant="h5" > Address: {farm.address} </Typography>
                    
                </Box>
            </Grid>

            <Grid xs={12} sx={{display:"flex", flexWrap:"wrap", justifyContent:"flex-start", marginTop:4}}>
                
                <Typography variant="h6">Animals</Typography>
                <Box sx={{width:"100%", marginTop:4, marginBottom:2}}>
                    {  farm.animals.length>0 ? <AnimalsTable animals={farm.animals} /> : <Typography>You don't have any animals addes try adding some to see the data</Typography>}
                </Box>
                <Box sx={{width:"100%", marginTop:4, marginBottom:2}}   >
                    <Button variant="contained"> Add Animal</Button>
                </Box>
            </Grid>
        </Grid>
    )


}