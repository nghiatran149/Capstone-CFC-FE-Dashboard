import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Snackbar, Alert } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_BASE_URL = "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, categoryId: null, categoryName: '' });
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddCategory = async () => {
        try {
            await axios.post(`${API_BASE_URL}/categories/create-category`, {
                name: newCategory,
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString(),
            });
            setNewCategory("");
            setOpenDialog(false);
            setSnackbar({ open: true, message: "Category added successfully!", severity: "success" });
            fetchCategories();
        } catch (error) {
            console.error("Failed to create category:", error);
            setSnackbar({ open: true, message: "An error occurred while adding the category.", severity: "error" });
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/categories/delete-category?id=${confirmDialog.categoryId}`);
            setSnackbar({ open: true, message: "Category deleted successfully!", severity: "success" });
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            setSnackbar({ open: true, message: "An error occurred while deleting the category.", severity: "error" });
        } finally {
            setConfirmDialog({ open: false, categoryId: null, categoryName: '' });
        }
    };

    const handleEditCategory = async () => {
        if (!selectedCategory) return;
        try {
            await axios.put(`${API_BASE_URL}/categories/${selectedCategory.categoryId}`, {
                categoryName: selectedCategory.categoryName,
            });
            setEditDialog(false);
            setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
            fetchCategories();
        } catch (error) {
            console.error("Failed to update category:", error);
            setSnackbar({ open: true, message: "An error occurred while updating the category.", severity: "error" });
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h2>Category Management</h2>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
                    Add Category
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.categoryId}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>{category.status ? "Hoạt động" : "Không hoạt động"}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => { setSelectedCategory(category); setEditDialog(true); }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => setConfirmDialog({
                                            open: true,
                                            categoryId: category.categoryId,
                                            categoryName: category.categoryName
                                        })}
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
                <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Add New Category</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Name" fullWidth value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred',} }} onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddCategory}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
                <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={selectedCategory?.categoryName || ""}
                        onChange={(e) => setSelectedCategory({ ...selectedCategory, categoryName: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred',} }} onClick={() => setEditDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditCategory}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, categoryId: null, categoryName: '' })}>
                <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete the category: <strong>{confirmDialog.categoryName}</strong>?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, categoryId: null, categoryName: '' })}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteCategory}>Delete</Button>
                </DialogActions>
            </Dialog>


            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%" }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryManagement;
