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
  Alert
} from '@mui/material';
import { Delete, Edit, Add, CloudUpload, Close } from '@mui/icons-material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, customerId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    quantity: 0,
    price: 0,
    size: '',
    discount: 0,
    description: '',
    featured: true,
    categoryId: '',
    status: true,
    images: []
  });
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateProductData, setUpdateProductData] = useState({
    productName: '',
    quantity: 0,
    price: 0,
    size: '',
    discount: 0,
    description: '',
    featured: true,
    categoryId: '',
    status: true
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchStores = async () => {
  //     try {
  //       const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/GetAllStore');
  //       setStores(response.data.data || []);
  //     } catch (error) {
  //       console.error('Error fetching stores:', error);
  //     }
  //   };

  //   fetchStores();
  // }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct({
        productName: product.productName,
        quantity: product.quantity || 0,
        price: product.price,
        size: product.size,
        discount: product.discount || 0,
        description: product.description,
        featured: product.featured,
        categoryId: product.categoryId || '',
        status: product.status,
        images: product.productImages?.map(image => image.productImage1) || []
      });
    } else {
      setEditingProduct(null);
      setNewProduct({
        productName: '',
        quantity: 0,
        price: 0,
        size: '',
        discount: 0,
        description: '',
        featured: true,
        categoryId: '',
        status: true,
        images: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    // Preview images
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setNewProduct(prev => ({
        ...prev,
        images: images
      }));
    });
  };

  const handleAddProduct = async () => {
    try {
      // Tạo FormData object
      const formData = new FormData();
      
      // Thêm các trường thông tin sản phẩm
      formData.append('productName', newProduct.productName);
      formData.append('quantity', newProduct.quantity.toString());
      formData.append('price', newProduct.price.toString());
      formData.append('size', newProduct.size);
      formData.append('discount', newProduct.discount.toString());
      formData.append('description', newProduct.description);
      formData.append('featured', 'true');
      formData.append('categoryId', newProduct.categoryId);
      formData.append('status', 'true');

      // Thêm các file ảnh
      selectedFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });

      console.log('Form Data:', Object.fromEntries(formData));

      const response = await axios.post(
        'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/CreateProduct',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        // Refresh product list
        const updatedProducts = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(updatedProducts.data.data);

        // Reset form
        setNewProduct({
          productName: '',
          quantity: 0,
          price: 0,
          size: '',
          discount: 0,
          description: '',
          featured: true,
          categoryId: '',
          status: true,
          images: []
        });
        setSelectedFiles([]);

        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: 'Product added successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setSnackbar({
        open: true,
        message: `Failed to add product: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleOpenUpdateDialog = (product) => {
    setEditingProduct(product);
    setUpdateProductData({
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      size: product.size,
      discount: product.discount,
      description: product.description,
      featured: product.featured,
      categoryId: product.categoryId,
      status: product.status
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) {
      console.error('No product selected for update');
      setSnackbar({
        open: true,
        message: 'Product not selected for update.',
        severity: 'error'
      });
      return;
    }
  
    try {
      const response = await axios.put(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/UpdateProduct/${editingProduct.productId}`,
        updateProductData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.statusCode === 200) {
        const updatedProducts = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(updatedProducts.data.data);
        setUpdateDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Cập nhật sản phẩm thành công!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: `Lỗi cập nhật sản phẩm: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDelete({ open: true, customerId: id });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/DeleteProduct/${productId}`
      );

      if (response.data.statusCode === 200) {
        setProducts(products.filter((product) => product.productId !== productId));
        setSnackbar({
          open: true,
          message: 'Product deleted successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete product: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setConfirmDelete({ open: false, productId: null });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Product Management</h2>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              {/* <TableCell>Store</TableCell> */}
              <TableCell>Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>featured</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                {/* <TableCell>{product.productId}</TableCell> */}
                <TableCell>
                  {product.productImages && product.productImages[0]?.productImage1 && (
                    <img
                      src={product.productImages[0].productImage1}
                      alt={product.productName}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.price}</TableCell>
                {/* <TableCell>
                  {stores.find(store => store.storeId === product.storeId)?.storeName || 'Unknown Store'}
                </TableCell> */}
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.discount}%</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.featured ? 'Active' : 'Inactive' }</TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>{product.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenUpdateDialog(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setConfirmDelete({ open: true, productId: product.productId })}
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
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            fullWidth
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            type="number"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Size"
            fullWidth
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Discount"
            fullWidth
            type="number"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={newProduct.categoryId}
              label="Category"
              onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          {/* Preview Images */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {newProduct.images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100
                }}
              >
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
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
                    top: -10,
                    right: -10,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  onClick={() => {
                    const newFiles = [...selectedFiles];
                    newFiles.splice(index, 1);
                    setSelectedFiles(newFiles);
                    
                    const newImages = [...newProduct.images];
                    newImages.splice(index, 1);
                    setNewProduct(prev => ({
                      ...prev,
                      images: newImages
                    }));
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Update Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            fullWidth
            value={updateProductData.productName}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              productName: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            type="number"
            value={updateProductData.quantity}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              quantity: parseInt(e.target.value)
            })}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            type="number"
            value={updateProductData.price}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              price: parseFloat(e.target.value)
            })}
          />
          <TextField
            margin="dense"
            label="Size"
            fullWidth
            value={updateProductData.size}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              size: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            fullWidth
            type="number"
            value={updateProductData.discount}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              discount: parseInt(e.target.value)
            })}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={updateProductData.description}
            onChange={(e) => setUpdateProductData({
              ...updateProductData,
              description: e.target.value
            })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={updateProductData.categoryId}
              label="Danh mục"
              onChange={(e) => setUpdateProductData({
                ...updateProductData,
                categoryId: e.target.value
              })}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred',} }} onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProduct}>
            Update
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, productId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, productId: null })}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDeleteProduct(confirmDelete.productId)}
          >
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

export default ProductManagement;