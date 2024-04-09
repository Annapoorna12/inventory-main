import React, { useState } from 'react';
import { Avatar, Typography, Paper, Grid, IconButton, Modal, Backdrop, Fade, Button, TextField } from '@mui/material';
import { Edit, Email, Phone } from '@mui/icons-material';
import { useFormik } from 'formik';
import Navbar from './Navbar';

const ProfileDisplay = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: user ? user.phone : '',
    },
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <>
    {/* <Navbar /> */}
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {user ? user.name : ''}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {user ? user.role : ''}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Email />
          </Grid>
          <Grid item>
            <Typography>{user ? user.email : ''}</Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Phone />
          </Grid>
          <Grid item>
            <Typography>{user ? user.phone : ''}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <IconButton aria-label="edit" onClick={handleOpen} sx={{ position: 'absolute', top: 10, right: 10 }}>
        <Edit />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 3 }}>
            <Typography variant="h6" gutterBottom>Edit Profile</Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ marginRight: 2 }}>Save Changes</Button>
              <Button variant="contained" onClick={handleClose}>Cancel</Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </Paper>
    </>
  );
}

export default ProfileDisplay;
