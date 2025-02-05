import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Snackbar, Alert } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, customerId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    city: '',
    district: '',
    address: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    status: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/customers'
      );
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddCustomer = () => {
    setCustomers([...customers, { customerId: Date.now().toString(), ...newCustomer }]);
    setNewCustomer({
      fullName: '',
      city: '',
      district: '',
      address: '',
      email: '',
      phone: '',
      gender: '',
      birthday: '',
      status: '',
    });
    setOpenDialog(false);
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete({ open: true, customerId: id });
  };

  const handleDeleteCustomer = async () => {
    try {
      await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/customers/delete-customer?id=${confirmDelete.customerId}`
      );
      setCustomers(customers.filter((customer) => customer.customerId !== confirmDelete.customerId));
      setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting customer', severity: 'error' });
      console.error('Error deleting customer:', error);
    }
    setConfirmDelete({ open: false, customerId: null });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Customer Management</h2>
        {/* <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add Customer
        </Button> */}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.district}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.gender}</TableCell>
                <TableCell>{customer.birthday}</TableCell>
                <TableCell>{customer.status}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleConfirmDelete(customer.customerId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          {['fullName', 'city', 'district', 'address', 'email', 'phone', 'gender', 'birthday', 'status'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              value={newCustomer[field]}
              onChange={(e) => setNewCustomer({ ...newCustomer, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCustomer}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, customerId: null })}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Confirm Store Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, customerId: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteCustomer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;