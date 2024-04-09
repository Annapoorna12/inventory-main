import React from 'react'
import Employee from '../components/salesmanager/employee/Employee';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function SalesViewEmployee() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Employee />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

