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
import { Delete, Edit, Add } from '@mui/icons-material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, customerId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    price: '',
    size: '',
    discount: 0,
    store: '',
    category: '',
    description: '',
    image: '',
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
        name: product.productName,
        quantity: product.quantity || 0,
        price: product.price,
        size: product.size,
        discount: product.discount || 0,
        store: product.storeId || '',
        category: product.categoryId || '',
        description: product.description,
        image: product.productImages?.[0]?.productImage1 || '',
      });
    } else {
      setEditingProduct(null);
      setNewProduct({
        name: '',
        quantity: 0,
        price: '',
        size: '',
        discount: 0,
        store: '',
        category: '',
        description: '',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddProduct = async () => {
    const productData = {
      productName: newProduct.name,
      quantity: parseInt(newProduct.quantity),
      price: parseFloat(newProduct.price),
      size: newProduct.size,
      discount: parseInt(newProduct.discount),
      description: newProduct.description,
      featured: true,
      categoryId: newProduct.category,
      status: true,
      images: [
        {
          productImage1: newProduct.image
        }
      ]
    };

    try {
      const response = await axios.post(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/CreateProduct?storeId=${newProduct.store}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.statusCode === 200) {
        const updatedProducts = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(updatedProducts.data.data);
        setNewProduct({
          name: '',
          quantity: 0,
          price: '',
          size: '',
          discount: 0,
          store: '',
          category: '',
          description: '',
          image: '',
        });
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: editingProduct ? 'Product updated successfully!' : 'Product added successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: `Failed to ${editingProduct ? 'update' : 'add'} product: ${error.response?.data?.message || error.message}`,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
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
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            type="number"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          {/* <FormControl fullWidth margin="dense">
            <InputLabel>Store</InputLabel>
            <Select
              value={newProduct.store}
              label="Store"
              onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
            >
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={newProduct.category}
              label="Category"
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
            label="Size"
            fullWidth
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            fullWidth
            type="number"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
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
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          {newProduct.image && (
            <img
              src={newProduct.image}
              alt="Preview"
              style={{ marginTop: 16, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred',} }} onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            Add
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