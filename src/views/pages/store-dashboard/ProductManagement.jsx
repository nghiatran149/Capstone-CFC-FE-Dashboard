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
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    store: '',
    category: '',
    size: '',
    description: '',
    image: '',
    discount: 0,
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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/GetAllStore');
        setStores(response.data.data || []);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
  
    fetchStores();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/categories');
        console.log('Categories response:', response.data);
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
        price: product.price,
        store: product.storeId || '',
        category: product.categoryId || '',
        size: product.size,
        description: product.description,
        image: product.productImages?.[0]?.productImage1 || '',
        discount: product.discount || 0,
      });
    } else {
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        store: '',
        category: '',
        size: '',
        description: '',
        image: '',
        discount: 0,
      });
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddProduct = async () => {
    const productData = {
      productName: newProduct.name,
      quantity: 0,
      price: newProduct.price,
      size: newProduct.size,
      discount: newProduct.discount,
      description: newProduct.description,
      featured: true,
      storeId: newProduct.store,
      categoryId: newProduct.category,
      status: true,
      images: [
        {
          productImage1: newProduct.image,
        },
      ],
    };

    try {
      const response = await axios.post(
        'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/CreateProduct',
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.statusCode === 200) {
        const updatedProducts = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(updatedProducts.data.data);
        setNewProduct({ name: '', price: '', store: '', category: '', size: '', description: '', image: '', discount: 0 });
        setOpenDialog(false);
      } else {
        alert('Tạo sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Tạo sản phẩm thất bại');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/DeleteProduct/${productId}`
      );
      
      if (response.data.statusCode === 200) {
        setProducts(products.filter((product) => product.productId !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
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
                <TableCell>{product.storeName}</TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.discount}%</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product.productId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
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
            label="Price"
            fullWidth
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
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
          </FormControl>
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
          {newProduct.image && (
            <img
              src={newProduct.image}
              alt="Preview"
              style={{ marginTop: 16, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;