import {useState, useRef }from 'react'
import Tooltip from '@mui/material/Tooltip';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Animal } from "../pages/farm-detail";
import { DataGrid, GridColDef  } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import  relativeTime  from 'dayjs/plugin/relativeTime'
import { BASE_URL, ServerResponse } from '../utils/const';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getTokenString } from '../utils/token-utils';
import EditIcon from '@mui/icons-material/Edit';
import { AddAnimal } from './add-animal';
import { EditAnimal } from './edit-animal';

dayjs.extend(relativeTime)





export const AnimalsTable = ({farmId: id, openAnimal, onClose} : {farmId: number, openAnimal : boolean, onClose: ()=>void} )=>{


  const getFarmAnimals = async (): Promise<Animal[]>=>{
    const {data}  = await axios.get<ServerResponse<Animal[]>>(BASE_URL+`/animals/farm/${id}`, {
        headers:{
            Authorization: getTokenString()
        }
    })
   return data.data
}


  const animals = useQuery<Animal[]>(["animals"], getFarmAnimals)

  const navigate = useNavigate()
  const {pathname}  = useLocation()
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const queryClient = useQueryClient()
  

  const handleEdit = (id:number)=>{
    refId.current = id
    setEdit(true)
  }
  
  const handleCloseEdit = ()=>{ 
    refId.current = null
      setEdit(false)
  }


  const handleOpen = (id:number)=>{ 
    refId.current = id
      setOpen(true)
  }
  const handleClose = ()=>{ 
    refId.current = null
      setOpen(false)
  }

  const refId = useRef<number | null>(null)


  

  const handleConfirmDelete = ()=>{


    if(refId.current){
      mutate(refId.current)
    }
    // console.log("about to mutatehe id: " + refId.current)

  }
  
  const { mutate, isLoading  } = useMutation({

      mutationFn: async (id:number)=>{
          const {  data  } = await axios.delete(BASE_URL+`/animals/${id}`, { headers:{  Authorization: getTokenString() }})
          return data
      },


      onError: ()=>{
        console.error("Something went wrong")
      },


      onSuccess:()=>{  
        handleClose()
        queryClient.invalidateQueries(["animals"])
      }


  })

   
  

  const columns = 
    [

      
      { field: 'id', headerName: 'ID'},
      { field: 'name', headerName: 'Name' },
      { field: 'dob', headerName: 'Date of birth'},
      { field: 'age', headerName: "Age",  renderCell :(params)=>{

          return `${dayjs(params.row.dob).from(dayjs(), true)}`
      }},
      { field: 'breed', headerName: 'Breed',
    
        renderCell: (params=>{
          return params.value.name
        })
      },
  
      {
        field:"sex", headerName:"Sex"

      },
      
      {
         headerName:"In farm", renderCell:(params)=>{

          
          return <>{params.row.inFarm ? "Yes": "No"}</>
        }

      },

      {
        field: "actions", headerName:"Actions",
        renderCell: (params=>{
    
          return <>

            <Tooltip title={"Details"}>
              <IconButton  onClick={()=>{ navigate(`${pathname}/animals/${params.row.id}`)}} aria-label="info" size="small">
                  <InfoIcon color='primary' fontSize="inherit" />
              </IconButton>
            </Tooltip>

            <Tooltip title={"Edit"}>
              <IconButton   aria-label="delete" size="small" onClick={()=>handleEdit(params.row.id)}>
                  <EditIcon color={"info"} fontSize="inherit" />
              </IconButton>
            </Tooltip>  

            <Tooltip title={"Delete"}>
              <IconButton   aria-label="delete" size="small" onClick={()=>handleOpen(params.row.id)}>
                  <DeleteIcon color={"error"} fontSize="inherit" />
              </IconButton>
            </Tooltip>  
            </>
        })
      }
      
    ] as GridColDef<Animal>[] ;
  // },[navigate, pathname])


    if(animals.isLoading) return <CircularProgress/>

    if(animals.isError) return <>Something went wrong</>



    return (
      <div style={{ height: 500, width: '100%' }}>
      
      <DataGrid
        rows={animals.data}
        columns={columns}
        disableColumnSelector
        
        
        initialState={{

          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[20, 40]}

      />

    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you delete this animal you can recover the data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ handleConfirmDelete()}} disabled={isLoading} color="error" > Delete</Button>
          <Button onClick={handleClose} variant='contained'  autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>


      <AddAnimal animals={animals.data} farmId={+id!} onClose={onClose} isOpen={openAnimal}/>
      {
          refId.current ? <EditAnimal toUpdate={refId.current} animals={animals.data} farmId={+id!} onClose={handleCloseEdit} isOpen={edit}/> : null
      }
        
    </div>

    )

}

