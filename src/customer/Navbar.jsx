import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const Navbar = () => {
  const [login, setLogin] = useState(false);
  const { logout } = useAuth();
  useEffect(() => {
    const userData = localStorage.getItem("data");
    if (userData !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management System
        </Typography>
        {login ? (
          <>
            <Button color="inherit" component={Link} to="/prodcutview">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Sign In</Button>
            <Button color="inherit" component={Link} to="/register">Sign Up</Button>
            <Button color="inherit" component={Link} to="/prodcutview">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
