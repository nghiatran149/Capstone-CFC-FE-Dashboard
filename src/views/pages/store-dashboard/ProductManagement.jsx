import React, { useState } from 'react';
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
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Rose', price: 10000, category: 'Bouquets', image: 'https://static.vecteezy.com/system/resources/previews/028/631/946/non_2x/a-red-rose-flower-with-water-drop-in-dark-theme-generative-ai-free-photo.jpg' },
    { id: 2, name: 'Lily', price: 15000, category: 'Bouquets', image: 'https://www.easytogrowbulbs.com/cdn/shop/files/LiliumOrientalLilyTricolorPlaytime_1853495104_SHUT-sqWeb.jpg?v=1694624897&width=1946' },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddProduct = () => {
    setProducts([...products, { id: Date.now(), ...newProduct }]);
    setNewProduct({ name: '', price: '', category: '', image: '' });
    setOpenDialog(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
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
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
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
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Product */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Product</DialogTitle>
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
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
