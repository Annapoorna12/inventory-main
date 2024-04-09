import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Supplier from '../components/admin/supplier/Supplier';
import AdminLayout from '../layout/AdminLayout'


export default function AdminViewSupplier() {
  return (
    <AdminLayout>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Supplier />
      </Paper>
    </Grid>
  </AdminLayout>
  );
}
