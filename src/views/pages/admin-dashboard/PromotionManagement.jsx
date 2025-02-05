import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Snackbar, Alert } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

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

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get(
          "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions"
        );
        setPromotions(data);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddPromotion = async () => {
    try {
      const { data } = await axios.post(
        "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/create-promotion",
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

      setNewPromotion({
        promotionName: "",
        quantity: "",
        promotionDiscount: "",
        promotionCode: "",
        startDate: "",
        endDate: "",
      });

      setOpenDialog(false);
      setSnackbar({ open: true, message: "Promotion added successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create promotion:", error);
      setSnackbar({ open: true, message: "An error occurred while adding the promotion.", severity: "error" });
    }
  };
  
  const handleDeletePromotion = async () => {
    try {
      const { data } = await axios.delete(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/delete-promotion`,
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
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/${selectedPromotion.promotionId}`,
        {
          ...selectedPromotion,
          quantity: parseInt(selectedPromotion.quantity),
          promotionDiscount: parseInt(selectedPromotion.promotionDiscount),
          updateAt: new Date().toISOString(),
        }
      );
  
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.promotionId === data.promotionId
            ? {
                ...data,
                startDate: data.startDate.split("T")[0],
                endDate: data.endDate.split("T")[0],
              }
            : promo
        )
      );
  
      setEditDialog(false);
      setSelectedPromotion(null);
      setSnackbar({ open: true, message: "Promotion updated successfully!", severity: "success" });
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
        <DialogTitle>Add New Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newPromotion.promotionName}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionName: e.target.value })
            }
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
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={newPromotion.promotionCode}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionCode: e.target.value })
            }
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPromotion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Promotion</DialogTitle>
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
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
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
