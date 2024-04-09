import React from 'react'
import Products from '../components/salesmanager/products/products';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function SalesViewProducts() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Products />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

