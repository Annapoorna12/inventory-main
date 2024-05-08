import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Paper, Card, CardContent, IconButton, CircularProgress, Button, Popover } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetApp as GetAppIcon } from "@mui/icons-material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ServiceURL from "../../../constants/url";
import { generateInvoicePDF } from "./bill";
// import jsPDFInvoiceTemplate from "jspdf-invoice-template";

const OrdersPage = () => {
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('data'));
    if (userData != null) {
      setUserID(userData[0].UserID);
    } else {
      setUserID('');
    }
  }, []);

  useEffect(() => {
    if (userID !== '') {
      fetchdata();
    }
  }, [userID]);

  const fetchdata = () => {
    setLoading(true);
    axios.post(`${ServiceURL}/users/GetOrderDetails`, { userID }).then(response => {
      setLoading(false);
      if (response.data && response.data.orders) {
        const dataWithIds = response.data.orders.map((item, index) => ({ ...item, id: index + 1, ProductDetails: JSON.parse(item.ProductDetails) }));
        setProducts(dataWithIds);
        const sortedData = dataWithIds.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)); // Sort by OrderDate in descending order
      setProducts(sortedData);
      } else {
        setProducts([]);
      }
    }).catch(error => {
      setLoading(false);
      console.error('Error fetching order details:', error);
      setError(error.message);
      setProducts([]);
    });
  }

  function formatDateOnly(dateTimeString) {
    const dateObject = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    return dateObject.toLocaleDateString('en-US', options);
  }

  const generatePDF = (data) => {
    console.log(data)
    generateInvoicePDF(data)
  };

  const handleClick = (event, productDetails) => {
    setSelectedProduct(productDetails);
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'SI NO', flex: 1 },
    { field: 'OrderDate', headerName: 'Order Date', flex: 1 },
    { field: 'TotalAmount', headerName: 'Total Amount(without gst)', flex: 1 },
    {
      field: 'ProductDetails',
      headerName: 'Product Details',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button onClick={(event) => handleClick(event, params.value)}>
            View Details
          </Button>
          <Popover
            open={open && anchorEl}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography sx={{ p: 2 }}>
              {selectedProduct && selectedProduct.map((product, index) => (
                <div key={index}>
                  <span>{product.ProductName} - Quantity: {product.Quantity} - Unit Price: {product.UnitPrice}</span>
                </div>
              ))}
            </Typography>
          </Popover>
        </>
      ),
    },
    {
      field: 'download',
      headerName: 'Download Invoice',
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => generatePDF(params.row)}>
          <GetAppIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ maxWidth:"100vw" , margin: "auto" }}>
      <Header />
      <Card style={{ marginTop: 20 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">Order Details</Typography>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography variant="body1" align="center">{error}</Typography>
          ) : products.length === 0 ? (
            <Typography variant="body1" align="center">No orders present</Typography>
          ) : (
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={products}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export default OrdersPage;
