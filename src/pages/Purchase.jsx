import React from 'react'
import RawMaterial from '../components/salesmanager/Rawmaterial/RawMaterial';
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

export default function PurchasePage() {

  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <RawMaterial />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

