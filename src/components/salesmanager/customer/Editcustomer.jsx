import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Stack, Container, Typography, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ServiceURL from '../../../constants/url';
import { toast } from "react-toastify";

export default function EditCustomer({ editedCustomer, onClose ,fetchData }) {
  const validSchema = Yup.object().shape({
    Username: Yup.string()
    .matches(/^\S/, "Whitespace is not allowed")
    .required("Name is required"),
    FullName: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Name is required"),
    ContactNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    Email: Yup.string()
      .email("Invalid Format")
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Email number is required"),
    Address: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Address is required"),
      Password: Yup.string().matches(/^\S/,"Whitespace is not allowed").required("Password is required")
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      Username: editedCustomer.Username,
      FullName: editedCustomer.FullName,
      ContactNumber: editedCustomer.ContactNumber,
      Email: editedCustomer.Email,
      Address: editedCustomer.Address,
      Password: editedCustomer.Password,
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onUpdate(values);
    },
  });
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const onUpdate = async (data) => {
    axios.put(`${ServiceURL}/admin/updatecustomer`, { data, oldData: editedCustomer })
    .then((response) => {
        if(response.data.message === "Email or username is already associated with another account"){
            setAlert(response.data.message)
        }else{
            toast.success(response.data.message, {
                position: "top-right"
              });
            fetchData();
            onClose();
        }
      
    })
    .catch((error) => {
      console.error("Error updating customer:", error);
      setAlert("Error updating customer. Please try again.");
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
            Edit Customer
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="h4">CUSTOMER DETAILS</Typography>

          <TextField
            fullWidth
            type="text"
            label="Username"
            variant="outlined"
            {...getFieldProps("Username")}
            error={Boolean(touched.Username && errors.Username) || alertMsg }
            helperText={touched.Username && errors.Username || alertMsg }
          />

          <TextField
            fullWidth
            type="text"
            label="Full Name"
            variant="outlined"
            {...getFieldProps("FullName")}
            error={Boolean(touched.FullName && errors.FullName)}
            helperText={touched.FullName && errors.FullName}
          />
          <TextField
            fullWidth
            type="number"
            label="Contact Number"
            variant="outlined"
            {...getFieldProps("ContactNumber")}
            error={Boolean(touched.ContactNumber && errors.ContactNumber)}
            helperText={touched.ContactNumber && errors.ContactNumber}
          />
          <TextField
            fullWidth
            type="text"
            label="Email"
            variant="outlined"
            {...getFieldProps("Email")}
            error={Boolean(touched.Email && errors.Email) || alertMsg}
            helperText={(touched.Email && errors.Email) || alertMsg }
          />
          <TextField
            fullWidth
            type="text"
            label="Address"
            variant="outlined"
            {...getFieldProps("Address")}
            error={Boolean(touched.Address && errors.Address)}
            helperText={touched.Address && errors.Address}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            {...getFieldProps("Password")}
            error={Boolean(touched.Password && errors.Password)}
            helperText={touched.Password && errors.Password}
          />
        </Stack>
      </Container>
    </Dialog>
  );
}
