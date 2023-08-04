import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {  Link, useParams } from "react-router-dom"
import { BASE_URL, ServerResponse } from "../utils/const"
import axios from "axios"
import { getTokenString } from "../utils/token-utils"
import { Box, Grid, Typography, Button, CircularProgress as Progress } from "@mui/material"
import { AnimalsTable } from "../components/animals-table"
import { AddAnimal } from "../components/add-animal"


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
    const [openAnimal, setOpenAnimal] = useState(false);
    const handleOpen = () => setOpenAnimal(true);
    const handleClose = () => setOpenAnimal(false);

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

    


    return (

        <Grid container >
            <Grid xs={12} sx={{justifyContent:"flex-start", display:"flex"}}> 
                <Link to={"/"}> Go back </Link>
            </Grid>
            <Grid xs={12} sx={{display:"flex"}}>
                <Box sx={{width:"100%", display:"flex", flexDirection:"column" }}>
                    <Typography variant="h4"> {farm.name} </Typography>
                    <Typography variant="h5" >{farm.address} </Typography>
                    
                </Box>
            </Grid>

            <Grid xs={12} sx={{display:"flex", flexWrap:"wrap", justifyContent:"flex-start", marginTop:4}}>
                
                <Typography variant="h6">Animals</Typography>
                <Box sx={{width:"100%", marginTop:4, marginBottom:2}}>
                    
                             <AnimalsTable farmId={+id!} openAnimal={openAnimal} onClose={handleClose} /> 
                    
                </Box>
                <Box sx={{width:"100%", marginTop:4, marginBottom:2}}   >
                    <Button onClick={handleOpen}  variant="contained"> Add Animal</Button>
                </Box>
            </Grid>
        </Grid>
    )


}