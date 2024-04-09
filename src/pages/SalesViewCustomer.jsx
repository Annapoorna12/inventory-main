import React from 'react'
import CustomersDetails from '../components/salesmanager/customer/customers';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function SalesViewCustomer() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <CustomersDetails />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

