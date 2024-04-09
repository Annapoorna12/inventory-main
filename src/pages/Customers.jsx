import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CustomersDetails from '../components/admin/customer/customers';
import AdminLayout from '../layout/AdminLayout';


export default function Customers() {

  return (
    <AdminLayout>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <CustomersDetails />
      </Paper>
    </Grid>
  </AdminLayout>
  );
}
