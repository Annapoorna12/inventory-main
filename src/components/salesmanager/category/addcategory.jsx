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


export default function AddCategory(details) {
  const [update, setUpdate] = useState(details.updated);
  const validSchema = Yup.object().shape({
    CategoryName: Yup.string()
      .matches(/^\S/, "Whitespace is not allowed")
      .required("Name is required")
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      CategoryName: update ? details.data.name : "",
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd(values);
    },
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const onAdd = async (data) => {

    axios.post(`${ServiceURL}/admin/addcategory`, { data })
    .then((response) => {
      console.log(response.data.message);
      if (response.data.message === 'Sorry, Category is already present.') {
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
              Add Customer
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
                Add
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">CATEGORY DETAILS</Typography>

            <TextField
              fullWidth
              type="text"
              label="Category Name"
              variant="outlined"
              value={details.update ? details.data.name : ""}
              {...getFieldProps("CategoryName")}
              error={Boolean((touched.CategoryName && errors.CategoryName)) || alertMsg}
              helperText={(touched.CategoryName && errors.CategoryName) || alertMsg}
            />

          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
