import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios, { AxiosError } from "axios"
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  BASE_URL, ServerResponse } from '../utils/const';
import { TOKEN_KEY, getAuthQuery } from '../components/protectedRoute';
import { useNavigate, Navigate, Link as NavLink } from 'react-router-dom';


const schema = z.object({
  username: z.string().min(4, { message: 'This field is required' }),
  password: z.string().min(8, { message: 'Password is required' }),
  confirmPassword: z.string().min(8, { message: 'Password is required' }),
  email:    z.string().email("Please provide a valid email"),
  name: z.string().min(4, { message: 'This field is required' }),
  lastname: z.string().min(3, { message: "Please provide a lastname"}),
}); 









export default function SignUp() {
   

    const {
      register,
      handleSubmit,   
       setError,

      formState:{errors},
    } = useForm({
      resolver: zodResolver(schema),
  
    });

    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const  {mutate } = useMutation<  ServerResponse<{ token:string}>, AxiosError<ServerResponse<unknown>> ,unknown, { username: string, password: string}>({ 
      mutationFn: async ( variables )=>{
  
          const response = await  axios.post<ServerResponse<{token:string}>>(BASE_URL+"/auth/register", variables)
          return response.data
      },

      onError: (error)=>{
        const serverErrors =  error.response?.data.errors
        serverErrors?.forEach(fieldError=>{
           setError(fieldError.location,{ message: fieldError.message}, {shouldFocus:true} )
        })
      },

      onSuccess: ( {data} )=>{

        
        localStorage.setItem(TOKEN_KEY, data.token)
        queryClient.invalidateQueries(["auth"])
        navigate("/")

      }

    })
  
    const submitFunction = async (values:FieldValues)=>{
      mutate(values)
        
    }
     


  
  
    const { data, isLoading  } = useQuery(["auth"], getAuthQuery)
    
    if(isLoading) return <>Loading...</>


    if(data) return <Navigate to="/" />


    return (  
      
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitFunction)}  sx={{ mt: 1 }}>
             
              <TextField
              {...register("username")}
                margin="normal"
                fullWidth
                label="Username"
                autoFocus
                error={!!errors["username"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["username"] ? errors["username"].message as string : ""  }
              />

            <TextField
                {...register("email")}
                margin="normal"
                
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!errors["email"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["email"] ? errors["email"].message as string : ""  }
              />


                <TextField
                {...register("name")}
                margin="normal"
                fullWidth
                label="Name"
                autoComplete="name"
                autoFocus
                error={!!errors["name"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["name"] ? errors["name"].message as string : ""  }
                /> 

                <TextField
                {...register("lastname")}
                margin="normal"
                
                fullWidth
                label="Lastname"
                autoFocus
                error={!!errors["lastname"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["lastname"] ? errors["lastname"].message as string : ""  }
              />

              <TextField
                {...register("password")}
                margin="normal"
                
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors["password"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["password"] ? errors["password"].message as string : ""  }
              />
              <TextField
                {...register("confirmPassword")}
                margin="normal"
                
                fullWidth
                
                label="Confirm password"
                type="password"
                
                error={!!errors["confirmPassword"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["confirmPassword"] ? errors["confirmPassword"].message as string : ""  }
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/login"  component={NavLink} variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
        </Container>
      
    )
  
  }