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


export default function EditRaw({ editedPurchase, onClose ,fetchData }) {
  const validSchema = Yup.object().shape({
    PurchaseName: Yup.string().required("Purchase Name is required"),
    Quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
    PurchaseAmount: Yup.number().required("Purchase Amount is required").min(1, "Purchase Amount must be at least 1"),
    SupplierID: Yup.string().required("Supplier is required"),
    PurchaseDate: Yup.date().required("Purchase Date is required"),
  });

  const [alertMsg, setAlert] = useState();
  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${ServiceURL}/staff/fetchSuppliers`);
      setSuppliers(response.data.result);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const formik = useFormik({
    initialValues: {
      PurchaseID: editedPurchase ? editedPurchase.PurchaseID : "",
      PurchaseName: editedPurchase ? editedPurchase.PurchaseName : "",
      Quantity: editedPurchase ? editedPurchase.Quantity : "",
      SupplierID: editedPurchase ? editedPurchase.SupplierID : "",
      PurchaseAmount: editedPurchase ? editedPurchase.PurchaseAmount : "",
      PurchaseDate: editedPurchase ? formatDate(editedPurchase.PurchaseDate) : "",
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      // console.log(values);
      onUpdate(values);
    },
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const onUpdate = async (data) => {
    console.log(data);
    axios.put(`${ServiceURL}/staff/updatePurchase`, { data, PurchaseID: editedPurchase.PurchaseID })
    .then((response) => {
      if(response.data.message === "Purchase updated successfully"){
        toast.success(response.data.message, {
          position: "top-right"
        });
        fetchData();
        onClose();
      } else {
        setAlert("Error updating purchase. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error updating purchase:", error);
      setAlert("Error updating purchase. Please try again.");
    });
  };

  return (
    <Dialog fullScreen open={true} onClose={onClose}>
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
            Edit Purchase
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Stack spacing={2} justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="h4">PURCHASE DETAILS</Typography>
          <TextField
            fullWidth
            type="text"
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
            type="date" // Change type to datetime-local
            label="Purchase Date"
            variant="outlined"
            {...getFieldProps("PurchaseDate")}
            error={Boolean(touched.PurchaseDate && errors.PurchaseDate)}
            helperText={touched.PurchaseDate && errors.PurchaseDate}
          />
        </Stack>
      </Container>
    </Dialog>
  );
}
