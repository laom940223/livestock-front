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
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});





export default function SignIn() {
   

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
  
          const response = await  axios.post<ServerResponse<{token:string}>>(BASE_URL+"/auth/login", variables)
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
      mutate({username: values.username, password: values.password })
  
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
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitFunction)}  sx={{ mt: 1 }}>
              <TextField
              {...register("username")}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                error={!!errors["username"]}
                // eslint-disable-next-line no-extra-boolean-cast
                helperText={ !!errors["username"] ? errors["username"].message as string : ""  }
              />
              <TextField
                {...register("password")}
                margin="normal"
                required
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
                    
                      <Link  to="/#"  component={NavLink} variant="body2" >
                        Forgot password?
                      </Link>
                    

                </Grid>
                <Grid item>

                  <Link to="/signup"  component={NavLink} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                
                </Grid>
              </Grid>
            </Box>
          </Box>
          
        </Container>
      
    )
  
  }