import React from 'react'
import { Grid, Paper } from '@mui/material'
import SupplierLayout from '../layout/SupplierLayout';
import Supplierpayout from '../components/supplier/Supplierpayout';

export default function SupplierViewpayout() {

  return (
    <SupplierLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Supplierpayout />
        </Paper>
      </Grid>
    </SupplierLayout>
  )
}

