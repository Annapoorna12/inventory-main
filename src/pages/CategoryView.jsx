import React from 'react'
import CategoryDetails from '../components/admin/category/category'
import AdminLayout from '../layout/AdminLayout'
import { Grid, Paper } from '@mui/material'

const CategoryView = () => {
  return (
    <AdminLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <CategoryDetails />
        </Paper>
      </Grid>
    </AdminLayout>
  )
}

export default CategoryView