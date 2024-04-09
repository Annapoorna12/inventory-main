import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Select, MenuItem } from '@mui/material';
import Navbar from './Navbar';
import axios from 'axios';
import ServiceURL from '../constants/url';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {

  const baseUrl = `http://localhost:3000/uploads/`;

  const [userID ,setUserID] = useState('');

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fetchdata = () => {
      axios.get(`${ServiceURL}/users/view-active-products`).then(response=>{
        console.log(response.data.results)
        setProducts(response.data.results)
    })
  }
  useEffect(() =>{
    fetchdata();
    const userData = JSON.parse(localStorage.getItem('data'));
    if (userData != null) {
      console.log(userData[0].UserID);
      setUserID(userData[0].UserID);
    } else {
      setUserID('');
    }
  },[])

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category === 'All') {
      fetchdata();
   } else {
      const filteredProducts = products.filter((product) => product.category === category);
      setProducts(filteredProducts);
    }
  };

  const AddtoCart = (productID) => {
    console.log('AddtoCart', productID,userID)
    axios.post(`${ServiceURL}/users/addtocart`,{
      userID: userID,
      productID: productID
    }).then((response) => {
        console.log(response.data);
        navigate('/cart');
        if(response.data.success){
          
        }
    }).catch((error) =>{
      console.error(error);
    });
  }

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Box mb={2}>
          <Select value={selectedCategory} onChange={handleCategoryChange} variant="outlined">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Category 1">Category 1</MenuItem>
            <MenuItem value="Category 2">Category 2</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.ProductID} xs={12} sm={6} md={4} lg={3}>
              <Card>
              {product.productImage && 
                <CardMedia
                  component="img"
                  height="200"
                  image={`../../src/uploads/${product.productImage}`} 
                  alt={product.productImage}
                />
              }
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.Name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" mb={2}>
                    {product.Description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.Price}
                  </Typography>
                  <Typography variant="body2" color={product.Status === 'Available' ? 'green' : 'red'}>
                    Product: {product.Status}
                  </Typography>
                  <Typography variant="body2" color={product.StockStatus === 'In Stock' ? 'green' : 'red'}>
                    Stock: {product.StockStatus}
                  </Typography>
                </CardContent>
                <Box p={2} textAlign="center">
                  {userID ? (
                    <Button variant="contained" color="primary" onClick={()=>{AddtoCart(product.ProductID)}}>
                        Add to Cart
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={()=>{navigate('/login')}}>
                        Add to Cart
                    </Button>
                  )  
                } 
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ProductPage;
