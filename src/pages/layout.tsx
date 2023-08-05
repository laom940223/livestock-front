


import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';

import { Alert, CircularProgress, Grid, Snackbar } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TOKEN_KEY } from '../components/protectedRoute';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Link } from '@mui/material';
import { BASE_URL, ServerResponse, User } from '../utils/const';
import axios, { AxiosError, isAxiosError } from 'axios';

const drawerWidth = 240;


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export const Layout = ()=>{


const queryClient = useQueryClient()

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);


  const {data, isLoading, isError , error, failureReason} = useQuery<ServerResponse<User>, AxiosError<ServerResponse<unknown>>>(["me"], async()=>{

        const response= await  axios.get(BASE_URL+"/me", {
                headers:{
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
        })

        return response.data
  }, {

    
  })



  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const handleLogout = () =>{

        localStorage.removeItem(TOKEN_KEY)
        queryClient.invalidateQueries(["auth"])
  }


  

    

  
  if(isLoading) {
    
      
    
      return (
        <>

          {failureReason?
            <Snackbar 
                open={!!failureReason}  
                autoHideDuration={6000}
                anchorOrigin={{ vertical:"bottom", horizontal:"right"  }}
                
                >
              <Alert severity="error">{failureReason.message}</Alert>
            </Snackbar>:

            null}
          
          <CircularProgress />
        </>
      
      )
  
  
  }




  if(isError){
    
    
    
    
    if(error.response){

         if(error.response.data.errors[0].message.includes("JWT")){

          localStorage.removeItem(TOKEN_KEY)
          queryClient.invalidateQueries(["auth"])
         }
    }


    if(isAxiosError(error)){

      return("Please check your connection")

    }
    

    return "Something went wrong"
  }

  
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      
      <AppBar position="fixed" open={open}>
      <Grid container sx={{
                height:"64px" ,
      }}  >
              <Grid xs={2} sx={{height:"100%" }} >

                   <Box sx={{
                        display:"flex",
                        justifyContent:"space-around",
                        alignItems:"center",
                        
                        height:"100%"
                   }}>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                        marginLeft:.8,
                ...(open && { display: 'none' }),
                }}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                Livestock control
                </Typography>
           </Box>

          </Grid>
                <Grid xs={10}   sx={{  display:"flex", alignItems:"center", justifyContent:"flex-end",
                                paddingRight:4

                        }}>
                


                <Tooltip title="Account settings">
                        <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        >
                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                        </IconButton>
                </Tooltip>
                <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openMenu}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                        elevation: 0,
                        sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                 >

                      <MenuItem >
                                {`Hello ${data?.data.username}`}
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                          <Link sx={{color:"MenuText", textDecoration:"none"}} component={RouterLink} to="/profile">
                            <Box sx={{display:"flex", alignItems:"center"}}>
                              <Avatar /> <span>Profile</span>
                            </Box>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                                <Avatar /> My account
                        </MenuItem>
                        
                        <Divider />
                        
                        <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                        <Logout fontSize="small" />
                                </ListItemIcon>
                                 Logout
                        </MenuItem>
                </Menu>

                

                </Grid>
        </Grid>
                

        
      </AppBar>


      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[{ text: "Home", path:"/"}].map((prop, index) => (
            <ListItem key={prop.text} disablePadding sx={{ display: 'block' }}>
             <Link component={RouterLink} sx={{textDecoration:"none"}} to={prop.path} >
              <ListItemButton
                
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={prop.text} sx={{ opacity: open ? 1 : 0, textDecoration:"none" }} />
                
              </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
       
                  <Outlet/>
                
      </Box>
    </Box>
  )

}