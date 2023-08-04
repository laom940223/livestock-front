import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { BASE_URL, ServerResponse } from "../utils/const";
import axios, { AxiosError } from "axios";
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { getTokenString } from "../utils/token-utils";
import { Box, Button, Checkbox, InputLabel, Modal, TextField, Typography } from "@mui/material";
import { Animal, AnimalBreed } from "../pages/farm-detail";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs, {Dayjs} from 'dayjs';
import { useState } from "react";


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
    name:       z.string().min(4, { message: 'This field is required' }),
    sex:        z.enum(["MALE", "FEMALE"]),
    breed:      z.number(),
    father:     z.number().optional(),
    mother:     z.number().optional(),
    dob:        z.instanceof(dayjs as unknown as typeof Dayjs)
  });



const getBreeds = async ()=>{
      const {   data } = await axios.get<ServerResponse<AnimalBreed[]>>(BASE_URL+"/breeds", {

        headers:{
          Authorization: getTokenString()
        }
        
      })
      return data.data

}


export const AddAnimal = ({onClose, isOpen, animals ,farmId } : { onClose: ()=>void, animals:Animal[] ,isOpen: boolean, farmId: number})=>{


  const [addMom, setAddMom ]= useState(false)
  const [addDad, setAddDad] = useState(false)

  const queryClient = useQueryClient()


  const onChangeMomSelect =() =>{  setAddMom(prev => !prev)}
  const onChangeDadSelect = ()=>{ setAddDad(prev=> !prev)}


   const { data: breeds, isLoading: isBreedLoading, isError: isBreedError}  =  useQuery<AnimalBreed[]>(["breed"], getBreeds)

    const {
        register,
        handleSubmit,  

        reset,
        setError,
        control,
        formState:{errors},
      } = useForm({
        resolver: zodResolver(schema),
    
      });


      const  {mutate, isLoading } = useMutation<  ServerResponse<Animal>, AxiosError<ServerResponse<unknown>> ,unknown, { name: string, address: string}>({ 
       
        mutationFn: async ( variables )=>{
    
            const response = await  axios.post<ServerResponse<Animal>>(BASE_URL+"/animals", variables, {
                headers:{
                    Authorization:getTokenString()
                }
            })
            return response.data
        },
  
        onError: (error)=>{
          const serverErrors =  error.response?.data.errors
          serverErrors?.forEach(fieldError=>{

            if(fieldError.location==="REQUEST") return

             setError(fieldError.location,{ message: fieldError.message}, {shouldFocus:true} )
          })
        },
  
        onSuccess: (  )=>{
  
          queryClient.invalidateQueries(["animals"])
          
          setAddDad(false)
          setAddMom(false)
          reset()
          onClose()
        }
  
      })
    


      const submitFunction = async (values:FieldValues)=>{
        


        // if(dayjs().isBefore(values.dob)) setError("dob", {message:"You can not select a future date"}, {shouldFocus:true})

        const dob = values.dob.format("YYYY-MM-DD")
       const data=  {name: values.name, dob, breed_id: values.breed, sex: values.sex, farm_id:farmId, mother_id: values.mother, father_id: values.father }



      //  console.log(data)
        mutate(data)
       




      }



      const males = animals.filter( animal => animal.sex === "MALE")
      const females = animals.filter(animal=> animal.sex === "FEMALE")


      
      
    

    return(
        <Modal
        open={isOpen}
        onClose={onClose}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Add an animal
                </Typography>
              
                <Box component="form" onSubmit={handleSubmit(submitFunction)}  sx={{ mt: 1, display:"flex", flexDirection:"column", gap:3 }}>
                    
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

                    <Controller
                        control={control}
                        name="dob"
                        defaultValue={dayjs()}
                  
                        render={({ field: { onChange,  value } }) => (
                        <DatePicker
                            label="Date of birth"
                            format="YYYY-MM-DD"

                            disableFuture
                            onChange={onChange} // send value to hook form
                            // onBlur={onBlur} // notify when input is touched/blur
                            value={value}                />
                        )}
                    />
              
              
                    <Controller
                              control={control}
                              name="sex"
                              defaultValue={"MALE"}
                              render={({ field: { onChange,  value } }) => (

                                <>
                                  <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={value}
                                  label="Breed"
                                  onChange={(e: SelectChangeEvent)=>{  onChange( e.target.value) }}
                                  >
                                    <MenuItem value={"MALE"}>Male</MenuItem>
                                    <MenuItem value={"FEMALE"}>Female</MenuItem>

                                  </Select>
                                </>
                              )}
                              />


                    {
                        !isBreedLoading ?


                          !isBreedError ? 
                              <Controller
                              control={control}
                              name="breed"
                              defaultValue={breeds[0].id}
                              render={({ field: { onChange,  value } }) => (

                                <>
                                  <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={value}
                                  label="Breed"
                                  onChange={(e: SelectChangeEvent)=>{  onChange( e.target.value) }}
                                  >
                                    {breeds.map( breed => <MenuItem key={breed.id} value={breed.id}>{breed.name}</MenuItem> )}
                                  </Select>
                                </>
                              )}
                              />

                              : <>Something went wrong</>
                          :
                          <>Loading...</>
                    }      



                    { females.length> 0 ?
                    
                    <Box sx={{display:"flex" , alignItems:"center", justifyContent:"flex-start", flexWrap:"wrap"} }>
                      <InputLabel> Add mom?</InputLabel>
                    <Checkbox name="Add mom" checked={addMom} onChange={onChangeMomSelect} />

                    {

                      addMom ?
                          <Controller
                              control={control}
                              name="mother"
                              defaultValue={females[0].id}
                              render={({ field: { onChange,  value } }) => (

                                <>
                                  
                                  <Select
                                  sx={{width:"100%"}}
                                  id="mother"
                                  value={value}
                                  labelId="mom_label"
                                  onChange={(e: SelectChangeEvent)=>{ 
                                      console.log(e.target.value)
                                    onChange( e.target.value) }}
                                  >
                                    {females.map( female => <MenuItem key={female.id} value={female.id}>{female.name}</MenuItem> )}
                                  </Select>
                                </>
                              )}
                              /> :
                              null
                      }
                  </Box>
              
                    :  null}
                    
                    

                    { males.length> 0 ?
                    
                    <Box sx={{display:"flex" , alignItems:"center", justifyContent:"flex-start", flexWrap:"wrap"} }>
                    <InputLabel> Add dad?</InputLabel>
                    <Checkbox name="Add dad"  checked={addDad} onChange={onChangeDadSelect} />

                    {

                      addDad ?
                          <Controller
                              control={control}
                              name="father"
                              defaultValue={males[0].id}
                              render={({ field: { onChange,  value } }) => (

                                <>
                                  
                                  <Select
                                  sx={{width:"100%"}}
                                  id="father"
                                  value={value}
                                  labelId="father_label"
                                  onChange={(e: SelectChangeEvent)=>{ 
                                      
                                    onChange( e.target.value) }}
                                  >
                                    {males.map( male => <MenuItem key={male.id} value={male.id}>{male.name}</MenuItem> )}
                                  </Select>
                                </>
                              )}
                              /> :
                              null
                      }
                  </Box>
                    
                    
                    
                    :  null}
                    
                    
                  

                

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                Add
              </Button>
              
            </Box>

            </Box>
        </Modal>
    )


}