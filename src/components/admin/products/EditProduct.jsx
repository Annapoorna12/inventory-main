import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Stack, Container, Typography, TextField, Avatar, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ServiceURL from "../../../constants/url";
import { toast } from "react-toastify";

export default function EditProduct({ editedProduct, onClose, fetchData }) {

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
    Price: Yup.number().required("Price is required").positive("Price must be positive"),
    Quantity: Yup.number().required("Quantity is required").integer("Quantity must be an integer").positive("Quantity must be positive"),
    ExpiryDate: Yup.date().required("Expiry date is required"),    
    CategoryID: Yup.number().integer("CategoryID must be an integer").positive("CategoryID must be positive").required("Category is required"),

  });

  const [alertMsg, setAlert] = useState();
  const [image, ImageData] = useState('');
  const [preview,setPreview] = useState(null);
  const [ImageError,setImageError] = useState('');
  const [categories, setCategories] = useState([]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract date portion
  };

  const formik = useFormik({
    initialValues: {
      Name: editedProduct.Name,
      Description: editedProduct.Description,
      Price: editedProduct.Price,
      Quantity: editedProduct.Quantity,
      ExpiryDate: formatDate(editedProduct.ExpiryDate),
      CategoryID: editedProduct.CategoryID
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      onUpdate(values);
    },
  });


  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const updateImage = async () => {
    if(!image){
      return setImageError("Image is Required");
    }
    const formData = new FormData();
    formData.append("ProductID", editedProduct.ProductID);
    formData.append("Image", image);
    try {
      const uploadResponse = await axios.put(`${ServiceURL}/updateproductImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (uploadResponse.data.message === "Error updating product Image!") {
        return setAlertMsg(uploadResponse.data.message);
      }

      toast.success(uploadResponse.data.message, {
        position: "top-right"
      });

      ImageData(null);
      setAlertMsg('');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.", {
        position: "top-right"
      });
    }
  }

  const onUpdate = async (data) => {
    axios
      .put(`${ServiceURL}/admin/updateProduct`, { data, ProductID: editedProduct.ProductID })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: "top-right",
          });
          fetchData();
          onClose();
        } else {
          setAlertMsg(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        setAlertMsg("Error updating product. Please try again.");
      });
  };

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      ImageData(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
            Edit Product
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Stack spacing={2} justifyContent="space-between" sx={{ my: 3 }}>
        <Typography variant="h4">PRODUCT DETAILS</Typography>
         {preview ? 
         (
          <>
          <Stack alignItems="center">
          <Avatar
            alt="Rounded Image"
            src={preview}
            variant="rounded"
            sx={{ width: 100, height: 100 }}
          />
        </Stack>
          </>
         ) : (
          <>
          <Stack alignItems="center">
              <Avatar
                alt="Rounded Image"
                src={`../../../../src/uploads/${editedProduct.productImage}`}
                variant="rounded"
                sx={{ width: 100, height: 100 }}
              />

          </Stack>
          </>
         )}
          <TextField
            fullWidth
            type="text"
            label="Name"
            variant="outlined"
            {...getFieldProps("Name")}
            error={Boolean(touched.Name && errors.Name) || alertMsg}
            helperText={(touched.Name && errors.Name) || alertMsg}
          />

          <TextField
            fullWidth
            type="text"
            label="Description"
            variant="outlined"
            {...getFieldProps("Description")}
            error={Boolean(touched.Description && errors.Description)}
            helperText={touched.Description && errors.Description}
          />

          <TextField
            fullWidth
            type="number"
            label="Price"
            variant="outlined"
            {...getFieldProps("Price")}
            error={Boolean(touched.Price && errors.Price)}
            helperText={touched.Price && errors.Price}
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
            type="date"
            label="Expiry Date"
            variant="outlined"
            {...getFieldProps("ExpiryDate")}
            error={Boolean(touched.ExpiryDate && errors.ExpiryDate)}
            helperText={touched.ExpiryDate && errors.ExpiryDate}
          />
          <TextField
            type="file"
            name="Image"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
            error={Boolean(ImageError)}
            helperText={ImageError && ImageError}
          />
            <Button variant="contained"  onClick={updateImage}>
              Upload Image
            </Button>

        </Stack>
      </Container>
    </Dialog>
  );
}
