import { useCallback } from "react"
import {  Link, useParams } from "react-router-dom"
import { BASE_URL, ServerResponse } from "../utils/const"
import { Animal } from "./farm-detail"
import axios from "axios"
import { getTokenString } from "../utils/token-utils"
import { useQuery } from "@tanstack/react-query"
import { CircularProgress, Stack, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import  relativeTime  from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs";


dayjs.extend(relativeTime)


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


export const AnimalDetail =()=>{

    const params = useParams()

    const fetchAnimal = useCallback(async ()=>{
        const { data }= await axios.get<ServerResponse<Animal>>(BASE_URL+`/animals/${params.animalId}`, {
            headers:{
                Authorization: getTokenString()
            }
        } )
        return data.data
    },[params])


    
    const fetchSons = useCallback(async ()=>{
        const { data }= await axios.get<ServerResponse<Animal[]>>(BASE_URL+`/animals/${params.animalId}/sons`, {
            headers:{
                Authorization: getTokenString()
            }
        } )
        return data.data
    },[params])


    const {isLoading, data: animal, isError } = useQuery<Animal>( ["animal"], fetchAnimal)

    const sons = useQuery<Animal[]>( ["sons"], fetchSons)


    if(isLoading) return <CircularProgress/>

    if(isError) return <>Something went wrong</>


    let renderSons :JSX.Element[] = []
    

    if(!sons.isLoading && !sons.isError) {

        renderSons =sons.data.map(son=>{

            return <>

        
                 <Typography variant="body1"> {`${son.name} `}</Typography>
                 
             </>
         })
    }

     

    return <>

            <Grid container spacing={2}>
                <Grid xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                
                    <Link to={`/farms/${params.farmId}`}> Go back </Link>

                
                </Grid>
            </Grid>

            <Grid container spacing={2}>
            <Grid xs={4}>
                <Item sx={{ padding:"2em" , display:"flex", flexDirection:"column" , alignItems:"flex-start", justifyContent:"center", flexWrap:"wrap"}}>
                    <Typography variant="h4" >{animal.name}</Typography>
                    <Typography  variant="body1">{ `Date of birth ${animal.dob}`}</Typography>
                    <Typography variant="body1" >{`${dayjs(animal.dob).from(dayjs(), true)}`}</Typography>
                    <Typography variant="body1">{animal.sex}</Typography>
                    <Typography variant="body1">{animal.breed.name}</Typography>
                    <Typography variant="body1">{`${animal.inFarm ? "In farm": "Not in farm"}`}</Typography>

                </Item>
            </Grid>
            

            <Grid xs={8}>
                <Item>
                    <Typography variant="h6"> Sons</Typography>

                    <Stack spacing={1} alignItems={"flex-start"} >
                        { 
                            renderSons.length>0 ?
                                renderSons  
                                :                            
                                "This animal does not have any sons"
                        }
                    </Stack>
                </Item>
            </Grid>
            
            </Grid>
    </>
}