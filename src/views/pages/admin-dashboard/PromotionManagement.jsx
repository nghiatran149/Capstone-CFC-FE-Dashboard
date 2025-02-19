import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Snackbar, Alert } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const API_BASE_URL = "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, promotionId: null, promotionName: '' });

  const [newPromotion, setNewPromotion] = useState({
    promotionName: "",
    quantity: "",
    promotionDiscount: "",
    promotionCode: "",
    startDate: "",
    endDate: "",
  });

  const [formErrors, setFormErrors] = useState({
    promotionName: "",
    quantity: "",
    promotionDiscount: "",
    promotionCode: "",
    startDate: "",
    endDate: "",
  });

  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/promotions`);
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const validatePromotion = () => {
    const errors = {};
    let isValid = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newPromotion.promotionName) {
      errors.promotionName = "Promotion name is required";
      isValid = false;
    } else if (newPromotion.promotionName.length < 3) {
      errors.promotionName = "Promotion name must be at least 3 characters";
      isValid = false;
    }

    if (!newPromotion.quantity) {
      errors.quantity = "Quantity is required";
      isValid = false;
    } else if (parseInt(newPromotion.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    if (!newPromotion.promotionDiscount) {
      errors.promotionDiscount = "Discount percentage is required";
      isValid = false;
    } else {
      const discount = parseInt(newPromotion.promotionDiscount);
      if (discount <= 0 || discount > 100) {
        errors.promotionDiscount = "Discount must be between 1 and 100";
        isValid = false;
      }
    }

    if (!newPromotion.promotionCode) {
      errors.promotionCode = "Promotion code is required";
      isValid = false;
    } else if (!/^[A-Z0-9]{4,10}$/.test(newPromotion.promotionCode)) {
      errors.promotionCode = "Code must be 4-10 characters, uppercase letters and numbers only";
      isValid = false;
    }

    if (!newPromotion.startDate) {
      errors.startDate = "Start date is required";
      isValid = false;
    } else {
      const startDate = new Date(newPromotion.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today) {
        errors.startDate = "Start date cannot be in the past";
        isValid = false;
      }
    }

    if (!newPromotion.endDate) {
      errors.endDate = "End date is required";
      isValid = false;
    } else {
      const endDate = new Date(newPromotion.endDate);
      endDate.setHours(0, 0, 0, 0);
      const startDate = new Date(newPromotion.startDate);
      startDate.setHours(0, 0, 0, 0);
  
      if (endDate <= startDate) {
        errors.endDate = "End date must be after start date";
        isValid = false;
      }
      
      if (endDate < today) {
        errors.endDate = "End date cannot be in the past";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };


  // const handleAddPromotion = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       `${API_BASE_URL}/promotions/create-promotion`,
  //       {
  //         ...newPromotion,
  //         quantity: parseInt(newPromotion.quantity),
  //         promotionDiscount: parseInt(newPromotion.promotionDiscount),
  //         createAt: new Date().toISOString(),
  //       }
  //     );

  //     const createdPromotion = {
  //       ...data.data,
  //       startDate: data.data.startDate.split("T")[0],
  //       endDate: data.data.endDate.split("T")[0],
  //     };

  //     setPromotions((prev) => [...prev, createdPromotion]);

  //     setNewPromotion({
  //       promotionName: "",
  //       quantity: "",
  //       promotionDiscount: "",
  //       promotionCode: "",
  //       startDate: "",
  //       endDate: "",
  //     });

  //     setOpenDialog(false);
  //     setSnackbar({ open: true, message: "Promotion added successfully!", severity: "success" });
  //   } catch (error) {
  //     console.error("Failed to create promotion:", error);
  //     setSnackbar({ open: true, message: "An error occurred while adding the promotion.", severity: "error" });
  //   }
  // };

  const handleAddPromotion = async () => {
    if (!validatePromotion()) {
      setSnackbar({ 
        open: true, 
        message: "Please check your input information", 
        severity: "error" 
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/promotions/create-promotion`,
        {
          ...newPromotion,
          quantity: parseInt(newPromotion.quantity),
          promotionDiscount: parseInt(newPromotion.promotionDiscount),
          createAt: new Date().toISOString(),
        }
      );

      const createdPromotion = {
        ...data.data,
        startDate: data.data.startDate.split("T")[0],
        endDate: data.data.endDate.split("T")[0],
      };

      setPromotions((prev) => [...prev, createdPromotion]);
      setOpenDialog(false);

      setNewPromotion({
        promotionName: "",
        quantity: "",
        promotionDiscount: "",
        promotionCode: "",
        startDate: "",
        endDate: "",
      });

      setFormErrors({
        promotionName: "",
        quantity: "",
        promotionDiscount: "",
        promotionCode: "",
        startDate: "",
        endDate: "",
      });
      setSnackbar({ open: true, message: "Promotion added successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create promotion:", error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || "An error occurred while adding the promotion.", 
        severity: "error" 
      });
    }
  };

  const handleDeletePromotion = async () => {
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/promotions/delete-promotion`,
        { params: { id: confirmDialog.promotionId } }
      );

      if (data.resultStatus === "Success") {
        setPromotions((prev) =>
          prev.filter((promo) => promo.promotionId !== confirmDialog.promotionId)
        );
        setSnackbar({ open: true, message: "Promotion deleted successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: data.messages[0] || "Failed to delete promotion.", severity: "error" });
      }
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      setSnackbar({ open: true, message: "An error occurred while deleting the promotion.", severity: "error" });
    } finally {
      setConfirmDialog({ open: false, promotionId: null, promotionName: '' });
    }
  };

  const handleEditPromotion = async () => {
    if (!selectedPromotion) return;

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/promotions/${selectedPromotion.promotionId}`,
        {
          ...selectedPromotion,
          quantity: parseInt(selectedPromotion.quantity),
          promotionDiscount: parseInt(selectedPromotion.promotionDiscount),
          updateAt: new Date().toISOString(),
        }
      );

      setEditDialog(false);
      setSelectedPromotion(null);
      setSnackbar({ open: true, message: "Promotion updated successfully!", severity: "success" });
      fetchPromotions();
    } catch (error) {
      console.error("Failed to update promotion:", error);
      setSnackbar({ open: true, message: "An error occurred while updating the promotion.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Promotion Management</h2>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add Promotion
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.promotionId}>
                <TableCell>{promotion.promotionName}</TableCell>
                <TableCell>{promotion.quantity}</TableCell>
                <TableCell>{promotion.promotionDiscount}</TableCell>
                <TableCell>{promotion.promotionCode}</TableCell>
                <TableCell>{new Date(promotion.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promotion.endDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedPromotion(promotion);
                      setEditDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setConfirmDialog({ open: true, promotionId: promotion.promotionId, promotionName: promotion.promotionName })}
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
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Add New Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newPromotion.promotionName}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionName: e.target.value })
            }
            error={!!formErrors.promotionName}
            helperText={formErrors.promotionName}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newPromotion.quantity}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, quantity: e.target.value })
            }
            error={!!formErrors.quantity}
            helperText={formErrors.quantity}
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={newPromotion.promotionDiscount}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                promotionDiscount: e.target.value,
              })
            }
            error={!!formErrors.promotionDiscount}
            helperText={formErrors.promotionDiscount}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={newPromotion.promotionCode}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionCode: e.target.value })
            }
            error={!!formErrors.promotionCode}
            helperText={formErrors.promotionCode}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromotion.startDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, startDate: e.target.value })
            }
            error={!!formErrors.startDate}
            helperText={formErrors.startDate}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromotion.endDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, endDate: e.target.value })
            }
            error={!!formErrors.endDate}
            helperText={formErrors.endDate}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred', } }} onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPromotion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Edit Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedPromotion?.promotionName || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={selectedPromotion?.quantity || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                quantity: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={selectedPromotion?.promotionDiscount || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionDiscount: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={selectedPromotion?.promotionCode || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionCode: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedPromotion?.startDate || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedPromotion?.endDate || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                endDate: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred', } }} onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditPromotion}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, promotionId: null, promotionName: '' })}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete the promotion: <strong>{confirmDialog.promotionName}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, promotionId: null, promotionName: '' })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeletePromotion}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default PromotionManagement;
