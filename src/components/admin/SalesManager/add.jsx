import React, { useState, useEffect } from "react";
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


export default function AddStaff(details) {
  const [update, setUpdate] = useState(details.updated);
  const validSchema = Yup.object().shape({
    Username: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Name is required"),
    CustomerName: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Name is required"),
    Mobnum: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    Email: Yup.string()
      .email("Invalid Format")
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Email number is required")
      ,
    Address: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Address is required"),
    Password: Yup.string().matches(/^\S/,"Whitespace is not allowed").required("Password is required")
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      CustomerName: update ? details.data.name : "",
      Mobnum: update ? details.data.mobile : "",
      Email: update ? details.data.email : "",
      Address: update ? details.data.address : "",
      Password: update ? details.data.password : ""
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd(values);
    },
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const onAdd = async (data) => {

    axios.post(`${ServiceURL}/admin/addSalesManager`, { data })
    .then((response) => {
      if (response.data.message === "Sorry, email or username is already associated with an account.") {
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
    })
    .catch((error) => {
      console.error("Error adding customer:", error);
      setAlert("Error adding customer. Please try again.");
    });
  }

  const onclose = () => {
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
              onClick={onclose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Employee
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
                Add
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">SALES MANAGER DETAILS</Typography>

            <TextField
              fullWidth
              type="number"
              label="Mobile Number"
              variant="outlined"
              value={details.update ? details.data.name : ""}
              {...getFieldProps("Mobnum")}
              error={Boolean((touched.Mobnum && errors.Mobnum))}
              helperText={(touched.Mobnum && errors.Mobnum)}
            />
            <TextField
              fullWidth
              type="text"
              label="Username"
              variant="outlined"
              value={details.update ? details.data.Username : "" }
              {...getFieldProps("Username")}
              error={Boolean((touched.Username && errors.Username) || alertMsg)}
              helperText={(touched.Username && errors.Username) || alertMsg}
            />
            {}
            <TextField
              fullWidth
              type="text"
              label="Employee Name"
              variant="outlined"
              {...getFieldProps("CustomerName")}
              error={Boolean(touched.CustomerName && errors.CustomerName)}
              helperText={touched.CustomerName && errors.CustomerName}
            />
            <TextField
              fullWidth
              type="text"
              label="Email"
              variant="outlined"
              {...getFieldProps("Email")}
              error={Boolean(touched.Email && errors.Email) || alertMsg}
              helperText={(touched.Email && errors.Email) || alertMsg}
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
    </div>
  );
}
