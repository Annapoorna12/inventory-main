import React from 'react'
import Supplier from '../components/salesmanager/supplier/Supplier';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function SalesViewSupplier() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Supplier />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

