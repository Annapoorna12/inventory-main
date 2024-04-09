import React from 'react'
import SalesViewOrders from '../components/salesmanager/orders/SaleViewOrders';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function SalesManagerViewOrders() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <SalesViewOrders />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

