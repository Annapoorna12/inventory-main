import React from 'react'
import AdminLayout from '../layout/AdminLayout'
import { Grid, Paper } from '@mui/material'
import AdminViewOrders from '../components/admin/orders/AdminViewOrders'
const AdminOrdersView = () => {
  return (
    <AdminLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <AdminViewOrders />
        </Paper>
      </Grid>
    </AdminLayout>
  )
}

export default AdminOrdersView