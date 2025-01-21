import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import EarningCard from 'views/dashboard/EarningCard';
import TotalOrderLineChartCard from 'views/dashboard/TotalOrderLineChartCard';
import TotalGrowthBarChart from 'views/dashboard/TotalGrowthBarChart';

const StoreOverview = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [editStore, setEditStore] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newStore, setNewStore] = useState({
    storeName: '',
    city: '',
    district: '',
    address: '',
    storePhone: '',
    storeAvatar: '',
    storeEmail: '',
    status: true,
  });

  const PHONE_REGEX = /^(0|\+84)([0-9]{9,10})$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/GetAllStore');
        const data = await response.json();
        setStores(data.data);
        if (data.data.length > 0) {
          setSelectedStore(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    fetchStores();
  }, []);

  const validateForm = () => {
    const errors = {};

    Object.keys(newStore).forEach(key => {
      if (key !== 'status' && !newStore[key].trim()) {
        errors[key] = 'This field is required';
      }
    });

    if (newStore.storePhone && !PHONE_REGEX.test(newStore.storePhone)) {
      errors.storePhone = 'Invalid phone number format. Use +84 or 0 followed by 9-10 digits';
    }

    if (newStore.storeEmail && !EMAIL_REGEX.test(newStore.storeEmail)) {
      errors.storeEmail = 'Invalid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};

    if (editStore.storePhone && !PHONE_REGEX.test(editStore.storePhone)) {
      errors.storePhone = 'Invalid phone number format. Use +84 or 0 followed by 9-10 digits';
    }

    if (editStore.storeEmail && !EMAIL_REGEX.test(editStore.storeEmail)) {
      errors.storeEmail = 'Invalid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStore = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/CreateStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        const addedStore = await response.json();
        setStores((prevStores) => [...prevStores, addedStore]);
        setIsDialogOpen(false);
        resetForm();
        alert('Store added successfully!');
      } else {
        alert('Failed to add store!');
      }
    } catch (error) {
      console.error('Error adding store:', error);
      alert('An error occurred while adding the store.');
    }
  };

  const resetForm = () => {
    setNewStore({
      storeName: '',
      city: '',
      district: '',
      address: '',
      storePhone: '',
      storeAvatar: '',
      storeEmail: '',
      status: true,
    });
    setFormErrors({});
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewStore(prev => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const handleUpdateStore = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      const response = await fetch(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/UpdateStore/${editStore.storeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editStore),
        }
      );

      if (response.ok) {
        const updatedStore = await response.json();
        setSelectedStore(updatedStore);
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.storeId === updatedStore.storeId ? updatedStore : store
          )
        );
        setIsEditDialogOpen(false);
        alert('Store updated successfully!');
      } else {
        alert('Failed to update store!');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      alert('An error occurred while updating the store.');
    }
  };

  const handleInputChangeForEdit = (field) => (event) => {
    const value = event.target.value;
    setEditStore((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        const response = await fetch(
          `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/DeleteStore/${storeId}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setStores((prevStores) => prevStores.filter((store) => store.storeId !== storeId));
          setSelectedStore(null); // Optionally reset selected store if needed
          alert('Store deleted successfully!');
        } else {
          alert('Failed to delete store!');
        }
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('An error occurred while deleting the store.');
      }
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Store Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>Select a store</InputLabel>
          <Select
            value={selectedStore ? selectedStore.storeId : ''}
            onChange={(e) => setSelectedStore(stores.find(store => store.storeId === e.target.value))}
            label="Select a store"
          >
            {stores.map((store) => (
              <MenuItem key={store.storeId} value={store.storeId}>
                {store.storeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => setIsDialogOpen(true)}
          size="large"
          sx={{ marginLeft: '16px', padding: '8px 16px', flex: 0.1 }}
        >
          Add Store
        </Button>
      </Box>

      {/* Store Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EarningCard
            revenue={selectedStore ? selectedStore.revenue : 0}
            expenses={selectedStore ? selectedStore.expenses : 0}
            profit={selectedStore ? selectedStore.profit : 0}
            isLoading={false}
          />
          <TotalOrderLineChartCard />
        </div>

        {selectedStore && (
          <Card sx={{ boxShadow: 3, borderRadius: '16px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      flex: 2,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    Store Information
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setEditStore(selectedStore);
                        setIsEditDialogOpen(true);
                      }}
                      sx={{ width: '50%' }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteStore(selectedStore.storeId)}
                      sx={{ width: '50%' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              }
              sx={{
                backgroundColor: '#ffffff',
                color: 'white',
                padding: '16px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            />
            <Divider />
            <CardContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Store Name:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storeName}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Address:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.address}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>City:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.city}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>District:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.district}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Phone:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storePhone}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Store Email:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storeEmail}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </div>

      <TotalGrowthBarChart />

      {/* Employees Table */}
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title="Employees"
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStore && selectedStore.employees && selectedStore.employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for add store */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        sx={{ '& .MuiDialog-paper': { width: '500px', padding: '24px' } }}
      >
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Store Name"
              value={newStore.storeName}
              onChange={handleInputChange('storeName')}
              fullWidth
              required
              error={!!formErrors.storeName}
              helperText={formErrors.storeName}
            />
            <TextField
              label="City"
              value={newStore.city}
              onChange={handleInputChange('city')}
              fullWidth
              required
              error={!!formErrors.city}
              helperText={formErrors.city}
            />
            <TextField
              label="District"
              value={newStore.district}
              onChange={handleInputChange('district')}
              fullWidth
              required
              error={!!formErrors.district}
              helperText={formErrors.district}
            />
            <TextField
              label="Address"
              value={newStore.address}
              onChange={handleInputChange('address')}
              fullWidth
              required
              error={!!formErrors.address}
              helperText={formErrors.address}
            />
            <TextField
              label="Phone"
              value={newStore.storePhone}
              onChange={handleInputChange('storePhone')}
              fullWidth
              required
              error={!!formErrors.storePhone}
              helperText={formErrors.storePhone || 'Format: 0xxxxxxxxx or +84xxxxxxxxx'}
            />
            <TextField
              label="Email"
              value={newStore.storeEmail}
              onChange={handleInputChange('storeEmail')}
              fullWidth
              required
              error={!!formErrors.storeEmail}
              helperText={formErrors.storeEmail}
            />
            <TextField
              label="Avatar URL"
              value={newStore.storeAvatar}
              onChange={handleInputChange('storeAvatar')}
              fullWidth
              required
              error={!!formErrors.storeAvatar}
              helperText={formErrors.storeAvatar}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">Cancel</Button>
          <Button onClick={handleAddStore} color="success">Add Store</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for edit store */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        sx={{ '& .MuiDialog-paper': { width: '500px', padding: '24px' } }}
      >
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Store Name"
              value={editStore?.storeName || ''}
              onChange={handleInputChangeForEdit('storeName')}
              fullWidth
              error={!!formErrors.storeName}
              helperText={formErrors.storeName}
            />
            <TextField
              label="City"
              value={editStore?.city || ''}
              onChange={handleInputChangeForEdit('city')}
              fullWidth
              error={!!formErrors.city}
              helperText={formErrors.city}
            />
            <TextField
              label="District"
              value={editStore?.district || ''}
              onChange={handleInputChangeForEdit('district')}
              fullWidth
              error={!!formErrors.district}
              helperText={formErrors.district}
            />
            <TextField
              label="Address"
              value={editStore?.address || ''}
              onChange={handleInputChangeForEdit('address')}
              fullWidth
              error={!!formErrors.address}
              helperText={formErrors.address}
            />
            <TextField
              label="Phone"
              value={editStore?.storePhone || ''}
              onChange={handleInputChangeForEdit('storePhone')}
              fullWidth
              error={!!formErrors.storePhone}
              helperText={formErrors.storePhone || 'Format: 0xxxxxxxxx or +84xxxxxxxxx'}
            />
            <TextField
              label="Email"
              value={editStore?.storeEmail || ''}
              onChange={handleInputChangeForEdit('storeEmail')}
              fullWidth
              error={!!formErrors.storeEmail}
              helperText={formErrors.storeEmail}
            />
            <TextField
              label="Avatar URL"
              value={editStore?.storeAvatar || ''}
              onChange={handleInputChangeForEdit('storeAvatar')}
              fullWidth
              error={!!formErrors.storeAvatar}
              helperText={formErrors.storeAvatar}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} color="error">Cancel</Button>
          <Button onClick={handleUpdateStore} color="success">Update Store</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoreOverview;