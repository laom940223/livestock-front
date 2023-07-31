import {useState} from 'react'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BASE_URL, ServerResponse } from "../utils/const"
import { getTokenString } from "../utils/token-utils"
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Grid,  Link,  Typography } from "@mui/material"
import { AddFarm } from '../components/add-farm'
import { Link as RouterLink } from 'react-router-dom'




export type Farm = {

    id:number,

    name :string,
    address: string,

}






export const Dashboard = ()=>{
    
    const getMyFarms = async ()=>{
        const response = await axios.get<ServerResponse<Farm[]>>(BASE_URL+"/farms", {
            headers:{
                Authorization: getTokenString()
            }
        })
        return response.data.data
    }

    const {data, isLoading, isError} = useQuery(["farms"], getMyFarms)


    const [openFarm, setOpenFarm] = useState(false);
    const handleOpen = () => setOpenFarm(true);
    const handleClose = () => setOpenFarm(false);


    if(isLoading) return <CircularProgress />

    if(isError) return <> Something went wrong</>

    
    const farms = data.map( farm=>{

        return (<Card key={farm.id} sx={{ minWidth: 200 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {farm.name}
                </Typography>
                
            </CardContent>
            <CardActions>
                
                    <Link component={RouterLink} to={`/farms/${farm.id}`}>
                        Go To Farm
                    </Link>
                
            </CardActions>
        </Card>)

    })

    

    return (

            <Grid container>
                <Grid xs={6} sx={{ display:"flex", alignItems:"center", justifyContent:"space-evenly", flexWrap:"wrap" }}>
                    <Box sx={{ width:"100%", marginBottom:1}}>
                        <Typography  variant="h4"> My Farms</Typography>
                    </Box>
                    <Box sx={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-around", flexWrap:"wrap" }}>
                        {farms}
                        {  
                                    
                                   farms.length < 2 ? <> <Button onClick={handleOpen}>Add a farm</Button>  
                                                            <AddFarm open={openFarm} onClose={handleClose} />
                                                        </>
                                    : null
                            
                        }
                    </Box>
                </Grid>
            </Grid>

    )
}