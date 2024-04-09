import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Stack, Container, Typography, TextField, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ServiceURL from '../../../constants/url';
import { toast } from "react-toastify";

export default function AddSupplier(details) {
  const [alertMsg, setAlert] = useState('');

  const [userList, setuserList] = useState([]);


  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(()=>{
    axios.get(`${ServiceURL}/admin/getusers`).then((response)=>{
        console.log(response.data)
        setuserList(response.data)
    }).catch((error)=>{
        console.log(error)
    });
  },[])

  const validSchema = Yup.object().shape({
    month: Yup.string().required("Month is required"),
    year: Yup.number()
    .required("Year is required")
    .test('valid-year', 'Year cannot exceed current year', function (value) {
      const currentYear = new Date().getFullYear();
      return value <= currentYear;
    }),
    workedHours: Yup.number().required("Worked hours are required"),
    wageperHour: Yup.number().required("Wage per hour is required"),
    UserID: Yup.string().required("User is required")
  });

  const formik = useFormik({
    initialValues: {
      month: "",
      year: "",
      workedHours: "",
      wageperHour: "",
      UserID: ""
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd(values);
    },
  });


  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  const onAdd = async (data) => {
    axios.post(`${ServiceURL}/admin/addWage`, { data })
      .then((response) => {
        if (response.data.success === false) {
          setAlert(response.data.message);
        } else {
          setAlert('');
          toast.success('Wage Added!', { position: "top-right" });
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
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Wage
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">WAGE DETAILS</Typography>

            <TextField
              select
              fullWidth
              label="Month"
              variant="outlined"
              {...getFieldProps("month")}
              onChange={(e) => setFieldValue("month", e.target.value)}
              error={Boolean(touched.month && errors.month) || alertMsg}
              helperText={(touched.month && errors.month) || alertMsg}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="number"
              label="Year"
              variant="outlined"
              {...getFieldProps("year")}
              error={Boolean(touched.year && errors.year) || alertMsg}
              helperText={(touched.year && errors.year) || alertMsg}
            />
            <TextField
              fullWidth
              type="number"
              label="Worked Hours"
              variant="outlined"
              {...getFieldProps("workedHours")}
              error={Boolean(touched.workedHours && errors.workedHours)}
              helperText={touched.workedHours && errors.workedHours}
            />
            <TextField
              fullWidth
              type="number"
              label="Wage Per Hour"
              variant="outlined"
              {...getFieldProps("wageperHour")}
              error={Boolean(touched.wageperHour && errors.wageperHour)}
              helperText={touched.wageperHour && errors.wageperHour}
            />
            <TextField
              select
              fullWidth
              label="User"
              variant="outlined"
              {...getFieldProps("UserID")}
              onChange={(e) => setFieldValue("UserID", e.target.value)}
              error={Boolean(touched.UserID && errors.UserID) || alertMsg}
              helperText={(touched.UserID && errors.UserID) || alertMsg}
            >
              {userList.map((user) => (
                <MenuItem key={user.UserID} value={user.UserID}>
                   {`${user.FullName} (Role: ${user.Role})`}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
