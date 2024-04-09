import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Grid, Card, CardContent, CardMedia, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ServiceURL from '../constants/url';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userID ,setUserID] = useState('');
  const navigate = useNavigate();

  const fetchData = () => {
    axios.post(`${ServiceURL}/users/get-cart-data`, { userID: userID })
      .then(response => {
        console.log(response.data.results);
        setCartItems(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
      });
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('data'));
    
    if (userData != null) {
      console.log(userData[0].UserID);
      setUserID(userData[0].UserID);
    } else {
      setUserID('');
    }   
  }, []);

  useEffect(() => {
    fetchData();
  }, [userID])

  const handleDelete = (id) => {
    // Implement delete functionality
  };

  const handleDecrement = (id) => {

  }

  const handleIncrement = (id) => {
    // Implement increment functionality
  };

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Divider />
        {cartItems.length === 0 ? ( // Check if cart is empty
          <Typography variant="body1">
            Your cart is empty.
          </Typography>
        ) : (
          <Grid container spacing={3} mt={4}>
            {cartItems.map((item) => (
              <Grid item xs={12} sm={8} md={4} key={item.cartChildID}>
                <Card>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`../../src/uploads/${item.productImage}`}
                        alt={item.productImage}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.productName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {item.productDescription}
                        </Typography>
                      </CardContent>
                    </Grid>
                    
                    <Grid item xs={12} sm={3}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <IconButton onClick={() => handleDecrement(item.id)} disabled={item.Quantity === 1}>
                          -
                        </IconButton>
                        <Typography variant="body1">{item.Quantity}</Typography>
                        <IconButton onClick={() => handleIncrement(item.id)}>
                          +
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="center" p={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(item.cartChildID)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default CartPage;
