import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Grid,
  Typography
} from '@mui/material';
import { Delete, Edit, Add, CloudUpload, Close, Visibility } from '@mui/icons-material';

const FlowerManagement = () => {
  const [flowers, setFlowers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingFlower, setEditingFlower] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, flowerId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newFlower, setNewFlower] = useState({
    flowerName: '',
    price: 0,
    color: '',
    quantity: 0,
    categoryId: '',
    description: '',
    image: null
  });

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateFlowerData, setUpdateFlowerData] = useState({
    flowerId: '',
    flowerName: '',
    price: 0,
    color: '',
    image: null,
    quantity: 0,
    categoryId: '',
    description: ''
  });

  const [viewDetail, setViewDetail] = useState({
    open: false,
    flower: null
  });

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers');
        setFlowers(response.data);
      } catch (error) {
        console.error('Error fetching flowers:', error);
      }
    };

    fetchFlowers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/categories/GetCategoryByFlowerType');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenDialog = (flower = null) => {
    if (flower) {
      setEditingFlower(flower);
      setNewFlower({
        flowerName: flower.flowerName,
        price: flower.price,
        color: flower.color || '',
        image: flower.image,
        quantity: flower.quantity,
        categoryId: flower.categoryId,
        description: flower.description,
      });
    } else {
      setEditingFlower(null);
      setNewFlower({
        flowerName: '',
        price: 0,
        color: '',
        image: null,
        quantity: 0,
        categoryId: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewFlower(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleAddFlower = async () => {
    try {
      const formData = new FormData();
      formData.append('FlowerName', newFlower.flowerName);
      formData.append('Price', newFlower.price.toString());
      formData.append('Color', newFlower.color);
      formData.append('Quantity', newFlower.quantity.toString());
      formData.append('CategoryId', newFlower.categoryId);
      formData.append('Description', newFlower.description);
      
      if (newFlower.image) {
        formData.append('Image', newFlower.image);
      }

      const response = await axios.post(
        'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers/create-flower',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        const updatedFlowers = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers');
        setFlowers(updatedFlowers.data);

        setNewFlower({
          flowerName: '',
          price: 0,
          color: '',
          quantity: 0,
          categoryId: '',
          description: '',
          image: null
        });

        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: 'Flower added successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding flower:', error);
      setSnackbar({
        open: true,
        message: `Failed to add flower: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleOpenUpdateDialog = (flower) => {
    setEditingFlower(flower);
    setUpdateFlowerData({
      flowerId: flower.flowerId,
      flowerName: flower.flowerName,
      price: flower.price,
      color: flower.color,
      image: flower.image,
      quantity: flower.quantity,
      categoryId: flower.categoryId,
      description: flower.description,
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUpdateFlowerData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleUpdateFlower = async () => {
    try {
      const formData = new FormData();
      formData.append('FlowerName', updateFlowerData.flowerName);
      formData.append('Price', updateFlowerData.price.toString());
      formData.append('Color', updateFlowerData.color);
      formData.append('Quantity', updateFlowerData.quantity.toString());
      formData.append('CategoryId', updateFlowerData.categoryId);
      formData.append('Description', updateFlowerData.description);
      
      if (updateFlowerData.image instanceof File) {
        formData.append('Image', updateFlowerData.image);
      }

      const response = await axios.put(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers/${updateFlowerData.flowerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        const updatedFlowers = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers');
        setFlowers(updatedFlowers.data);
        setUpdateDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Flower updated successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating flower:', error);
      setSnackbar({
        open: true,
        message: `Failed to update flower: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete({ open: true, flowerId: id });
  };

  const handleDeleteFlower = async (flowerId) => {
    try {
      const response = await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers/delete-flower?id=${flowerId}`
      );

      if (response.status === 200) {
        const updatedFlowers = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers');
        setFlowers(updatedFlowers.data);
        setConfirmDelete({ open: false, flowerId: null });
        setSnackbar({
          open: true,
          message: 'Flower deleted successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error deleting flower:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete flower: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Flower Management</h2>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Flower
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>CategoryName</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flowers.map((flower) => (
              <TableRow key={flower.flowerId}>
                <TableCell>
                  {flower.image && (
                    <img
                      src={flower.image}
                      alt={flower.flowerName}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </TableCell>
                <TableCell>{flower.flowerName}</TableCell>
                <TableCell>{flower.price}</TableCell>
                <TableCell>{flower.color || 'N/A'}</TableCell>
                <TableCell>{flower.quantity}</TableCell>
                <TableCell>{flower.categoryName}</TableCell>
                <TableCell>{flower.description}</TableCell>
                <TableCell>{flower.sold || 0}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => setViewDetail({ open: true, flower })}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleOpenUpdateDialog(flower)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => setConfirmDelete({ open: true, flowerId: flower.flowerId })}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Flower</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Flower Name"
            fullWidth
            required
            value={newFlower.flowerName}
            onChange={(e) => setNewFlower({ ...newFlower, flowerName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            required
            type="number"
            value={newFlower.price}
            onChange={(e) => setNewFlower({ ...newFlower, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Color"
            fullWidth
            value={newFlower.color}
            onChange={(e) => setNewFlower({ ...newFlower, color: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            required
            type="number"
            value={newFlower.quantity}
            onChange={(e) => setNewFlower({ ...newFlower, quantity: parseInt(e.target.value) })}
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={newFlower.categoryId}
              label="Category"
              onChange={(e) => setNewFlower({ ...newFlower, categoryId: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newFlower.description}
            onChange={(e) => setNewFlower({ ...newFlower, description: e.target.value })}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {newFlower.image && (
            <Box sx={{ mt: 2, position: 'relative', width: 200, height: 200 }}>
              <img
                src={URL.createObjectURL(newFlower.image)}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { backgroundColor: 'white' }
                }}
                onClick={() => setNewFlower(prev => ({ ...prev, image: null }))}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddFlower}
            disabled={!newFlower.flowerName || !newFlower.price || !newFlower.quantity || !newFlower.categoryId}
          >
            Add Flower
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Flower</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Flower Name"
            fullWidth
            required
            value={updateFlowerData.flowerName}
            onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, flowerName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            required
            type="number"
            value={updateFlowerData.price}
            onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Color"
            fullWidth
            value={updateFlowerData.color}
            onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, color: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            required
            type="number"
            value={updateFlowerData.quantity}
            onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, quantity: parseInt(e.target.value) })}
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={updateFlowerData.categoryId}
              label="Category"
              onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, categoryId: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={updateFlowerData.description}
            onChange={(e) => setUpdateFlowerData({ ...updateFlowerData, description: e.target.value })}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
            >
              Update Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpdateImageChange}
              />
            </Button>
          </Box>

          <Box sx={{ mt: 2, position: 'relative', width: 200, height: 200 }}>
            <img
              src={updateFlowerData.image instanceof File 
                ? URL.createObjectURL(updateFlowerData.image)
                : updateFlowerData.image}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateFlower}
            disabled={!updateFlowerData.flowerName || !updateFlowerData.price || !updateFlowerData.quantity || !updateFlowerData.categoryId}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, flowerId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this flower?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDelete({ open: false, flowerId: null })}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDeleteFlower(confirmDelete.flowerId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewDetail.open}
        onClose={() => setViewDetail({ open: false, flower: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Flower Details</DialogTitle>
        <DialogContent>
          {viewDetail.flower && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <img
                  src={viewDetail.flower.image}
                  alt={viewDetail.flower.flowerName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Flower ID
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.flowerId}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Flower Name
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.flowerName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.price.toLocaleString()} VND
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Color
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.color || 'N/A'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Quantity
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.quantity}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.categoryName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.description || 'No description'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Sold
                    </Typography>
                    <Typography variant="body1">
                      {viewDetail.flower.sold || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setViewDetail({ open: false, flower: null })}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlowerManagement;