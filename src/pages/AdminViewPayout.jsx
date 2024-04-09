import React from 'react'
import AdminLayout from '../layout/AdminLayout'
import { Grid, Paper } from '@mui/material'
import SupplierPayment from '../components/admin/supplier/Supplierpayment'
const AdminViewPurchases = () => {
  return (
    <AdminLayout>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <SupplierPayment />
        </Paper>
      </Grid>
    </AdminLayout>
  )
}

export default AdminViewPurchases