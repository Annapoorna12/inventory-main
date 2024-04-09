import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Stack, Container, Typography, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ServiceURL from '../../../constants/url';
import { toast } from "react-toastify";


export default function Add(details) {

  const [update, setUpdate] = useState(details.updated);
  const [suppliers, setSuppliers] = useState([]);
  const [UserID,setUserID] = useState('');

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${ServiceURL}/staff/fetchSuppliers`);
      setSuppliers(response.data.result);
      // console.log(response.data.result);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    const UserData = JSON.parse(localStorage.getItem('data'));
    // console.log(UserData.data[0].UserID)
    if(UserData != null && UserData.Role === 'Sales'){
      setUserID(UserData.data[0].UserID)
    }else{
      setUserID('')
    }
    fetchSuppliers();
  }, []);

  const validSchema = Yup.object().shape({
    PurchaseName: Yup.string().required("Purchase Name is required"),
    PurchaseAmount: Yup.number().required("Purchase Amount is required").min(1, "Purchase Amount must be at least 1"),
    Quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
    SupplierID: Yup.number().required("Supplier is required"),
    PurchaseDate: Yup.date().required("Purchase Date is required"),
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      PurchaseName: update ? details.data.name : "",
      Quantity: update ? details.data.quantity : "",
      PurchaseAmount: update ? details.data.PurchaseAmount : "",
      SupplierID: update ? details.data.supplierID : "",
      PurchaseDate: update ? details.data.purchaseDate : "",
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd(values);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const onAdd = async (data) => {
    try {
      const response = await axios.post(`${ServiceURL}/staff/addPurchase`, { data,UserID });
      if (response.data.message === "Sorry, purchase already exists.") {
        setAlert(response.data.message);
      } else {
        setAlert('');
        toast.success(response.data.message, {
          position: "top-right"
        });
        formik.resetForm();
        details.fetchData();
        details.onClose();
      }
    } catch (error) {
      console.error("Error adding purchase:", error);
      setAlert("Error adding purchase. Please try again.");
    }
  }

  const onClose = () => {
    formik.resetForm();
    details.onClose();
  };

  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Purchase
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={2} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">PURCHASE DETAILS</Typography>
            <TextField
              fullWidth
              label="Purchase Name"
              variant="outlined"
              {...getFieldProps("PurchaseName")}
              error={Boolean(touched.PurchaseName && errors.PurchaseName)}
              helperText={touched.PurchaseName && errors.PurchaseName}
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              variant="outlined"
              {...getFieldProps("Quantity")}
              error={Boolean(touched.Quantity && errors.Quantity)}
              helperText={touched.Quantity && errors.Quantity}
            />
            <TextField
              fullWidth
              type="number"
              label="Purchase Amount"
              variant="outlined"
              {...getFieldProps("PurchaseAmount")}
              error={Boolean(touched.PurchaseAmount && errors.PurchaseAmount)}
              helperText={touched.PurchaseAmount && errors.PurchaseAmount}
            />
            <FormControl fullWidth variant="outlined" error={Boolean(touched.SupplierID && errors.SupplierID)}>
              <InputLabel>Supplier</InputLabel>
              <Select
                {...getFieldProps("SupplierID")}
                label="Supplier"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.UserID} value={supplier.UserID}>{supplier.FullName}</MenuItem>
                ))}
              </Select>
              {touched.SupplierID && errors.SupplierID && <Typography variant="body2" color="error">{errors.SupplierID}</Typography>}
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Purchase Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              {...getFieldProps("PurchaseDate")}
              error={Boolean(touched.PurchaseDate && errors.PurchaseDate)}
              helperText={touched.PurchaseDate && errors.PurchaseDate}
            />
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
