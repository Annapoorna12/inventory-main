import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AdminLayout from '../layout/AdminLayout'
import Wages from '../components/admin/wage/Wages';


export default function AdminViewWages() {
  return (
    <AdminLayout>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Wages />
      </Paper>
    </Grid>
  </AdminLayout>
  );
}
