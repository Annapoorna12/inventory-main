import React from 'react';
import { Typography, Button, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Navbar from './Navbar';

const HomePage = () => {
  
  return (
    <div>
       <Navbar />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Our Shop
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome to our online shop! We offer a wide range of products to meet your needs. Whether you're looking for electronics, clothing, accessories, or more, we've got you covered. Shop with us today and experience convenience, quality, and great prices!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Bestsellers */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
              Bestsellers
            </Typography>
            <Grid container spacing={2}>
              {/* Product cards */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia component="img" height="140" image="/product1.jpg" alt="Product 1" />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Product 1
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description of Product 1
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>Add to Cart</Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia component="img" height="140" image="/product2.jpg" alt="Product 2" />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Product 2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description of Product 2
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>Add to Cart</Button>
                  </CardContent>
                </Card>
              </Grid>
              {/* Add more product cards as needed */}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default HomePage;
