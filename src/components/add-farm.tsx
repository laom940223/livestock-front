import { Box,  Modal, Typography } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Farm } from "../pages/dashboard";
import { BASE_URL, ServerResponse } from "../utils/const";
import axios, { AxiosError } from "axios";
import { getTokenString } from "../utils/token-utils";


const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const schema = z.object({
    name: z.string().min(4, { message: 'This field is required' }),
    address: z.string().min(8, { message: 'This field is required' }),
   
    
  });




  // private String name;
  // @JsonFormat( pattern = "yyyy-MM-dd")
  // private String dob;
  // private Long breed_id;
  // private Long father_id;
  // private Long mother_id;
  // private Long farm_id;


export const AddFarm = ({ open, onClose}:{ open:boolean, onClose:()=>void })=>{

    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,   
         setError,
  
        formState:{errors},
      } = useForm({
        resolver: zodResolver(schema),
    
      });


      const  {mutate } = useMutation<  ServerResponse<Farm>, AxiosError<ServerResponse<unknown>> ,unknown, { name: string, address: string}>({ 
       
        mutationFn: async ( variables )=>{
    
            const response = await  axios.post<ServerResponse<Farm>>(BASE_URL+"/farms", variables, {
                headers:{
                    Authorization:getTokenString()
                }
            })

            

            return response.data
        },
  
        onError: (error)=>{


            
        

          const serverErrors =  error.response?.data.errors
          serverErrors?.forEach(fieldError=>{

            if(fieldError.location==="REQUEST")

             setError(fieldError.location,{ message: fieldError.message}, {shouldFocus:true} )
          })
        },
  
        onSuccess: (  )=>{
  
        
          
          queryClient.invalidateQueries(["farms"])
        
          onClose()
  
        }
  
      })
    


      const submitFunction = async (values:FieldValues)=>{
        mutate({name: values.name, address: values.address })

        // console.log(values)
    
      }


    return(
        <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Add a farm
                </Typography>
              
                <Box component="form" onSubmit={handleSubmit(submitFunction)}  sx={{ mt: 1 }}>
              <TextField
              {...register("name")}
                margin="normal"
                
                fullWidth
                
                label="Name"
                
                
                autoFocus
                error={!!errors["name"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["name"] ? errors["name"].message as string : ""  }
              />
              <TextField
                {...register("address")}
                margin="normal"
                
                fullWidth
                label="Address"
                error={!!errors["address"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["address"] ? errors["address"].message as string : ""  }
              />
              
              

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add
              </Button>
              
            </Box>

            </Box>
        </Modal>
    )
}