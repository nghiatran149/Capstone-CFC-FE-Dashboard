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
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { Delete, Edit, Add, RemoveRedEye } from '@mui/icons-material';
import { Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CloudUpload } from '@mui/icons-material';

const FlowerBasketManagement = () => {
  const [flowerBaskets, setFlowerBaskets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBasket, setEditingBasket] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    basketId: null,
    basketName: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newBasket, setNewBasket] = useState({
    flowerBasketName: '',
    maxQuantity: 0,
    minQuantity: 0,
    quantity: 0,
    price: 0,
    categoryId: '',
    description: '',
    image: null,
    feature: true
  });
  const [viewDetail, setViewDetail] = useState({
    open: false,
    basket: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch flower baskets
  const fetchFlowerBaskets = async () => {
    try {
      const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets');
      if (response.data) {
        setFlowerBaskets(response.data);
      }
    } catch (error) {
      console.error('Error fetching flower baskets:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch flower baskets',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchFlowerBaskets();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/categories/GetCategoryByBasketType');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenDialog = (basket = null) => {
    if (basket) {
      setEditingBasket(basket);
      setNewBasket({
        flowerBasketName: basket.flowerBasketName,
        maxQuantity: basket.maxQuantity,
        minQuantity: basket.minQuantity,
        quantity: basket.quantity,
        price: basket.price,
        categoryId: basket.categoryId,
        description: basket.description,
        image: basket.image,
        feature: basket.feature,
        status: basket.status
      });
    } else {
      setEditingBasket(null);
      setNewBasket({
        flowerBasketName: '',
        maxQuantity: 0,
        minQuantity: 0,
        quantity: 0,
        price: 0,
        categoryId: '',
        description: '',
        image: null,
        feature: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewBasket({ ...newBasket, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddBasket = async () => {
    try {
      const formData = new FormData();
      
      formData.append('Price', newBasket.price.toString());
      formData.append('Quantity', newBasket.quantity.toString());
      formData.append('Decription', newBasket.description);
      formData.append('FlowerBasketName', newBasket.flowerBasketName);
      formData.append('MaxQuantity', newBasket.maxQuantity.toString());
      formData.append('Feature', newBasket.feature.toString());
      formData.append('CategoryId', newBasket.categoryId);
      formData.append('MinQuantity', newBasket.minQuantity.toString());
      
      if (newBasket.image) {
        formData.append('Image', newBasket.image, newBasket.image.name);
      }

      const response = await axios.post(
        'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets/create-flowerbasket',
        formData,
        {
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.resultStatus === "Success") {
        setSnackbar({
          open: true,
          message: response.data.messages[0] || 'Flower basket created successfully!',
          severity: 'success'
        });
        setOpenDialog(false);
        // Reset form
        setNewBasket({
          flowerBasketName: '',
          maxQuantity: 0,
          minQuantity: 0,
          quantity: 0,
          price: 0,
          categoryId: '',
          description: '',
          image: null,
          feature: true
        });
        // Refresh data
        await fetchFlowerBaskets();
        return true;
      } else {
        throw new Error(response.data.messages?.[0] || 'Failed to create flower basket');
      }
    } catch (error) {
      console.error('Error creating flower basket:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.messages?.[0] || error.message,
        severity: 'error'
      });
      return false;
    }
  };

  const handleUpdate = async () => {
    if (!editingBasket) {
      console.error('No flower basket selected for update');
      setSnackbar({
        open: true,
        message: 'Flower basket not selected for update.',
        severity: 'error'
      });
      return;
    }
  
    try {
      const response = await axios.put(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets/${editingBasket.flowerBasketId}`,
        newBasket,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.statusCode === 200) {
        const updatedBaskets = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets');
        setFlowerBaskets(updatedBaskets.data);
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: 'Cập nhật flower basket thành công!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating flower basket:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: `Lỗi cập nhật flower basket: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete({ open: true, basketId: id });
  };

  const handleDelete = async (basketId) => {
    try {
      const response = await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets/delete-flowerbasket?id=${basketId}`
      );

      if (response.data.resultStatus === "Success") {
        setSnackbar({
          open: true,
          message: response.data.messages?.[0] || 'Flower basket deleted successfully!',
          severity: 'success'
        });
        // Refresh data sau khi xóa
        await fetchFlowerBaskets();
      } else {
        throw new Error(response.data.messages?.[0] || 'Failed to delete flower basket');
      }
    } catch (error) {
      console.error('Error deleting flower basket:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.messages?.[0] || error.message,
        severity: 'error'
      });
    } finally {
      // Đóng confirm dialog
      setConfirmDelete({ open: false, basketId: null, basketName: '' });
    }
  };

  // Sửa lại hàm validateForm, bỏ validation quantity
  const validateForm = () => {
    const errors = [];
    
    if (!newBasket.flowerBasketName) {
      errors.push('Basket Name is required');
    }
    
    if (!newBasket.categoryId) {
      errors.push('Category is required');
    }
    
    if (!newBasket.image) {
      errors.push('Image is required');
    }
    
    if (newBasket.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    return errors;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Flower Basket Management</h2>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpenDialog(true)}
          aria-label="open add flower basket form"
        >
          Add Flower Basket
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Min Quantity</TableCell>
              <TableCell>Max Quantity</TableCell>
              <TableCell>Current Quantity</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flowerBaskets.map((basket) => (
              <TableRow key={basket.flowerBasketId}>
                <TableCell>
                  {basket.image && (
                    <img
                      src={basket.image}
                      alt={basket.flowerBasketName}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </TableCell>
                <TableCell>{basket.flowerBasketName}</TableCell>
                <TableCell>{basket.categoryName}</TableCell>
                <TableCell>{basket.price.toLocaleString()} VND</TableCell>
                <TableCell>{basket.minQuantity}</TableCell>
                <TableCell>{basket.maxQuantity}</TableCell>
                <TableCell>{basket.quantity}</TableCell>
                <TableCell>{basket.sold}</TableCell>
                <TableCell>
                  <Chip 
                    label={basket.feature ? 'Yes' : 'No'}
                    color={basket.feature ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={basket.status ? 'Active' : 'Inactive'}
                    color={basket.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="info" 
                    onClick={() => setViewDetail({ open: true, basket: basket })}
                    title="View Detail"
                  >
                    <RemoveRedEye />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleOpenDialog(basket)}>
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => setConfirmDelete({ 
                      open: true, 
                      basketId: basket.flowerBasketId,
                      basketName: basket.flowerBasketName 
                    })}
                    aria-label="delete flower basket"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        keepMounted
        disablePortal
        aria-labelledby="add-basket-dialog-title"
      >
        <DialogTitle id="add-basket-dialog-title">
          Add New Flower Basket
        </DialogTitle>
        <DialogContent>
          <Box 
            component="form" 
            sx={{ mt: 2 }} 
            noValidate
            role="form"
            aria-label="flower basket form"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Basket Name"
                  value={newBasket.flowerBasketName}
                  onChange={(e) => setNewBasket({ ...newBasket, flowerBasketName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Min Quantity"
                  value={newBasket.minQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewBasket(prev => ({
                      ...prev,
                      minQuantity: value,
                      // Tự động điều chỉnh quantity nếu nó nhỏ hơn min mới
                      quantity: prev.quantity < value ? value : prev.quantity
                    }));
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Max Quantity"
                  value={newBasket.maxQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewBasket(prev => ({
                      ...prev,
                      maxQuantity: value,
                      // Tự động điều chỉnh quantity nếu nó lớn hơn max mới
                      quantity: prev.quantity > value ? value : prev.quantity
                    }));
                  }}
                  error={newBasket.maxQuantity <= newBasket.minQuantity}
                  helperText={
                    newBasket.maxQuantity <= newBasket.minQuantity ?
                      'Max Quantity must be greater than Min Quantity' : ''
                  }
                  inputProps={{ min: newBasket.minQuantity + 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Current Quantity"
                  value={newBasket.quantity}
                  onChange={(e) => setNewBasket({ ...newBasket, quantity: parseInt(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price"
                  value={newBasket.price}
                  onChange={(e) => setNewBasket({ ...newBasket, price: parseInt(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newBasket.categoryId}
                    label="Category"
                    onChange={(e) => setNewBasket({ ...newBasket, categoryId: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={newBasket.description}
                  onChange={(e) => setNewBasket({ ...newBasket, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newBasket.feature}
                      onChange={(e) => setNewBasket({ ...newBasket, feature: e.target.checked })}
                    />
                  }
                  label="Featured"
                />
              </Grid>
              <Grid item xs={12}>
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
                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              document.body.focus();
              setOpenDialog(false);
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddBasket}
            aria-label="add flower basket"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, basketId: null, basketName: '' })}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete flower basket "{confirmDelete.basketName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDelete({ open: false, basketId: null, basketName: '' })}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleDelete(confirmDelete.basketId)}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewDetail.open}
        onClose={() => setViewDetail({ open: false, basket: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6">Flower Basket Details</Typography>
          <IconButton onClick={() => setViewDetail({ open: false, basket: null })}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {viewDetail.basket && (
            <Grid container spacing={3}>
              {/* Left side - Image */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    height: 400,
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {viewDetail.basket.image ? (
                    <img
                      src={viewDetail.basket.image}
                      alt={viewDetail.basket.flowerBasketName}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary">No image available</Typography>
                  )}
                </Paper>
              </Grid>

              {/* Right side - Information */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Basic Info */}
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {viewDetail.basket.flowerBasketName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {viewDetail.basket.flowerBasketId}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" color="primary">
                      {viewDetail.basket.price.toLocaleString()} VND
                    </Typography>
                  </Box>

                  {/* Detailed Information */}
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Category</TableCell>
                          <TableCell>{viewDetail.basket.categoryName || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Quantity Range</TableCell>
                          <TableCell>
                            Min: {viewDetail.basket.minQuantity} - Max: {viewDetail.basket.maxQuantity}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Current Quantity</TableCell>
                          <TableCell>{viewDetail.basket.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Sold</TableCell>
                          <TableCell>{viewDetail.basket.sold}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Featured</TableCell>
                          <TableCell>
                            <Chip 
                              label={viewDetail.basket.feature ? 'Yes' : 'No'}
                              color={viewDetail.basket.feature ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell>
                            <Chip 
                              label={viewDetail.basket.status ? 'Active' : 'Inactive'}
                              color={viewDetail.basket.status ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                          <TableCell>
                            {new Date(viewDetail.basket.createAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                          <TableCell>
                            {viewDetail.basket.updateAt ? 
                              new Date(viewDetail.basket.updateAt).toLocaleString() : 
                              'N/A'
                            }
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Description */}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        backgroundColor: '#f8f8f8',
                        minHeight: 100
                      }}
                    >
                      <Typography>
                        {viewDetail.basket.decription || 'No description available'}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 6000 : 3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlowerBasketManagement;