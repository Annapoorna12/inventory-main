import React from 'react'
import CategoryDetails from '../components/salesmanager/category/category'
import { Grid, Paper } from '@mui/material'
import SalesManagerLayout from '../layout/StaffLayout'

const SalesViewCategory = () => {
  return (
    <SalesManagerLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <CategoryDetails />
        </Paper>
      </Grid>
    </SalesManagerLayout>
  )
}

export default SalesViewCategory