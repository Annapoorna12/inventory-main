import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import Popover from "@mui/material/Popover";


import { mainListItems } from '../components/salesmanager/listItems';

import {useAuth} from '../hooks/useAuth';
import ServiceURL from "../constants/url";
import axios from "axios";

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();



export default function SalesManagerLayout({children}) {

  const {logout} = useAuth();

  const [notifications, setNotifications] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
     logout();
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${ServiceURL}/admin/stocks`)
        .then((response) => {
          console.log(response.data);
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Something went wrong while fetching", error);
        });
    };

    fetchData();
  }, []);

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "notification-popover" : undefined;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', 
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Sales Manager Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handlePopoverOpen}>
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Badge  color="secondary">
                <LogoutIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                {/* <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}> */}
                  { children }
                {/* </Paper> */}
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{color: "red"}}>No notifications</Typography>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.ProductID}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      notification.StockStatus === "Out of Stock"
                        ? "red"
                        : "inherit",
                  }}
                >
                  {notification.StockQuantity === 0 && (
                    <>
                      {notification.ProductName} is {notification.StockStatus}
                    </>
                  )}
                </Typography>
                {notification.StockQuantity <= 5 &&
                  notification.StockQuantity !== 0 && (
                    <Typography variant="body2" sx={{ color: "orange" }}>
                      {notification.ProductName} - Low stock quantity, Remaining
                      Stock - {notification.StockQuantity}
                    </Typography>
                  )}
                <Divider sx={{ my: 1 }} />
              </React.Fragment>
            ))
          )}
        </Box>
      </Popover>

      </Box>
    </ThemeProvider>
  );
}
