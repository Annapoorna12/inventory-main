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

export default function Editcategory({ editedCategory, onClose ,fetchData }) {
  const validSchema = Yup.object().shape({
    CategoryName: Yup.string()
    .matches(/^\S/, "Whitespace is not allowed")
    .required("Name is required")
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      CategoryName: editedCategory.CategoryName
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onUpdate(values);
    },
  });
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const onUpdate = async (data) => {
    axios.put(`${ServiceURL}/admin/updateCategory`, { data, oldData: editedCategory })
    .then((response) => {
        if(response.data.message === "Sorry, Category is already present."){
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
      console.error("Error updating Category:", error);
      setAlert("Error updating Category. Please try again.");
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
            Edit Category
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="h4">CATEGORY DETAILS</Typography>

          <TextField
            fullWidth
            type="text"
            label="CategoryName"
            variant="outlined"
            {...getFieldProps("CategoryName")}
            error={Boolean(touched.CategoryName && errors.CategoryName) || alertMsg }
            helperText={touched.CategoryName && errors.CategoryName || alertMsg }
          />

        </Stack>
      </Container>
    </Dialog>
  );
}
