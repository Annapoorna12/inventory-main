import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Employee from '../components/admin/employee/Employee';
import AdminLayout from '../layout/AdminLayout'



export default function EmployeView() {
  return (
    <AdminLayout>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Employee />
      </Paper>
    </Grid>
  </AdminLayout>
  );
}
