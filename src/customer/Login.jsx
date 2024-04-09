import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';

const LoginPage = () => {
  const { login } = useAuth();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values);
    setSubmitting(false);
    await login(values)
  };

  return (
    <>
    <Navbar />
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="primary">Welcome Back!</Typography>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="username"
                    label="Username"
                    variant="outlined"
                    error={errors.username && touched.username}
                    helperText={errors.username && touched.username ? errors.username : ''}
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
                    error={errors.password && touched.password}
                    helperText={errors.password && touched.password ? errors.password : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register" style={{ color: '#1976d2', fontWeight: 'bold' }}>Register here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
    </>

  );
}

export default LoginPage;
