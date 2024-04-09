import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Stack, Container, Typography, TextField, MenuItem, Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ServiceURL from '../../../constants/url';
import { toast } from "react-toastify";

export default function AddProduct(details) {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${ServiceURL}/active-categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const validSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    Description: Yup.string().required("Description is required"),
    Price: Yup.number().positive("Price must be positive").required("Price is required"),
    Quantity: Yup.number().integer("Quantity must be an integer").positive("Quantity must be positive").required("Quantity is required"),
    CategoryID: Yup.number().integer("CategoryID must be an integer").positive("CategoryID must be positive").required("Category is required"),
    ExpiryDate: Yup.date().required("Expiry Date is required")
    .min(new Date(), "Expiry Date must be valild!")
    .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      Price: "",
      Quantity: "",
      CategoryID: "",
      ExpiryDate: null,
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onAdd = async (values) => {
    if (!image) {
      return setImageError('Image is required');
    }

    const formData = new FormData();
    formData.append("Name", values.Name);
    formData.append("Description", values.Description);
    formData.append("Price", values.Price);
    formData.append("Quantity", values.Quantity);
    formData.append("CategoryID", values.CategoryID);
    formData.append("ExpiryDate", values.ExpiryDate);
    formData.append("Role", "Admin");
    formData.append("Image", image);

    try {
      const uploadResponse = await axios.post(`${ServiceURL}/addProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (uploadResponse.data.message === "A product with this name already exists.") {
        return setAlertMsg(uploadResponse.data.message);
      }

      toast.success(uploadResponse.data.message, {
        position: "top-right"
      });

      formik.resetForm();
      setImage(null);
      setPreview(null);
      setAlertMsg('');
      details.fetchData();
      details.onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.", {
        position: "top-right"
      });
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setImage(null);
    setPreview(null);
    details.onClose();
  };

  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Product
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={2} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">Product Details</Typography>
           {preview && (
              <Stack alignItems="center">
              <Avatar
                alt="Rounded Image"
                src={preview}
                variant="rounded"
                sx={{ width: 100, height: 100 }}
              />
            </Stack>
           )}
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              {...getFieldProps("Name")}
              error={Boolean(touched.Name && errors.Name) || alertMsg}
              helperText={(touched.Name && errors.Name) || alertMsg}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              {...getFieldProps("Description")}
              error={Boolean(touched.Description && errors.Description)}
              helperText={touched.Description && errors.Description}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              {...getFieldProps("Price")}
              error={Boolean(touched.Price && errors.Price)}
              helperText={touched.Price && errors.Price}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              variant="outlined"
              {...getFieldProps("Quantity")}
              error={Boolean(touched.Quantity && errors.Quantity)}
              helperText={touched.Quantity && errors.Quantity}
            />
            <TextField
              select
              fullWidth
              label="Category"
              variant="outlined"
              {...getFieldProps("CategoryID")}
              error={Boolean(touched.CategoryID && errors.CategoryID)}
              helperText={touched.CategoryID && errors.CategoryID}
            >
              {categories.map((category) => (
                <MenuItem key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="file"
              label="Image"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
              error={Boolean(imageError && imageError)}
              helperText={imageError && imageError}
            />
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              {...getFieldProps("ExpiryDate")}
              error={Boolean(touched.ExpiryDate && errors.ExpiryDate)}
              helperText={touched.ExpiryDate && errors.ExpiryDate}
            />
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
