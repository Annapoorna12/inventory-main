import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import ErrorMessage
import * as Yup from 'yup';
import Navbar from './Navbar';

const RegisterPage = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Handle register logic here
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
    <Navbar />
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="primary">Create an Account</Typography>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="Name"
                    variant="outlined"
                    error={isSubmitting}
                    helperText={<ErrorMessage name="name" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label="Email"
                    variant="outlined"
                    error={isSubmitting}
                    helperText={<ErrorMessage name="email" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    error={isSubmitting}
                    helperText={<ErrorMessage name="password" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account? <Link to="/login" style={{ color: '#1976d2', fontWeight: 'bold' }}>Login here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
    </>
  );
}

export default RegisterPage;
