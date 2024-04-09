import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AdminLayout from '../layout/AdminLayout'
import Products from '../components/admin/products/products';

export default function ProductView() {

  return (
    <AdminLayout>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Products />
      </Paper>
    </Grid>
  </AdminLayout>
  );
}
